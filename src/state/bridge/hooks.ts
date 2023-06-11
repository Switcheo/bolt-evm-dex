import { AppDispatch, AppState } from 'state'
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
import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { Currency } from '@bolt-dex/sdk'

export const useBridgeState = () => {
  return useSelector<AppState, AppState['bridge']>(state => state.bridge)
}

export const useBridgeActionHandlers = () => {
  const dispatch = useDispatch<AppDispatch>()

  const onUserInput = useCallback(
    (typedValue: string) => {
      dispatch(updateInputValue(typedValue))
    },
    [dispatch]
  )

  const onCurrencySelection = useCallback(
    (currency: Currency) => {
      dispatch(selectTokenCurrency(currency))
    },
    [dispatch]
  )

  const onNetworkASelection = useCallback(
    (networkId: string) => {
      dispatch(setNetworkAMenu(null))
      dispatch(setNetworkA(networkId))
    },
    [dispatch]
  )

  const onNetworkBSelection = useCallback(
    (networkId: string) => {
      dispatch(setNetworkBMenu(null))
      dispatch(setNetworkB(networkId))
    },
    [dispatch]
  )

  return {
    onUserInput,
    onCurrencySelection,
    onNetworkASelection,
    onNetworkBSelection
  }
}

export const useNetworkAMenuOpen = (menu: BridgeMenu) => {
  const networkAMenu = useSelector((state: AppState) => state.bridge.networkAMenu)
  return networkAMenu === menu
}

export const useNetworkToggleAMenu = (menu: BridgeMenu) => {
  const open = useNetworkAMenuOpen(menu)
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(() => dispatch(setNetworkAMenu(open ? null : menu)), [dispatch, menu, open])
}

export const useNetworkBMenuOpen = (menu: BridgeMenu) => {
  const networkBMenu = useSelector((state: AppState) => state.bridge.networkBMenu)
  return networkBMenu === menu
}

export const useNetworkToggleBMenu = (menu: BridgeMenu) => {
  const open = useNetworkBMenuOpen(menu)
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(() => dispatch(setNetworkBMenu(open ? null : menu)), [dispatch, menu, open])
}

export const useSwitchNetworkSrcDest = () => {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(() => {
    dispatch(switchNetworkSrcDest())
  }, [dispatch])
}
