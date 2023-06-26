import JSBI from "jsbi";
import { Currency } from "./entities/currency";
import { CurrencyAmount } from "./entities/fractions/currencyAmount";

export const getMaxAmountInput = (currency?: Currency | null, balance?: CurrencyAmount): JSBI => {
  if (!currency || !balance) return JSBI.BigInt(0);
  const decimals = BigInt(currency.decimals);
  const maxAmount = balance.divide(decimals).quotient;
  return maxAmount;
};
