import { useEffect, useMemo, useRef } from "react";
import { useAccount } from "wagmi";
import { useMulticallContract } from "../../../hooks/useContract";
import { useDebounce } from "../../../hooks/useDebounce";
import chunkArray from "../../../utils/chunkArray";
import { CancelledError, retry } from "../../../utils/retry";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useBlockNumber } from "../application/hooks";
import {
  errorFetchingMulticallResults,
  fetchingMulticallResults,
  parseCallKey,
  updateMulticallResults,
} from "./actions";
import { activeListeningKeys, CALL_CHUNK_SIZE, fetchChunk, outdatedListeningKeys } from "./utils";

export default function Updater(): null {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.multicall);
  // wait for listeners to settle before triggering updates
  const debouncedListeners = useDebounce(state.callListeners, 100);
  const latestBlockNumber = useBlockNumber();
  const { chain } = useAccount();
  const chainId = chain?.id;
  const multicallContract = useMulticallContract();
  const cancellations = useRef<{ blockNumber: number; cancellations: (() => void)[] }>();

  const listeningKeys: { [callKey: string]: number } = useMemo(() => {
    return activeListeningKeys(debouncedListeners, chainId);
  }, [debouncedListeners, chainId]);

  const unserializedOutdatedCallKeys = useMemo(() => {
    return outdatedListeningKeys(state.callResults, listeningKeys, chainId, latestBlockNumber);
  }, [chainId, state.callResults, listeningKeys, latestBlockNumber]);

  const serializedOutdatedCallKeys = useMemo(
    () => JSON.stringify(unserializedOutdatedCallKeys.sort()),
    [unserializedOutdatedCallKeys],
  );

  useEffect(() => {
    if (!latestBlockNumber || !chainId || !multicallContract) return;

    const outdatedCallKeys: string[] = JSON.parse(serializedOutdatedCallKeys);
    if (outdatedCallKeys.length === 0) return;
    const calls = outdatedCallKeys.map((key) => parseCallKey(key));

    const chunkedCalls = chunkArray(calls, CALL_CHUNK_SIZE);

    if (cancellations.current?.blockNumber !== latestBlockNumber) {
      cancellations.current?.cancellations?.forEach((c) => c());
    }

    dispatch(
      fetchingMulticallResults({
        calls,
        chainId,
        fetchingBlockNumber: latestBlockNumber,
      }),
    );

    cancellations.current = {
      blockNumber: latestBlockNumber,
      cancellations: chunkedCalls.map((chunk, index) => {
        const { cancel, promise } = retry(() => fetchChunk(multicallContract, chunk, latestBlockNumber), {
          n: Infinity,
          minWait: 2500,
          maxWait: 3500,
        });
        promise
          .then(({ results: returnData, blockNumber: fetchBlockNumber }) => {
            cancellations.current = { cancellations: [], blockNumber: latestBlockNumber };

            // accumulates the length of all previous indices
            const firstCallKeyIndex = chunkedCalls
              .slice(0, index)
              .reduce<number>((memo, curr) => memo + curr.length, 0);
            const lastCallKeyIndex = firstCallKeyIndex + returnData.length;

            dispatch(
              updateMulticallResults({
                chainId,
                results: outdatedCallKeys
                  .slice(firstCallKeyIndex, lastCallKeyIndex)
                  .reduce<{ [callKey: string]: string | null }>((memo, callKey, i) => {
                    memo[callKey] = returnData[i] ?? null;
                    return memo;
                  }, {}),
                blockNumber: fetchBlockNumber,
              }),
            );
          })
          .catch((error: Error) => {
            if (error instanceof CancelledError) {
              console.debug("Cancelled fetch for blockNumber", latestBlockNumber);
              return;
            }
            console.error("Failed to fetch multicall chunk", chunk, chainId, error);
            dispatch(
              errorFetchingMulticallResults({
                calls: chunk,
                chainId,
                fetchingBlockNumber: latestBlockNumber,
              }),
            );
          });
        return cancel;
      }),
    };
  }, [chainId, multicallContract, dispatch, serializedOutdatedCallKeys, latestBlockNumber]);

  return null;
}
