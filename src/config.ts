import { getDefaultConfig } from "connectkit";
import { createConfig, http } from "wagmi";
import { sepolia as baseSepolia } from "wagmi/chains";

const walletConnectProjectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

export const pivotal = {
  id: 16481,
  name: "Pivotal Sepolia",
  network: "Pivotal Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://sepolia.pivotalprotocol.com"] },
    default: { http: ["https://sepolia.pivotalprotocol.com"] },
  },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://sepolia.pivotalscan.xyz" },
  },
};

export const sepolia = {
  ...baseSepolia,
  rpcUrls: {
    ...baseSepolia.rpcUrls,
    default: { http: ["https://eth-sepolia.g.alchemy.com/v2/7y0_VO9hXrNuU0iroPAPEnhFkDX13XY2"] },
    public: { http: ["https://eth-sepolia.g.alchemy.com/v2/7y0_VO9hXrNuU0iroPAPEnhFkDX13XY2"] },
  }
}

export const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: "Pivotal Swap",
    walletConnectProjectId: walletConnectProjectId,
    transports: {
      [pivotal.id]: http("https://sepolia.pivotalprotocol.com"),
      [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/7y0_VO9hXrNuU0iroPAPEnhFkDX13XY2'),
    },
    chains: [pivotal, sepolia],
  }),
);