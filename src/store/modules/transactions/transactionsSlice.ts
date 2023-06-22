import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SerializableTransactionReceipt {
  to: string;
  from: string;
  contractAddress: string;
  transactionIndex: number;
  blockHash: string;
  transactionHash: string;
  blockNumber: number;
  status?: number;
}

export interface TransactionDetails {
  hash: string;
  approval?: { tokenAddress: string; spender: string };
  summary?: string;
  claim?: { recipient: string };
  receipt?: SerializableTransactionReceipt;
  lastCheckedBlockNumber?: number;
  addedTime: number;
  confirmedTime?: number;
  from: string;
}

export interface TransactionState {
  [chainId: number]: {
    [txHash: string]: TransactionDetails;
  };
}

interface TransactionPayload {
  chainId: number;
  from: string;
  hash: string;
  approval?: { tokenAddress: string; spender: string };
  summary?: string;
  claim?: { recipient: string };
  blockNumber?: number;
  receipt?: SerializableTransactionReceipt;
}

export const initialState: TransactionState = {};

const now = () => new Date().getTime();

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<TransactionPayload>) => {
      const { chainId, from, hash, approval, summary, claim } = action.payload;
      if (state[chainId]?.[hash]) {
        throw Error("Attempted to add existing transaction.");
      }
      const txs = state[chainId] ?? {};
      txs[hash] = { hash, approval, summary, claim, from, addedTime: now() };
      state[chainId] = txs;
    },
    clearAllTransactions: (state, action: PayloadAction<TransactionPayload>) => {
      const { chainId } = action.payload;
      if (!state[chainId]) return;
      state[chainId] = {};
    },
    checkedTransaction: (state, { payload: { chainId, hash, blockNumber } }) => {
      const tx = state[chainId]?.[hash];
      if (!tx || !blockNumber) {
        return;
      }
      if (!tx.lastCheckedBlockNumber) {
        tx.lastCheckedBlockNumber = blockNumber;
      } else {
        tx.lastCheckedBlockNumber = Math.max(blockNumber, tx.lastCheckedBlockNumber);
      }
    },
    finalizeTransaction: (state, { payload: { hash, chainId, receipt } }) => {
      const tx = state[chainId]?.[hash];
      if (!tx) {
        return;
      }
      tx.receipt = receipt;
      tx.confirmedTime = now();
    },
  },
});

export const { addTransaction, clearAllTransactions, checkedTransaction, finalizeTransaction } =
  transactionsSlice.actions;

export default transactionsSlice.reducer;
