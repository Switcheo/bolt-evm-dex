import React, { useState } from 'react'
import { AutoColumn } from 'components/Column'
import { SwapPoolTabs } from 'components/NavigationTabs'
// import styled from 'styled-components'
import AppBody from 'pages/AppBody'
import { Wrapper } from './styleds'
import AddressInputPanel from 'components/AddressInputPanel'
import { ButtonError, ButtonPrimary } from 'components/Button'
import { isAddress } from 'ethers/lib/utils'
import { ColumnCenter } from 'components/Column'
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket'
import { useActiveWeb3React } from 'hooks'
import { TYPE } from 'theme'
import useTheme from 'hooks/useTheme'

// const PageWrapper = styled(AutoColumn)`
//   max-width: 640px;
//   width: 100%;
// `

export default function Mint() {
  const [socketUrl, setSocketUrl] = useState('wss://faucet.bolt.switcheo.network/faucet-smart/api')
  const { account } = useActiveWeb3React()
  // state for smart contract input
  const [typed, setTyped] = useState('')
  // used for UI loading states
  // const [attempting, setAttempting] = useState<boolean>(false)
  // const [hash, setHash] = useState<string | undefined>()

  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [error, setError] = useState(null)
  const theme = useTheme()

  const { sendJsonMessage, getWebSocket, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log('WebSocket connection opened.'),
    onClose: () => console.log('WebSocket connection closed.'),
    shouldReconnect: closeEvent => true,
    onMessage: (event: WebSocketEventMap['message']) => processMessages(event),
    onError: (event: WebSocketEventMap['error']) => {
      console.log('WebSocket error occurred.', event)
      setLoading(false)
    }
  })

  const processMessages = (event: { data: string }) => {
    const response = JSON.parse(event.data)

    console.log(response)
    if (response?.error) {
      setError(response.error)
      setSuccessMessage(null)
    }

    if (response?.success) {
      setError(null)
      setSuccessMessage(`10 ETH request accepted for ${typed}. Awaiting blockchain confirmation.`)
    }

    setLoading(false)
  }

  function handleRecipientType(val: string) {
    setTyped(val)
    if (error) setError(null)
  }

  const onClaim = () => {
    setLoading(true)
    sendJsonMessage({
      url: typed,
      tier: 0,
      symbol: 'NativeToken'
    })
  }

  return (
    <>
      {/* <PageWrapper> */}
      <SwapPoolTabs active={'mint'} />
      <AppBody>
        <Wrapper id="mint-page">
          <AutoColumn>
            <ColumnCenter>
              <AddressInputPanel value={typed} onChange={handleRecipientType} />
              <ButtonError
                padding="16px 16px"
                width="100%"
                mt="1rem"
                disabled={!!error || !isAddress(typed ?? '') || readyState !== 1 || loading}
                error={!!error}
                onClick={onClaim}
              >
                {error ?? 'Send Me ETH'}
              </ButtonError>
              {successMessage && (
                <TYPE.body color={theme.green1} fontWeight={500} fontSize={14} mt="0.75rem">{successMessage}</TYPE.body>
              )}
              
            </ColumnCenter>
          </AutoColumn>
        </Wrapper>
      </AppBody>
      {/* </PageWrapper> */}
    </>
  )
}
