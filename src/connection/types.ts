// import { Web3ReactHooks } from '@web3-react/core'
// import { Connector } from '@web3-react/types'

export enum ConnectionType {
  UNISWAP_WALLET = 'UNISWAP_WALLET',
  INJECTED = 'INJECTED',
  COINBASE_WALLET = 'COINBASE_WALLET',
  WALLET_CONNECT = 'WALLET_CONNECT',
  WALLET_CONNECT_V2 = 'WALLET_CONNECT_V2',
  NETWORK = 'NETWORK',
  GNOSIS_SAFE = 'GNOSIS_SAFE'
}

export interface Connection {
  getName(): string
  connector: /* Connector */ any
  hooks: /* Web3ReactHooks */ any
  type: ConnectionType
  getIcon?(isDarkMode: boolean): string
  shouldDisplay(): boolean
  overrideActivate?: () => boolean
  isNew?: boolean
}
