import { CSSProperties, MutableRefObject, useCallback, useMemo } from "react";
import { FixedSizeList } from "react-window";
import { Text } from "rebass";
import styled, { useTheme } from "styled-components";
import { useAccount } from "wagmi";
import TokenListLogo from "../../assets/svg/tokenlist.svg";
import { useCurrencyBalance } from "../../hooks/balances/useCurrencyBalance";
import { WrappedTokenInfo } from "../../store/modules/lists/hooks";
import { TYPE } from "../../theme";
import { serializeBridgeableToken } from "../../utils/bridge";
import { BridgeableToken } from "../../utils/entities/bridgeableToken";
import { Currency, ETHER } from "../../utils/entities/currency";
import { CurrencyAmount } from "../../utils/entities/fractions/currencyAmount";
import { currencyEquals, Token } from "../../utils/entities/token";
import { LightGreyCard } from "../Card";
import Column from "../Column";
import Loader from "../Loader";
import { RowBetween, RowFixed } from "../Row";
import { MouseoverTooltip } from "../Tooltip";


function currencyKey(bridgeableToken: BridgeableToken): string {
  return bridgeableToken instanceof Token ? bridgeableToken.address : bridgeableToken === ETHER ? "ETHER" : "";
}

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`;

const Tag = styled.div`
  background-color: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text2};
  font-size: 14px;
  border-radius: 4px;
  padding: 0.25rem 0.3rem 0.25rem 0.3rem;
  max-width: 6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  justify-self: flex-end;
  margin-right: 4px;
`;

const FixedContentRow = styled.div`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-gap: 16px;
  align-items: center;
`;

export const MenuItem = styled(RowBetween)`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: minmax(auto, 1fr) minmax(0, 72px);
  grid-gap: 16px;
  cursor: ${({ disabled }) => !disabled && "pointer"};
  pointer-events: ${({ disabled }) => disabled && "none"};
  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && theme.bg2};
  }
  opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};
`;

function Balance({ balance }: { balance: CurrencyAmount }) {
  return <StyledBalanceText title={balance.toExact()}>{balance.toSignificant(4)}</StyledBalanceText>;
}

const TagContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const TokenListLogoWrapper = styled.img`
  height: 20px;
`;

function TokenTags({ currency }: { currency: Currency }) {
  if (!(currency instanceof WrappedTokenInfo)) {
    return <span />;
  }

  const tags = currency.tags;
  if (!tags || tags.length === 0) return <span />;

  const tag = tags[0];

  return (
    <TagContainer>
      <MouseoverTooltip text={tag.description}>
        <Tag key={tag.id}>{tag.name}</Tag>
      </MouseoverTooltip>
      {tags.length > 1 ? (
        <MouseoverTooltip
          text={tags
            .slice(1)
            .map(({ name, description }) => `${name}: ${description}`)
            .join("; \n")}
        >
          <Tag>...</Tag>
        </MouseoverTooltip>
      ) : null}
    </TagContainer>
  );
}

function BridgeableTokenRow({
  bridgeableToken,
  onSelect,
  isSelected,
  otherSelected,
  style,
}: {
  bridgeableToken: BridgeableToken;
  onSelect: () => void;
  isSelected: boolean;
  otherSelected: boolean;
  style: CSSProperties;
}) {
  const { address } = useAccount();
  const key = currencyKey(bridgeableToken);

  const balance = useCurrencyBalance(address ?? undefined, bridgeableToken);

  // only show add or remove buttons if not on selected list
  return (
    <MenuItem
      style={style}
      className={`token-item-${key}`}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      selected={otherSelected}
    >
      {/* <CurrencyLogo currency={currency} size={"24px"} /> */}
      <Column>
        <Text title={bridgeableToken.name} fontWeight={500}>
          {bridgeableToken.symbol}
        </Text>
        <TYPE.darkGray ml="0px" fontSize={"12px"} fontWeight={300}>
          {bridgeableToken.name}
        </TYPE.darkGray>
      </Column>
      {/* <TokenTags currency={bridgeableToken} /> */}
      <RowFixed style={{ justifySelf: "flex-end" }}>
        {balance ? <Balance balance={balance} /> : address ? <Loader /> : null}
      </RowFixed>
    </MenuItem>
  );
}

export default function BridgeableTokensList({
  height,
  currencies,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
}: {
  height: number;
  currencies: BridgeableToken[];
  selectedCurrency?: BridgeableToken | null;
  onCurrencySelect: (currency: BridgeableToken) => void;
  otherCurrency?: BridgeableToken | null;
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>;
}) {

  const theme = useTheme();

  const Row = useCallback(
    ({ data, index, style }: { data: (BridgeableToken | undefined)[]; index: number; style: CSSProperties }) => {
      const currency: BridgeableToken | undefined = data[index];
      if (!currency) return;
      const isSelected = Boolean(selectedCurrency && currencyEquals(selectedCurrency, currency));
      const otherSelected = Boolean(otherCurrency && currencyEquals(otherCurrency, currency));
      const handleSelect = () => onCurrencySelect(currency);

      if (!data) {
        return (
          <FixedContentRow style={style}>
            <LightGreyCard padding="8px 12px" borderRadius="8px">
              <RowBetween>
                <RowFixed>
                  <TokenListLogoWrapper src={TokenListLogo} />
                  <TYPE.main ml="6px" fontSize="12px" color={theme?.text1}>
                    Loading tokens...
                  </TYPE.main>
                </RowFixed>
                {/* <QuestionHelper text="Tokens from inactive lists. Import specific tokens below or click 'Manage' to activate more lists." /> */}
              </RowBetween>
            </LightGreyCard>
          </FixedContentRow>
        );
      }

      return (
        <BridgeableTokenRow
          style={style}
          bridgeableToken={currency}
          isSelected={isSelected}
          onSelect={handleSelect}
          otherSelected={otherSelected}
        />
      );
    },
    [onCurrencySelect, otherCurrency, selectedCurrency, theme?.text1],
  );

  // const itemKey = useCallback((index: number, data: any) => currencyKey(data[index]), []);

  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={currencies}
      itemCount={currencies.length}
      itemSize={56}
      // itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  );
}