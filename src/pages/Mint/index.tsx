import React, { useState } from 'react'
import { AutoColumn } from 'components/Column'
import { SwapPoolTabs } from 'components/NavigationTabs'
// import styled from 'styled-components'
import AppBody from 'pages/AppBody'
import { Wrapper } from './styleds'
import AddressInputPanel from 'components/AddressInputPanel'
import { ButtonPrimary } from 'components/Button'
import { isAddress } from 'ethers/lib/utils'
import { ColumnCenter } from 'components/Column'

// const PageWrapper = styled(AutoColumn)`
//   max-width: 640px;
//   width: 100%;
// `

export default function Mint() {
  // state for smart contract input
  const [typed, setTyped] = useState('')
  // used for UI loading states
  // const [attempting, setAttempting] = useState<boolean>(false)
  // const [hash, setHash] = useState<string | undefined>()

  function handleRecipientType(val: string) {
    setTyped(val)
  }

  function onClaim() {
    // setAttempting(true)
    // claimCallback()
    //   .then(hash => {
    //     setHash(hash)
    //   })
    //   // reset modal and log error
    //   .catch(error => {
    //     setAttempting(false)
    //     console.log(error)
    //   })
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
              <ButtonPrimary
                disabled={!isAddress(typed ?? '')}
                padding="16px 16px"
                width="100%"
                borderRadius="12px"
                mt="1rem"
                onClick={onClaim}
              >
                Mint Tokens
              </ButtonPrimary>
            </ColumnCenter>
          </AutoColumn>
        </Wrapper>
      </AppBody>
      {/* </PageWrapper> */}
    </>
  )
}
