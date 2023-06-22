export enum SupportedChainId {
  MAINNET = 1,
  POLYGON = 137,
  BSC = 56,
  BOLTCHAIN = 42069,
  CARBON = 9790,
}

export enum SupportedBridgingChainId {
  MAINNET = 2,
  POLYGON = 17,
  BSC = 6,
  CARBON = 4,
}

export const ChainIdToNameRecord: Record<SupportedChainId, string> = {
  [SupportedChainId.MAINNET]: "Ethereum",
  [SupportedChainId.POLYGON]: "Polygon",
  [SupportedChainId.BSC]: "Binance Smart Chain",
  [SupportedChainId.BOLTCHAIN]: "BoltChain",
  [SupportedChainId.CARBON]: "Carbon"
};

// Create Bridging ChainId To Name
export const BridgingChainIdToNameRecord: Record<SupportedBridgingChainId, string> = {
  [SupportedBridgingChainId.MAINNET]: "Ethereum",
  [SupportedBridgingChainId.POLYGON]: "Polygon",
  [SupportedBridgingChainId.BSC]: "Binance Smart Chain",
  [SupportedBridgingChainId.CARBON]: "Carbon"
};

export function recordEntries<K extends PropertyKey, T>(object: Record<K, T>) {
  return Object.entries(object) as [K, T][];
}

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
  [SupportedBridgingChainId.CARBON]: SupportedChainId.CARBON
};

// helper function to check if a chain is supported
export const isSupportedChain = (chainId: number) => {
  return Object.values(SupportedChainId).includes(chainId as SupportedChainId);
};

// Helper function to check if a chain is supported for bridging
export const isSupportedBridgingChain = (chainId: number) => {
  return Object.values(SupportedBridgingChainId).includes(chainId as SupportedBridgingChainId);
};

// Create a function retrieve Bridging Chain
export const getOfficialChainIdFromBridgingChainId = (chainId: SupportedBridgingChainId): SupportedChainId => {
  return BridgingChainIdToOriginalChainId[chainId];
};

export const getBridgingChainIdFromOfficialChainId = (chainId: SupportedChainId): SupportedBridgingChainId => {
  const entries = recordEntries(BridgingChainIdToOriginalChainId);
  const entry = entries.find((entry) => entry[1] == chainId); // TODO: A better solution for this
  if (entry) {
    const chainId = entry[0];
    return chainId;
  }
  return SupportedBridgingChainId.MAINNET;
};

// Function to retreive the name from *Bridging* ChainId
export const getChainNameFromBridgingId = (chainId: SupportedBridgingChainId): string => {
  return ChainIdToNameRecord[getOfficialChainIdFromBridgingChainId(chainId)];
};

// Function to retrieve the Bridging ChainId from the Name
export const getBridgingChainIdFromName = (name: string): SupportedBridgingChainId => {
  const entries = recordEntries(ChainIdToNameRecord);
  const entry = entries.find((entry) => entry[1] === name);
  if (entry) {
    const chainId = entry[0];
    return getBridgingChainIdFromOfficialChainId(chainId);
  }
  return SupportedBridgingChainId.MAINNET;
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
