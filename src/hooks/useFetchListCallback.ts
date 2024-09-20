import { nanoid } from "@reduxjs/toolkit";
import { TokenList } from "@uniswap/token-lists";
import { useCallback } from "react";
import { useAccount } from "wagmi";
import { useAppDispatch } from "../store/hooks";
import { fetchTokenList } from "../store/modules/lists/actions";
import { getEthersProvider } from "../utils/evm";
import getTokenList from "../utils/getTokenList";
import resolveENSContentHash from "../utils/resolveENSContentHash";

export function useFetchListCallback(): (listUrl: string, sendDispatch?: boolean) => Promise<TokenList> {
  const { chain } = useAccount();
  const chainId = chain?.id;
  const provider = getEthersProvider({ chainId });

  const dispatch = useAppDispatch();

  const ensResolver = useCallback(
    (ensName: string) => {
      // if (!provider || chainId !== SupportedChainId.MAINNET) {
      //   if (1 === SupportedChainId.MAINNET) {
      //     return resolveENSContentHash(ensName, provider);
      //   }
      //   throw new Error("Could not construct mainnet ENS resolver");
      // }
      return resolveENSContentHash(ensName, provider);
    },
    [provider],
  );

  // note: prevent dispatch if using for list search or unsupported list
  return useCallback(
    async (listUrl: string, sendDispatch = true) => {
      const requestId = nanoid();
      sendDispatch && dispatch(fetchTokenList.pending({ requestId, url: listUrl }));
      return getTokenList(listUrl, ensResolver)
        .then((tokenList) => {
          sendDispatch && dispatch(fetchTokenList.fulfilled({ url: listUrl, tokenList, requestId }));
          return tokenList;
        })
        .catch((error) => {
          console.debug(`Failed to get list at url ${listUrl}`, error);
          sendDispatch && dispatch(fetchTokenList.rejected({ url: listUrl, requestId, errorMessage: error.message }));
          throw error;
        });
    },
    [dispatch, ensResolver],
  );
}
