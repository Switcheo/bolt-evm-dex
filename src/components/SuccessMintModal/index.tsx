import { ArrowUpCircle } from "react-feather";
import { Text } from "rebass";
import styled, { useTheme } from "styled-components";
import { useAccount } from "wagmi";
import { getWalletClient } from "wagmi/actions";
import { BOLT_ERC20_ADDRESS } from "../../constants/addresses";
import { CloseIcon, ExternalLink, LinkStyledButton, TYPE } from "../../theme";
import { getEtherscanLink } from "../../utils/getExplorerLink";
import { ButtonPrimary } from "../Button";
import { AutoColumn, ColumnCenter } from "../Column";
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

interface SuccessMintModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  message?: string | null;
}

function SuccessMintModal({ isOpen, onDismiss, message }: SuccessMintModalProps) {
  const theme = useTheme();
  const { chain } = useAccount();
  const chainId = chain?.id;

  const handleAddBolt = async () => {
    const walletClient = await getWalletClient();
    await walletClient?.watchAsset({
      type: "ERC20",
      options: {
        address: BOLT_ERC20_ADDRESS,
        decimals: 18,
        symbol: "BOLT",
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90}>
      <Wrapper>
        <Section>
          <RowBetween>
            <Text fontWeight={500} fontSize={20}>
              $BOLT Requested
            </Text>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
          <ConfirmedIcon>
            <ArrowUpCircle strokeWidth={0.5} size={90} color={theme?.primary1} />
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
              {BOLT_ERC20_ADDRESS}
            </Text>
            <LinkStyledButton>
              <Text fontWeight={500} fontSize={18} onClick={handleAddBolt}>
                Add $BOLT to Metamask
              </Text>
            </LinkStyledButton>
            <ButtonPrimary onClick={onDismiss} style={{ margin: "20px 0 0 0" }}>
              <Text fontWeight={500} fontSize={20}>
                Close
              </Text>
            </ButtonPrimary>
          </AutoColumn>
        </Section>
      </Wrapper>
    </Modal>
  );
}

export default SuccessMintModal;
