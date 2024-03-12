import { BigNumber, ethers } from "ethers";
import JSBI from "jsbi";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDown, ChevronDown, ChevronUp } from "react-feather";
import { useNavigate } from "react-router-dom";
import { Text } from "rebass";
import styled, { useTheme } from "styled-components";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { ReactComponent as GasIcon } from "../assets/svg/gas_icon.svg";
import { ReactComponent as SwapIcon } from "../assets/svg/swap.svg";
import AddressInputPanel from "../components/AddressInputPanel";
import { ButtonConfirmed, ButtonError, ButtonPrimary, ConnectKitLightButton } from "../components/Button";
import Card, { GreyCard } from "../components/Card";
import Column, { AutoColumn } from "../components/Column";
import ConfirmSwapModal from "../components/ConfirmSwapModal";
import { SwapCallbackError } from "../components/ConfirmSwapModal/styleds";
import CurrencyInputPanel from "../components/CurrencyInputPanel";
import Loader from "../components/Loader";
import { SwapPoolTabs } from "../components/NavigationTabs";
import ProgressSteps from "../components/ProgressSteps";
import { AutoRow, RowBetween } from "../components/Row";
import { AdvancedSwapDetail } from "../components/Swap/AdvancedSwapDetail";
import { ArrowWrapper } from "../components/Swap/ArrowWrapper";
import SwapHeader from "../components/Swap/SwapHeader";
import TokenWarningModal from "../components/TokenWarningModal";
import TradePrice from "../components/TradePrice";
import { SupportedChainId } from "../constants/chains";
import { useAllTokens, useCurrency } from "../hooks/Tokens";
import { useIsTransactionUnsupported } from "../hooks/Trades";
import { ApprovalState, useApproveCallbackFromTrade } from "../hooks/useApproveCallback";
import { useDebounce } from "../hooks/useDebounce";
import { useSwapCallback } from "../hooks/useSwapCallback";
import useWrapCallback, { WrapType } from "../hooks/useWrapCallback";
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from "../store/modules/swap/hooks";
import { Field } from "../store/modules/swap/swapSlice";
import { useExpertModeManager, useUserSingleHopOnly, useUserSlippageTolerance } from "../store/modules/user/hooks";
import { LinkStyledButton, TYPE } from "../theme";
import confirmPriceImpactWithoutFee from "../utils/confirmPriceImpactWithoutFee";
import { Currency } from "../utils/entities/currency";
import { CurrencyAmount } from "../utils/entities/fractions/currencyAmount";
import { Token } from "../utils/entities/token";
import { Trade } from "../utils/entities/trade";
import { getEthersProvider } from "../utils/evm";
import { maxAmountSpend } from "../utils/maxAmountSpend";
import { computeTradePriceBreakdown, warningSeverity } from "../utils/prices";
import AppBody from "./AppBody";

export const Wrapper = styled.div`
  position: relative;
  padding: 1rem;
`;

export const ClickableText = styled(Text)`
  &:hover {
    cursor: pointer;
  }
  color: ${({ theme }) => theme.primary1};
`;

export const BottomGrouping = styled.div`
  margin-top: 1rem;
`;

export const ChevronWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`;

export default function Swap() {
  const loadedUrlParams = useDefaultsFromURLSearch();
  const navigate = useNavigate();

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ];
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false);
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency],
  );
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true);
  }, []);

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens();
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !(token.address in defaultTokens);
    });

  const { address } = useAccount();
  const chainId = useNetwork().chain?.id;
  const { switchNetwork } = useSwitchNetwork();
  const theme = useTheme();

  // for expert mode
  // const toggleSettings = useToggleSettingsMenu();
  const [, setToggleSettingsMenu] = useState(false);
  const [isExpertMode] = useExpertModeManager();

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance();

  // swap state
  const { independentField, typedValue, recipient } = useSwapState();
  // Debounce the typedValue
  const debouncedTypedValue = useDebounce(typedValue, 1000); // 2 seconds delay

  const { v2Trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo();

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue);
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE;
  // const { address: recipientAddress } = useENSAddress(recipient);

  const trade = showWrap ? undefined : v2Trade;
  // const defaultTrade = showWrap ? undefined : v2Trade;

  // const betterTradeLinkV2: Version | undefined =
  //   toggledVersion === Version.v1 && isTradeBetter(v1Trade, v2Trade) ? Version.v2 : undefined;

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      };

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers();
  const isValid = !swapInputError;
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value);
    },
    [onUserInput],
  );
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value);
    },
    [onUserInput],
  );

  // reset if they close warning without tokens in params
  const handleDismissTokenWarning = useCallback(() => {
    setDismissTokenWarning(true);
    navigate("/swap/");
  }, [navigate]);

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean;
    tradeToConfirm: Trade | undefined;
    attemptingTxn: boolean;
    swapErrorMessage: string | undefined;
    txHash: string | undefined;
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  });

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ""
      : parsedAmounts[dependentField]?.toSignificant(6) ?? "",
  };

  const route = trade?.route;
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0)),
  );
  const noRoute = !route;

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage);

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true);
    }
  }, [approval, approvalSubmitted]);

  const [estimatedGasFee, setEstimatedGasFee] = useState<string | null>(null);
  const fetchEthToUsdRate = async (): Promise<number> => {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
    const data = await response.json();
    return data.ethereum.usd;
  };

  const provider = getEthersProvider({ chainId });

  const estimateGasForSwap = useCallback(async () => {
    try {
      const feeData = await provider.getFeeData();

      let gasUsed = BigNumber.from("216860");

      // if bolt chain then multiply gasUsed by 10^9
      if (chainId === SupportedChainId.BOLTCHAIN) {
        gasUsed = BigNumber.from("21686000000000");
      }

      // Extracting the necessary fields from the feeData
      const baseFeePerGas = BigNumber.from(feeData.lastBaseFeePerGas || 0);
      const maxPriorityFeePerGas = BigNumber.from(feeData.maxPriorityFeePerGas || 1);

      // Calculate the total cost in wei
      const totalCostInWei = baseFeePerGas.add(maxPriorityFeePerGas).mul(gasUsed);
      const totalCostInEth = ethers.utils.formatUnits(totalCostInWei, "ether");

      const ethToUsdRate = await fetchEthToUsdRate();

      // Convert the total cost to USD
      const totalCostInUsd = (parseFloat(totalCostInEth) * ethToUsdRate).toFixed(4);

      setEstimatedGasFee(`$ ${totalCostInUsd}`);
    } catch (error) {
      console.error("Gas estimate failed", error);
      setEstimatedGasFee(null);
    }
  }, [chainId]);

  useEffect(() => {
    if (debouncedTypedValue) {
      estimateGasForSwap();
    }
  }, [debouncedTypedValue, estimateGasForSwap]);
  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT]);
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput));

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient);

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade);

  const [singleHopOnly] = useUserSingleHopOnly();

  const [showDetails, toggleShowDetails] = useState(false);

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return;
    }
    if (!swapCallback) {
      return;
    }
    estimateGasForSwap();
    setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: undefined });
    swapCallback()
      .then((hash) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: hash });
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        });
      });
  }, [priceImpactWithoutFee, swapCallback, tradeToConfirm, showConfirm, estimateGasForSwap]);

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false);

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee);

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode);

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash });
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, "");
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash]);

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn, showConfirm });
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash]);

  const handleInputSelect = useCallback(
    (inputCurrency: Currency) => {
      estimateGasForSwap();
      setApprovalSubmitted(false); // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency);
    },
    [onCurrencySelection, estimateGasForSwap],
  );

  const handleMaxInput = useCallback(() => {
    maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact());
  }, [maxAmountInput, onUserInput]);

  const handleOutputSelect = useCallback(
    (outputCurrency: Currency) => onCurrencySelection(Field.OUTPUT, outputCurrency),
    [onCurrencySelection],
  );

  const handleChangeNetwork = useCallback(() => {
    switchNetwork?.(SupportedChainId.BOLTCHAIN);
  }, [switchNetwork]);

  const swapIsUnsupported = useIsTransactionUnsupported(currencies?.INPUT, currencies?.OUTPUT);

  return (
    <>
      <TokenWarningModal
        isOpen={importTokensNotInDefault.length > 0 && !dismissTokenWarning}
        tokens={importTokensNotInDefault}
        onConfirm={handleConfirmTokenWarning}
        onDismiss={handleDismissTokenWarning}
      />
      <SwapPoolTabs $active={"swap"} />
      <AppBody>
        <SwapHeader />
        <Wrapper id="swap-page">
          <ConfirmSwapModal
            isOpen={showConfirm}
            trade={trade}
            originalTrade={tradeToConfirm}
            onAcceptChanges={handleAcceptChanges}
            attemptingTxn={attemptingTxn}
            txHash={txHash}
            recipient={recipient}
            allowedSlippage={allowedSlippage}
            onConfirm={handleSwap}
            swapErrorMessage={swapErrorMessage}
            onDismiss={handleConfirmDismiss}
          />

          <AutoColumn gap={"md"}>
            <CurrencyInputPanel
              label={independentField === Field.OUTPUT && !showWrap && trade ? "From (estimated)" : "From"}
              value={formattedAmounts[Field.INPUT]}
              showMaxButton={!atMaxAmountInput}
              currency={currencies[Field.INPUT]}
              onUserInput={handleTypeInput}
              onMax={handleMaxInput}
              onCurrencySelect={handleInputSelect}
              otherCurrency={currencies[Field.OUTPUT]}
              id="swap-currency-input"
            />
            <AutoColumn justify="space-between">
              <AutoRow justify={isExpertMode ? "space-between" : "center"} style={{ padding: "0 1rem" }}>
                <ArrowWrapper $clickable>
                  <SwapIcon
                    onClick={() => {
                      setApprovalSubmitted(false); // reset 2 step UI for approvals
                      onSwitchTokens();
                    }}
                  />
                </ArrowWrapper>
                {recipient === null && !showWrap && isExpertMode ? (
                  <LinkStyledButton id="add-recipient-button" onClick={() => onChangeRecipient("")}>
                    + Add a send (optional)
                  </LinkStyledButton>
                ) : null}
              </AutoRow>
            </AutoColumn>
            <CurrencyInputPanel
              label={independentField === Field.INPUT && !showWrap && trade ? "To (estimated)" : "To"}
              value={formattedAmounts[Field.OUTPUT]}
              showMaxButton={false}
              currency={currencies[Field.OUTPUT]}
              onUserInput={handleTypeOutput}
              onCurrencySelect={handleOutputSelect}
              otherCurrency={currencies[Field.INPUT]}
              id="swap-currency-output"
            />

            {recipient !== null && !showWrap ? (
              <>
                <AutoRow justify="space-between" style={{ padding: "0 1rem" }}>
                  <ArrowWrapper $clickable={false}>
                    <ArrowDown size="16" color={theme?.text2} />
                  </ArrowWrapper>
                  <LinkStyledButton id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                    - Remove send
                  </LinkStyledButton>
                </AutoRow>
                <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
              </>
            ) : null}

            {showWrap ? null : (
              <Card padding={showWrap ? ".25rem 1rem 0 1rem" : "0px"} borderRadius={"10px"}>
                <AutoColumn gap="10px">
                  {Boolean(trade) && (
                    <RowBetween align="center">
                      <TradePrice
                        price={trade?.executionPrice}
                        showInverted={showInverted}
                        setShowInverted={setShowInverted}
                      />
                      <Text fontWeight={500} fontSize={14} display={"flex"} alignItems={"center"}>
                        <GasIcon width={18} height={18} />
                        {estimatedGasFee}
                      </Text>
                    </RowBetween>
                  )}

                  {showDetails && (
                    <>
                      <AdvancedSwapDetail trade={trade} />
                    </>
                  )}

                  {trade && (
                    <ChevronWrapper
                      onClick={() => {
                        toggleShowDetails(!showDetails);
                      }}
                    >
                      {showDetails ? (
                        <ChevronUp />
                      ) : (
                        <>
                          <ChevronDown />
                          <Text>Click for more info</Text>{" "}
                        </>
                      )}
                    </ChevronWrapper>
                  )}
                </AutoColumn>
              </Card>
            )}
          </AutoColumn>
          <BottomGrouping>
            {swapIsUnsupported ? (
              <ButtonPrimary disabled={true}>
                <TYPE.main mb="4px">Unsupported Asset</TYPE.main>
              </ButtonPrimary>
            ) : !address ? (
              <ConnectKitLightButton padding="18px" $borderRadius="20px" width="100%">
                Connect Wallet
              </ConnectKitLightButton>
            ) : chainId !== SupportedChainId.BOLTCHAIN ? (
              <ButtonError $error={chainId !== SupportedChainId.BOLTCHAIN} onClick={handleChangeNetwork}>
                Please switch to the Boltchain Network.
              </ButtonError>
            ) : showWrap ? (
              <ButtonPrimary disabled={Boolean(wrapInputError)} onClick={onWrap}>
                {wrapInputError ??
                  (wrapType === WrapType.WRAP ? "Wrap" : wrapType === WrapType.UNWRAP ? "Unwrap" : null)}
              </ButtonPrimary>
            ) : noRoute && userHasSpecifiedInputOutput ? (
              <GreyCard style={{ textAlign: "center" }}>
                <TYPE.main mb="4px">Insufficient liquidity for this trade.</TYPE.main>
                {singleHopOnly && <TYPE.main mb="4px">Try enabling multi-hop trades.</TYPE.main>}
              </GreyCard>
            ) : showApproveFlow ? (
              <RowBetween>
                <ButtonConfirmed
                  onClick={approveCallback}
                  disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                  width="48%"
                  $altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
                  confirmed={approval === ApprovalState.APPROVED}
                >
                  {approval === ApprovalState.PENDING ? (
                    <AutoRow gap="6px" justify="center">
                      Approving <Loader stroke="white" />
                    </AutoRow>
                  ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                    "Approved"
                  ) : (
                    "Approve " + currencies[Field.INPUT]?.symbol
                  )}
                </ButtonConfirmed>
                <ButtonError
                  onClick={() => {
                    if (isExpertMode) {
                      handleSwap();
                    } else {
                      setSwapState({
                        tradeToConfirm: trade,
                        attemptingTxn: false,
                        swapErrorMessage: undefined,
                        showConfirm: true,
                        txHash: undefined,
                      });
                    }
                  }}
                  width="48%"
                  id="swap-button"
                  disabled={
                    !isValid || approval !== ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode)
                  }
                  $error={isValid && priceImpactSeverity > 2}
                >
                  <Text fontSize={14} fontWeight={500}>
                    {priceImpactSeverity > 3 && !isExpertMode
                      ? `Price Impact High`
                      : `Swap${priceImpactSeverity > 2 ? " Anyway" : ""}`}
                  </Text>
                </ButtonError>
              </RowBetween>
            ) : (
              <ButtonError
                onClick={() => {
                  if (isExpertMode) {
                    handleSwap();
                  } else {
                    setSwapState({
                      tradeToConfirm: trade,
                      attemptingTxn: false,
                      swapErrorMessage: undefined,
                      showConfirm: true,
                      txHash: undefined,
                    });
                  }
                }}
                id="swap-button"
                disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                $error={isValid && priceImpactSeverity > 2 && !swapCallbackError}
              >
                <Text fontSize={14} fontWeight={500}>
                  {swapInputError
                    ? swapInputError
                    : priceImpactSeverity > 3 && !isExpertMode
                    ? `Price Impact Too High`
                    : `Swap${priceImpactSeverity > 2 ? " Anyway" : ""}`}
                </Text>
              </ButtonError>
            )}
            {showApproveFlow && (
              <Column style={{ marginTop: "1rem" }}>
                <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
              </Column>
            )}
            {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
            {/* {betterTradeLinkV2 && !swapIsUnsupported && toggledVersion === Version.v1 ? (
              <BetterTradeLink version={betterTradeLinkV2} />
            ) : toggledVersion !== DEFAULT_VERSION && defaultTrade ? (
              <DefaultVersionLink />
            ) : null} */}
          </BottomGrouping>
        </Wrapper>
      </AppBody>
    </>
  );
}
