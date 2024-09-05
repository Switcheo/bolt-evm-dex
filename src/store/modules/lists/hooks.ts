import { Tags, TokenInfo, TokenList } from "@uniswap/token-lists";
import { useMemo } from "react";
import { Address } from "viem";
import { SupportedChainId } from "../../../constants/chains";
import { UNSUPPORTED_LIST_URLS } from "../../../constants/lists";
import DEFAULT_TOKEN_LIST from "../../../constants/tokenLists/uniswap-default.tokenlist.json";
import UNSUPPORTED_TOKEN_LIST from "../../../constants/tokenLists/uniswap-v2-unsupported.tokenlist.json";
import { Token } from "../../../utils/entities/token";
import sortByListPriority from "../../../utils/listSort";
import { useAppSelector } from "../../hooks";

type TagDetails = Tags[keyof Tags];
export interface TagInfo extends TagDetails {
  id: string;
}

/**
 * Token instances created from token info.
 */
export class WrappedTokenInfo extends Token {
  public readonly tokenInfo: TokenInfo;
  public readonly tags: TagInfo[];
  constructor(tokenInfo: TokenInfo, tags: TagInfo[]) {
    super(tokenInfo.chainId, tokenInfo.address as Address, tokenInfo.decimals, tokenInfo.symbol, tokenInfo.name);
    this.tokenInfo = tokenInfo;
    this.tags = tags;
  }
  public get logoURI(): string | undefined {
    return this.tokenInfo.logoURI;
  }
}

export type TokenAddressMap = Readonly<{
  [chainId in SupportedChainId]: Readonly<{ [tokenAddress: string]: { token: WrappedTokenInfo; list: TokenList } }>;
}>;

/**
 * An empty result, useful as a default.
 */
const EMPTY_LIST: TokenAddressMap = {
  [SupportedChainId.MAINNET]: {},
  [SupportedChainId.SEPOLIA]: {},
  [SupportedChainId.PIVOTAL_SEPOLIA]: {},
};

const listCache: WeakMap<TokenList, TokenAddressMap> | null =
  typeof WeakMap !== "undefined" ? new WeakMap<TokenList, TokenAddressMap>() : null;

export function listToTokenMap(list: TokenList): TokenAddressMap {
  const result = listCache?.get(list);
  if (result) return result;

  const map = list.tokens.reduce<TokenAddressMap>(
    (tokenMap, tokenInfo) => {
      const tags: TagInfo[] =
        tokenInfo.tags
          ?.map((tagId) => {
            if (!list.tags?.[tagId]) return undefined;
            return { ...list.tags[tagId], id: tagId };
          })
          ?.filter((x): x is TagInfo => Boolean(x)) ?? [];
      const token = new WrappedTokenInfo(tokenInfo, tags);

      // Create a copy of tokenMap
      const tokenMapCopy = { ...tokenMap };

      // Check and create chainId property if it doesn't exist
      if (!tokenMapCopy[token.chainId]) {
        tokenMapCopy[token.chainId] = {};
      }

      // Duplicate token error handling
      if (tokenMapCopy[token.chainId][token.address] !== undefined) {
        console.error(new Error(`Duplicate token! ${token.address}`));
        return tokenMapCopy;
      }

      // Add new token
      tokenMapCopy[token.chainId] = {
        ...tokenMapCopy[token.chainId],
        [token.address]: {
          token,
          list: list,
        },
      };

      return tokenMapCopy;
    },
    { ...EMPTY_LIST },
  );
  listCache?.set(list, map);
  return map;
}

export function useAllLists(): {
  readonly [url: string]: {
    readonly current: TokenList | null;
    readonly pendingUpdate: TokenList | null;
    readonly loadingRequestId: string | null;
    readonly error: string | null;
  };
} {
  return useAppSelector((state) => state.lists.byUrl);
}

function combineMaps(map1: TokenAddressMap, map2: TokenAddressMap): TokenAddressMap {
  return {
    [SupportedChainId.MAINNET]: { ...map1[SupportedChainId.MAINNET], ...map2[SupportedChainId.MAINNET] },
    [SupportedChainId.SEPOLIA]: { ...map1[SupportedChainId.SEPOLIA], ...map2[SupportedChainId.SEPOLIA] },
    [SupportedChainId.PIVOTAL_SEPOLIA]: { ...map1[SupportedChainId.PIVOTAL_SEPOLIA], ...map2[SupportedChainId.PIVOTAL_SEPOLIA] },
  };
}

// merge tokens contained within lists from urls
function useCombinedTokenMapFromUrls(urls: string[] | undefined): TokenAddressMap {
  const lists = useAllLists();
  return useMemo(() => {
    if (!urls) return EMPTY_LIST;
    return (
      urls
        .slice()
        // sort by priority so top priority goes last
        .sort(sortByListPriority)
        .reduce((allTokens, currentUrl) => {
          const current = lists[currentUrl]?.current;
          if (!current) return allTokens;
          try {
            const newTokens = Object.assign(listToTokenMap(current));
            return combineMaps(allTokens, newTokens);
          } catch (error) {
            console.error("Could not show token list due to error", error);
            return allTokens;
          }
        }, EMPTY_LIST)
    );
  }, [lists, urls]);
}

// filter out unsupported lists
export function useActiveListUrls(): string[] | undefined {
  return useAppSelector((state) => state.lists.activeListUrls)?.filter((url) => !UNSUPPORTED_LIST_URLS.includes(url));
}

export function useInactiveListUrls(): string[] {
  const lists = useAllLists();
  const allActiveListUrls = useActiveListUrls();
  return Object.keys(lists).filter((url) => !allActiveListUrls?.includes(url) && !UNSUPPORTED_LIST_URLS.includes(url));
}

// get all the tokens from active lists state, combine with local default tokens
export function useCombinedActiveList(): TokenAddressMap {
  const activeListUrls = useActiveListUrls(); // selector
  const activeTokens = useCombinedTokenMapFromUrls(activeListUrls);
  const defaultTokenMap = listToTokenMap(DEFAULT_TOKEN_LIST);
  return combineMaps(activeTokens, defaultTokenMap);
}

// all tokens from inactive lists
export function useCombinedInactiveList(): TokenAddressMap {
  const allInactiveListUrls: string[] = useInactiveListUrls();
  return useCombinedTokenMapFromUrls(allInactiveListUrls);
}

// used to hide warnings on import for default tokens
export function useDefaultTokenList(): TokenAddressMap {
  return listToTokenMap(DEFAULT_TOKEN_LIST);
}

// list of tokens not supported on interface, used to show warnings and prevent swaps and adds
export function useUnsupportedTokenList(): TokenAddressMap {
  // get hard coded unsupported tokens
  const localUnsupportedListMap = listToTokenMap(UNSUPPORTED_TOKEN_LIST);

  // get any loaded unsupported tokens
  const loadedUnsupportedListMap = useCombinedTokenMapFromUrls(UNSUPPORTED_LIST_URLS);

  // format into one token address map
  return combineMaps(localUnsupportedListMap, loadedUnsupportedListMap);
}

export function useIsListActive(url: string): boolean {
  const activeListUrls = useActiveListUrls();
  return Boolean(activeListUrls?.includes(url));
}
