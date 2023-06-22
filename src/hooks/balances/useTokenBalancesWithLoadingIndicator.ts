import { useMemo } from "react";
import { Address } from "viem";
import { ERC20_INTERFACE } from "../../constants/abis";
import { useMultipleContractSingleData } from "../../store/modules/multicall/hooks";
import { TokenAmount } from "../../utils/entities/fractions/tokenAmount";
import { Token } from "../../utils/entities/token";

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  userAddress: Address | undefined,
  tokens: (Token | undefined)[],
): [{ [tokenAddress: string]: TokenAmount | undefined }, boolean] {
  const tokenAddresses = useMemo(() => tokens.map((vt) => vt?.address), [tokens]);

  const balances = useMultipleContractSingleData(tokenAddresses, ERC20_INTERFACE, "balanceOf", [userAddress]);

  const anyLoading: boolean = useMemo(() => balances.some((callState) => callState.loading), [balances]);

  return [
    useMemo(
      () =>
        userAddress && tokens.length > 0
          ? tokens.reduce<{ [tokenAddress: string]: TokenAmount | undefined }>((memo, token, i) => {
              if (!token) return memo;
              const value = balances?.[i]?.result?.[0];
              const amount = value ? BigInt(value.toString()) : undefined;
              if (amount) {
                memo[token.address] = new TokenAmount(token, amount);
              }
              return memo;
            }, {})
          : {},
      [userAddress, tokens, balances],
    ),
    anyLoading,
  ];
}
