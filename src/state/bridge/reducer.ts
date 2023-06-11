import { createReducer } from '@reduxjs/toolkit'
import {
  BridgeMenu,
  selectTokenCurrency,
  setNetworkA,
  setNetworkAMenu,
  setNetworkB,
  setNetworkBMenu,
  switchNetworkSrcDest,
  updateInputValue
} from './actions'
import { Currency } from '@bolt-dex/sdk'

export interface BridgeState {
  readonly networkAMenu: BridgeMenu | null
  readonly networkBMenu: BridgeMenu | null
  readonly networkA: {
    readonly networkId: string | undefined
  }
  readonly networkB: {
    readonly networkId: string | undefined
  }
  readonly typedInputValue: string
  readonly selectedCurrency: Currency | undefined
}

const initialState: BridgeState = {
  networkAMenu: null,
  networkBMenu: null,
  networkA: {
    networkId: 'ETH'
  },
  networkB: {
    networkId: 'BNB'
  },
  typedInputValue: '',
  selectedCurrency: undefined
}

export default createReducer(initialState, builder =>
  builder
    .addCase(setNetworkAMenu, (state, action) => {
      state.networkAMenu = action.payload
    })
    .addCase(setNetworkBMenu, (state, action) => {
      state.networkBMenu = action.payload
    })
    .addCase(switchNetworkSrcDest, state => {
      const tokenA = state.networkA
      state.networkA = state.networkB
      state.networkB = tokenA
    })
    .addCase(updateInputValue, (state, action) => {
      state.typedInputValue = action.payload
    })
    .addCase(selectTokenCurrency, (state, action) => {
      state.selectedCurrency = action.payload
    })
    .addCase(setNetworkA, (state, action) => {
      state.networkA.networkId = action.payload
    })
    .addCase(setNetworkB, (state, action) => {
      state.networkB.networkId = action.payload
    })
)
