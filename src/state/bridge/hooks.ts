import { nanoid } from "@reduxjs/toolkit";
import { useActiveWeb3React } from "hooks";
import { BridgeTx } from "pages/Bridge";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "state";
import {
  BridgeMenu,
  fetchBridgeableTokens,
  selectTokenCurrency,
  setNetworkA,
  setNetworkAMenu,
  setNetworkB,
  setNetworkBMenu,
  switchNetworkSrcDest,
  Token,
  TokenList,
  updateInputValue,
} from "./actions";

export const useBridgeState = () => {
  return useSelector<AppState, AppState["bridge"]>((state) => state.bridge);
};

export const useBridgeActionHandlers = () => {
  const dispatch = useDispatch<AppDispatch>();

  const onUserInput = useCallback(
    (typedValue: string) => {
      dispatch(updateInputValue(typedValue));
    },
    [dispatch],
  );

  const onCurrencySelection = useCallback(
    (currency: Token) => {
      dispatch(selectTokenCurrency(currency));
    },
    [dispatch],
  );

  const onNetworkASelection = useCallback(
    (networkId: string) => {
      dispatch(setNetworkAMenu(null));
      dispatch(setNetworkA(networkId));
      dispatch(selectTokenCurrency(undefined));
    },
    [dispatch],
  );

  const onNetworkBSelection = useCallback(
    (networkId: string) => {
      dispatch(setNetworkBMenu(null));
      dispatch(setNetworkB(networkId));
      dispatch(selectTokenCurrency(undefined));
    },
    [dispatch],
  );

  return {
    onUserInput,
    onCurrencySelection,
    onNetworkASelection,
    onNetworkBSelection,
  };
};

export const useNetworkAMenuOpen = (menu: BridgeMenu) => {
  const networkAMenu = useSelector((state: AppState) => state.bridge.networkAMenu);
  return networkAMenu === menu;
};

export const useNetworkToggleAMenu = (menu: BridgeMenu) => {
  const open = useNetworkAMenuOpen(menu);
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(() => dispatch(setNetworkAMenu(open ? null : menu)), [dispatch, menu, open]);
};

export const useNetworkBMenuOpen = (menu: BridgeMenu) => {
  const networkBMenu = useSelector((state: AppState) => state.bridge.networkBMenu);
  return networkBMenu === menu;
};

export const useNetworkToggleBMenu = (menu: BridgeMenu) => {
  const open = useNetworkBMenuOpen(menu);
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(() => dispatch(setNetworkBMenu(open ? null : menu)), [dispatch, menu, open]);
};

export const useSwitchNetworkSrcDest = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(() => {
    dispatch(switchNetworkSrcDest());
    dispatch(selectTokenCurrency(undefined));
  }, [dispatch]);
};

export const useFetchBridgeableTokens = (
  tokensUrl: string,
  bridgesUrl: string,
  wrapperUrl: string,
  fromNetworkId: string,
) => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(async () => {
    const requestId = nanoid();
    dispatch(
      fetchBridgeableTokens.pending({
        tokensUrl,
        bridgesUrl,
        wrapperUrl,
        requestId,
      }),
    );

    try {
      // Fetch both and await both
      const [tokensResponse] = await Promise.all([fetch(tokensUrl), fetch(bridgesUrl), fetch(wrapperUrl)]);

      const tokensJson: TokenList = await tokensResponse.json();

      // const bridgeableTokenChainId = BRIDGEABLE_TOKENS[fromNetworkId];

      dispatch(
        fetchBridgeableTokens.fulfilled({
          tokenList: tokensJson.tokens,
          requestId,
          tokensUrl,
          bridgesUrl,
          wrapperUrl,
        }),
      );
    } catch (error) {
      let errorMessage = "";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      dispatch(
        fetchBridgeableTokens.rejected({
          errorMessage,
          requestId,
          tokensUrl,
          bridgesUrl,
          wrapperUrl,
        }),
      );
    }
  }, [dispatch, tokensUrl, bridgesUrl, wrapperUrl]);
};

export const useGetPendingBridgeTx = () => {
  const networkA = useSelector((state: AppState) => state.bridge.networkA);
  const networkB = useSelector((state: AppState) => state.bridge.networkB);
  const inputAmount = useSelector((state: AppState) => state.bridge.typedInputValue);
  const selectedToken = useSelector((state: AppState) => state.bridge.selectedCurrency);
  const { account } = useActiveWeb3React();

  const getPendingBridgeTx = useCallback(() => {
    const pendingBridgeTx: BridgeTx = {
      srcToken: selectedToken,
      destToken: selectedToken,
      srcChain: networkA.networkId,
      destChain: networkB.networkId,
      amount: inputAmount,
      srcAddr: account ?? undefined,
      destAddr: account ?? undefined,
    };

    return pendingBridgeTx;
  }, [networkA, networkB, inputAmount, selectedToken, account]);

  return getPendingBridgeTx;
};
