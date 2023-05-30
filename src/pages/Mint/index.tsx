import React, { useState } from 'react'
import { AutoColumn } from 'components/Column'
import { SwapPoolTabs } from 'components/NavigationTabs'
import AppBody from 'pages/AppBody'
import { Wrapper } from './styleds'
import AddressInputPanel from 'components/AddressInputPanel'
import { ButtonError } from 'components/Button'
import { isAddress } from 'ethers/lib/utils'
import { ColumnCenter } from 'components/Column'
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket'
import { TYPE } from 'theme'
import useTheme from 'hooks/useTheme'

import { WSS_FAUCET_URL } from '../../constants'


export default function Mint() {
  const [typed, setTyped] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [error, setError] = useState(null)
  const theme = useTheme()

  const { sendJsonMessage, readyState } = useWebSocket(WSS_FAUCET_URL, {
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
                <TYPE.body color={theme.green1} fontWeight={500} fontSize={14} mt="0.75rem">
                  {successMessage}
                </TYPE.body>
              )}
            </ColumnCenter>
          </AutoColumn>
        </Wrapper>
      </AppBody>
    </>
  )
}
