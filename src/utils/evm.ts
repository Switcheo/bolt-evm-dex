import { AddressZero } from "@ethersproject/constants";
import { Contract } from "@ethersproject/contracts";
import { getPublicClient, getWalletClient } from "@wagmi/core";
import { providers } from "ethers";
import { isAddress, type HttpTransport } from "viem";
import { UNISWAP_V2_ROUTER_ABI } from "../constants/abis";
import { V2_ROUTER_ADDRESSES } from "../constants/addresses";
import { SupportedChainId } from "../constants/chains";
import { wagmiConfig } from "../config";

export function publicClientToProvider(publicClient: ReturnType<typeof getPublicClient>) {
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

export function walletClientToSigner(walletClient: ReturnType<typeof getWalletClient>) {
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
  const publicClient = getPublicClient(wagmiConfig,{
    chainId: chainId
  });

  return publicClientToProvider(publicClient);
}

/** Action to convert a viem Wallet Client to an ethers.js Signer. */
export async function getEthersSigner({ chainId }: { chainId?: number } = {}) {
  const walletClient = await getWalletClient(wagmiConfig, { 
    chainId: chainId 
  });
  if (!walletClient) return undefined;
  return walletClientToSigner(walletClient);
}

// account is optional
export function getProviderOrSigner(walletClient: ReturnType<typeof getWalletClient>, publicClient: ReturnType<typeof getPublicClient>, account?: string) {
  return account ? walletClientToSigner(walletClient) : publicClientToProvider(publicClient);
}

// account is optional
export function getContract(
  contractAddress: string,
  ABI: any,
  walletClient: ReturnType<typeof getWalletClient>,
  publicClient: ReturnType<typeof getPublicClient>,
  account?: string,
): Contract {
  if (!isAddress(contractAddress) || contractAddress === AddressZero) {
    throw Error(`Invalid 'contractAddress' parameter '${contractAddress}'.`);
  }

  return new Contract(contractAddress, ABI, getProviderOrSigner(walletClient, publicClient, account));
}

export function getRouterContract(
  walletClient: ReturnType<typeof getWalletClient>,
  publicClient: ReturnType<typeof getPublicClient>,
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
