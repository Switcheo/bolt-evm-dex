import { PairState } from "../../pages/PoolFinder";
import { Currency } from "../../utils/entities/currency";
import { Pair } from "../../utils/entities/pair";
import { usePairs } from "./usePairs";

export function usePair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  return usePairs([[tokenA, tokenB]])[0];
}
