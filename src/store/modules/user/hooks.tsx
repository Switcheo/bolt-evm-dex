import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { SupportedChainId } from "../../../constants/chains";
import { Pair } from "../../../utils/entities/pair";
import { Token } from "../../../utils/entities/token";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  addSerializedPair,
  addSerializedToken,
  removeSerializedToken,
  SerializedPair,
  SerializedToken,
  toggleURLWarning,
  updateUserDeadline,
  updateUserExpertMode,
  updateUserSingleHopOnly,
  updateUserSlippageTolerance,
} from "./actions";

export function serializeToken(token: Token): SerializedToken {
  return {
    chainId: token.chainId,
    address: token.address,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name,
  };
}

export function deserializeToken(serializedToken?: SerializedToken | null): Token | null {
  if (!serializedToken) return null;
  return new Token(
    serializedToken.chainId,
    serializedToken.address as Address,
    serializedToken.decimals,
    serializedToken.symbol,
    serializedToken.name,
  );
}

export function useIsExpertMode(): boolean {
  return useAppSelector((state) => state.user.userExpertMode);
}

export function useExpertModeManager(): [boolean, () => void] {
  const dispatch = useAppDispatch();
  const expertMode = useIsExpertMode();

  const toggleSetExpertMode = useCallback(() => {
    dispatch(updateUserExpertMode({ userExpertMode: !expertMode }));
  }, [expertMode, dispatch]);

  return [expertMode, toggleSetExpertMode];
}

export function useUserSingleHopOnly(): [boolean, (newSingleHopOnly: boolean) => void] {
  const dispatch = useAppDispatch();

  const singleHopOnly = useAppSelector((state) => state.user.userSingleHopOnly);

  const setSingleHopOnly = useCallback(
    (newSingleHopOnly: boolean) => {
      dispatch(updateUserSingleHopOnly({ userSingleHopOnly: newSingleHopOnly }));
    },
    [dispatch],
  );

  return [singleHopOnly, setSingleHopOnly];
}

export function useUserSlippageTolerance(): [number, (slippage: number) => void] {
  const dispatch = useAppDispatch();
  const userSlippageTolerance = useAppSelector((state) => {
    return state.user.userSlippageTolerance;
  });

  const setUserSlippageTolerance = useCallback(
    (userSlippageTolerance: number) => {
      dispatch(updateUserSlippageTolerance({ userSlippageTolerance }));
    },
    [dispatch],
  );

  return [userSlippageTolerance, setUserSlippageTolerance];
}

export function useUserTransactionTTL(): [number, (slippage: number) => void] {
  const dispatch = useAppDispatch();
  const userDeadline = useAppSelector((state) => {
    return state.user.userDeadline;
  });

  const setUserDeadline = useCallback(
    (userDeadline: number) => {
      dispatch(updateUserDeadline({ userDeadline }));
    },
    [dispatch],
  );

  return [userDeadline, setUserDeadline];
}

export function useAddUserToken(): (token: Token) => void {
  const dispatch = useAppDispatch();
  return useCallback(
    (token: Token) => {
      dispatch(addSerializedToken({ serializedToken: serializeToken(token) }));
    },
    [dispatch],
  );
}

export function useRemoveUserAddedToken(): (chainId: number, address: string) => void {
  const dispatch = useAppDispatch();
  return useCallback(
    (chainId: number, address: string) => {
      dispatch(removeSerializedToken({ chainId, address }));
    },
    [dispatch],
  );
}

export function useUserAddedTokens(): Token[] {
  const { chain } = useAccount();
  const chainId = chain?.id;
  const serializedTokensMap = useAppSelector(({ user: { tokens } }) => tokens);

  return useMemo(() => {
    if (!chainId) return [];
    return Object.values(serializedTokensMap?.[chainId as SupportedChainId] ?? {}).map(
      (serializedToken) => deserializeToken(serializedToken) as Token,
    );
  }, [serializedTokensMap, chainId]);
}

function serializePair(pair: Pair): SerializedPair {
  return {
    token0: serializeToken(pair.token0),
    token1: serializeToken(pair.token1),
  };
}

export function usePairAdder(): (pair: Pair) => void {
  const dispatch = useAppDispatch();

  return useCallback(
    (pair: Pair) => {
      dispatch(addSerializedPair({ serializedPair: serializePair(pair) }));
    },
    [dispatch],
  );
}

export function useURLWarningVisible(): boolean {
  return useAppSelector((state) => state.user.URLWarningVisible);
}

export function useURLWarningToggle(): () => void {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(toggleURLWarning()), [dispatch]);
}

/**
 * Given two tokens return the liquidity token that represents its liquidity shares
 * @param tokenA one of the two tokens
 * @param tokenB the other token
 */
export function toV2LiquidityToken([tokenA, tokenB]: [Token, Token]): Token {
  return new Token(tokenA.chainId, Pair.getAddress(tokenA, tokenB), 18, "UNI-V2", "Uniswap V2");
}

/**
 * Returns all the pairs of tokens that are tracked by the user for the current chain ID.
 */
export function useTrackedTokenPairs(): [Token, Token][] {
  const { chain } = useAccount()
  const chainId = chain?.id;

  // pairs saved by users
  const savedSerializedPairs = useAppSelector((state) => state.user.pairs);

  const userPairs: [Token, Token][] = useMemo(() => {
    if (!chainId || !savedSerializedPairs) return [];
    const forChain = savedSerializedPairs[chainId];
    if (!forChain) return [];

    return Object.keys(forChain).map((pairId) => {
      return [deserializeToken(forChain[pairId].token0), deserializeToken(forChain[pairId].token1)];
    });
  }, [savedSerializedPairs, chainId]).filter(([tokenA, tokenB]) => tokenA && tokenB) as [Token, Token][];

  const combinedList = useMemo(
    () => userPairs,
    [userPairs],
  );

  return useMemo(() => {
    // dedupes pairs of tokens in the combined list
    const keyed = combinedList.reduce<{ [key: string]: [Token, Token] }>((memo, [tokenA, tokenB]) => {
      const sorted = tokenA.sortsBefore(tokenB);
      const key = sorted ? `${tokenA.address}:${tokenB.address}` : `${tokenB.address}:${tokenA.address}`;
      if (memo[key]) return memo;
      memo[key] = sorted ? [tokenA, tokenB] : [tokenB, tokenA];
      return memo;
    }, {});

    return Object.keys(keyed).map((key) => keyed[key]);
  }, [combinedList]);
}
