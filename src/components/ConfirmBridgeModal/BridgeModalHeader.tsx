import { ArrowDown } from "react-feather";
import { Text } from "rebass";
import { useTheme } from "styled-components";
import { isAddress } from "viem";
import { getChainNameFromBridgingId, SupportedBridgingChainId } from "../../constants/chains";
import { BridgeTx } from "../../hooks/useBridgeCallback";
import { TYPE } from "../../theme";
import { shortenString } from "../../utils/format";
import { AutoColumn } from "../Column";
import CurrencyLogo from "../CurrencyLogo";
import { RowBetween, RowFixed } from "../Row";
import { TruncatedText } from "./styleds";

export default function BridgeModalHeader({
  bridgeTx,
  recipient,
}: // onAcceptChanges,
{
  bridgeTx: BridgeTx;
  recipient: string | null;
  // onAcceptChanges: () => void;
}) {
  const theme = useTheme();

  return (
    <AutoColumn gap={"md"} style={{ marginTop: "20px" }}>
      <RowBetween align="flex-end">
        <RowFixed gap={"0px"}>
          {/* <CurrencyLogo
            currency={trade.inputAmount.currency}
            size={"24px"}
            style={{ marginRight: "12px" }}
          /> */}
          <TruncatedText fontSize={24} fontWeight={500} color={theme?.primary1}>
            {bridgeTx.amount.toString()}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap={"0px"}>
          <AutoColumn justify="flex-end">
            <Text fontSize={16} fontWeight={500} style={{ marginLeft: "10px", whiteSpace: "nowrap" }}>
              {bridgeTx.srcToken?.name}
            </Text>
            <Text fontSize={12} fontWeight={500} style={{ marginLeft: "10px", whiteSpace: "nowrap" }}>
              {getChainNameFromBridgingId(bridgeTx.srcToken?.bridgeChainId as SupportedBridgingChainId)}
            </Text>
          </AutoColumn>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        <ArrowDown size="16" color={theme?.text2} style={{ marginLeft: "4px", minWidth: "16px" }} />
      </RowFixed>
      <RowBetween align="flex-end">
        <RowFixed gap={"0px"}>
          <CurrencyLogo currency={bridgeTx.destToken} size={"24px"} style={{ marginRight: "12px" }} />
          <TruncatedText fontSize={24} fontWeight={500} color={theme?.primary1}>
            {bridgeTx.amount.toString()}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap={"0px"}>
          <AutoColumn justify="flex-end">
            <Text fontSize={16} fontWeight={500} style={{ marginLeft: "10px", whiteSpace: "nowrap" }}>
              {bridgeTx.destToken?.name}
            </Text>
            <Text fontSize={12} fontWeight={500} style={{ marginLeft: "10px", whiteSpace: "nowrap" }}>
              {getChainNameFromBridgingId(bridgeTx.destToken?.bridgeChainId as SupportedBridgingChainId)}
            </Text>
          </AutoColumn>
        </RowFixed>
      </RowBetween>
      {/* {showAcceptChanges ? (
        <SwapShowAcceptChanges justify="flex-start" gap={"0px"}>
          <RowBetween>
            <RowFixed>
              <AlertTriangle
                size={20}
                style={{ marginRight: "8px", minWidth: 24 }}
              />
              <TYPE.main color={theme.primary1}> Price Updated</TYPE.main>
            </RowFixed>
            <ButtonPrimary
              style={{
                padding: ".5rem",
                width: "fit-content",
                fontSize: "0.825rem",
                borderRadius: "12px",
              }}
              onClick={onAcceptChanges}
            >
              Accept
            </ButtonPrimary>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null} */}
      <AutoColumn justify="flex-start" gap="sm" style={{ padding: "12px 0 0 0px" }}>
        {/* {trade.tradeType === TradeType.EXACT_INPUT ? (
          <TYPE.italic textAlign="left" style={{ width: "100%" }}>
            {`Output is estimated. You will receive at least `}
            <b>
              {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)}{" "}
              {trade.outputAmount.currency.symbol}
            </b>
            {" or the transaction will revert."}
          </TYPE.italic>
        ) : (
          <TYPE.italic textAlign="left" style={{ width: "100%" }}>
            {`Input is estimated. You will sell at most `}
            <b>
              {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)}{" "}
              {trade.inputAmount.currency.symbol}
            </b>
            {" or the transaction will revert."}
          </TYPE.italic>
        )} */}
      </AutoColumn>
      {recipient !== null ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: "12px 0 0 0px" }}>
          <TYPE.main>
            Output will be sent to{" "}
            <b title={recipient}>{isAddress(recipient) ? shortenString(recipient, 4) : recipient}</b>
          </TYPE.main>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  );
}
