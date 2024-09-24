import { AddressZero } from "@ethersproject/constants";
import { Contract } from "@ethersproject/contracts";
import { getPublicClient, getWalletClient, type PublicClient, type WalletClient } from "@wagmi/core";
import { providers } from "ethers";
import { isAddress, type HttpTransport } from "viem";
import { UNISWAP_V2_ROUTER_ABI } from "../constants/abis";
import { V2_ROUTER_ADDRESSES } from "../constants/addresses";
import { SupportedChainId } from "../constants/chains";
import { sepolia as baseSepolia } from "wagmi/chains";
import { getDefaultConfig } from "connectkit";
import { createConfig, http } from "wagmi";


const walletConnectProjectId = import.meta.env.WALLET_CONNECT_PROJECT_ID;
const pivotal = {
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
const sepolia = {
  ...baseSepolia,
  rpcUrls: {
    ...baseSepolia.rpcUrls,
    default: { http: ["https://eth-sepolia.g.alchemy.com/v2/7y0_VO9hXrNuU0iroPAPEnhFkDX13XY2"] },
    public: { http: ["https://eth-sepolia.g.alchemy.com/v2/7y0_VO9hXrNuU0iroPAPEnhFkDX13XY2"] },
  }
}

const config = createConfig(
  getDefaultConfig({
    appName: "Pivotal Swap",
    walletConnectProjectId,
    transports: {
      [pivotal.id]: http("https://sepolia.pivotalprotocol.com"),
      [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/7y0_VO9hXrNuU0iroPAPEnhFkDX13XY2'),
    },
    chains: [pivotal, sepolia],
  }),
);

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === "fallback")
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network),
      ),
    );
  return new providers.JsonRpcProvider(transport.url, network);
}

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

/** Action to convert a viem Public Client to an ethers.js Provider. */
export function getEthersProvider({ chainId }: { chainId?: number } = {}) {
  // const publicClient = getPublicClient({ chainId });
  const publicClient = getPublicClient(config,{
    chainId: chainId
  });
  console.log(publicClient);
  return publicClientToProvider(publicClient);
}

/** Action to convert a viem Wallet Client to an ethers.js Signer. */
export async function getEthersSigner({ chainId }: { chainId?: number } = {}) {
  const walletClient = await getWalletClient(config, { 
    chainId: chainId 
  });
  if (!walletClient) return undefined;
  return walletClientToSigner(walletClient);
}

// account is optional
export function getProviderOrSigner(walletClient: WalletClient, publicClient: PublicClient, account?: string) {
  return account ? walletClientToSigner(walletClient) : publicClientToProvider(publicClient);
}

// account is optional
export function getContract(
  contractAddress: string,
  ABI: any,
  walletClient: WalletClient,
  publicClient: PublicClient,
  account?: string,
): Contract {
  if (!isAddress(contractAddress) || contractAddress === AddressZero) {
    throw Error(`Invalid 'contractAddress' parameter '${contractAddress}'.`);
  }

  return new Contract(contractAddress, ABI, getProviderOrSigner(walletClient, publicClient, account));
}

export function getRouterContract(
  walletClient: WalletClient,
  publicClient: PublicClient,
  account?: string,
  chainId?: number,
): Contract {
  return getContract(
    V2_ROUTER_ADDRESSES[chainId ?? SupportedChainId.MAINNET],
    UNISWAP_V2_ROUTER_ABI,
    walletClient,
    publicClient,
    account,
  );
}
