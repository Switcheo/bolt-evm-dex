import { useMemo } from "react";
import { useAccount } from "wagmi";
import { PAIR_INTERFACE } from "../../constants/abis";
import { PairState } from "../../pages/PoolFinder";
import { useMultipleContractSingleData } from "../../store/modules/multicall/hooks";
import { Currency } from "../../utils/entities/currency";
import { TokenAmount } from "../../utils/entities/fractions/tokenAmount";
import { Pair } from "../../utils/entities/pair";
import { wrappedCurrency } from "../../utils/wrappedCurrency";

export function usePairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const { chain } = useAccount();
  const chainId = chain?.id;

  const tokens = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => [
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId),
      ]),
    [chainId, currencies],
  );

  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        return tokenA && tokenB && !tokenA.equals(tokenB) ? Pair.getAddress(tokenA, tokenB) : undefined;
      }),
    [tokens],
  );

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, "getReserves");

  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result;
      const tokenA = tokens[i][0];
      const tokenB = tokens[i][1];

      if (loading) return [PairState.LOADING, null];
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null];
      if (!reserves) return [PairState.NOT_EXISTS, null];
      const { reserve0, reserve1 } = reserves;
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
      return [
        PairState.EXISTS,
        new Pair(new TokenAmount(token0, reserve0.toString()), new TokenAmount(token1, reserve1.toString())),
      ];
    });
  }, [results, tokens]);
}
