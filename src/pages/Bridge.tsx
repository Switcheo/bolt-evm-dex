import { useCallback, useEffect, useState } from "react";
import { ArrowRight } from "react-feather";
import styled, { css, useTheme } from "styled-components";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import BridgeInputPanel from "../components/BridgeInputPanel";
import { ButtonError, ConnectKitLightButton } from "../components/Button";
import ChainLogo from "../components/ChainLogo";
import { AutoColumn } from "../components/Column";
import ConfirmBridgeModal from "../components/ConfirmBridgeModal";
import Menus from "../components/Menu";
import SwitchNetworkModal from "../components/SwitchNetworkModal";
import {
  BridgingChainIdToNameRecord,
  convertToSupportedBridgingChainId,
  getChainNameFromBridgingId,
  getOfficialChainIdFromBridgingChainId,
  SupportedBridgingChainId,
} from "../constants/chains";
import { BridgeTx, useBridgeCallback } from "../hooks/useBridgeCallback";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setDestinationChain,
  setSelectedCurrency,
  setSourceAmount,
  setSourceChain,
} from "../store/modules/bridge/bridgeSlice";
import { useDerivedBridgeInfo } from "../store/modules/bridge/hooks";
import { fetchHydrogenFees, fetchTokens } from "../store/modules/bridge/services/api";
import { TYPE } from "../theme";
import { deserializeBridgeableToken, serializeBridgeableToken } from "../utils/bridge";
import { BridgeableToken } from "../utils/entities/bridgeableToken";

export const Wrapper = styled.div`
  position: relative;
  padding: 1rem;
`;

const BridgeBody = styled.div`
  position: relative;
  max-width: 620px;
  // margin: 0 5rem;
  width: 100%;
  background: ${({ theme }) => theme.bg1};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 30px;
  /* padding: 1rem; */
  margin-top: -50px;
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
  const selectedCurrency = useAppSelector((state) => state.bridge.selectedCurrency);
  const selectedCurrencyAmount = useAppSelector((state) => state.bridge.sourceAmount);

  const pendingBridgeTx = useDerivedBridgeInfo();

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

  const { address } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork, isLoading, isError } = useSwitchNetwork();

  const { callback: bridgeCallback } = useBridgeCallback(pendingBridgeTx);

  // const maxAmountInput: bigint = getMaxAmountInput(selectedCurrency, selectedCurrencyData?.value ?? BigInt(0));

  // const atMaxAmountInput = Boolean(selectedCurrencyAmount && maxAmountInput === BigInt(selectedCurrencyAmount));

  // Handlers
  const handleUserInputChange = useCallback(
    (value: string) => {
      dispatch(setSourceAmount(value));
    },
    [dispatch],
  );

  // const handleMaxInput = useCallback(() => {
  //   dispatch(setSourceAmount(maxAmountInput.toString()));
  // }, [dispatch, maxAmountInput]);

  const handleCurrencySelect = useCallback(
    (inputCurrency: BridgeableToken) => {
      dispatch(setSelectedCurrency(serializeBridgeableToken(inputCurrency)));
      dispatch(fetchHydrogenFees(pendingBridgeTx?.destToken?.tokenDenom ?? ""));
    },
    [dispatch, pendingBridgeTx?.destToken?.tokenDenom],
  );

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

  const handleSwitchNetwork = useCallback(() => {
    if (switchNetwork) {
      switchNetwork(getOfficialChainIdFromBridgingChainId(sourceChain));
    }

    setShowSwitchNetworkModal(false);
    dispatch(setSelectedCurrency(null));
  }, [dispatch, sourceChain, switchNetwork]);

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
    if (chain?.id && sourceChain && getOfficialChainIdFromBridgingChainId(sourceChain) !== chain?.id) {
      setShowSwitchNetworkModal(true);
    }
  }, [sourceChain, chain?.id]);

  // Fetch fees whenever the destination chain changes
  useEffect(() => {
    if (!pendingBridgeTx?.destToken?.tokenDenom) {
      return;
    }
    dispatch(fetchHydrogenFees(pendingBridgeTx?.destToken?.tokenDenom ?? ""));
  }, [dispatch, pendingBridgeTx?.destToken?.tokenDenom]);

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
            <ActiveText>BoltBridge</ActiveText>
          </BridgeHeader>

          <BridgeTokenContainer>
            <Menus>
              <BridgeCardContainer $hideInput={false}>
                <TYPE.body color={theme?.text2} fontWeight={500} fontSize={14}>
                  From
                </TYPE.body>

                <BridgeTokenLogoContainer>
                  <ChainLogo chain={getOfficialChainIdFromBridgingChainId(sourceChain)} />
                </BridgeTokenLogoContainer>

                <Menus.Menu>
                  <Menus.Toggle id={1}>{getChainNameFromBridgingId(sourceChain)}</Menus.Toggle>

                  <Menus.List id={1}>
                    {Object.keys(BridgingChainIdToNameRecord).map((chainId) => (
                      <Menus.Button
                        key={`src-${chainId}`}
                        onClick={() => {
                          dispatch(
                            setSourceChain(
                              convertToSupportedBridgingChainId(chainId) ?? SupportedBridgingChainId.MAINNET,
                            ),
                          );
                        }}
                      >
                        {getChainNameFromBridgingId(
                          convertToSupportedBridgingChainId(chainId) ?? SupportedBridgingChainId.MAINNET,
                        )}
                      </Menus.Button>
                    ))}
                  </Menus.List>
                </Menus.Menu>

                {!address && (
                  <ConnectKitLightButton style={{ marginTop: "1rem" }} padding="0.5rem" $borderRadius="0.75rem">
                    Connect Wallet
                  </ConnectKitLightButton>
                )}
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
                  <ChainLogo chain={getOfficialChainIdFromBridgingChainId(destChain)} />
                </BridgeTokenLogoContainer>

                <Menus.Menu>
                  <Menus.Toggle id={2}>{getChainNameFromBridgingId(destChain)}</Menus.Toggle>

                  <Menus.List id={2}>
                    {Object.keys(BridgingChainIdToNameRecord).map((chainId) => (
                      <Menus.Button
                        key={`dest-${chainId}`}
                        onClick={() => {
                          dispatch(
                            setDestinationChain(
                              convertToSupportedBridgingChainId(chainId) ?? SupportedBridgingChainId.MAINNET,
                            ),
                          );
                        }}
                      >
                        {getChainNameFromBridgingId(
                          convertToSupportedBridgingChainId(chainId) ?? SupportedBridgingChainId.MAINNET,
                        )}
                      </Menus.Button>
                    ))}
                  </Menus.List>
                </Menus.Menu>

                {!address && (
                  <ConnectKitLightButton style={{ marginTop: "1rem" }} padding="0.5rem" $borderRadius="0.75rem">
                    Connect Wallet
                  </ConnectKitLightButton>
                )}
              </BridgeCardContainer>
            </Menus>
          </BridgeTokenContainer>

          <BridgeInputPanel
            label={"Amount"}
            value={selectedCurrencyAmount.toString()}
            // showMaxButton={!atMaxAmountInput}
            showMaxButton={false}
            // onMax={handleMaxInput}
            onMax={() => {}}
            id={"bridge-input-panel"}
            onUserInput={handleUserInputChange}
            onCurrencySelect={handleCurrencySelect}
            currency={deserializeBridgeableToken(selectedCurrency)}
          />

          {!address ? (
            <ConnectKitLightButton style={{ marginTop: "1rem" }} $borderRadius="0.75rem">
              Connect Wallet
            </ConnectKitLightButton>
          ) : (
            <ButtonError
              style={{ marginTop: "1rem" }}
              disabled={
                isLoading || isError
                // ||
                // BigInt(selectedCurrencyAmount) <= 0 ||
                // BigInt(selectedCurrencyAmount) >= (selectedCurrencyData?.value ?? 0)
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
    </BridgeBody>
  );
};

export default Bridge;
