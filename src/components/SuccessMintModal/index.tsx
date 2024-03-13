import { Text } from "rebass";
import styled, { useTheme } from "styled-components";
import { useNetwork } from "wagmi";
import { ReactComponent as MintErrorIcon } from "../../assets/svg/mint_error.svg";
import { ReactComponent as MintSuccessIcon } from "../../assets/svg/mint_success.svg";
import { BOLT_ERC20_ADDRESS } from "../../constants/addresses";
import { CloseIcon, ExternalLink, TYPE } from "../../theme";
import { getEtherscanLink } from "../../utils/getExplorerLink";
import { AutoColumn, ColumnCenter } from "../Column";
import MintLoadingIcon from "../MintLoadingIcon";
import Modal from "../Modal";
import { RowBetween } from "../Row";

const Wrapper = styled.div`
  width: 100%;
`;
const Section = styled(AutoColumn)`
  padding: 24px;
`;

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`;

const CloseIconContainer = styled(RowBetween)`
  justify-content: flex-end;
`;

interface SuccessMintModalProps {
  isOpen: boolean;
  status: "idle" | "loading" | "success" | "error";
  onDismiss: () => void;
  message?: string | null;
}

function SuccessMintModal({ isOpen, status, onDismiss, message }: SuccessMintModalProps) {
  const theme = useTheme();
  const chainId = useNetwork().chain?.id;

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90}>
      <Wrapper>
        <Section>
          <CloseIconContainer>
            <CloseIcon onClick={onDismiss} />
          </CloseIconContainer>
          <ConfirmedIcon>
            {status === "loading" && <MintLoadingIcon />}
            {status === "success" && <MintSuccessIcon />}
            {status === "error" && <MintErrorIcon />}
            <Text fontWeight={500} fontSize={20} mt={4}>
              $BOLT Requested
            </Text>
          </ConfirmedIcon>
          <AutoColumn gap="12px" justify={"center"}>
            {message && (
              <TYPE.body fontSize={14} color={theme?.green1} textAlign="center">
                {message}
              </TYPE.body>
            )}
            {chainId && (
              <ExternalLink href={getEtherscanLink(chainId, BOLT_ERC20_ADDRESS, "token")}>
                <Text fontWeight={500} fontSize={14} color={theme?.primary1}>
                  View on Explorer
                </Text>
              </ExternalLink>
            )}
            <Text fontWeight={500} fontSize={14}>
              requested for {BOLT_ERC20_ADDRESS}
            </Text>
          </AutoColumn>
        </Section>
      </Wrapper>
    </Modal>
  );
}

export default SuccessMintModal;
