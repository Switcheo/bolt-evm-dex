import { Address } from "viem";
import { TokenAmount } from "../../utils/entities/fractions/tokenAmount";
import { Token } from "../../utils/entities/token";
import { useTokenBalancesWithLoadingIndicator } from "./useTokenBalancesWithLoadingIndicator";

export function useTokenBalances(
  address: Address | undefined,
  tokens: (Token | undefined)[],
): { [tokenAddress: string]: TokenAmount | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0];
}
