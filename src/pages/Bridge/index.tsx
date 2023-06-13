import React, { useCallback, useEffect, useRef } from 'react'

import styled from 'styled-components'

import { SwapPoolTabs } from 'components/NavigationTabs'
import { Wrapper } from './styleds'
import { AutoColumn } from 'components/Column'

import { useActiveWeb3React } from 'hooks'
import { ButtonError, ButtonLight } from 'components/Button'
import { useWalletModalToggle } from 'state/application/hooks'
import { TYPE } from 'theme'
import useTheme from 'hooks/useTheme'
import ChainLogo from 'components/ChainLogo'
import { ArrowWrapper } from 'components/swap/styleds'
import { ArrowRight } from 'react-feather'

import NetworkMenu from 'components/NetworkMenu'
import { useBridgeActionHandlers, useBridgeState, useSwitchNetworkSrcDest } from 'state/bridge/hooks'
import BridgeCurrencyInputPanel from 'components/BridgeCurrencyInputPanel'
import { getBridgeableTokens, getSwthBridgeTokens } from 'utils/bridge'


const BridgeBody = styled.div`
  position: relative;
  max-width: 576px;
  // margin: 0 5rem;
  width: 100%;
  background: ${({ theme }) => theme.bg1};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 30px;
  /* padding: 1rem; */
  margin-top: -50px;
  gap: 1rem;
`

const BridgeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  padding: 1rem 1rem 0 1rem;
`

const BridgeTokenContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
`

const BridgeCardContainer = styled.div<{hideInput: boolean}>`
  display: flex;
  padding: 1rem 2rem;
  border-radius: 1rem;
  flex-direction: column;
  align-items: center;
  flex: 1 1 0;
  gap: 0.5rem;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: ${({ theme }) => theme.bg1};
`

const BridgeTokenLogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
`

const BridgeArrow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0.3 1 0%;
`

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 24px;
`

export default function Bridge() {
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const theme = useTheme()

  const tokenARef = useRef<HTMLDivElement>(null)
  const tokenBRef = useRef<HTMLDivElement>(null)

  const onSwitchTokens = useSwitchNetworkSrcDest();

  // Real
  const { typedInputValue, networkA, networkB, selectedCurrency, bridgeableTokens } = useBridgeState();

  const { onUserInput, onCurrencySelection } = useBridgeActionHandlers();
  // States
  const atMaxAmountInput = false; // Temp

  // Handlers
  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(value)
    },
    [onUserInput]
  )

  const handleMaxInput = useCallback(() => {
  }, []);

  const handleInputSelect = useCallback((inputCurrency) => {
    onCurrencySelection(inputCurrency)
  }, [onCurrencySelection]);

  useEffect(() => {
    console.log(getBridgeableTokens(bridgeableTokens ?? []))
  }, [networkA, bridgeableTokens])

  return (
    <>
      <SwapPoolTabs active={'issue'} />
      <BridgeBody>
        <Wrapper id="bridge-page">
          <AutoColumn gap="md">
            <BridgeHeader>
              <ActiveText>BoltBridge</ActiveText>
            </BridgeHeader>

            <BridgeTokenContainer>
              <BridgeCardContainer hideInput={false}>
                <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                  From
                </TYPE.body>

                <BridgeTokenLogoContainer>
                  <ChainLogo chain={networkA.networkId} />
                </BridgeTokenLogoContainer>

                <NetworkMenu ref={tokenARef} selectedInput={networkA.networkId ?? ''} />

                {!account && (
                  <ButtonLight
                    onClick={toggleWalletModal}
                    style={{ marginTop: '1rem' }}
                    padding="0.5rem"
                    borderRadius="0.75rem"
                  >
                    Connect Wallet
                  </ButtonLight>
                )}
              </BridgeCardContainer>

              <BridgeArrow>
                <ArrowWrapper clickable>
                  <ArrowRight
                    size="24"
                    onClick={() => {
                      // setApprovalSubmitted(false) // reset 2 step UI for approvals
                      onSwitchTokens()
                    }}
                    color={theme.primary1}
                  />
                </ArrowWrapper>
              </BridgeArrow>

              <BridgeCardContainer hideInput={false}>
                <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                  To
                </TYPE.body>

                <BridgeTokenLogoContainer>
                  <ChainLogo chain={networkB.networkId} />
                </BridgeTokenLogoContainer>

                <NetworkMenu ref={tokenBRef} selectedOutput={networkB.networkId ?? ''} />

                {!account && (
                  <ButtonLight
                    onClick={toggleWalletModal}
                    style={{ marginTop: '1rem' }}
                    padding="0.5rem"
                    borderRadius="0.75rem"
                  >
                    Connect Wallet
                  </ButtonLight>
                )}
              </BridgeCardContainer>
            </BridgeTokenContainer>

            <BridgeCurrencyInputPanel
              label={'Transfer Amount'}
              value={typedInputValue}
              onUserInput={handleTypeInput}
              showMaxButton={!atMaxAmountInput}
              onMax={handleMaxInput}
              onCurrencySelect={handleInputSelect}
              currency={selectedCurrency}
              id={"bridge-input"}
            />

            {!account ? (
              <ButtonLight onClick={toggleWalletModal} style={{ marginTop: '1rem' }}>
                Connect Wallet
              </ButtonLight>
            ) : (
              <ButtonError style={{ marginTop: '1rem' }} onClick={() => {}} id="swap-button">
                Bridge
              </ButtonError>
            )}
          </AutoColumn>
        </Wrapper>
      </BridgeBody>
    </>
  )
}
