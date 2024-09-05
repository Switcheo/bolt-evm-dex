import { Address } from "viem";
import { getNetwork, getPublicClient, getWalletClient, prepareWriteContract } from "wagmi/actions";
import { BRIDGE_PROXY_ABI } from "../constants/abis";
import { NATIVE_TOKEN_ADDRESS } from "../constants/addresses";
import { getChainInfo } from "../constants/chainInfo";
import {
  getChainNameFromId,
  SupportedChainId,
} from "../constants/chains";
import { useTransactionAdder } from "../store/modules/transactions/hooks";

export enum BridgeCallbackState {
  INVALID,
  LOADING,
  VALID,
}

export interface BridgeTx {
  srcToken: string;
  destToken: string;
  srcChain: SupportedChainId;
  destChain: SupportedChainId;
  amount: string;
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

    const nonce = await publicClient.getTransactionCount({ address: srcAddr });

    const ethAmount = srcToken === NATIVE_TOKEN_ADDRESS ? BigInt(amount) : BigInt(0);

    // Prepare the config for the bridging
    const { request } = await prepareWriteContract({
      address: chainInfo.bridgeInfo.bridgeProxy as Address,
      abi: BRIDGE_PROXY_ABI,
      args: [
        "200000",
        ""
      ],
      functionName: "bridgeETH",
      value: ethAmount,
      nonce,
      gas: BigInt(getEvmGasLimit(srcChain)),
    });
    const hash = await walletClient.writeContract(request);

    const transactionReceipt = await publicClient.waitForTransactionReceipt({
      hash,
    });

    addTransaction(transactionReceipt, {
      summary: `Bridge ${srcToken} (${getChainNameFromId(srcChain)}) to ${
        destToken
      } (${getChainNameFromId(destChain)})`,
    });

    return hash;
  };

  return {
    state: BridgeCallbackState.VALID,
    callback: bridgeCallback,
    error: null,
  };
};
