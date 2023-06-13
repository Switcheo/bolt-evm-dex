import { ActionCreatorWithPayload, createAction } from "@reduxjs/toolkit";

export enum BridgeMenu {
  NETWORK_A,
  NETWORK_B,
}

export const switchNetworkSrcDest = createAction("bridge/switchNetworkSrcDest");

export const setNetworkAMenu = createAction<BridgeMenu | null>(
  "bridge/setNetworkAMenu",
);
export const setNetworkBMenu = createAction<BridgeMenu | null>(
  "bridge/setNetworkBMenu",
);

export const setNetworkA = createAction<string>("bridge/setNetworkA");
export const setNetworkB = createAction<string>("bridge/setNetworkB");

// Input actions
export const updateInputValue = createAction<string>("bridge/updateInputValue");
export const selectTokenCurrency = createAction<Token>(
  "bridge/selectTokenCurrency",
);

interface InputCurrency {
  name: string;
  blockchain: string;
  address: string;
}

export interface Token {
  id: string;
  creator: string;
  denom: string;
  name: string;
  symbol: string;
  decimals: string;
  bridge_id: string;
  chain_id: string;
  token_address: string;
  bridge_address: string;
  is_active: boolean;
  is_collateral: boolean;
}

export interface TokenList {
  tokens: Token[];
  pagination: {
    next_key: string | null;
    total: string;
  };
}

export interface BridgesListResponse {
  bridges: {
    name: string;
    bridge_id: string;
    chain_id: string;
    bridge_name: string;
    chain_name: string;
    enabled: true;
    bridge_addresses: {
      [key: string]: string;
    }[];
  }[];
}

export interface BridgeableTokenActions {
  pending: ActionCreatorWithPayload<{
    tokensUrl: string;
    bridgesUrl: string;
    requestId: string;
  }>;
  fulfilled: ActionCreatorWithPayload<{
    tokensUrl: string;
    bridgesUrl: string;
    tokenList: Token[];
    requestId: string;
  }>;
  rejected: ActionCreatorWithPayload<{
    tokensUrl: string;
    bridgesUrl: string;
    errorMessage: string;
    requestId: string;
  }>;
}

export const fetchBridgeableTokens: Readonly<BridgeableTokenActions> = {
  pending: createAction("bridge/fetchBridgeableTokens/pending"),
  fulfilled: createAction("bridge/fetchBridgeableTokens/fulfilled"),
  rejected: createAction("bridge/fetchBridgeableTokens/rejected"),
};

// From and to Tokens
export const setFromToken = createAction<InputCurrency>("bridge/setFromToken");
export const setToToken = createAction<InputCurrency>("bridge/setToToken");
