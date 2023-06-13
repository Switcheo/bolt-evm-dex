import { createReducer, PayloadAction } from "@reduxjs/toolkit";

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
  updateInputValue,
} from "./actions";

export interface BridgeState {
  readonly networkAMenu: BridgeMenu | null;
  readonly networkBMenu: BridgeMenu | null;
  readonly networkA: {
    readonly networkId: string | undefined;
  };
  readonly networkB: {
    readonly networkId: string | undefined;
  };
  readonly typedInputValue: string;
  readonly selectedCurrency: Token | undefined;
  /* TokenList */
  readonly bridgeableTokens: Token[];
  readonly error: string | null;
  readonly isLoading: boolean;
}

const initialState: BridgeState = {
  networkAMenu: null,
  networkBMenu: null,
  networkA: {
    networkId: "ETH",
  },
  networkB: {
    networkId: "BNB",
  },
  typedInputValue: "",
  selectedCurrency: undefined,
  isLoading: false,
  error: null,
  bridgeableTokens: [],
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(setNetworkAMenu, (state, action) => {
      state.networkAMenu = action.payload;
    })
    .addCase(setNetworkBMenu, (state, action) => {
      state.networkBMenu = action.payload;
    })
    .addCase(switchNetworkSrcDest, (state) => {
      const tokenA = state.networkA;
      state.networkA = state.networkB;
      state.networkB = tokenA;
    })
    .addCase(updateInputValue, (state, action) => {
      state.typedInputValue = action.payload;
    })
    .addCase(selectTokenCurrency, (state, action) => {
      state.selectedCurrency = action.payload;
    })
    .addCase(setNetworkA, (state, action) => {
      state.networkA.networkId = action.payload;
    })
    .addCase(setNetworkB, (state, action) => {
      state.networkB.networkId = action.payload;
    })
    // TokenList
    .addCase(fetchBridgeableTokens.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(
      fetchBridgeableTokens.fulfilled,
      (
        state,
        action: PayloadAction<{
          tokensUrl: string;
          bridgesUrl: string;
          tokenList: Token[];
          requestId: string;
        }>,
      ) => {
        state.isLoading = false;
        state.bridgeableTokens = action.payload.tokenList;
      },
    )
    .addCase(
      fetchBridgeableTokens.rejected,
      (
        state,
        action: PayloadAction<{
          tokensUrl: string;
          bridgesUrl: string;
          errorMessage: string;
          requestId: string;
        }>,
      ) => {
        state.isLoading = false;
        state.error = action.payload.errorMessage;
      },
    ),
);
