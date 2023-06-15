import { BALANCE_READER_ADDRESSES, BRIDGE_ENTRANCE_ADDRESSES, LOCK_PROXY_ADDRESSES } from "./addresses";
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
  readonly bridgeInfo: {
    readonly lockProxyAddr: string;
    readonly bridgeEntranceAddr: string;
    readonly balanceReader: string;
    readonly feeAddress: string;
  };
  readonly color?: string;
  readonly backgroundColor?: string;
}

const CHAIN_INFO: Record<SupportedChainId, ChainInfo> = {
  [SupportedChainId.MAINNET]: {
    explorer: "https://etherscan.io",
    infoLink: "https://ethereum.org/en/developers/docs/networks/",
    logoUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    label: "Ethereum",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    color: "#0e0e10",
    backgroundColor: "#0e0e10",
    bridgeInfo: {
      bridgeEntranceAddr: BRIDGE_ENTRANCE_ADDRESSES[SupportedChainId.MAINNET],
      lockProxyAddr: LOCK_PROXY_ADDRESSES[SupportedChainId.MAINNET],
      balanceReader: BALANCE_READER_ADDRESSES[SupportedChainId.MAINNET],
      feeAddress: "0x08d8f59e475830d9a1bb97d74285c4d34c6dac08", // swth1prv0t8j8tqcdngdmjlt59pwy6dxxmtqgycy2h7
    },
  },
  [SupportedChainId.BOLTCHAIN]: {
    explorer: "https://blockscout.bolt.switcheo.network",
    infoLink: "https://www.bolt.global",
    logoUrl: "https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png?1547034615",
    label: "Boltchain",
    nativeCurrency: {
      name: "BOLT",
      symbol: "BOLT",
      decimals: 18,
    },
    color: "#f0b90b",
    backgroundColor: "#f0b90b",
    bridgeInfo: {
      // BoltChain is not supported yet
      bridgeEntranceAddr: BRIDGE_ENTRANCE_ADDRESSES[SupportedChainId.BOLTCHAIN],
      lockProxyAddr: LOCK_PROXY_ADDRESSES[SupportedChainId.BOLTCHAIN],
      balanceReader: BALANCE_READER_ADDRESSES[SupportedChainId.BOLTCHAIN],
      feeAddress: "0x08d8f59e475830d9a1bb97d74285c4d34c6dac08", // swth1prv0t8j8tqcdngdmjlt59pwy6dxxmtqgycy2h7
    },
  },
  [SupportedChainId.BSC]: {
    explorer: "https://bscscan.com",
    infoLink: "https://docs.binance.org/smart-chain/developer/rpc.html",
    logoUrl: "https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png?1547034615",
    label: "Binance Smart Chain",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    color: "#f0b90b",
    backgroundColor: "#f0b90b",
    bridgeInfo: {
      bridgeEntranceAddr: BRIDGE_ENTRANCE_ADDRESSES[SupportedChainId.BSC],
      lockProxyAddr: LOCK_PROXY_ADDRESSES[SupportedChainId.BSC],
      balanceReader: BALANCE_READER_ADDRESSES[SupportedChainId.BSC],
      feeAddress: "0x08d8f59e475830d9a1bb97d74285c4d34c6dac08", // swth1prv0t8j8tqcdngdmjlt59pwy6dxxmtqgycy2h7
    },
  },
  [SupportedChainId.POLYGON]: {
    explorer: "https://polygonscan.com",
    infoLink: "https://docs.matic.network/docs/develop/network-details/network",
    logoUrl: "https://assets.coingecko.com/coins/images/4713/small/matic___polygon.jpg?1612939050",
    label: "Polygon",
    nativeCurrency: {
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
    },
    color: "#8247e5",
    backgroundColor: "#8247e5",
    bridgeInfo: {
      bridgeEntranceAddr: BRIDGE_ENTRANCE_ADDRESSES[SupportedChainId.POLYGON],
      lockProxyAddr: LOCK_PROXY_ADDRESSES[SupportedChainId.POLYGON],
      balanceReader: BALANCE_READER_ADDRESSES[SupportedChainId.POLYGON],
      feeAddress: "0x08d8f59e475830d9a1bb97d74285c4d34c6dac08", // swth1prv0t8j8tqcdngdmjlt59pwy6dxxmtqgycy2h7
    },
  },
};

export const getChainInfo = (chainId: SupportedChainId) => {
  return CHAIN_INFO[chainId] ?? CHAIN_INFO[SupportedChainId.MAINNET];
};
