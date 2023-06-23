import { bech32 } from "bech32";
import { Address, bytesToHex, parseEther, stringToBytes } from "viem";
import { getPublicClient, getWalletClient, prepareWriteContract } from "wagmi/actions";
import { BRIDGE_ENTRANCE_ABI } from "../constants/abis";
import { MAIN_DEV_RECOVERY_ADDRESS, NATIVE_TOKEN_ADDRESS } from "../constants/addresses";
import { getChainInfo } from "../constants/chainInfo";
import { getOfficialChainIdFromBridgingChainId, SupportedBridgingChainId } from "../constants/chains";
import { BridgeableToken } from "../utils/entities/bridgeableToken";

export enum BridgeCallbackState {
  INVALID,
  LOADING,
  VALID,
}

export interface BridgeTx {
  srcToken: BridgeableToken | undefined;
  destToken: BridgeableToken | undefined;
  srcChain: SupportedBridgingChainId;
  destChain: SupportedBridgingChainId;
  feeAmount: string;
  amount: bigint;
  srcAddr: Address;
  destAddr: Address;
}

export const getEvmGasLimit = (evmChain: SupportedBridgingChainId) => {
  switch (evmChain) {
    case SupportedBridgingChainId.MAINNET:
      return 250000;
    case SupportedBridgingChainId.BSC:
      return 200000;
    default:
      return 250000;
  }
};

export const useBridgeCallback = (bridgeTx: BridgeTx | undefined) => {
  if (!bridgeTx)
    return {
      state: BridgeCallbackState.INVALID,
      callback: null,
      error: "Missing dependencies",
    };

  const { srcToken, destToken, srcChain, destChain, amount, srcAddr, destAddr, feeAmount } = bridgeTx;

  if (!srcToken || !destToken || !amount || !srcChain || !destChain || !srcAddr || !destAddr) {
    return {
      state: BridgeCallbackState.INVALID,
      callback: null,
      error: "Missing dependencies",
    };
  }

  const bridgeCallback = async () => {
    const publicClient = await getPublicClient();
    const walletClient = await getWalletClient();

    if (!walletClient) return;

    const fromAssetHash = bytesToHex(stringToBytes(srcToken.address)); // need to get denom from token
    const toAssetHash = bytesToHex(stringToBytes(destToken.address)); // need to get denom from token
    const chainInfo = getChainInfo(getOfficialChainIdFromBridgingChainId(srcChain));

    const { bridgeEntranceAddr, feeAddress } = chainInfo.bridgeInfo;
    const tokenCreator = destToken.tokenCreator;

    // targetProxyHash
    const { words: recoveryAddressWords } = bech32.decode(MAIN_DEV_RECOVERY_ADDRESS);
    const recoveryAddressBytes = new Uint8Array(bech32.fromWords(recoveryAddressWords));
    const recoveryAddressHex = bytesToHex(recoveryAddressBytes); // Need to convert

    const { words } = bech32.decode(tokenCreator);
    const addressBytes = new Uint8Array(bech32.fromWords(words));
    const targetProxyHash = bytesToHex(addressBytes); // Need to convert

    const nonce = await publicClient.getTransactionCount({ address: srcAddr });

    const ethAmount =
      srcToken.address === NATIVE_TOKEN_ADDRESS ? parseEther(amount.toString() as `${number}`) : BigInt(0);

    // convert amount to account for decimals
    const amountDecimals = BigInt(srcToken.decimals);
    const toTokenDecimals = BigInt(destToken.decimals);
    const amountWithDecimals = amount * 10n ** amountDecimals;

    // TODO: Add fee amount
    const feeAmountWithDecimals = BigInt(feeAmount) * 10n ** toTokenDecimals;

    // Prepare the config for the bridging
    const { request } = await prepareWriteContract({
      address: bridgeEntranceAddr as Address,
      abi: BRIDGE_ENTRANCE_ABI,
      args: [
        srcToken.address as Address,
        [
          targetProxyHash, // _targetProxyHash
          recoveryAddressHex, // _recoveryAddress
          fromAssetHash, // _fromAssetHash
          feeAddress as Address, // _feeAddress
          destAddr, // _toAddress the L1 address to bridge to
          toAssetHash, // _toAssetHash
        ],
        [amountWithDecimals, feeAmountWithDecimals, amountWithDecimals],
      ],
      functionName: "lock",
      value: ethAmount,
      nonce,
      gas: BigInt(getEvmGasLimit(srcChain)),
    });
    const hash = await walletClient.writeContract(request);

    return hash;
  };

  return {
    state: BridgeCallbackState.VALID,
    callback: bridgeCallback,
    error: null,
  };
};
