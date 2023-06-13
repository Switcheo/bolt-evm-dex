import { useCallback } from "react";
import { nanoid } from "@reduxjs/toolkit";
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
    },
    [dispatch],
  );

  const onNetworkBSelection = useCallback(
    (networkId: string) => {
      dispatch(setNetworkBMenu(null));
      dispatch(setNetworkB(networkId));
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
  const networkAMenu = useSelector(
    (state: AppState) => state.bridge.networkAMenu,
  );
  return networkAMenu === menu;
};

export const useNetworkToggleAMenu = (menu: BridgeMenu) => {
  const open = useNetworkAMenuOpen(menu);
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    () => dispatch(setNetworkAMenu(open ? null : menu)),
    [dispatch, menu, open],
  );
};

export const useNetworkBMenuOpen = (menu: BridgeMenu) => {
  const networkBMenu = useSelector(
    (state: AppState) => state.bridge.networkBMenu,
  );
  return networkBMenu === menu;
};

export const useNetworkToggleBMenu = (menu: BridgeMenu) => {
  const open = useNetworkBMenuOpen(menu);
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    () => dispatch(setNetworkBMenu(open ? null : menu)),
    [dispatch, menu, open],
  );
};

export const useSwitchNetworkSrcDest = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(() => {
    dispatch(switchNetworkSrcDest());
  }, [dispatch]);
};

export const useFetchBridgeableTokens = (
  tokensUrl: string,
  bridgesUrl: string,
) => {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(async () => {
    const requestId = nanoid();
    dispatch(
      fetchBridgeableTokens.pending({ tokensUrl, bridgesUrl, requestId }),
    );

    try {
      // Fetch both and await both
      const [tokensResponse] = await Promise.all([
        fetch(tokensUrl),
        fetch(bridgesUrl),
      ]);

      const tokensJson: TokenList = await tokensResponse.json();
      // const bridgesJson: BridgesListResponse = await bridgesResponse.json()

      // const filteredBridges = bridgesJson.bridges.filter(
      //   bridge =>
      //     bridge.bridge_name === 'Polynetwork' &&
      //     (bridge.chain_name === 'Binance Smart Chain' ||
      //       bridge.chain_name === 'Ethereum' ||
      //       bridge.chain_name === 'Polygon') &&
      //     bridge.enabled
      // ) // chain_id === 17, 2, 6

      // Filter to check if token is active and if the bridge id of the token is in the filteredBridges
      // const bridgeableTokens = tokensJson.tokens.filter(token =>
      //   (token.is_active && token.bridge_id === "1" && filteredBridges.some(bridge => bridge.chain_id === token.chain_id || token.chain_id === '4'))
      // )
      // const bridgeableTokens = tokensJson.tokens.filter(token =>
      //   token.is_active)

      dispatch(
        fetchBridgeableTokens.fulfilled({
          tokenList: tokensJson.tokens,
          requestId,
          tokensUrl,
          bridgesUrl,
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
        }),
      );
    }
  }, [dispatch, tokensUrl, bridgesUrl]);
};
