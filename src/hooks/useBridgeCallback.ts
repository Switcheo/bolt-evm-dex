import { bech32 } from "bech32";
import ABIs from "constants/abis";
import { NATIVE_TOKEN_ADDRESS } from "constants/addresses";
import { getChainInfo } from "constants/chainInfo";
import {
  convertToSupportedBridgingChainId,
  getOfficialChainIdFromBridgingChainId,
  SupportedBridgingChainId,
} from "constants/chains";
import { ethers } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { useActiveWeb3React } from "hooks";
import { BridgeTx } from "pages/Bridge";

// import { getContract, toBytes, toHex } from "viem";

const mainDevRecoveryAddress = "swth1cuekk8en9zgnuv0eh4hk7xtr2kghn69x0x6u7r";
// const localTestRecoveryAddress = "tswth1cuekk8en9zgnuv0eh4hk7xtr2kghn69xt3tv8x";

enum BridgeCallbackState {
  INVALID,
  LOADING,
  VALID,
}

export const appendHexPrefix = (input: string) => {
  return input?.slice(0, 2) === "0x" ? input : `0x${input}`;
};

export function useBridgeCallback(bridgeTx: BridgeTx | undefined) {
  const { srcToken: fromToken, destToken: toToken, amount, srcAddr: fromAddress, destAddr: toAddress } = bridgeTx || {};

  const { library, chainId, account } = useActiveWeb3React();

  const recipient = toAddress;

  if (
    !library ||
    !account ||
    !chainId ||
    !fromToken ||
    !toToken ||
    !amount ||
    !fromAddress ||
    !toAddress ||
    !recipient
  ) {
    return {
      state: BridgeCallbackState.INVALID,
      callback: null,
      error: "Missing dependencies",
    };
  }

  if (!recipient) {
    if (recipient !== null) {
      return {
        state: BridgeCallbackState.INVALID,
        callback: null,
        error: "Invalid recipient",
      };
    } else {
      return {
        state: BridgeCallbackState.LOADING,
        callback: null,
        error: null,
      };
    }
  }

  return {
    state: BridgeCallbackState.VALID,
    callback: async function onBridge(): Promise<string> {
      const fromTokenId = fromToken.id;
      const fromTokenAddress = appendHexPrefix(fromToken.token_address);
      const toTokenDenom = toToken.denom;

      // const recoveryAddressHex = toHex(mainDevRecoveryAddress); // need to confirm

      const fromAssetHash = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(fromTokenId));
      const toAssetHash = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(toTokenDenom));
      const chainId = getOfficialChainIdFromBridgingChainId(
        convertToSupportedBridgingChainId(fromToken.chain_id) ?? SupportedBridgingChainId.MAINNET,
      );
      const chainInfo = getChainInfo(chainId);

      const { bridgeEntranceAddr, feeAddress } = chainInfo.bridgeInfo;
      const tokenCreator = fromToken.creator;

      // targetProxyHash
      const { words: recoveryAddressWords } = bech32.decode(mainDevRecoveryAddress);
      const recoveryAddressBytes = new Uint8Array(bech32.fromWords(recoveryAddressWords));
      const recoveryAddressHex = ethers.utils.hexlify(recoveryAddressBytes); // Need to convert

      const { words } = bech32.decode(tokenCreator);
      const addressBytes = new Uint8Array(bech32.fromWords(words));
      const targetProxyHash = ethers.utils.hexlify(addressBytes); // Need to convert

      const nonce = await library.getTransactionCount(account);

      // const contract = getContract({address: bridgeEntranceAddr, abi: ABIs.bridgeEntrance, });
      const ethAmount = fromToken.token_address === NATIVE_TOKEN_ADDRESS ? amount : BigInt(0);

      console.log(
        fromTokenAddress,
        [
          targetProxyHash, // _targetProxyHash
          recoveryAddressHex, // _recoveryAddress
          fromAssetHash, // _fromAssetHash
          feeAddress, // _feeAddress
          toAddress, // _toAddress the L1 address to bridge to
          toAssetHash, // _toAssetHash
        ],
        [parseEther(amount).toString(), parseEther("0.005"), parseEther(amount).toString()],
        {
          gasLimit: 250000,
          nonce,
          value: ethAmount,
        },
      );

      const bridgeEntranceContract = new ethers.Contract(bridgeEntranceAddr, ABIs.bridgeEntrance, library.getSigner());
      const bridgeResultTx = await bridgeEntranceContract.connect(library.getSigner()).lock(
        fromTokenAddress,
        [
          targetProxyHash, // _targetProxyHash
          recoveryAddressHex, // _recoveryAddress
          fromAssetHash, // _fromAssetHash
          feeAddress, // _feeAddress
          toAddress, // _toAddress the L1 address to bridge to
          toAssetHash, // _toAssetHash
        ],
        [parseEther(amount).toString(), parseEther("0.005"), parseEther(amount).toString()],
        {
          gasLimit: 250000,
          nonce,
          value: ethAmount,
        },
      );

      // Send Transaction
      // For now just use promise to delay to simulate transaction
      await new Promise((resolve) => setTimeout(resolve, 3000));

      return bridgeResultTx;
    },
    error: null,
  };
}
