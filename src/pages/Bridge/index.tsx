import ConfirmBridgeModal from "components/bridge/ConfirmBridgeModal";
import BridgeCurrencyInputPanel from "components/BridgeCurrencyInputPanel";
import { ButtonError, ButtonLight } from "components/Button";
import ChainLogo from "components/ChainLogo";
import { AutoColumn } from "components/Column";
import { SwapPoolTabs } from "components/NavigationTabs";
import NetworkMenu from "components/NetworkMenu";
import { ArrowWrapper } from "components/swap/styleds";
import { useActiveWeb3React } from "hooks";
import { useBridgeCallback } from "hooks/useBridgeCallback";
import useTheme from "hooks/useTheme";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight } from "react-feather";
import { useWalletModalToggle } from "state/application/hooks";
import { Token } from "state/bridge/actions";
import {
  useBridgeActionHandlers,
  useBridgeState,
  useGetPendingBridgeTx,
  useSwitchNetworkSrcDest,
} from "state/bridge/hooks";
import styled from "styled-components";
import { TYPE } from "theme";
import { Wrapper } from "./styleds";

const BridgeBody = styled.div`
  position: relative;
  max-width: 576px;
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

const BridgeCardContainer = styled.div<{ hideInput: boolean }>`
  display: flex;
  padding: 1rem 2rem;
  border-radius: 1rem;
  flex-direction: column;
  align-items: center;
  flex: 1 1 0;
  gap: 0.5rem;
  border-radius: ${({ hideInput }) => (hideInput ? "8px" : "20px")};
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

// Move to redux state
export interface BridgeTx {
  srcToken: Token | undefined;
  destToken: Token | undefined;
  srcChain: string;
  destChain: string;
  amount: string;
  srcAddr: string | undefined | null;
  destAddr: string | undefined | null;
}

export interface BridgingState {
  showConfirm: boolean;
  bridgeToConfirm: BridgeTx | undefined;
  attemptingTxn: boolean;
  bridgeErrorMessage: string | undefined;
  txHash: string | undefined;
}

export default function Bridge() {
  const { account } = useActiveWeb3React();
  const toggleWalletModal = useWalletModalToggle();
  const theme = useTheme();

  const tokenARef = useRef<HTMLDivElement>(null);
  const tokenBRef = useRef<HTMLDivElement>(null);

  const onSwitchTokens = useSwitchNetworkSrcDest();

  // Real
  const { typedInputValue, networkA, networkB, selectedCurrency } = useBridgeState();

  const { onUserInput, onCurrencySelection } = useBridgeActionHandlers();
  // States
  const atMaxAmountInput = false; // Temp

  const getPendingBridgeTx = useGetPendingBridgeTx();

  // Handlers
  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(value);
    },
    [onUserInput],
  );

  const handleMaxInput = useCallback(() => {}, []);

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      onCurrencySelection(inputCurrency);
    },
    [onCurrencySelection],
  );

  // modal and loading
  const [{ showConfirm, bridgeToConfirm, bridgeErrorMessage, attemptingTxn, txHash }, setBridgeState] =
    useState<BridgingState>({
      showConfirm: false,
      bridgeToConfirm: undefined,
      attemptingTxn: false,
      bridgeErrorMessage: undefined,
      txHash: undefined,
    });

  useEffect(() => {
    setBridgeState({
      attemptingTxn: false,
      bridgeToConfirm: getPendingBridgeTx(),
      showConfirm,
      bridgeErrorMessage: undefined,
      txHash: undefined,
    });
  }, [typedInputValue, selectedCurrency, networkA, networkB, account, getPendingBridgeTx, showConfirm]);

  console.log(getPendingBridgeTx());

  // const { callback: bridgeCallback, error: bridgeCallbackError } =
  //   useBridgeCallback(bridgeToConfirm);
  const { callback: bridgeCallback } = useBridgeCallback(bridgeToConfirm);

  const handleBridge = useCallback(() => {
    if (!bridgeCallback) {
      return;
    }
    setBridgeState({
      attemptingTxn: true,
      bridgeToConfirm,
      showConfirm,
      bridgeErrorMessage: undefined,
      txHash: undefined,
    });
    bridgeCallback()
      .then((hash: string) => {
        setBridgeState({
          attemptingTxn: false,
          bridgeToConfirm,
          showConfirm,
          bridgeErrorMessage: undefined,
          txHash: hash,
        });
      })
      .catch((error: Error) => {
        setBridgeState({
          attemptingTxn: false,
          bridgeToConfirm,
          showConfirm,
          bridgeErrorMessage: error.message,
          txHash: undefined,
        });
      });
  }, [bridgeCallback, bridgeToConfirm, showConfirm]);

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
      onUserInput("");
    }
  }, [attemptingTxn, onUserInput, bridgeErrorMessage, bridgeToConfirm, txHash]);

  const handleAcceptChanges = useCallback(() => {
    setBridgeState({
      bridgeToConfirm,
      bridgeErrorMessage,
      txHash,
      attemptingTxn,
      showConfirm,
    });
  }, [attemptingTxn, showConfirm, bridgeErrorMessage, bridgeToConfirm, txHash]);

  return (
    <>
      <SwapPoolTabs active={"bridge"} />
      <BridgeBody>
        <Wrapper id="bridge-page">
          <ConfirmBridgeModal
            isOpen={showConfirm}
            bridgeTx={bridgeToConfirm}
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
              <BridgeCardContainer hideInput={false}>
                <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                  From
                </TYPE.body>

                <BridgeTokenLogoContainer>
                  <ChainLogo chain={networkA.networkId} />
                </BridgeTokenLogoContainer>

                <NetworkMenu ref={tokenARef} selectedInput={networkA.networkId ?? ""} />

                {!account && (
                  <ButtonLight
                    onClick={toggleWalletModal}
                    style={{ marginTop: "1rem" }}
                    padding="0.5rem"
                    borderRadius="0.75rem"
                  >
                    Connect Wallet
                  </ButtonLight>
                )}
              </BridgeCardContainer>

              <BridgeArrow>
                <ArrowWrapper clickable>
                  <ArrowRight
                    size="24"
                    onClick={() => {
                      // setApprovalSubmitted(false) // reset 2 step UI for approvals
                      onSwitchTokens();
                    }}
                    color={theme.primary1}
                  />
                </ArrowWrapper>
              </BridgeArrow>

              <BridgeCardContainer hideInput={false}>
                <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                  To
                </TYPE.body>

                <BridgeTokenLogoContainer>
                  <ChainLogo chain={networkB.networkId} />
                </BridgeTokenLogoContainer>

                <NetworkMenu ref={tokenBRef} selectedOutput={networkB.networkId ?? ""} />

                {!account && (
                  <ButtonLight
                    onClick={toggleWalletModal}
                    style={{ marginTop: "1rem" }}
                    padding="0.5rem"
                    borderRadius="0.75rem"
                  >
                    Connect Wallet
                  </ButtonLight>
                )}
              </BridgeCardContainer>
            </BridgeTokenContainer>

            <BridgeCurrencyInputPanel
              label={"Transfer Amount"}
              value={typedInputValue}
              onUserInput={handleTypeInput}
              showMaxButton={!atMaxAmountInput}
              onMax={handleMaxInput}
              onCurrencySelect={handleInputSelect}
              currency={selectedCurrency}
              id={"bridge-input"}
            />

            {!account ? (
              <ButtonLight onClick={toggleWalletModal} style={{ marginTop: "1rem" }}>
                Connect Wallet
              </ButtonLight>
            ) : (
              <ButtonError
                style={{ marginTop: "1rem" }}
                disabled={!typedInputValue.length || !selectedCurrency}
                onClick={() => {
                  setBridgeState({
                    bridgeToConfirm,
                    bridgeErrorMessage,
                    txHash: undefined,
                    attemptingTxn: false,
                    showConfirm: true,
                  });
                }}
                id="swap-button"
              >
                Bridge
              </ButtonError>
            )}
          </AutoColumn>
        </Wrapper>
      </BridgeBody>
    </>
  );
}
