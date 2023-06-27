import { useEffect, useMemo } from "react";
import { useNetwork } from "wagmi";
import { getEthersProvider } from "../../../utils/evm";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useAddPopup, useBlockNumber } from "../application/hooks";
import { checkedTransaction, finalizeTransaction } from "./transactionsSlice";
import { shouldCheck } from "./utils";

export default function Updater(): null {
  const { chain } = useNetwork();
  const chainId = chain?.id;
  const provider = getEthersProvider({ chainId });

  const lastBlockNumber = useBlockNumber();

  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.transactions);

  const transactions = useMemo(() => {
    return chainId ? state[chainId] ?? {} : {};
  }, [chainId, state]);

  // show popup on confirm
  const addPopup = useAddPopup();

  useEffect(() => {
    if (!chainId || !provider || !lastBlockNumber) return;

    Object.keys(transactions)
      .filter((hash) => shouldCheck(lastBlockNumber, transactions[hash]))
      .forEach((hash) => {
        provider
          .getTransactionReceipt(hash)
          .then((receipt) => {
            if (receipt) {
              dispatch(
                finalizeTransaction({
                  chainId,
                  hash,
                  receipt: {
                    blockHash: receipt.blockHash,
                    blockNumber: receipt.blockNumber,
                    contractAddress: receipt.contractAddress,
                    from: receipt.from,
                    status: receipt.status,
                    to: receipt.to,
                    transactionHash: receipt.transactionHash,
                    transactionIndex: receipt.transactionIndex,
                  },
                }),
              );

              addPopup(
                {
                  txn: {
                    hash,
                    success: receipt.status === 1,
                    summary: transactions[hash]?.summary,
                  },
                },
                hash,
              );
            } else {
              dispatch(checkedTransaction({ chainId, hash, blockNumber: lastBlockNumber }));
            }
          })
          .catch((error) => {
            console.error(`failed to check transaction hash: ${hash}`, error);
          });
      });
  }, [chainId, transactions, lastBlockNumber, dispatch, addPopup, provider]);

  return null;
}
