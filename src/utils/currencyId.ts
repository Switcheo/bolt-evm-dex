import { Currency, ETHER } from "./entities/currency";
import { Token } from "./entities/token";

/**
 * Returns the currency id for a given currency
 * @param {Currency} currency the currency for which to get the id
 * @returns {string} the currency id
 * @throws if the currency is invalid
 */
export function currencyId(currency: Currency): string {
  if (currency === ETHER) return "ETH";
  if (currency instanceof Token) return currency.address;
  throw new Error("invalid currency");
}
