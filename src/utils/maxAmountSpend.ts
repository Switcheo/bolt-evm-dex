import JSBI from "jsbi";
import { ETHER } from "./entities/currency";
import { CurrencyAmount } from "./entities/fractions/currencyAmount";

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)); // .01 ETH

/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 */
export function maxAmountSpend(currencyAmount?: CurrencyAmount): CurrencyAmount | undefined {
  if (!currencyAmount) return undefined;
  if (currencyAmount.currency === ETHER) {
    if (JSBI.greaterThan(currencyAmount.raw, MIN_ETH)) {
      return CurrencyAmount.ether(JSBI.subtract(currencyAmount.raw, MIN_ETH));
    } else {
      return CurrencyAmount.ether(JSBI.BigInt(0));
    }
  }
  return currencyAmount;
}
