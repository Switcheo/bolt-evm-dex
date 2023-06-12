import { useActiveWeb3React } from 'hooks'
import { useFetchBridgeableTokens } from './hooks'
import { useEffect } from 'react'

export default function Updater(): null {
  const { library } = useActiveWeb3React()

  const fetchBridgeableTokens = useFetchBridgeableTokens(
    'https://api.carbon.network/carbon/coin/v1/tokens?pagination.limit=1000',
    'https://api.carbon.network/carbon/coin/v1/bridges?pagination.limt=1000'
  )

  // Whenever the library changes, fetch the bridgeable tokens
  useEffect(() => {
    fetchBridgeableTokens()
  }, [fetchBridgeableTokens, library])

  return null
}
