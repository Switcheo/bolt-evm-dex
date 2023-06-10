import { createAction } from "@reduxjs/toolkit";
import { Currency } from "@uniswap/sdk";

export enum BridgeMenu {
    NETWORK_A,
    NETWORK_B
}

export const switchNetworkSrcDest = createAction('bridge/switchNetworkSrcDest')

export const setNetworkAMenu = createAction<BridgeMenu | null>('bridge/setNetworkAMenu')
export const setNetworkBMenu = createAction<BridgeMenu | null>('bridge/setNetworkBMenu')

export const setNetworkA = createAction<string>('bridge/setNetworkA')
export const setNetworkB = createAction<string>('bridge/setNetworkB')

// Input actions
export const updateInputValue = createAction<string>('bridge/updateInputValue')
export const selectTokenCurrency = createAction<Currency>('bridge/selectTokenCurrency')

interface InputCurrency {
    name: string,
    blockchain: string,
    address: string
}

// From and to Tokens
export const setFromToken = createAction<InputCurrency>('bridge/setFromToken')
export const setToToken = createAction<InputCurrency>('bridge/setToToken')