import { Address, parseEther } from "viem";
import { getAccount, getPublicClient, getWalletClient } from "wagmi/actions";
import { getChainInfo } from "../constants/chainInfo";
import {
  getChainNameFromId,
  SupportedChainId,
} from "../constants/chains";
import { useTransactionAdder } from "../store/modules/transactions/hooks";
import { Currency } from "../utils/entities/currency";
import { wagmiConfig } from "../config";

export enum BridgeCallbackState {
  INVALID,
  LOADING,
  VALID,
}

export interface BridgeTx {
  srcToken: Currency | undefined;
  destToken: Currency | undefined;
  srcChain: SupportedChainId;
  destChain: SupportedChainId;
  feeAmount: string;
  amount: bigint;
  srcAddr: Address;
  destAddr: Address;
}

export const getEvmGasLimit = (evmChain: SupportedChainId) => {
  switch (evmChain) {
    default:
      return 250000;
  }
};

export const useBridgeCallback = (bridgeTx: BridgeTx | undefined) => {
  const addTransaction = useTransactionAdder();

  if (!bridgeTx)
    return {
      state: BridgeCallbackState.INVALID,
      callback: null,
      error: "Missing dependencies",
    };

  const { srcToken, destToken, srcChain, destChain, amount, srcAddr, destAddr } = bridgeTx;

  if (!srcToken || !destToken || !amount || !srcChain || !destChain || !srcAddr || !destAddr) {
    return {
      state: BridgeCallbackState.INVALID,
      callback: null,
      error: "Missing dependencies",
    };
  }

  const bridgeCallback = async () => {
    const { chainId } = getAccount(wagmiConfig);
    const publicClient = getPublicClient(wagmiConfig, {
      chainId: chainId
    });
    // const chainId = await getNetwork();
    const walletClient = await getWalletClient(wagmiConfig,{ 
      chainId: chainId 
    });

    if (!walletClient) return;
    const [address] = await walletClient.getAddresses();
    const chainInfo = getChainInfo(srcChain);

    const ethAmount = parseEther(String(amount));
    
    const hash = await walletClient.sendTransaction({
      address,
      to: `0x${chainInfo.bridgeInfo.bridgeProxy.replace(/^0x/, '')}`,
      value: ethAmount,
  });

    const transactionReceipt = await publicClient?.waitForTransactionReceipt({
      hash,
      timeout: 30_000,
    });

    if (transactionReceipt) {
      addTransaction(transactionReceipt, {
        summary: `Bridge ${srcToken.symbol} (${getChainNameFromId(srcChain)}) to ${destToken.symbol} (${getChainNameFromId(destChain)})`,
      });
    }

    return hash;
  };

  return {
    state: BridgeCallbackState.VALID,
    callback: bridgeCallback,
    error: null,
  };
};
