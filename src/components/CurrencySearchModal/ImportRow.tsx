import { CSSProperties } from "react";
import { CheckCircle } from "react-feather";
import styled, { useTheme } from "styled-components";
import { useAccount } from "wagmi";
import { SupportedChainId } from "../../constants/chains";
import { useIsTokenActive, useIsUserAddedToken } from "../../hooks/Tokens";
import { useCombinedInactiveList } from "../../store/modules/lists/hooks";
import { TYPE } from "../../theme";
import { Token } from "../../utils/entities/token";
import { ButtonPrimary } from "../Button";
import { AutoColumn } from "../Column";
import CurrencyLogo from "../CurrencyLogo";
import ListLogo from "../ListLogo";
import { AutoRow, RowFixed } from "../Row";

const TokenSection = styled.div<{ $dim?: boolean }>`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto;
  grid-gap: 16px;
  align-items: center;

  opacity: ${({ $dim }) => ($dim ? "0.4" : "1")};
`;

const CheckIcon = styled(CheckCircle)`
  height: 16px;
  width: 16px;
  margin-right: 6px;
  stroke: ${({ theme }) => theme.green1};
`;

const NameOverflow = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
  font-size: 12px;
`;

export default function ImportRow({
  token,
  style,
  dim,
  showImportView,
  setImportToken,
}: {
  token: Token;
  style?: CSSProperties;
  dim?: boolean;
  showImportView: () => void;
  setImportToken: (token: Token) => void;
}) {
  // gloabls
  const { chain } = useAccount();
  const chainId = chain?.id;
  const theme = useTheme();

  // check if token comes from list
  const inactiveTokenList = useCombinedInactiveList();
  const list = chainId && inactiveTokenList?.[chainId as SupportedChainId]?.[token.address]?.list;

  // check if already active on list or local storage tokens
  const isAdded = useIsUserAddedToken(token);
  const isActive = useIsTokenActive(token);

  return (
    <TokenSection style={style}>
      <CurrencyLogo currency={token} size={"24px"} style={{ opacity: dim ? "0.6" : "1" }} />
      <AutoColumn gap="4px" style={{ opacity: dim ? "0.6" : "1" }}>
        <AutoRow>
          <TYPE.body fontWeight={500}>{token.symbol}</TYPE.body>
          <TYPE.darkGray ml="8px" fontWeight={300}>
            <NameOverflow title={token.name}>{token.name}</NameOverflow>
          </TYPE.darkGray>
        </AutoRow>
        {list && list.logoURI && (
          <RowFixed>
            <TYPE.small mr="4px" color={theme?.text3}>
              via {list.name}
            </TYPE.small>
            <ListLogo logoURI={list.logoURI} size="12px" />
          </RowFixed>
        )}
      </AutoColumn>
      {!isActive && !isAdded ? (
        <ButtonPrimary
          width="fit-content"
          padding="6px 12px"
          fontWeight={500}
          fontSize="14px"
          onClick={() => {
            setImportToken && setImportToken(token);
            showImportView();
          }}
        >
          Import
        </ButtonPrimary>
      ) : (
        <RowFixed style={{ minWidth: "fit-content" }}>
          <CheckIcon />
          <TYPE.main color={theme?.green1}>Active</TYPE.main>
        </RowFixed>
      )}
    </TokenSection>
  );
}
