import { Trade, TradeType } from "@bolt-dex/sdk";
import { BridgeTx } from "pages/Bridge";
import React, { useContext, useMemo, useState } from "react";
import { Repeat } from "react-feather";
import { Text } from "rebass";
import { ThemeContext } from "styled-components";
import { Field } from "../../state/swap/actions";
import { TYPE } from "../../theme";
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  formatExecutionPrice,
  warningSeverity,
} from "../../utils/prices";
import { ButtonError } from "../Button";
import { AutoColumn } from "../Column";
import QuestionHelper from "../QuestionHelper";
import { AutoRow, RowBetween, RowFixed } from "../Row";
import FormattedPriceImpact from "./FormattedPriceImpact";
import { StyledBalanceMaxMini, SwapCallbackError } from "./styleds";

export default function BridgeModalFooter({
  bridgeTx,
  onConfirm,
  // allowedSlippage,
  bridgeErrorMessage,
  disabledConfirm,
}: {
  bridgeTx: BridgeTx;
  // allowedSlippage: number;
  onConfirm: () => void;
  bridgeErrorMessage: string | undefined;
  disabledConfirm: boolean;
}) {
  const [showInverted, setShowInverted] = useState<boolean>(false);
  // @ts-ignore
  const theme = useContext(ThemeContext);

  return (
    <>
      <AutoColumn gap="0px">
        <RowBetween align="center">
          <Text fontWeight={400} fontSize={14} color={theme.text2}>
            Price
          </Text>
          <Text
            fontWeight={500}
            fontSize={14}
            color={theme.text1}
            style={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              textAlign: "right",
              paddingLeft: "10px",
            }}
          >
            {/* {formatExecutionPrice(trade, showInverted)} */}
            <StyledBalanceMaxMini
              onClick={() => setShowInverted(!showInverted)}
            >
              <Repeat size={14} />
            </StyledBalanceMaxMini>
          </Text>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
              {/* {trade.tradeType === TradeType.EXACT_INPUT
                ? "Minimum received"
                : "Maximum sold"} */}
            </TYPE.black>
            <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
          </RowFixed>
          <RowFixed>
            <TYPE.black fontSize={14}>
              {/* {trade.tradeType === TradeType.EXACT_INPUT
                ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? "-"
                : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? "-"} */}
            </TYPE.black>
            <TYPE.black fontSize={14} marginLeft={"4px"}>
              {/* {trade.tradeType === TradeType.EXACT_INPUT
                ? trade.outputAmount.currency.symbol
                : trade.inputAmount.currency.symbol} */}
            </TYPE.black>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black color={theme.text2} fontSize={14} fontWeight={400}>
              Price Impact
            </TYPE.black>
            <QuestionHelper text="The difference between the market price and your price due to trade size." />
          </RowFixed>
          {/* <FormattedPriceImpact priceImpact={priceImpactWithoutFee} /> */}
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
              Liquidity Provider Fee
            </TYPE.black>
            <QuestionHelper text="A portion of each trade (0.30%) goes to liquidity providers as a protocol incentive." />
          </RowFixed>
          <TYPE.black fontSize={14}>
            {/* {realizedLPFee
              ? realizedLPFee?.toSignificant(6) +
                " " +
                trade.inputAmount.currency.symbol
              : "-"} */}
          </TYPE.black>
        </RowBetween>
      </AutoColumn>

      <AutoRow>
        <ButtonError
          onClick={onConfirm}
          disabled={disabledConfirm}
          style={{ margin: "10px 0 0 0" }}
          id="confirm-swap-or-send"
        >
          <Text fontSize={20} fontWeight={500}>
            Confirm Bridge
          </Text>
        </ButtonError>

        {bridgeErrorMessage ? (
          <SwapCallbackError error={bridgeErrorMessage} />
        ) : null}
      </AutoRow>
    </>
  );
}
