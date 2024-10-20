import { useCallback, useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { useDebounce } from "../../../hooks/useDebounce";
import useIsWindowVisible from "../../../hooks/useIsWindowVisible";
import { useAppDispatch } from "../../hooks";
import { updateBlockNumber } from "./applicationSlice";

export default function Updater(): null {
  const publicClient = usePublicClient();
  const { chain } = useAccount();
  const chainId = chain?.id;
  const dispatch = useAppDispatch();

  const windowVisible = useIsWindowVisible();

  const [state, setState] = useState<{ chainId: number | undefined; blockNumber: number | null }>({
    chainId,
    blockNumber: null,
  });

  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      setState((state) => {
        if (chainId === state.chainId) {
          if (typeof state.blockNumber !== "number") return { chainId, blockNumber };
          return { chainId, blockNumber: Math.max(blockNumber, state.blockNumber) };
        }
        return state;
      });
    },
    [chainId, setState],
  );

  // attach/detach listeners
  useEffect(() => {
    if (!publicClient || !chainId || !windowVisible) return undefined;

    setState({ chainId, blockNumber: null });

    publicClient
      .getBlockNumber()
      .then((result) => blockNumberCallback(Number(result)))
      .catch((error) => {
        console.error(`Failed to get block number for chainId: ${chainId}`, error);
      });

    const unwatch = publicClient.watchBlockNumber({
      onBlockNumber: (blockNumber) => blockNumberCallback(Number(blockNumber)),
    });

    return () => {
      unwatch();
    };
  }, [dispatch, chainId, blockNumberCallback, windowVisible, publicClient]);

  const debouncedState = useDebounce(state, 100);

  useEffect(() => {
    if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible) return;
    dispatch(updateBlockNumber({ chainId: debouncedState.chainId, blockNumber: debouncedState.blockNumber }));
  }, [windowVisible, dispatch, debouncedState.blockNumber, debouncedState.chainId]);

  return null;
}
