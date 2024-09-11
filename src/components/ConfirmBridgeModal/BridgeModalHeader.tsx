import { ArrowDown } from "react-feather";
import { Text } from "rebass";
import { useTheme } from "styled-components";
import { formatUnits, isAddress } from "viem";
import { BridgeTx } from "../../hooks/useBridgeCallback";
import { TYPE } from "../../theme";
import { shortenString } from "../../utils/format";
import { AutoColumn } from "../Column";
import CurrencyLogo from "../CurrencyLogo";
import { RowBetween, RowFixed } from "../Row";
import { TruncatedText } from "./styleds";
import { getChainNameFromId } from "../../constants/chains";
import { Currency } from "../../utils/entities/currency";

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
          <CurrencyLogo currency={Currency.ETHER} size={"24px"} style={{ marginRight: "12px" }} />
          <TruncatedText fontSize={24} fontWeight={500} color={theme?.primary1}>
            {formatUnits(BigInt(bridgeTx.amount), 18)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap={"0px"}>
          <AutoColumn justify="flex-end">
            <Text fontSize={16} fontWeight={500} style={{ marginLeft: "10px", whiteSpace: "nowrap" }}>
              {bridgeTx.srcToken}
            </Text>
            <Text fontSize={12} fontWeight={500} style={{ marginLeft: "10px", whiteSpace: "nowrap" }}>
              {getChainNameFromId(bridgeTx.srcChain)}
            </Text>
          </AutoColumn>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        <ArrowDown size="16" color={theme?.text2} style={{ marginLeft: "4px", minWidth: "16px" }} />
      </RowFixed>
      <RowBetween align="flex-end">
        <RowFixed gap={"0px"}>
          <CurrencyLogo currency={Currency.ETHER} size={"24px"} style={{ marginRight: "12px" }} />
          <TruncatedText fontSize={24} fontWeight={500} color={theme?.primary1}>
            {formatUnits(BigInt(bridgeTx.amount), 18)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap={"0px"}>
          <AutoColumn justify="flex-end">
            <Text fontSize={16} fontWeight={500} style={{ marginLeft: "10px", whiteSpace: "nowrap" }}>
              {bridgeTx.destToken}
            </Text>
            <Text fontSize={12} fontWeight={500} style={{ marginLeft: "10px", whiteSpace: "nowrap" }}>
              {getChainNameFromId(bridgeTx.destChain)}
            </Text>
          </AutoColumn>
        </RowFixed>
      </RowBetween>
      <AutoColumn justify="flex-start" gap="sm" style={{ padding: "12px 0 0 0px" }}></AutoColumn>
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
