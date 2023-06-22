import { Contract } from "@ethersproject/contracts";
import { useMemo } from "react";
import { Address } from "viem";
import { useAccount, useNetwork, usePublicClient, useWalletClient } from "wagmi";
import {
  ENS_PUBLIC_RESOLVER_ABI,
  ENS_REGISTRAR_ABI,
  ERC20_BYTES32_ABI,
  MULTICALL_ABI,
  UNISWAP_V2_ROUTER_ABI,
} from "../constants/abis";
import ERC20ABI from "../constants/abis/erc20";
import IUniswapV2PairABI from "../constants/abis/pair";
import { MULTICALL_ADDRESSES, V2_ROUTER_ADDRESSES } from "../constants/addresses";
import { SupportedChainId } from "../constants/chains";
import { getContract } from "../utils/evm";

// returns null on errors
function useContract(contractAddress: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const publicClient = usePublicClient();
  const { data: walletClient, isError, isLoading } = useWalletClient();
  const { address } = useAccount();

  return useMemo(() => {
    if (isError || isLoading || !walletClient || !address || !ABI || !contractAddress) return null;
    try {
      return getContract(
        contractAddress,
        ABI,
        walletClient,
        publicClient,
        withSignerIfPossible && address ? address : undefined,
      );
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [isError, isLoading, walletClient, address, ABI, contractAddress, publicClient, withSignerIfPossible]);
}

export function useTokenContract(tokenAddress?: Address, withSignerIfPossible?: boolean) {
  return useContract(tokenAddress ?? ("" as Address), ERC20ABI, withSignerIfPossible);
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chain } = useNetwork();
  const chainId = chain?.id as SupportedChainId;
  let address: string | undefined;
  if (chainId) {
    switch (chainId) {
      case SupportedChainId.MAINNET:
        address = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
        break;
    }
  }
  return useContract(address, ENS_REGISTRAR_ABI, withSignerIfPossible);
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean) {
  return useContract(address as Address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible);
}

export function useMulticallContract(): Contract | null {
  const { chain } = useNetwork();
  const chainId = chain?.id as SupportedChainId;
  return useContract(chainId && MULTICALL_ADDRESSES[chainId], MULTICALL_ABI, false);
}

export function useInterfaceMulticall() {
  const { chain } = useNetwork();
  const chainId = chain?.id as SupportedChainId;
  return useContract(MULTICALL_ADDRESSES[chainId], MULTICALL_ABI, false);
}

export function useRouterContract(): Contract | null {
  const { chain } = useNetwork();
  const chainId = chain?.id as SupportedChainId;
  return useContract(chainId && V2_ROUTER_ADDRESSES[chainId], UNISWAP_V2_ROUTER_ABI, false);
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible);
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible);
}
