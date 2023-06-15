import { useActiveWeb3React } from "hooks";
import { useEffect } from "react";
import { useBridgeState, useFetchBridgeableTokens } from "./hooks";

export default function Updater(): null {
  const { library } = useActiveWeb3React();

  const bridgeState = useBridgeState();

  const fetchBridgeableTokens = useFetchBridgeableTokens(
    "https://api.carbon.network/carbon/coin/v1/tokens?pagination.limit=1000",
    "https://api.carbon.network/carbon/coin/v1/bridges?pagination.limt=1000",
    "https://api.carbon.network/carbon/coin/v1/wrapper_mappings",
    bridgeState.networkA.networkId ?? "ETH",
  );

  // Whenever the library changes, fetch the bridgeable tokens
  useEffect(() => {
    fetchBridgeableTokens();
  }, [fetchBridgeableTokens, library]);

  return null;
}
