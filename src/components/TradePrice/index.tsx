import { Repeat } from "react-feather";
import { Text } from "rebass";
import { useTheme } from "styled-components";
import { Price } from "../../utils/entities/fractions/price";
import { StyledBalanceMaxMini } from "../ConfirmSwapModal/styleds";

interface TradePriceProps {
  price?: Price;
  showInverted: boolean;
  setShowInverted: (showInverted: boolean) => void;
}

export default function TradePrice({ price, showInverted, setShowInverted }: TradePriceProps) {
  const theme = useTheme();
  const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6);
  const show = Boolean(price?.baseCurrency && price?.quoteCurrency);

  return (
    <Text
      fontWeight={500}
      fontSize={14}
      color={theme?.text2}
      sx={{ justifyContent: "center", alignItems: "center", display: "flex" }}
    >
      {show ? (
        <>
          {formattedPrice ?? "-"}
          &nbsp;
          <Text fontSize={14} fontWeight={400} color={theme?.text2}>
            {showInverted ? price?.quoteCurrency?.symbol : price?.baseCurrency?.symbol} =
          </Text>
          <Text color={theme?.text1} fontSize={14}>
            &nbsp;1&nbsp;
            {showInverted ? price?.baseCurrency?.symbol : price?.quoteCurrency?.symbol}
          </Text>
          <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
            <Repeat size={14} />
          </StyledBalanceMaxMini>
        </>
      ) : (
        "-"
      )}
    </Text>
  );
}
