import { Text } from "rebass";
import styled, { useTheme } from "styled-components";
import { useNetwork } from "wagmi";
import { ReactComponent as MintErrorIcon } from "../../assets/svg/mint_error.svg";
import { ReactComponent as MintSuccessIcon } from "../../assets/svg/mint_success.svg";
import { BOLT_ERC20_ADDRESS } from "../../constants/addresses";
import { CloseIcon, TYPE } from "../../theme";
import { getEtherscanLink } from "../../utils/getExplorerLink";
import { ExplorerButton } from "../AddressInputPanel";
import { AutoColumn, ColumnCenter } from "../Column";
import MintLoadingIcon from "../MintLoadingIcon";
import Modal from "../Modal";
import { RowBetween } from "../Row";

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
`;

const ContentBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: radial-gradient(ellipse 50% 80%, #b57cfe, #647dfd, #1f77fd, #81e1ff);
  filter: blur(500px);
  backdrop-filter: blur(500px);
  display: flex;
  height: 100%;
  width: 100%;
  border-radius: 12px;
  z-index: -1;
`;

const Section = styled(AutoColumn)`
  padding: 24px;
  background: linear-gradient(to right, rgba(51, 51, 51, 0.1), rgba(0, 0, 0, 0.1));
`;

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 24px 0;
`;

const CloseIconContainer = styled(RowBetween)`
  justify-content: flex-end;
`;

const statusMessages = {
  loading: "$BOLT Requested",
  success: "Mint Request Successful",
  error: "Mint Request Failed",
};

enum Status {
  Idle = "idle",
  Loading = "loading",
  Success = "success",
  Error = "error",
}
interface SuccessMintModalProps {
  isOpen: boolean;
  status: "idle" | "loading" | "success" | "error";
  onDismiss: () => void;
  message?: string | null;
}

function SuccessMintModal({ isOpen, status, onDismiss, message }: SuccessMintModalProps) {
  const theme = useTheme();
  const chainId = useNetwork().chain?.id;

  const renderIcon = () => {
    switch (status) {
      case Status.Loading:
        return <MintLoadingIcon />;
      case Status.Success:
        return <MintSuccessIcon />;
      case Status.Error:
        return <MintErrorIcon />;
      default:
        return null;
    }
  };
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90}>
      <Wrapper>
        <ContentBackground />
        <Section>
          <CloseIconContainer>
            <CloseIcon onClick={onDismiss} />
          </CloseIconContainer>
          <ConfirmedIcon>{renderIcon()}</ConfirmedIcon>
          <AutoColumn gap="12px" justify="center">
            <Text fontWeight={500} fontSize={20} mt={2}>
              {statusMessages[status as keyof typeof statusMessages]}
            </Text>

            {message && (
              <TYPE.body fontSize={14} color={theme?.grey50} textAlign="center" marginBottom="8px">
                {message}
              </TYPE.body>
            )}
            {chainId && status === Status.Success && (
              <ExplorerButton href={getEtherscanLink(chainId, BOLT_ERC20_ADDRESS, "token")}>
                View on Explorer
              </ExplorerButton>
            )}
          </AutoColumn>
        </Section>
      </Wrapper>
    </Modal>
  );
}

export default SuccessMintModal;
