import { Address, useAccount } from "wagmi";
import { BridgeTx } from "../../../hooks/useBridgeCallback";
import { useAppSelector } from "../../hooks";
import { NATIVE_TOKEN_ADDRESS } from "../../../constants/addresses";
import { parseUnits } from "viem";

export function useBridgeState() {
  return useAppSelector((state) => state.bridge);
}

// From the current bridging Inputs, we get the bridge trade details
export function useDerivedBridgeInfo() {
  const { sourceChain, destinationChain, selectedCurrency, sourceAmount, bridgeableTokens } =
    useBridgeState();

  const { address } = useAccount();

  if (!bridgeableTokens) return;

  const parsedAmount = parseUnits(sourceAmount as `${number}`, selectedCurrency.decimals).toString();

  const bridgeTx: BridgeTx = {
    srcToken: NATIVE_TOKEN_ADDRESS, // TODO: fix me
    destToken: NATIVE_TOKEN_ADDRESS,
    srcChain: sourceChain,
    destChain: destinationChain,
    amount: parsedAmount,
    srcAddr: address ?? ("" as Address),
    destAddr: address ?? ("" as Address),
  };

  return bridgeTx;
}
