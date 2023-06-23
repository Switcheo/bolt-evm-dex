import { ChangeEvent, RefObject, useCallback, useEffect, useRef, useState } from "react";
import { FixedSizeList } from "react-window";
import { Text } from "rebass";
import styled, { useTheme } from "styled-components";
import { getAddress, isAddress } from "viem";
import { useOnClickOutside } from "../../hooks/useOnOutsideClick";
import useToggle from "../../hooks/useToggle";
import { useAppSelector } from "../../store/hooks";
import { CloseIcon, TYPE } from "../../theme";
import { deserializeBridgeableToken } from "../../utils/bridge";
import { BridgeableToken } from "../../utils/entities/bridgeableToken";
import Column, { AutoColumn } from "../Column";
import Row, { RowBetween } from "../Row";
import BridgeableTokensList from "./BridgeableTokensList";


const ContentWrapper = styled(Column)`
  width: 100%;
  flex: 1 1;
  position: relative;
`;

export const PaddedColumn = styled(AutoColumn)`
  padding: 20px;
`;

export const SearchInput = styled.input`
  position: relative;
  display: flex;
  padding: 16px;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  border-radius: 20px;
  color: ${({ theme }) => theme.text1};
  border-style: solid;
  border: 1px solid ${({ theme }) => theme.bg3};
  -webkit-appearance: none;

  font-size: 18px;

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

interface BridgeCurrencySearchProps {
  isOpen: boolean;
  onDismiss: () => void;
  selectedCurrency?: BridgeableToken | null;
  onCurrencySelect: (currency: BridgeableToken) => void;
}

const BridgeCurrencySearch = ({ selectedCurrency, onCurrencySelect, onDismiss, isOpen }: BridgeCurrencySearchProps) => {
  const theme = useTheme();
  const bridgeableTokens = useAppSelector((state) => state.bridge.bridgeableTokens);
  const sourceChain = useAppSelector((state) => state.bridge.sourceChain);

  const [filteredTokens, setFilteredTokens] = useState<BridgeableToken[]>([]);

  // refs for fixed size lists
 const fixedList = useRef<FixedSizeList<(BridgeableToken | undefined)[]>>();
  const inputRef = useRef<HTMLInputElement>();

  const [searchQuery, setSearchQuery] = useState<string>("");
  // const debouncedQuery = useDebounce(searchQuery, 200);

  // Handlers

  const handleCurrencySelect = useCallback(
    (currency: BridgeableToken) => {
      onCurrencySelect(currency);
      onDismiss();
    },
    [onCurrencySelect, onDismiss],
  );

  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    const checksummedInput = isAddress(input) ? getAddress(input) : undefined;
    setSearchQuery(checksummedInput || input);
    fixedList.current?.scrollTo(0);
  }, []);

  // Effect

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery("");
  }, [isOpen]);

  useEffect(() => {
    if (bridgeableTokens) {
      const tempFilteredTokens = Object.values(bridgeableTokens)
        .map((token) => deserializeBridgeableToken(token[sourceChain]))
        .filter((token) => token !== undefined)
        .map((token) => token as BridgeableToken);

      setFilteredTokens(tempFilteredTokens);
    }
  }, [bridgeableTokens, sourceChain, setFilteredTokens]);

  // menu ui
  const [, toggle] = useToggle(false);
  const node = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(node, toggle);

  return (
    <ContentWrapper>
      <PaddedColumn gap="16px">
        <RowBetween>
          <Text fontWeight={500} fontSize={16}>
            Select a token to bridge
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <Row>
          <SearchInput
            type="text"
            id="token-search-input"
            placeholder={"Search name or paste address"}
            autoComplete="off"
            value={searchQuery}
            ref={inputRef as RefObject<HTMLInputElement>}
            onChange={handleInput}
            // onKeyDown={handleEnter}
          />
        </Row>
      </PaddedColumn>
      <Separator />
      {filteredTokens?.length > 0 ? (
        <div style={{ flex: "1" }}>
          {/* <AutoSizer disableWidth>
            {({ height }: { height: number }) => (
              <BridgeableTokensList
                height={height}
                currencies={filteredTokens}
                onCurrencySelect={handleCurrencySelect}
                selectedCurrency={selectedCurrency}
                fixedListRef={fixedList}
              />
            )}
          </AutoSizer> */}
          <BridgeableTokensList
            height={500}
            currencies={filteredTokens}
            onCurrencySelect={handleCurrencySelect}
            selectedCurrency={selectedCurrency}
            fixedListRef={fixedList}
          />
        </div>
      ) : (
        <Column style={{ padding: "20px", height: "100%" }}>
          <TYPE.main color={theme?.text3} textAlign="center" mb="20px">
            No results found.
          </TYPE.main>
        </Column>
      )}
    </ContentWrapper>
  );
};

export default BridgeCurrencySearch;