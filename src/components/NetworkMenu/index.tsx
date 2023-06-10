import React, { forwardRef } from 'react'
import styled from 'styled-components'

import { TYPE } from '../../theme'
import { ButtonDropdownLight } from '../Button'
import useTheme from 'hooks/useTheme'
import { ChainId } from '@uniswap/sdk'
import { CHAIN_INFO } from '../../constants/'
import { useBridgeActionHandlers, useNetworkAMenuOpen, useNetworkBMenuOpen, useNetworkToggleAMenu, useNetworkToggleBMenu } from 'state/bridge/hooks'
import { BridgeMenu } from 'state/bridge/actions'

const StyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
  width: 100%;
`

const MenuFlyout = styled.span`
  min-width: 8.125rem;
  background-color: ${({ theme }) => theme.bg2};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 12px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 3.25rem;
  right: 0rem;
  z-index: 500;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    top: -17.25rem;
  `};
`

const MenuItem = styled.div`
  flex: 1;
  padding: 0.5rem 0.5rem;
  color: ${({ theme }) => theme.text2};
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
  > svg {
    margin-right: 8px;
  }
`

const LOGO_SIZE = 20

const Logo = styled.img`
  height: ${LOGO_SIZE}px;
  width: ${LOGO_SIZE}px;
  margin-right: 12px;
`

const NETWORK_SELECTOR_CHAINS = [ChainId.MAINNET, 42069, 56]

interface NetworkMenuProps {
  selectedInput?: string
  selectedOutput?: string
}

const NetworkMenu = forwardRef<HTMLDivElement, NetworkMenuProps>((props, ref) => {
  const theme = useTheme()

  const open = useNetworkAMenuOpen(BridgeMenu.NETWORK_A)
  const toggle = useNetworkToggleAMenu(BridgeMenu.NETWORK_A)

  const openB = useNetworkBMenuOpen(BridgeMenu.NETWORK_B)
  const toggleB = useNetworkToggleBMenu(BridgeMenu.NETWORK_B)

  const { onNetworkASelection, onNetworkBSelection } = useBridgeActionHandlers();

  
  // useOnClickOutside(ref && ref.current ? ref : null
  //   , open ? toggle : undefined)

  const handleNetworkSelection = (chainId: string) => {
    if (props?.selectedInput) {
      console.log('input', chainId)

      onNetworkASelection(chainId)
    } else if (props?.selectedOutput) {
      console.log('selectedOutput', chainId)
      onNetworkBSelection(chainId)
    }
  }

  const getChainInfo = () => {
    return NETWORK_SELECTOR_CHAINS.map(chainId => {
      const chainInfo = CHAIN_INFO[chainId]
      return (
        <MenuItem key={chainId} style={{ display: 'flex', alignItems: 'center' }} onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleNetworkSelection(chainInfo.chain)
        }}>
          <Logo src={chainInfo.logoUrl} alt={`${chainInfo.label}-logo`} />
          {chainInfo.label}
        </MenuItem>
      )
    })
  }

  return (
    <StyledMenu ref={ref}>
      <ButtonDropdownLight
        padding="0.5rem"
        style={{ borderRadius: '0.75rem' }}
        onClick={props?.selectedInput ? toggle : toggleB}
      >
        <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
          {props?.selectedInput ?? props.selectedOutput ?? ''}
        </TYPE.body>
      </ButtonDropdownLight>
      {props?.selectedInput && open && <MenuFlyout>{getChainInfo()}</MenuFlyout>}

      {props?.selectedOutput && openB && <MenuFlyout>{getChainInfo()}</MenuFlyout>}
    </StyledMenu>
  )
})

export default NetworkMenu
