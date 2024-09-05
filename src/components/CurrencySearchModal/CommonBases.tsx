import { Text } from "rebass";
import styled from "styled-components";
import { Currency, ETHER } from "../../utils/entities/currency";
import { currencyEquals } from "../../utils/entities/token";
import { AutoColumn } from "../Column";
import CurrencyLogo from "../CurrencyLogo";
import QuestionHelper from "../QuestionHelper";
import { AutoRow } from "../Row";

const BaseWrapper = styled.div<{ $disable?: boolean }>`
  border: 1px solid ${({ theme, $disable }) => ($disable ? "transparent" : theme.bg3)};
  border-radius: 10px;
  display: flex;
  padding: 6px;

  align-items: center;
  &:hover {
    cursor: ${({ $disable }) => !$disable && "pointer"};
    background-color: ${({ theme, $disable }) => !$disable && theme.bg2};
  }

  background-color: ${({ theme, $disable }) => $disable && theme.bg3};
  opacity: ${({ $disable }) => $disable && "0.4"};
`;

export default function CommonBases({
  onSelect,
  selectedCurrency,
}: {
  selectedCurrency?: Currency | null;
  onSelect: (currency: Currency) => void;
}) {
  return (
    <AutoColumn gap="md">
      <AutoRow>
        <Text fontWeight={500} fontSize={14}>
          Common bases
        </Text>
        <QuestionHelper text="These tokens are commonly paired with other tokens." />
      </AutoRow>
      <AutoRow gap="4px">
        <BaseWrapper
          onClick={() => {
            if (!selectedCurrency || !currencyEquals(selectedCurrency, ETHER)) {
              onSelect(ETHER);
            }
          }}
          $disable={selectedCurrency === ETHER}
        >
          <CurrencyLogo currency={ETHER} style={{ marginRight: 8 }} />
          <Text fontWeight={500} fontSize={16}>
            ETH
          </Text>
        </BaseWrapper>
      </AutoRow>
    </AutoColumn>
  );
}
