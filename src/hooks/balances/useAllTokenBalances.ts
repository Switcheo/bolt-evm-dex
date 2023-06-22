import { useMemo } from "react";
import { useAccount } from "wagmi";
import { TokenAmount } from "../../utils/entities/fractions/tokenAmount";
import { useAllTokens } from "../Tokens";
import { useTokenBalances } from "./useTokenBalances";

export function useAllTokenBalances(): { [tokenAddress: string]: TokenAmount | undefined } {
  const { address } = useAccount();
  const allTokens = useAllTokens();
  const allTokensArray = useMemo(() => Object.values(allTokens ?? {}), [allTokens]);
  // console.log(allTokensArray)
  const balances = useTokenBalances(address ?? undefined, allTokensArray);
  return balances ?? {};
  // return {};
}
