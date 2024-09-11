import { Address } from "viem";
import { getNetwork, getPublicClient, getWalletClient, prepareSendTransaction } from "wagmi/actions";
import { getChainInfo } from "../constants/chainInfo";
import {
  getChainNameFromId,
  SupportedChainId,
} from "../constants/chains";
import { useTransactionAdder } from "../store/modules/transactions/hooks";
import { Currency } from "../utils/entities/currency";

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
    const publicClient = await getPublicClient();
    const chainId = await getNetwork();
    const walletClient = await getWalletClient({ chainId: chainId.chain?.id });

    if (!walletClient) return;
    const chainInfo = getChainInfo(srcChain);

    const ethAmount = BigInt(amount);

    // Prepare the config for the bridging
    const result = await prepareSendTransaction({
      to: chainInfo.bridgeInfo.bridgeProxy,
      value: ethAmount,
    });
    const hash = await walletClient.sendTransaction(result);

    const transactionReceipt = await publicClient.waitForTransactionReceipt({
      hash,
      timeout: 30_000,
    });

    addTransaction(transactionReceipt, {
      summary: `Bridge ${srcToken.symbol} (${getChainNameFromId(srcChain)}) to ${destToken.symbol} (${getChainNameFromId(destChain)})`,
    });

    return hash;
  };

  return {
    state: BridgeCallbackState.VALID,
    callback: bridgeCallback,
    error: null,
  };
};
