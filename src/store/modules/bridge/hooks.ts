import { Address, useAccount } from "wagmi";
import { BridgeTx } from "../../../hooks/useBridgeCallback";
import { deserializeBridgeableToken } from "../../../utils/bridge";
import { useAppSelector } from "../../hooks";

export function useBridgeState() {
  return useAppSelector((state) => state.bridge);
}

// From the current bridging Inputs, we get the bridge trade details
export function useDerivedBridgeInfo() {
  const { sourceChain, destinationChain, selectedCurrency, sourceAmount, bridgeableTokens, bridgeFees } = useBridgeState();

  const { address } = useAccount();

  if (!bridgeableTokens) return;

  // const sourceToken = Object.values(bridgeableTokens)
  //   .map((token) => deserializeBridgeableToken(token[sourceChain]))
  //   .find((token) => token !== undefined);

  const sourceToken = deserializeBridgeableToken(selectedCurrency);

  const destinationToken = Object.values(bridgeableTokens)
    .map((token) => deserializeBridgeableToken(token[destinationChain]))
    .find((token) => token !== undefined);

  const bridgeTx: BridgeTx = {
    srcToken: sourceToken,
    destToken: destinationToken,
    srcChain: sourceChain,
    destChain: destinationChain,
    amount: BigInt(sourceAmount),
    srcAddr: address ?? ("" as Address),
    destAddr: address ?? ("" as Address),
    feeAmount: bridgeFees ?? "0",
  };

  return bridgeTx;
}
