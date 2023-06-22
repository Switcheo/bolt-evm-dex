import { Text } from "rebass";
import { useTheme } from "styled-components";
import { ONE_BIPS } from "../../constants/utils";
import { Field } from "../../store/modules/mint/mintSlice";
import { TYPE } from "../../theme";
import { Currency } from "../../utils/entities/currency";
import { Percent } from "../../utils/entities/fractions/percent";
import { Price } from "../../utils/entities/fractions/price";
import { AutoColumn } from "../Column";
import { AutoRow } from "../Row";

export function PoolPriceBar({
  currencies,
  noLiquidity,
  poolTokenPercentage,
  price,
}: {
  currencies: { [field in Field]?: Currency };
  noLiquidity?: boolean;
  poolTokenPercentage?: Percent;
  price?: Price;
}) {
  const theme = useTheme();
  return (
    <AutoColumn gap="md">
      <AutoRow justify="space-around" gap="4px">
        <AutoColumn justify="center">
          <TYPE.black>{price?.toSignificant(6) ?? "-"}</TYPE.black>
          <Text fontWeight={500} fontSize={14} color={theme?.text2} pt={1}>
            {currencies[Field.CURRENCY_B]?.symbol} per {currencies[Field.CURRENCY_A]?.symbol}
          </Text>
        </AutoColumn>
        <AutoColumn justify="center">
          <TYPE.black>{price?.invert()?.toSignificant(6) ?? "-"}</TYPE.black>
          <Text fontWeight={500} fontSize={14} color={theme?.text2} pt={1}>
            {currencies[Field.CURRENCY_A]?.symbol} per {currencies[Field.CURRENCY_B]?.symbol}
          </Text>
        </AutoColumn>
        <AutoColumn justify="center">
          <TYPE.black>
            {noLiquidity && price
              ? "100"
              : (poolTokenPercentage?.lessThan(ONE_BIPS) ? "<0.01" : poolTokenPercentage?.toFixed(2)) ?? "0"}
            %
          </TYPE.black>
          <Text fontWeight={500} fontSize={14} color={theme?.text2} pt={1}>
            Share of Pool
          </Text>
        </AutoColumn>
      </AutoRow>
    </AutoColumn>
  );
}
