import { SupportedChainId } from "../constants/chains";
import { WETH_TOKENS } from "../constants/tokens";
import { Currency, ETHER } from "./entities/currency";
import { CurrencyAmount } from "./entities/fractions/currencyAmount";
import { TokenAmount } from "./entities/fractions/tokenAmount";
import { Token } from "./entities/token";

export function wrappedCurrency(
  currency: Currency | undefined,
  chainId: SupportedChainId | undefined,
): Token | undefined {
  return chainId && currency === ETHER ? WETH_TOKENS[chainId] : currency instanceof Token ? currency : undefined;
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount | undefined,
  chainId: SupportedChainId | undefined,
): TokenAmount | undefined {
  const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, chainId) : undefined;
  return token && currencyAmount ? new TokenAmount(token, currencyAmount.raw) : undefined;
}

export function unwrappedToken(token: Token): Currency {
  if (token.equals(WETH_TOKENS[token.chainId])) return ETHER;
  return token;
}
