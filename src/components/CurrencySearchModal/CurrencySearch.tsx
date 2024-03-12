import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import { Text } from "rebass";
import styled, { useTheme } from "styled-components";
import { getAddress, isAddress } from "viem";
import { useNetwork } from "wagmi";
import { ReactComponent as ManageEdit } from "../../assets/svg/manage_edit.svg";
import { useAllTokens, useFoundOnInactiveList, useIsUserAddedToken, useToken } from "../../hooks/Tokens";
import { useDebounce } from "../../hooks/useDebounce";
import { useOnClickOutside } from "../../hooks/useOnOutsideClick";
import useToggle from "../../hooks/useToggle";
import { useTokenComparator } from "../../hooks/useTokenComparator";
import { ButtonText, CloseIcon, IconWrapper, TYPE } from "../../theme";
import { Currency, ETHER } from "../../utils/entities/currency";
import { Token } from "../../utils/entities/token";
import { filterTokens, useSortedTokensByQuery } from "../../utils/listFilter";
import Column, { AutoColumn } from "../Column";
import Row, { RowBetween } from "../Row";
import CommonBases from "./CommonBases";
import CurrencyList from "./CurrencyList";
import ImportRow from "./ImportRow";

const ContentWrapper = styled(Column)`
  width: 100%;
  flex: 1 1;
  position: relative;
  background: transparent;
  z-index: 0;
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
  opacity: 10%;
  z-index: -1;
`;

const Footer = styled.div`
  width: 100%;
  border-radius: 20px;
  padding: 20px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`;

export const PaddedColumn = styled(AutoColumn)`
  padding: 20px;
`;

export const SearchInput = styled.input`
  position: relative;
  display: flex;
  padding: 8px 16px;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  border-radius: 8px;
  color: ${({ theme }) => theme.text1};
  border-style: solid;
  border: 1px solid ${({ theme }) => theme.bg3};
  -webkit-appearance: none;
  font-size: 14px;

  ::placeholder {
    color: ${({ theme }) => theme.text3};
  }
  transition: border 100ms;
  &:focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }
`;

export const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.bg2};
`;

const ManageButton = styled(ButtonText)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text1};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.bg3};
  padding: 8px 16px;
`;

interface CurrencySearchProps {
  isOpen: boolean;
  onDismiss: () => void;
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  otherSelectedCurrency?: Currency | null;
  showCommonBases?: boolean;
  showManageView: () => void;
  showImportView: () => void;
  setImportToken: (token: Token) => void;
}

export function CurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  onDismiss,
  isOpen,
  showManageView,
  showImportView,
  setImportToken,
}: CurrencySearchProps) {
  const chainId = useNetwork().chain?.id;
  const theme = useTheme();

  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedQuery = useDebounce(searchQuery, 200);

  const [invertSearchOrder] = useState<boolean>(false);

  const allTokens = useAllTokens(); // This gives all the tokens on the current chain

  // if they input an address, use it
  const searchToken = useToken(debouncedQuery);
  const searchTokenIsAdded = useIsUserAddedToken(searchToken);

  const showETH: boolean = useMemo(() => {
    const s = debouncedQuery.toLowerCase().trim();
    return s === "" || s === "e" || s === "et" || s === "eth";
  }, [debouncedQuery]);

  const tokenComparator = useTokenComparator(invertSearchOrder);

  const filteredTokens: Token[] = useMemo(() => {
    return filterTokens(Object.values(allTokens), debouncedQuery);
  }, [allTokens, debouncedQuery]);

  const sortedTokens: Token[] = useMemo(() => {
    return filteredTokens.sort(tokenComparator);
  }, [filteredTokens, tokenComparator]);

  const filteredSortedTokens = useSortedTokensByQuery(sortedTokens, debouncedQuery);

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency);
      onDismiss();
    },
    [onDismiss, onCurrencySelect],
  );

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery("");
  }, [isOpen]);

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>();
  const handleInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    const checksummedInput = isAddress(input) ? getAddress(input) : undefined;
    setSearchQuery(checksummedInput || input);
    fixedList.current?.scrollTo(0);
  }, []);

  const handleEnter = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const s = debouncedQuery.toLowerCase().trim();
        if (s === "eth") {
          handleCurrencySelect(ETHER);
        } else if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokens[0]);
          }
        }
      }
    },
    [filteredSortedTokens, handleCurrencySelect, debouncedQuery],
  );

  // menu ui
  const [open, toggle] = useToggle(false);
  const node = useRef<HTMLDivElement>();
  useOnClickOutside(node, open ? toggle : undefined);

  // if no results on main list, show option to expand into inactive
  const inactiveTokens = useFoundOnInactiveList(debouncedQuery);
  const filteredInactiveTokens: Token[] = useSortedTokensByQuery(inactiveTokens, debouncedQuery);

  return (
    <ContentWrapper>
      <ContentBackground />
      <PaddedColumn gap="16px">
        <RowBetween>
          <Text fontWeight={700} fontSize={16}>
            Select Token
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <Row>
          <SearchInput
            type="text"
            id="token-search-input"
            placeholder={"Search Tokens"}
            autoComplete="off"
            value={searchQuery}
            ref={inputRef as RefObject<HTMLInputElement>}
            onChange={handleInput}
            onKeyDown={handleEnter}
          />
        </Row>
        <CommonBases chainId={chainId} onSelect={handleCurrencySelect} selectedCurrency={selectedCurrency} />
      </PaddedColumn>
      <Separator />
      {searchToken && !searchTokenIsAdded ? (
        <Column style={{ padding: "20px 0", height: "100%" }}>
          <ImportRow token={searchToken} showImportView={showImportView} setImportToken={setImportToken} />
        </Column>
      ) : filteredSortedTokens?.length > 0 || filteredInactiveTokens?.length > 0 ? (
        <div style={{ flex: "1" }}>
          <AutoSizer disableWidth>
            {({ height }) => (
              <CurrencyList
                height={height}
                showETH={showETH}
                currencies={
                  filteredInactiveTokens ? filteredSortedTokens.concat(filteredInactiveTokens) : filteredSortedTokens
                }
                breakIndex={inactiveTokens && filteredSortedTokens ? filteredSortedTokens.length : undefined}
                onCurrencySelect={handleCurrencySelect}
                otherCurrency={otherSelectedCurrency}
                selectedCurrency={selectedCurrency}
                fixedListRef={fixedList}
                showImportView={showImportView}
                setImportToken={setImportToken}
              />
            )}
          </AutoSizer>
        </div>
      ) : (
        <Column style={{ padding: "20px", height: "100%" }}>
          <TYPE.main color={theme?.text3} textAlign="center" mb="20px">
            No results found.
          </TYPE.main>
        </Column>
      )}
      <Footer>
        <Row justify="center">
          <ManageButton onClick={showManageView} className="list-token-manage-button">
            <IconWrapper size="16px" $marginRight="6px">
              <ManageEdit />
            </IconWrapper>
            <TYPE.main>Manage</TYPE.main>
          </ManageButton>
        </Row>
      </Footer>
    </ContentWrapper>
  );
}
