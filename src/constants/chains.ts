import { ChainId } from "@bolt-dex/sdk"


export enum SupportedChainId {
    MAINNET = 1,
    POLYGON = 137,
    BSC = 56,
    BOLTCHAIN = 42069,
}

export const ChainIdToNameRecord: Record<SupportedChainId, string> = {
    [SupportedChainId.MAINNET]: 'Ethereum',
    [SupportedChainId.POLYGON]: 'Polygon',
    [SupportedChainId.BSC]: 'Binance Smart Chain',
    [SupportedChainId.BOLTCHAIN]: 'BoltChain',
}

export const ChainIdToLegacyChainIdRecord: Record<SupportedChainId, ChainId> = {
    [SupportedChainId.MAINNET]: ChainId.MAINNET,
    [SupportedChainId.POLYGON]: ChainId.POLYGON,
    [SupportedChainId.BSC]: ChainId.BNB,
    [SupportedChainId.BOLTCHAIN]: ChainId.BOLTCHAIN,
}

// helper function to check if a chain is supported
export const isSupportedChain = (chainId: number) => {
    return Object.values(SupportedChainId).includes(chainId as SupportedChainId)
}
