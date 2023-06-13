import React, {
  KeyboardEvent,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useDebounce from "hooks/useDebounce";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import useTheme from "hooks/useTheme";
import useToggle from "hooks/useToggle";
import { useTranslation } from "react-i18next";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import { Text } from "rebass";
import { Token } from "state/bridge/actions";
import { useBridgeState } from "state/bridge/hooks";
import styled from "styled-components";

import { CloseIcon, TYPE } from "../../theme";
import { isAddress } from "../../utils";
import Column from "../Column";
import Row, { RowBetween } from "../Row";
import CurrencyList from "./CurrencyList";
import { filterTokens } from "./filtering";
import { PaddedColumn, SearchInput, Separator } from "./styleds";

const ContentWrapper = styled(Column)`
  width: 100%;
  flex: 1 1;
  position: relative;
`;

interface BridgeCurrencySearchProps {
  isOpen: boolean;
  onDismiss: () => void;
  selectedCurrency?: Token | null;
  onCurrencySelect: (currency: Token) => void;
}

export function BridgeCurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  onDismiss,
  isOpen,
}: BridgeCurrencySearchProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedQuery = useDebounce(searchQuery, 200);

  const { bridgeableTokens } = useBridgeState();

  // const showETH: boolean = useMemo(() => {
  //   const s = debouncedQuery.toLowerCase().trim()
  //   return s === '' || s === 'e' || s === 'et' || s === 'eth'
  // }, [debouncedQuery])

  const filteredTokens: Token[] = useMemo(() => {
    return filterTokens(Object.values(bridgeableTokens), debouncedQuery);
  }, [bridgeableTokens, debouncedQuery]);

  const handleCurrencySelect = useCallback(
    (currency: Token) => {
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
  const handleInput = useCallback((event: { target: { value: any; }; }) => {
    const input = event.target.value;
    const checksummedInput = isAddress(input);
    setSearchQuery(checksummedInput || input);
    fixedList.current?.scrollTo(0);
  }, []);

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const s = debouncedQuery.toLowerCase().trim();
        if (
          filteredTokens[0].symbol?.toLowerCase() === s ||
          filteredTokens.length === 1
        ) {
          handleCurrencySelect(filteredTokens[0]);
        }
      }
    },
    [handleCurrencySelect, debouncedQuery, filteredTokens],
  );

  // menu ui
  const [open, toggle] = useToggle(false);
  const node = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(node, open ? toggle : undefined);

  return (
    <ContentWrapper>
      <PaddedColumn gap="16px">
        <RowBetween>
          <Text fontWeight={500} fontSize={16}>
            Select a token
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <Row>
          <SearchInput
            type="text"
            id="token-search-input"
            placeholder={t("tokenSearchPlaceholder")}
            autoComplete="off"
            value={searchQuery}
            ref={inputRef as RefObject<HTMLInputElement>}
            onChange={handleInput}
            onKeyDown={handleEnter}
          />
        </Row>
      </PaddedColumn>
      <Separator />
      {filteredTokens.length !== 0 ? (
        <div style={{ flex: "1" }}>
          <AutoSizer disableWidth>
            {({ height }: {height:number}) => (
              <CurrencyList
                height={height}
                currencies={filteredTokens}
                onCurrencySelect={handleCurrencySelect}

                selectedCurrency={selectedCurrency}
                fixedListRef={fixedList}
              />
            )}
          </AutoSizer>
        </div>
      ) : (
        <Column style={{ padding: "20px", height: "100%" }}>
          <TYPE.main color={theme.text3} textAlign="center" mb="20px">
            No results found.
          </TYPE.main>
        </Column>
      )}
    </ContentWrapper>
  );
}
