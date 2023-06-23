import { useMemo } from "react";
import { Text } from "rebass";
import styled from "styled-components";
import { ReactComponent as WarningLogo } from "../../assets/svg/warning-popup.svg";
import { getChainNameFromBridgingId } from "../../constants/chains";
import { ButtonPrimary } from "../Button";
import { AutoColumn } from "../Column";
import { RowBetween } from "../Row";

const ModalWrapper = styled.div`
  width: 100%;
  padding: 16px 32px;
`;

const SwitchNetworkModalHeader = ({ chainId, onConfirm }: { chainId: number; onConfirm: () => void }) => {
  const chainIdName = useMemo(() => {
    return getChainNameFromBridgingId(chainId);
  }, [chainId]);

  return (
    <ModalWrapper>
      <AutoColumn gap={"md"} style={{ marginTop: "20px" }} justify="center">
        <WarningLogo />
        <RowBetween justify="center">
          <Text alignSelf="center">You&#39;re connected to the wrong network.</Text>
        </RowBetween>
        <ButtonPrimary padding="16px" style={{ marginTop: 20 }} onClick={onConfirm}>
          Switch to {chainIdName}
        </ButtonPrimary>
      </AutoColumn>
    </ModalWrapper>
  );
};

export default SwitchNetworkModalHeader;
