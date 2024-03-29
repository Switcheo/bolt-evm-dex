import { Contract } from "@ethersproject/contracts";
import { AppState } from "../..";
import { RetryableError } from "../../../utils/retry";
import { Call } from "./actions";

// chunk calls so we do not exceed the gas limit
export const CALL_CHUNK_SIZE = 500;

/**
 * Fetches a chunk of calls, enforcing a minimum block number constraint
 * @param multicallContract multicall contract to fetch against
 * @param chunk chunk of calls to make
 * @param minBlockNumber minimum block number of the result set
 */
export async function fetchChunk(
  multicallContract: Contract,
  chunk: Call[],
  minBlockNumber: number,
): Promise<{ results: string[]; blockNumber: number }> {
  console.debug("Fetching chunk", multicallContract, chunk, minBlockNumber);
  let resultsBlockNumber, returnData;
  try {
    [resultsBlockNumber, returnData] = await multicallContract.aggregate(
      chunk.map((obj) => [obj.address, obj.callData]),
    );
  } catch (error) {
    console.debug("Failed to fetch chunk inside retry", error);
    throw error;
  }
  if (resultsBlockNumber.toNumber() < minBlockNumber) {
    console.debug(`Fetched results for old block number: ${resultsBlockNumber.toString()} vs. ${minBlockNumber}`);
    throw new RetryableError("Fetched for old block number");
  }
  return { results: returnData, blockNumber: resultsBlockNumber.toNumber() };
}

/**
 * From the current all listeners state, return each call key mapped to the
 * minimum number of blocks per fetch. This is how often each key must be fetched.
 * @param allListeners the all listeners state
 * @param chainId the current chain id
 */
export function activeListeningKeys(
  allListeners: AppState["multicall"]["callListeners"],
  chainId?: number,
): { [callKey: string]: number } {
  if (!allListeners || !chainId) return {};
  const listeners = allListeners[chainId];
  if (!listeners) return {};

  return Object.keys(listeners).reduce<{ [callKey: string]: number }>((memo, callKey) => {
    const keyListeners = listeners[callKey];

    memo[callKey] = Object.keys(keyListeners)
      .filter((key) => {
        const blocksPerFetch = parseInt(key);
        if (blocksPerFetch <= 0) return false;
        return keyListeners[blocksPerFetch] > 0;
      })
      .reduce((previousMin, current) => {
        return Math.min(previousMin, parseInt(current));
      }, Infinity);
    return memo;
  }, {});
}

/**
 * Return the keys that need to be refetched
 * @param callResults current call result state
 * @param listeningKeys each call key mapped to how old the data can be in blocks
 * @param chainId the current chain id
 * @param latestBlockNumber the latest block number
 */
export function outdatedListeningKeys(
  callResults: AppState["multicall"]["callResults"],
  listeningKeys: { [callKey: string]: number },
  chainId: number | undefined,
  latestBlockNumber: number | undefined,
): string[] {
  if (!chainId || !latestBlockNumber) return [];
  const results = callResults[chainId];
  // no results at all, load everything
  if (!results) return Object.keys(listeningKeys);

  return Object.keys(listeningKeys).filter((callKey) => {
    const blocksPerFetch = listeningKeys[callKey];

    const data = callResults[chainId][callKey];
    // no data, must fetch
    if (!data) return true;

    const minDataBlockNumber = latestBlockNumber - (blocksPerFetch - 1);

    // already fetching it for a recent enough block, don't refetch it
    if (data.fetchingBlockNumber && data.fetchingBlockNumber >= minDataBlockNumber) return false;

    // if data is older than minDataBlockNumber, fetch it
    return !data.blockNumber || data.blockNumber < minDataBlockNumber;
  });
}
