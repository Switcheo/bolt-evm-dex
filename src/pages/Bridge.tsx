import JSBI from "jsbi";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight } from "react-feather";
import styled, { css, useTheme } from "styled-components";
import { useAccount, useSwitchChain } from "wagmi";
import CurrencyInputPanel from "../components/CurrencyInputPanel";
import { ButtonError, ButtonPrimary, ConnectKitLightButton } from "../components/Button";
import ChainLogo from "../components/ChainLogo";
import { AutoColumn } from "../components/Column";
import ConfirmBridgeModal from "../components/ConfirmBridgeModal";
import { Dots } from "../components/ConfirmBridgeModal/styleds";
import Menus from "../components/Menu";
import SwitchNetworkModal from "../components/SwitchNetworkModal";
import { getChainInfo } from "../constants/chainInfo";
import { BRIDGING_CHAIN_IDS, getChainNameFromId, SupportedChainId } from "../constants/chains";
import { useCurrencyBalance } from "../hooks/balances/useCurrencyBalance";
import { ApprovalState, useApproveCallback } from "../hooks/useApproveCallback";
import { BridgeTx, useBridgeCallback } from "../hooks/useBridgeCallback";
import { tryParseAmount } from "../hooks/useWrapCallback";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setDestinationChain,
  setSelectedCurrency,
  setSourceAmount,
  setSourceChain,
} from "../store/modules/bridge/bridgeSlice";
import { useDerivedBridgeInfo } from "../store/modules/bridge/hooks";
import { fetchTokens } from "../store/modules/bridge/services/api";
import { TYPE } from "../theme";
import { maxAmountSpend } from "../utils/maxAmountSpend";
import { Currency } from "../utils/entities/currency";
import { Token } from "../utils/entities/token";
import switchNetwork from "../utils/switchNetwork";

export const Wrapper = styled.div`
  position: relative;
  padding: 1rem;
  background: ${({ theme }) => theme.bg1};
  border-radius: 30px;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
`;

export const Wrapper2 = styled.div`
  position: relative;
  padding: 20px;
  margin-top: 20px;
  background: ${({ theme }) => theme.bg1};
  border-radius: 30px;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
`;

const BridgeBody = styled.div`
  position: relative;
  max-width: 620px;
  width: 100%;
  border-radius: 30px;
  margin-top: auto;
  margin-bottom: auto;
  gap: 1rem;
`;

const BridgeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  padding: 1rem 1rem 0 1rem;
`;

const BridgeTokenContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const BridgeCardContainer = styled.div<{ $hideInput: boolean }>`
  display: flex;
  padding: 1rem 2rem;
  border-radius: 1rem;
  flex-direction: column;
  align-items: center;
  flex: 1 1 0;
  gap: 0.5rem;
  border-radius: ${({ $hideInput }) => ($hideInput ? "8px" : "20px")};
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: ${({ theme }) => theme.bg1};
`;

const BridgeTokenLogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
`;

const BridgeArrow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0.3 1 0%;
`;

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 24px;
`;

const DialogHeader = styled.div`
  display: flex;
  padding-top: 1rem;
  border-radius: 1rem;
  flex-direction: column;
  align-items: center;
  flex: 1 1 0;
  gap: 0.5rem;
`;

const DialogBody = styled.div`
  padding: 0 1.5rem
`;

const DialogATag = styled.div`
  color:  ${({ theme }) => theme?.text2};
`

export const ArrowWrapper = styled.div<{ $clickable: boolean }>`
  padding: 2px;

  ${({ $clickable }) =>
    $clickable
      ? css`
          &:hover {
            cursor: pointer;
            opacity: 0.8;
          }
        `
      : null}
`;

const Bridge = () => {
  const theme = useTheme();
  // Dispatch
  const dispatch = useAppDispatch();
  // Get states
  const sourceChain = useAppSelector((state) => state.bridge.sourceChain);
  const destChain = useAppSelector((state) => state.bridge.destinationChain);
  const curr = useAppSelector((state) => state.bridge.selectedCurrency);
  const selectedCurrency =
    curr.chainId && curr.address ?
    new Token(curr.chainId, curr.address, curr.decimals, curr.symbol, curr.name) :
    Currency.ETHER
  const selectedCurrencyAmount = useAppSelector((state) => state.bridge.sourceAmount);
  const pendingBridgeTx = useDerivedBridgeInfo();

  // const bridgingCurrency = new Token

  // Local states
  const [{ showConfirm, bridgeToConfirm, bridgeErrorMessage, attemptingTxn, txHash }, setBridgeState] = useState<{
    showConfirm: boolean;
    bridgeToConfirm: BridgeTx | undefined;
    attemptingTxn: boolean;
    bridgeErrorMessage: string | undefined;
    txHash: string | undefined;
  }>({
    showConfirm: false,
    bridgeToConfirm: pendingBridgeTx,
    attemptingTxn: false,
    bridgeErrorMessage: undefined,
    txHash: undefined,
  });

  const [showSwitchNetworkModal, setShowSwitchNetworkModal] = useState(false);

  const { address, chain } = useAccount();
  // const { switchNetwork, isLoading, isError } = useSwitchNetwork();
  const { switchChain, isError, isPending} = useSwitchChain();
  const { callback: bridgeCallback } = useBridgeCallback(pendingBridgeTx);

  const selectedCurrencyBalance = useCurrencyBalance(address, selectedCurrency);

  // get the max amounts user can add
  const maxAmounts = maxAmountSpend(selectedCurrencyBalance);
  const parsedAmount = tryParseAmount(selectedCurrencyAmount, selectedCurrency);

  const atMaxAmountInput = Boolean(maxAmounts?.equalTo(parsedAmount ?? "0"));

  // check whether the user has approved the router on the tokens
  const [approvalBridge, approveBridgeCallback] = useApproveCallback(
    selectedCurrencyBalance,
    getChainInfo(chain?.id ?? SupportedChainId.SEPOLIA).bridgeInfo.bridgeProxy,
  );

  const selectCurrency = (curr: Currency) => {
    dispatch(setSelectedCurrency(JSON.parse(JSON.stringify(curr))));
  }

  // testnet faucet links
  const testnetFaucentLinks = {
    "Google Cloud": "https://cloud.google.com/application/web3/faucet/ethereum/sepolia",
    "Alchemy": "https://www.alchemy.com/faucets/ethereum-sepolia",
    "Infura": "https://www.infura.io/faucet/sepolia",
  }

  // Handlers
  const handleUserInputChange = useCallback(
    (value: string) => {
      dispatch(setSourceAmount(value));
    },
    [dispatch],
  );

  const handleMaxInput = useCallback(() => {
    dispatch(setSourceAmount(maxAmounts?.toExact() ?? ""));
  }, [dispatch, maxAmounts]);

  const handleConfirmDismiss = useCallback(() => {
    setBridgeState({
      showConfirm: false,
      bridgeToConfirm,
      attemptingTxn,
      bridgeErrorMessage,
      txHash,
    });
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      dispatch(setSourceAmount(""));
    }
  }, [bridgeToConfirm, attemptingTxn, bridgeErrorMessage, txHash, dispatch]);

  const handleAcceptChanges = useCallback(() => {
    setBridgeState({
      bridgeToConfirm,
      bridgeErrorMessage,
      txHash,
      attemptingTxn,
      showConfirm,
    });
  }, [attemptingTxn, showConfirm, bridgeErrorMessage, bridgeToConfirm, txHash]);

  const handleSwitchNetwork = useCallback(async () => {
    try {
      await switchNetwork(sourceChain);
    } catch (error) {
      console.error("Error during network switch or transaction: ", error);
    }

    setShowSwitchNetworkModal(false);
    dispatch(setSelectedCurrency({ decimals: 18, symbol: "ETH", name: "Ether" }));
    dispatch(setSourceAmount(""));
  }, [dispatch, sourceChain, switchChain]);

  const handleBridge = useCallback(async () => {
    if (!bridgeCallback) {
      return;
    }

    setBridgeState({
      attemptingTxn: true,
      bridgeToConfirm: pendingBridgeTx,
      showConfirm,
      bridgeErrorMessage,
      txHash: undefined,
    });
    try {
      const hash = await bridgeCallback();

      setBridgeState({
        attemptingTxn: false,
        bridgeToConfirm,
        showConfirm,
        bridgeErrorMessage: undefined,
        txHash: hash,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setBridgeState({
          attemptingTxn: false,
          bridgeToConfirm,
          showConfirm,
          bridgeErrorMessage: error.message,
          txHash: undefined,
        });
      }
    }
  }, [bridgeCallback, pendingBridgeTx, showConfirm, bridgeErrorMessage, bridgeToConfirm]);

  useEffect(() => {
    if (chain?.id && sourceChain && sourceChain !== chain?.id) {
      setShowSwitchNetworkModal(true);
    }
  }, [sourceChain, chain?.id]);

  return (
    <BridgeBody>
      <Wrapper id="bridge-page">
        <SwitchNetworkModal
          isOpen={showSwitchNetworkModal}
          onDismiss={() => setShowSwitchNetworkModal(false)}
          chainId={sourceChain}
          onConfirm={handleSwitchNetwork}
        />
        <ConfirmBridgeModal
          isOpen={showConfirm}
          bridgeTx={pendingBridgeTx}
          onAcceptChanges={handleAcceptChanges}
          attemptingTxn={attemptingTxn}
          txHash={txHash}
          // recipient={recipient}
          onConfirm={handleBridge} // this is the actual confirm callback
          bridgeErrorMessage={bridgeErrorMessage}
          onDismiss={handleConfirmDismiss} // this is to dismiss the modal
          recipient={bridgeToConfirm?.destAddr ?? ""}
        />
        <AutoColumn gap="md">
          <BridgeHeader>
            <ActiveText>Pivotal Bridge</ActiveText>
          </BridgeHeader>

          <BridgeTokenContainer>
            <Menus>
              <BridgeCardContainer $hideInput={false}>
                <TYPE.body color={theme?.text2} fontWeight={500} fontSize={14}>
                  From
                </TYPE.body>

                <BridgeTokenLogoContainer>
                  <ChainLogo style={{ height: "75px", width: "75px" }} chain={sourceChain} />
                </BridgeTokenLogoContainer>

                <Menus.Menu>
                  <Menus.Toggle id={1}>{getChainNameFromId(sourceChain)}</Menus.Toggle>

                  <Menus.List id={1}>
                    {Object.entries(BRIDGING_CHAIN_IDS).map(([chainId, chainName]) => (
                      <Menus.Button
                        key={`dest-${chainId}`}
                        onClick={() => {
                          dispatch(
                            setSourceChain(parseInt(chainId, 10)),
                          );
                        }}
                      >
                        {chainName}
                      </Menus.Button>
                    ))}
                  </Menus.List>
                </Menus.Menu>
              </BridgeCardContainer>

              <BridgeArrow>
                <ArrowWrapper $clickable>
                  <ArrowRight
                    size="24"
                    onClick={() => {
                      dispatch(setDestinationChain(sourceChain));
                      dispatch(fetchTokens());
                    }}
                    color={theme?.primary1}
                  />
                </ArrowWrapper>
              </BridgeArrow>

              <BridgeCardContainer $hideInput={false}>
                <TYPE.body color={theme?.text2} fontWeight={500} fontSize={14}>
                  To
                </TYPE.body>

                <BridgeTokenLogoContainer>
                  <ChainLogo style={{ height: "75px", width: "75px" }} chain={destChain} />
                </BridgeTokenLogoContainer>

                <Menus.Menu>
                  <Menus.Toggle id={2}>{getChainNameFromId(destChain)}</Menus.Toggle>

                  <Menus.List id={2}>
                    {Object.entries(BRIDGING_CHAIN_IDS).map(([chainId, chainName]) => (
                      <Menus.Button
                        key={`dest-${chainId}`}
                        onClick={() => {
                          dispatch(
                            setDestinationChain(parseInt(chainId, 10)),
                          );
                        }}
                      >
                        {chainName}
                      </Menus.Button>
                    ))}
                  </Menus.List>
                </Menus.Menu>
              </BridgeCardContainer>
            </Menus>
          </BridgeTokenContainer>

          <CurrencyInputPanel
            value={selectedCurrencyAmount.toString()}
            onUserInput={handleUserInputChange}
            onMax={handleMaxInput}
            onCurrencySelect={selectCurrency}
            showMaxButton={!atMaxAmountInput}
            currency={selectedCurrency}
            id="bridge-input-panel"
            showCommonBases
          />

          {!address ? (
            <ConnectKitLightButton style={{ marginTop: "1rem" }} padding="18px" $borderRadius="20px" width="100%">
              Connect Wallet
            </ConnectKitLightButton>
          ) : sourceChain !== chain?.id ? (
            <ButtonError style={{ marginTop: "1rem" }} $error={true} onClick={handleSwitchNetwork}>
              Please switch your Wallet network to the source network
            </ButtonError>
          ) : approvalBridge === ApprovalState.PENDING || approvalBridge === ApprovalState.NOT_APPROVED ? (
            <ButtonPrimary
              onClick={approveBridgeCallback}
              disabled={approvalBridge === ApprovalState.PENDING}
              width={"100%"}
            >
              {approvalBridge === ApprovalState.PENDING ? (
                <Dots>Approving {selectedCurrency?.symbol}</Dots>
              ) : (
                "Approve " + selectedCurrency?.symbol
              )}
            </ButtonPrimary>
          ) : (
            <ButtonError
              style={{ marginTop: "1rem" }}
              disabled={
                isPending ||
                isError ||
                JSBI.lessThan(maxAmounts?.raw ?? JSBI.BigInt(0), parsedAmount?.raw ?? JSBI.BigInt(0)) ||
                !parsedAmount ||
                !selectedCurrency
              }
              onClick={() => {
                setBridgeState({
                  bridgeToConfirm,
                  bridgeErrorMessage: undefined,
                  txHash: undefined,
                  attemptingTxn: false,
                  showConfirm: true,
                });
              }}
            >
              Bridge
            </ButtonError>
          )}
        </AutoColumn>
      </Wrapper>
      <Wrapper2>
        <DialogHeader>
          <TYPE.body color={theme?.text2} fontWeight={500} fontSize={14}>
            Acquire Sepolia ETH to test on Pivotal via any of these testnet faucets:
          </TYPE.body>
        </DialogHeader>
        <DialogBody>
          <ul>
            {Object.entries(testnetFaucentLinks).map(([testnet, link]) => (
              <li key={testnet}>
                <DialogATag as="a" href={link} target="_blank" rel="noopener noreferrer">
                  <TYPE.body color={theme?.text2} fontWeight={500} fontSize={14}>
                    {testnet}
                  </TYPE.body>
                </DialogATag>
              </li>
            ))}
          </ul>
        </DialogBody>
      </Wrapper2>
    </BridgeBody>
  );
};

export default Bridge;
