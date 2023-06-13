import { Token } from '@bolt-dex/sdk'

import { SupportedChainId, ChainIdToLegacyChainIdRecord } from './chains'

export const USDC_MAINNET = new Token(
  ChainIdToLegacyChainIdRecord[SupportedChainId.MAINNET],
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  6,
  'USDC',
  'USD//C'
)

export const USDC_POLYGON = new Token(
  ChainIdToLegacyChainIdRecord[SupportedChainId.POLYGON],
  '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
  6,
  'USDC',
  'USD//C'
)
export const DAI = new Token(
  ChainIdToLegacyChainIdRecord[SupportedChainId.MAINNET],
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  18,
  'DAI',
  'Dai Stablecoin'
)

export const DAI_POLYGON = new Token(
  ChainIdToLegacyChainIdRecord[SupportedChainId.POLYGON],
  '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  18,
  'DAI',
  'Dai Stablecoin'
)
export const USDT_POLYGON = new Token(
  ChainIdToLegacyChainIdRecord[SupportedChainId.POLYGON],
  '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
  6,
  'USDT',
  'Tether USD'
)
export const WBTC_POLYGON = new Token(
  ChainIdToLegacyChainIdRecord[SupportedChainId.POLYGON],
  '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
  8,
  'WBTC',
  'Wrapped BTC'
)

export const USDT = new Token(
  ChainIdToLegacyChainIdRecord[SupportedChainId.MAINNET],
  '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  6,
  'USDT',
  'Tether USD'
)

export const WBTC = new Token(
  ChainIdToLegacyChainIdRecord[SupportedChainId.MAINNET],
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  8,
  'WBTC',
  'Wrapped BTC'
)

export const WETH_POLYGON = new Token(
  ChainIdToLegacyChainIdRecord[SupportedChainId.POLYGON],
  '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
  18,
  'WETH',
  'Wrapped Ether'
)
