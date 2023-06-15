import { ChainId } from "@bolt-dex/sdk";

export enum SupportedChainId {
  MAINNET = 1,
  POLYGON = 137,
  BSC = 56,
  BOLTCHAIN = 42069,
}

export enum SupportedBridgingChainId {
  MAINNET = 2,
  POLYGON = 17,
  BSC = 6,
}

export const ChainIdToNameRecord: Record<SupportedChainId, string> = {
  [SupportedChainId.MAINNET]: "Ethereum",
  [SupportedChainId.POLYGON]: "Polygon",
  [SupportedChainId.BSC]: "Binance Smart Chain",
  [SupportedChainId.BOLTCHAIN]: "BoltChain",
};

export const ChainIdToLegacyChainIdRecord: Record<SupportedChainId, ChainId> = {
  [SupportedChainId.MAINNET]: ChainId.MAINNET,
  [SupportedChainId.POLYGON]: ChainId.POLYGON,
  [SupportedChainId.BSC]: ChainId.BNB,
  [SupportedChainId.BOLTCHAIN]: ChainId.BOLTCHAIN,
};

/*
 * BridgingChainIdToOriginalChainId is a mapping of the bridging chainId to the original chainId
 * This is needed because the chainId used for bridging is different than the official ChainId
 * For example, the chainId used for bridging on Polygon is 17, but the official ChainId is 137
 * Reference: https://api.carbon.network/carbon/coin/v1/bridges?pagination.limt=1000
 */
export const BridgingChainIdToOriginalChainId: Record<SupportedBridgingChainId, SupportedChainId> = {
  [SupportedBridgingChainId.MAINNET]: SupportedChainId.MAINNET,
  [SupportedBridgingChainId.POLYGON]: SupportedChainId.POLYGON,
  [SupportedBridgingChainId.BSC]: SupportedChainId.BSC,
};

// helper function to check if a chain is supported
export const isSupportedChain = (chainId: number) => {
  return Object.values(SupportedChainId).includes(chainId as SupportedChainId);
};

// Helper function to check if a chain is supported for bridging
export const isSupportedBridgingChain = (chainId: number) => {
  return Object.values(SupportedBridgingChainId).includes(chainId as SupportedBridgingChainId);
};

// Create a function retrieve Legacy Chain
export const getLegacyChainId = (chainId: SupportedChainId): ChainId => {
  return ChainIdToLegacyChainIdRecord[chainId];
};

// Create a function retrieve Bridging Chain
export const getOfficialChainIdFromBridgingChainId = (chainId: SupportedBridgingChainId): number => {
  return BridgingChainIdToOriginalChainId[chainId];
};

export const convertToSupportedChainId = (chainId: number | string): SupportedChainId | null => {
  const chainIdNumber = typeof chainId === "string" ? parseInt(chainId, 10) : chainId;
  if (isNaN(chainIdNumber)) {
    return null; // or throw an error
  }
  if (isSupportedChain(chainIdNumber)) {
    return chainIdNumber as SupportedChainId;
  }
  // return null or throw an error if the chainId is not supported
  return null;
};

export const convertToSupportedBridgingChainId = (chainId: number | string): SupportedBridgingChainId | null => {
  const chainIdNumber = typeof chainId === "string" ? parseInt(chainId, 10) : chainId;
  if (isNaN(chainIdNumber)) {
    return null; // or throw an error
  }
  if (isSupportedBridgingChain(chainIdNumber)) {
    return chainIdNumber as SupportedBridgingChainId;
  }
  // return null or throw an error if the chainId is not supported
  return null;
};
