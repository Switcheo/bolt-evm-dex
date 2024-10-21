import { TransactionResponse } from "@ethersproject/providers";
import { useCallback, useMemo } from "react";
import { TransactionReceipt } from "viem";
import { useAccount } from "wagmi";
import { hasProperty } from "../../../utils/validateTypes";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { addTransaction, TransactionDetails } from "./transactionsSlice";

// helper that can take a ethers library transaction response and add it to the list of transactions
export function useTransactionAdder(): (
  response: TransactionResponse | TransactionReceipt,
  customData?: {
    summary?: string;
    approval?: { tokenAddress: string; spender: string };
    claim?: { recipient: string };
  },
) => void {
  const { address, chain } = useAccount();
  const chainId = chain?.id;
  const dispatch = useAppDispatch();

  return useCallback(
    (
      response: TransactionResponse | TransactionReceipt,
      {
        summary,
        approval,
        claim,
      }: { summary?: string; claim?: { recipient: string }; approval?: { tokenAddress: string; spender: string } } = {},
    ) => {
      if (!address) return;
      if (!chainId) return;

      // if the response is a transaction receipt, we add transactionHash. If it is a transaction response, we add hash
      if (hasProperty<TransactionReceipt, "transactionHash">(response, "transactionHash")) {
        const { transactionHash } = response;

        if (!transactionHash) {
          throw Error("No transaction hash found.");
        }
        dispatch(addTransaction({ hash: transactionHash, from: address, chainId, approval, summary, claim }));
      } else {
        const { hash } = response;
        if (!hash) {
          throw Error("No transaction hash found.");
        }
        dispatch(addTransaction({ hash, from: address, chainId, approval, summary, claim }));
      }
    },
    [address, chainId, dispatch],
  );
}

// returns all the transactions for the current chain
export function useAllTransactions(): { [txHash: string]: TransactionDetails } {
  const { chain } = useAccount();
  const chainId = chain?.id;

  const state = useAppSelector((state) => state.transactions);

  return chainId ? state[chainId] ?? {} : {};
}

export function useIsTransactionPending(transactionHash?: string): boolean {
  const transactions = useAllTransactions();

  if (!transactionHash || !transactions[transactionHash]) return false;

  return !transactions[transactionHash].receipt;
}

/**
 * Returns whether a transaction happened in the last day (86400 seconds * 1000 milliseconds / second)
 * @param tx to check for recency
 */
export function isTransactionRecent(tx: TransactionDetails): boolean {
  return new Date().getTime() - tx.addedTime < 86_400_000;
}

// returns whether a token has a pending approval transaction
export function useHasPendingApproval(tokenAddress: string | undefined, spender: string | undefined): boolean {
  const allTransactions = useAllTransactions();
  return useMemo(
    () =>
      typeof tokenAddress === "string" &&
      typeof spender === "string" &&
      Object.keys(allTransactions).some((hash) => {
        const tx = allTransactions[hash];
        if (!tx) return false;
        if (tx.receipt) {
          return false;
        } else {
          const approval = tx.approval;
          if (!approval) return false;
          return approval.spender === spender && approval.tokenAddress === tokenAddress && isTransactionRecent(tx);
        }
      }),
    [allTransactions, spender, tokenAddress],
  );
}
