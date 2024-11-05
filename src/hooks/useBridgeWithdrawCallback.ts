import { Address, parseEther } from "viem";
import { useTransactionAdder } from "../store/modules/transactions/hooks";
import { Currency } from "../utils/entities/currency";
import {
  getChainNameFromId,
  SupportedChainId,
} from "../constants/chains";
import { getAccount, getPublicClient, getWalletClient } from "wagmi/actions";
import { wagmiConfig } from "../config";
import { CrossChainMessenger, MessageStatus } from "@eth-optimism/sdk"; // Import CrossChainMessenger
import { ExternalProvider, Web3Provider } from "@ethersproject/providers";

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

export const useWithdrawCallback = (withdrawTx: BridgeTx | undefined) => {
  const addTransaction = useTransactionAdder();

  if (!withdrawTx) {
    return {
      state: BridgeCallbackState.INVALID,
      callback: null,
      error: "Missing dependencies",
    };
  }

  const { srcToken, destToken, srcChain, destChain, amount, srcAddr, destAddr } = withdrawTx;

  if (!srcToken || !destToken || !amount || !srcChain || !destChain || !srcAddr || !destAddr) {
    return {
      state: BridgeCallbackState.INVALID,
      callback: null,
      error: "Missing dependencies",
    };
  }

  const withdrawCallback = async () => {
    const { chainId } = getAccount(wagmiConfig);
    const publicClient = getPublicClient(wagmiConfig, { chainId });
    const walletClient = await getWalletClient(wagmiConfig, { chainId });
    const ethAmount = parseEther(amount.toString());

    if (!walletClient) return;
    // const [address] = await walletClient.getAddresses();
    // const chainInfo = getChainInfo(destChain);

    // Convert `walletClient` to an `ethers` Signer
    const provider = new Web3Provider(walletClient as unknown as ExternalProvider);
    const signer = provider.getSigner();


    // Initialize the CrossChainMessenger
    const messenger = new CrossChainMessenger({
      l1ChainId: destChain, // L1 chain ID
      l2ChainId: srcChain, // L2 chain ID 
      l1SignerOrProvider: signer, // L1 Signer for transactions
      l2SignerOrProvider: signer, // L2 Signer for transactions
    });

    // Step 1: Start the withdrawal on L2
    const withdrawal = await messenger.withdrawERC20(srcAddr, destAddr, ethAmount.toString());

    // Step 2: Wait for the withdrawal to be ready to prove
    await messenger.waitForMessageStatus(withdrawal.hash, MessageStatus.READY_TO_PROVE);

    // Step 3: Prove the withdrawal on L1
    await messenger.proveMessage(withdrawal.hash);

    // Step 4: Wait for the message status to be READY_FOR_RELAY
    await messenger.waitForMessageStatus(withdrawal.hash, MessageStatus.READY_FOR_RELAY);

    // Step 5: Finalize the withdrawal on L1
    await messenger.finalizeMessage(withdrawal.hash);

    // Step 6: Wait for the message to be relayed
    await messenger.waitForMessageStatus(withdrawal.hash, MessageStatus.RELAYED);

    // Step 7: Add transaction receipt to state
    const transactionReceipt = await publicClient?.waitForTransactionReceipt({
      hash: withdrawal.hash as `0x${string}`,
      timeout: 30_000,
    });

    if (transactionReceipt) {
      addTransaction(transactionReceipt, {
        summary: `Withdraw ${destToken.symbol} (${getChainNameFromId(destChain)}) to ${srcToken.symbol} (${getChainNameFromId(srcChain)})`,
      });
    }

    return withdrawal.hash;
  };

  return {
    state: BridgeCallbackState.VALID,
    callback: withdrawCallback,
    error: null,
  };
};