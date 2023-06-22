import { CSSProperties, ForwardedRef, forwardRef, ReactNode } from "react";
import { ChevronRight } from "react-feather";
import styled, { css } from "styled-components";
import { ClickableStyle } from "../../theme";
import { formatTransactionHash } from "../../utils/format";
import { LARGE_MEDIA_BREAKPOINT, MAX_WIDTH_MEDIA_BREAKPOINT, MEDIUM_MEDIA_BREAKPOINT, SMALL_MEDIA_BREAKPOINT } from "./constants";


export enum TokenSortMethod {
  PRICE = "Price",
  PERCENT_CHANGE = "Change",
  TOTAL_VALUE_LOCKED = "TVL",
  VOLUME = "Volume",
}

const Cell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DataCell = styled(Cell)<{ $sortable: boolean }>`
  justify-content: flex-end;
  min-width: 80px;
  user-select: ${({ $sortable }) => ($sortable ? "none" : "unset")};
  transition: ${({
    theme: {
      transition: { duration, timing },
    },
  }) => css`background-color ${duration.medium} ${timing.ease}`};
`;

const DateCell = styled(Cell)`
  justify-content: flex-start;
  padding: 0px 8px;
  /* min-width: 240px; */
  gap: 8px;

  /* Ellipsis */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NameCell = styled(Cell)`
  justify-content: flex-start;
  padding: 0px 8px;
  min-width: 240px;
  gap: 8px;
`;

const ChainCell = styled(Cell)`
  justify-content: flex-start;
  padding: 0px 8px;
  /* min-width: 240px; */
  gap: 8px;
`;

const StatusCell = styled(Cell)`
  justify-content: flex-start;
  padding: 0px 8px;
  /* min-width: 240px; */
  gap: 8px;
`;

const TransactionCell = styled(DataCell)`
  padding-right: 8px;
  @media only screen and (max-width: ${SMALL_MEDIA_BREAKPOINT}) {
    display: none;
  }
`;

const MoreDetailsCell = styled(Cell)`
  justify-content: flex-start;
  padding: 0px 8px;
  /* min-width: 240px; */
  gap: 8px;
`;

const HeaderCellWrapper = styled.span<{ onClick?: () => void }>`
  align-items: center;
  cursor: ${({ onClick }) => (onClick ? "pointer" : "unset")};
  display: flex;
  gap: 4px;
  justify-content: flex-end;
  width: 100%;

  &:hover {
    ${ClickableStyle}
  }
`;

const StyledTokenRow = styled.div<{
  first?: boolean;
  last?: boolean;
  $loading?: boolean;
}>`
  background-color: transparent;
  display: grid;
  font-size: 13px;
  grid-template-columns: 3fr 5fr 3fr 3fr 4fr 4fr 4fr 3fr 3fr;
  line-height: 24px;
  max-width: 1366px;
  min-width: 390px;
  ${({ first, last }) => css`
    height: ${first || last ? "72px" : "64px"};
    padding-top: ${first ? "8px" : "0px"};
    padding-bottom: ${last ? "8px" : "0px"};
  `}
  padding-left: 12px;
  padding-right: 12px;
  transition: ${({
    theme: {
      transition: { duration, timing },
    },
  }) => css`background-color ${duration.medium} ${timing.ease}`};
  width: 100%;
  transition-duration: ${({ theme }) => theme.transition.duration.fast};

  &:hover {
    ${({ $loading, theme }) =>
      !$loading &&
      css`
        background-color: ${theme.hoverDefault};
      `}
    ${({ last }) =>
      last &&
      css`
        border-radius: 0px 0px 8px 8px;
      `}
  }

  @media only screen and (max-width: ${MAX_WIDTH_MEDIA_BREAKPOINT}) {
    grid-template-columns: 3fr 5fr 3fr 3fr 4fr 4fr 4fr 3fr 3fr;
  }

  @media only screen and (max-width: ${LARGE_MEDIA_BREAKPOINT}) {
    grid-template-columns: 3fr 5fr 3fr 3fr 4fr 4fr 4fr 3fr 3fr;
  }

  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    grid-template-columns: 1fr 10fr 5fr 5fr 1.2fr;
  }

  @media only screen and (max-width: ${SMALL_MEDIA_BREAKPOINT}) {
    grid-template-columns: 2fr 3fr;
    min-width: unset;
    border-bottom: 0.5px solid ${({ theme }) => theme.backgroundModule};

    :last-of-type {
      border-bottom: none;
    }
  }
`;

const StyledHeaderRow = styled(StyledTokenRow)`
  border-bottom: 1px solid;
  border-color: ${({ theme }) => theme.backgroundOutline};
  border-radius: 8px 8px 0px 0px;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
  height: 48px;
  line-height: 16px;
  padding: 0px 12px;
  width: 100%;
  justify-content: center;

  &:hover {
    background-color: transparent;
  }

  @media only screen and (max-width: ${SMALL_MEDIA_BREAKPOINT}) {
    justify-content: space-between;
  }
`;

const TokenInfoCell = styled(Cell)`
  gap: 8px;
  line-height: 24px;
  /* font-size: 16px; */
  max-width: inherit;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media only screen and (max-width: ${SMALL_MEDIA_BREAKPOINT}) {
    justify-content: flex-start;
    flex-direction: column;
    gap: 0px;
    width: max-content;
    font-weight: 500;
  }
`;

const TokenName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
`;

const TokenSymbol = styled(Cell)`
  color: ${({ theme }) => theme.textTertiary};
  text-transform: uppercase;

  @media only screen and (max-width: ${SMALL_MEDIA_BREAKPOINT}) {
    font-size: 12px;
    height: 16px;
    justify-content: flex-start;
    width: 100%;
  }
`;

interface TokenRowProps {
  first?: boolean;
  header: boolean;
  $loading?: boolean;
  date: ReactNode;
  tokenInfo: ReactNode;
  sourceChain: ReactNode;
  destinationChain: ReactNode;
  sourceTransaction: ReactNode;
  destinationTransaction: ReactNode;
  bridgeTransaction: ReactNode;
  status: ReactNode;
  moreDetails: ReactNode;
  last?: boolean;
  style?: CSSProperties;
}

/* Token Row: skeleton row component */
function TokenRow({
  header,
  date,
  tokenInfo,
  sourceChain,
  destinationChain,
  sourceTransaction,
  destinationTransaction,
  bridgeTransaction,
  status,
  moreDetails,
  ...rest
}: TokenRowProps) {
  const rowCells = (
    <>
      <DateCell data-testid="date-cell">{date}</DateCell>
      <NameCell data-testid="name-cell">{tokenInfo}</NameCell>
      <ChainCell data-testid="source-chain-cell">{sourceChain}</ChainCell>
      <ChainCell data-testid="destination-chain-cell">{destinationChain}</ChainCell>
      <TransactionCell data-testid="source-transaction-cell" $sortable={false}>
        {sourceTransaction}
      </TransactionCell>
      <TransactionCell data-testid="destination-transaction-cell" $sortable={false}>
        {destinationTransaction}
      </TransactionCell>
      <TransactionCell data-testid="bridge-transaction-cell" $sortable={false}>
        {bridgeTransaction}
      </TransactionCell>
      <StatusCell data-testid="status-cell">{status}</StatusCell>
      <MoreDetailsCell data-testid="more-details-cell">{moreDetails}</MoreDetailsCell>
    </>
  );
  if (header) return <StyledHeaderRow data-testid="header-row">{rowCells}</StyledHeaderRow>;
  return <StyledTokenRow {...rest}>{rowCells}</StyledTokenRow>;
}

export function HeaderRow() {
  return (
    <TokenRow
      header={true}
      date={"Date/Time"}
      tokenInfo={"Asset name"}
      sourceChain={"Source"}
      destinationChain={"Destination"}
      sourceTransaction={"Source Tx"}
      destinationTransaction={"Destination Tx"}
      bridgeTransaction={"Bridge Tx"}
      status={"Status"}
      moreDetails={"More details"}
    />
  );
}

interface LoadedRowProps {
  id: string;
  date: string;
  assetName: string;
  assetSymbol: string;
  sourceChain: string;
  destinationChain: string;
  sourceTransactionHash: string;
  destinationTransactionHash: string;
  bridgeTransactionHash: string;
  status: string;
  moreDetails: string;
}

/* Loaded State: row component with token information */
export const LoadedRow = forwardRef((props: LoadedRowProps, ref: ForwardedRef<HTMLDivElement>) => {
  const {
    id,
    date,
    assetName,
    assetSymbol,
    sourceChain,
    destinationChain,
    sourceTransactionHash,
    destinationTransactionHash,
    bridgeTransactionHash,
    status,
    // moreDetails,
  } = props;

  return (
    <div ref={ref} data-testid={`token-table-row-${id}`}>
      {/* <StyledLink to={"#"}> */}
      <TokenRow
        header={false}
        date={date}
        tokenInfo={
          <TokenInfoCell>
            <TokenName data-cy="token-name">{assetName}</TokenName>
            <TokenSymbol>{assetSymbol}</TokenSymbol>
          </TokenInfoCell>
        }
        sourceChain={sourceChain}
        destinationChain={destinationChain}
        sourceTransaction={formatTransactionHash(sourceTransactionHash)}
        destinationTransaction={formatTransactionHash(destinationTransactionHash)}
        bridgeTransaction={formatTransactionHash(bridgeTransactionHash)}
        status={status}
        moreDetails={
          <MoreDetailsCell>
            <ChevronRight size={16} />
          </MoreDetailsCell>
        }
      />
      {/* </StyledLink> */}
    </div>
  );
});