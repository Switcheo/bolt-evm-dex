import { AlertCircle, CheckCircle } from "react-feather";
import styled, { useTheme } from "styled-components";
import { useAccount } from "wagmi";
import { TYPE } from "../../theme";
import { ExternalLink } from "../../theme/components";
import { getEtherscanLink } from "../../utils/getExplorerLink";
import { AutoColumn } from "../Column";
import { AutoRow } from "../Row";

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`;

export default function TransactionPopup({
  hash,
  success,
  summary,
}: {
  hash: string;
  success?: boolean;
  summary?: string;
}) {
  const { chain } = useAccount();
  const chainId = chain?.id;

  const theme = useTheme();

  return (
    <RowNoFlex>
      <div style={{ paddingRight: 16 }}>
        {success ? <CheckCircle color={theme?.green1} size={24} /> : <AlertCircle color={theme?.red1} size={24} />}
      </div>
      <AutoColumn gap="8px">
        <TYPE.body fontWeight={500}>{summary ?? "Hash: " + hash.slice(0, 8) + "..." + hash.slice(58, 65)}</TYPE.body>
        {chainId && <ExternalLink href={getEtherscanLink(chainId, hash, "transaction")}>View on Explorer</ExternalLink>}
      </AutoColumn>
    </RowNoFlex>
  );
}
