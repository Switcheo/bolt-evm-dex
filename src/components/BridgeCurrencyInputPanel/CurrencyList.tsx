import { LightGreyCard } from "components/Card";
import useTheme from "hooks/useTheme";
import _ from "lodash";
import React, {
  CSSProperties,
  MutableRefObject,
  useCallback,
  useMemo,
} from "react";
import { FixedSizeList } from "react-window";
import { Text } from "rebass";
import { Token } from "state/bridge/actions";
import styled from "styled-components";
// import { useActiveWeb3React } from '../../hooks'

import { TYPE } from "../../theme";
import Column from "../Column";
import { RowBetween, RowFixed } from "../Row";
import { MenuItem } from "./styleds";

// const StyledBalanceText = styled(Text)`
//   white-space: nowrap;
//   overflow: hidden;
//   max-width: 5rem;
//   text-overflow: ellipsis;
// `

// const Tag = styled.div`
//   background-color: ${({ theme }) => theme.bg3};
//   color: ${({ theme }) => theme.text2};
//   font-size: 14px;
//   border-radius: 4px;
//   padding: 0.25rem 0.3rem 0.25rem 0.3rem;
//   max-width: 6rem;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   white-space: nowrap;
//   justify-self: flex-end;
//   margin-right: 4px;
// `

const FixedContentRow = styled.div`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-gap: 16px;
  align-items: center;
`;

// function Balance({ balance }: { balance: CurrencyAmount }) {
//   return <StyledBalanceText title={balance.toExact()}>{balance.toSignificant(4)}</StyledBalanceText>
// }

// const TagContainer = styled.div`
//   display: flex;
//   justify-content: flex-end;
// `

// function TokenTags({ currency }: { currency: Token }) {
//   if (!(currency instanceof WrappedTokenInfo)) {
//     return <span />
//   }

//   const tags = currency.tags
//   if (!tags || tags.length === 0) return <span />

//   const tag = tags[0]

//   return (
//     <TagContainer>
//       <MouseoverTooltip text={tag.description}>
//         <Tag key={tag.id}>{tag.name}</Tag>
//       </MouseoverTooltip>
//       {tags.length > 1 ? (
//         <MouseoverTooltip
//           text={tags
//             .slice(1)
//             .map(({ name, description }) => `${name}: ${description}`)
//             .join('; \n')}
//         >
//           <Tag>...</Tag>
//         </MouseoverTooltip>
//       ) : null}
//     </TagContainer>
//   )
// }

function CurrencyRow({
  currency,
  onSelect,
  isSelected,
  style,
}: {
  currency: Token;
  onSelect: () => void;
  isSelected: boolean;
  style?: CSSProperties;
}) {
  // const { account } = useActiveWeb3React()
  // const selectedTokenList = useCombinedActiveList()
  // const isOnSelectedList = isTokenOnList(selectedTokenList, currency)
  // const balance = useCurrencyBalance(account ?? undefined, currency)

  // only show add or remove buttons if not on selected list
  return (
    <MenuItem
      style={style}
      className={`token-item-${currency.id}`}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
    >
      {/* <CurrencyLogo currency={currency} size={'24px'} /> */}
      <Column>
        <Text title={currency.symbol} fontWeight={500}>
          {currency.symbol}
        </Text>
        <TYPE.darkGray ml="0px" fontSize={"12px"} fontWeight={300}>
          {currency.name}
        </TYPE.darkGray>
      </Column>
      {/* <TokenTags currency={currency} /> */}
      <RowFixed style={{ justifySelf: "flex-end" }}>
        {/* {balance ? <Balance balance={balance} /> : account ? <Loader /> : null} */}
      </RowFixed>
    </MenuItem>
  );
}

export default function CurrencyList({
  height,
  currencies,
  selectedCurrency,
  onCurrencySelect,
  fixedListRef,
}: {
  height: number;
  currencies: Token[];
  selectedCurrency?: Token | null;
  onCurrencySelect: (currency: Token) => void;
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>;
}) {
  const itemData: (Token | undefined)[] = useMemo(() => {
    return currencies;
  }, [currencies]);

  const theme = useTheme();

  const Row = useCallback(
    ({ data, index, style }) => {
      const currency: Token = data[index];
      const isSelected = Boolean(
        selectedCurrency && _.isEqual(selectedCurrency, currency),
      );
      const handleSelect = () => onCurrencySelect(currency);

      if (!data) {
        return (
          <FixedContentRow style={style}>
            <LightGreyCard padding="8px 12px" borderRadius="8px">
              <RowBetween>
                <RowFixed>
                  <TYPE.main ml="6px" fontSize="12px" color={theme.text1}>
                    Loading tokens...
                  </TYPE.main>
                </RowFixed>
              </RowBetween>
            </LightGreyCard>
          </FixedContentRow>
        );
      }
      return (
        <CurrencyRow
          style={style}
          currency={currency}
          isSelected={isSelected}
          onSelect={handleSelect}
        />
      );
    },
    [onCurrencySelect, selectedCurrency, theme.text1],
  );

  // const itemKey = useCallback((index: number, data: any) => data[index], [])

  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={itemData}
      itemCount={itemData.length}
      itemSize={56}
      // itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  );
}
