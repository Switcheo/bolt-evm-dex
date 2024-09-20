import { Address, parseUnits } from "viem";
import { useAccount } from "wagmi";
import { BridgeTx } from "../../../hooks/useBridgeCallback";
import { Currency } from "../../../utils/entities/currency";
import { useAppSelector } from "../../hooks";

export function useBridgeState() {
  return useAppSelector((state) => state.bridge);
}

// From the current bridging Inputs, we get the bridge trade details
export function useDerivedBridgeInfo() {
  const { sourceChain, destinationChain, selectedCurrency, sourceAmount, bridgeableTokens } =
    useBridgeState();

  const { address } = useAccount();

  if (!bridgeableTokens) return;

  const parsedAmount = parseUnits(sourceAmount as `${number}`, selectedCurrency.decimals);

  const bridgeTx: BridgeTx = {
    srcToken: Currency.ETHER,
    destToken: Currency.ETHER,
    srcChain: sourceChain,
    destChain: destinationChain,
    feeAmount: "0",
    amount: parsedAmount,
    srcAddr: address ?? ("" as Address),
    destAddr: address ?? ("" as Address),
  };

  return bridgeTx;
}
