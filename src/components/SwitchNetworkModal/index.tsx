import { Text } from "rebass";
import styled from "styled-components";
import { CloseIcon } from "../../theme";
import { AutoColumn } from "../Column";
import Modal from "../Modal";
import { RowBetween } from "../Row";
import SwitchNetworkModalHeader from "./SwitchNetworkModalHeader";

const Wrapper = styled.div`
  width: 100%;
`;

const Section = styled(AutoColumn)`
  padding: 24px;
`;

interface SwitchNetworkModalProps {
  isOpen: boolean;
  chainId: number;
  onDismiss: () => void;
  onConfirm: () => void;
}

const SwitchNetworkModal = ({ isOpen, onDismiss, chainId, onConfirm }: SwitchNetworkModalProps) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90}>
      <Wrapper>
        <Section>
          <RowBetween>
            <Text fontWeight={500} fontSize={20}>
              Switch Network
            </Text>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
          <SwitchNetworkModalHeader chainId={chainId} onConfirm={onConfirm} />
        </Section>
      </Wrapper>
    </Modal>
  );
};

export default SwitchNetworkModal;
