import { SupportedChainId } from "./chains";

interface ChainInfo {
  readonly explorer: string;
  readonly infoLink: string;
  readonly logoUrl: string;
  readonly label: string;
  readonly nativeCurrency: {
    name: string; // e.g. 'Goerli ETH',
    symbol: string; // e.g. 'gorETH',
    decimals: number; // e.g. 18,
  };
  readonly color?: string;
  readonly backgroundColor?: string;
}

const CHAIN_INFO: Record<SupportedChainId, ChainInfo> = {
  [SupportedChainId.MAINNET]: {
    explorer: "https://etherscan.io",
    infoLink: "https://ethereum.org/en/developers/docs/networks/",
    logoUrl:
      "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    label: "Ethereum",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    color: "#0e0e10",
    backgroundColor: "#0e0e10",
  },
  [SupportedChainId.BOLTCHAIN]: {
    explorer: "https://blockscout.bolt.switcheo.network",
    infoLink: "https://www.bolt.global",
    logoUrl:
      "https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png?1547034615",
    label: "Boltchain",
    nativeCurrency: {
      name: "BOLT",
      symbol: "BOLT",
      decimals: 18,
    },
    color: "#f0b90b",
    backgroundColor: "#f0b90b",
  },
  [SupportedChainId.BSC]: {
    explorer: "https://bscscan.com",
    infoLink: "https://docs.binance.org/smart-chain/developer/rpc.html",
    logoUrl:
      "https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png?1547034615",
    label: "Binance Smart Chain",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    color: "#f0b90b",
    backgroundColor: "#f0b90b",
  },
  [SupportedChainId.POLYGON]: {
    explorer: "https://polygonscan.com",
    infoLink: "https://docs.matic.network/docs/develop/network-details/network",
    logoUrl:
      "https://assets.coingecko.com/coins/images/4713/small/matic___polygon.jpg?1612939050",
    label: "Polygon",
    nativeCurrency: {
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
    },
    color: "#8247e5",
    backgroundColor: "#8247e5",
  },
};

export const getChainInfo = (chainId: SupportedChainId) => {
  if (chainId) {
    return CHAIN_INFO[chainId] ?? undefined;
  }
  return undefined;
};
