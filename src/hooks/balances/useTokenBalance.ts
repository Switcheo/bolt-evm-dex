import { Address } from "viem";
import { TokenAmount } from "../../utils/entities/fractions/tokenAmount";
import { Token } from "../../utils/entities/token";
import { useTokenBalances } from "./useTokenBalances";

// get the balance for a single token/account combo
export function useTokenBalance(account: Address | undefined, token: Token | undefined): TokenAmount | undefined {
  const tokenBalances = useTokenBalances(account, [token]);
  if (!token) return undefined;
  return tokenBalances[token.address];
}
