export enum SupportedChainId {
  MAINNET = 1,
  SEPOLIA = 11155111,
  PIVOTAL_SEPOLIA = 16481,
}

export type ChainIdRecord = Record<SupportedChainId, string>

export const CHAIN_IDS: ChainIdRecord = {
  [SupportedChainId.MAINNET]: "Ethereum",
  [SupportedChainId.SEPOLIA]: "Sepolia",
  [SupportedChainId.PIVOTAL_SEPOLIA]: "Pivotal Sepolia",
};

export const BRIDGING_CHAIN_IDS: Partial<ChainIdRecord> = {
  [SupportedChainId.SEPOLIA]: "Sepolia",
  [SupportedChainId.PIVOTAL_SEPOLIA]: "Pivotal Sepolia",
};

export function recordEntries<K extends PropertyKey, T>(object: Record<K, T>) {
  return Object.entries(object) as [K, T][];
}

// helper function to check if a chain is supported
export const isSupportedChain = (chainId: number) => {
  return Object.values(SupportedChainId).includes(chainId as SupportedChainId);
};

// Function to retrieve the Bridging ChainId from the Name
export const getChainIdFromName = (name: string): SupportedChainId => {
  const entries = recordEntries(CHAIN_IDS);
  const entry = entries.find((entry) => entry[1].toLowerCase() === name.toLowerCase());
  if (entry) {
    return entry[0];
  }
  return SupportedChainId.PIVOTAL_SEPOLIA;
};

export const getChainNameFromId = (chainId: number): string => {
  return CHAIN_IDS[chainId as SupportedChainId]
};
