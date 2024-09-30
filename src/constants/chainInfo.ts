import pivotalchainLogo from "../assets/svg/bridge-assets-list/pivotal-logo.svg";
import ethereumLogo from "../assets/svg/bridge-assets-list/ethereum-logo.svg";
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
    bridgeProxy: string;
  };
  readonly color?: string;
  readonly backgroundColor?: string;
}

const CHAIN_INFO: Record<SupportedChainId, ChainInfo> = {
  [SupportedChainId.MAINNET]: {
    explorer: "https://etherscan.io",
    infoLink: "https://ethereum.org/en/developers/docs/networks/",
    logoUrl: ethereumLogo,
    label: "Ethereum",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    color: "#0e0e10",
    backgroundColor: "#0e0e10",
    bridgeInfo: {
      bridgeProxy: "0x00",
    },
  },
  [SupportedChainId.SEPOLIA]: {
    explorer: "https://sepolia.etherscan.io",
    infoLink: "https://ethereum.org/en/developers/docs/networks/",
    logoUrl: ethereumLogo,
    label: "Ethereum",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    color: "#0e0e10",
    backgroundColor: "#0e0e10",
    bridgeInfo: {
      bridgeProxy: "0x788De2B0Dd35808a05eAFf7aAf5578B21E0dd9A7"
    },
  },
  [SupportedChainId.PIVOTAL_SEPOLIA]: {
    explorer: "https://sepolia.pivotalscan.xyz",
    infoLink: "https://pivotalprotocol.com",
    logoUrl: pivotalchainLogo,
    label: "Pivotal Sepolia",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    color: "#f0b90b",
    backgroundColor: "#f0b90b",
    bridgeInfo: {
      bridgeProxy: "0x00",
    },
  },

};

export const getChainInfo = (chainId: SupportedChainId) => {
  return CHAIN_INFO[chainId] ?? CHAIN_INFO[SupportedChainId.PIVOTAL_SEPOLIA];
};
