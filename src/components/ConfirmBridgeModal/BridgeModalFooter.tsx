import { useState } from "react";
import { Repeat } from "react-feather";
import { Text } from "rebass";
import { useTheme } from "styled-components";
import { BridgeTx } from "../../hooks/useBridgeCallback";
import { useAppSelector } from "../../store/hooks";
import { TYPE } from "../../theme";
import { ButtonError } from "../Button";
import { AutoColumn } from "../Column";
import QuestionHelper from "../QuestionHelper";
import { AutoRow, RowBetween, RowFixed } from "../Row";
import { SwapCallbackError } from "./styleds";

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
  const theme = useTheme();
  const withdrawFee = useAppSelector((state) => state.bridge.bridgeFees);

  return (
    <>
      <AutoColumn gap="sm">
        <RowBetween align="center">
          <RowFixed>
            <Text fontWeight={400} fontSize={14} color={theme?.text2}>
              Estimated Total Fees
            </Text>
            <QuestionHelper text="Estimated total fees to be incurred for this transfer (in USD). Please note that the fees will be deducted from the amount that is being transferred out of the network and you will receive less tokens as a result." />
          </RowFixed>
          <Text
            fontWeight={500}
            fontSize={14}
            color={theme?.text1}
            style={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              textAlign: "right",
              paddingLeft: "10px",
            }}
          >
            {(BigInt(withdrawFee ?? "0") / BigInt(10) ** BigInt(bridgeTx.destToken?.decimals ?? 8)).toString(10)}
            ETH ~$0.08
          </Text>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black color={theme?.text2} fontSize={14} fontWeight={400}>
              Estimated Transfer Time
            </TYPE.black>
            <QuestionHelper text="Estimated time for the completion of this transfer." />
          </RowFixed>
          &lt; 30 minutes
        </RowBetween>
      </AutoColumn>

      <AutoRow>
        <ButtonError
          onClick={onConfirm}
          disabled={disabledConfirm}
          style={{ margin: "10px 0 0 0" }}
          id="confirm-bridge"
        >
          <Text fontSize={20} fontWeight={500}>
            Confirm Bridge
          </Text>
        </ButtonError>

        {bridgeErrorMessage ? <SwapCallbackError error={bridgeErrorMessage} /> : null}
      </AutoRow>
    </>
  );
}
