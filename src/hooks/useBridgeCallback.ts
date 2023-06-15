import ABIs from "constants/abis";
import { NATIVE_TOKEN_ADDRESS } from "constants/addresses";
import { getChainInfo } from "constants/chainInfo";
import {
  convertToSupportedBridgingChainId,
  convertToSupportedChainId,
  getOfficialChainIdFromBridgingChainId,
  SupportedBridgingChainId,
  SupportedChainId,
} from "constants/chains";
import { BigNumber, ethers } from "ethers";
import { useActiveWeb3React } from "hooks";
import { BridgeTx } from "pages/Bridge";
import { useCallback } from "react";

// import { getContract, toBytes, toHex } from "viem";

const mainDevRecoveryAddress = "swth1cuekk8en9zgnuv0eh4hk7xtr2kghn69x0x6u7r";
const localTestRecoveryAddress = "tswth1cuekk8en9zgnuv0eh4hk7xtr2kghn69xt3tv8x";

// export const getEvmGasLimit = (evmChain: Blockchain) => {
//   switch (evmChain) {
//     case Blockchain.Ethereum:
//       return 250000;
//     case Blockchain.Arbitrum:
//       return 2000000;
//     case Blockchain.BinanceSmartChain:
//       return 200000;
//     default:
//       return 250000;
//   }
// };

enum BridgeCallbackState {
  INVALID,
  LOADING,
  VALID,
}

export const appendHexPrefix = (input: string) => {
  return input?.slice(0, 2) === "0x" ? input : `0x${input}`;
};

export function useBridgeCallback(
  bridgeTx: BridgeTx | undefined, // trade to execute, required
) {
  const { srcToken: fromToken, destToken: toToken, amount, srcAddr: fromAddress, destAddr: toAddress } = bridgeTx || {};

  const { library, chainId, account } = useActiveWeb3React();

  const recipient = toAddress;

  /*
  fromToken: Models.Token;
    toToken: Models.Token;
    amount: BigNumber;
    fromAddress: string;
    recoveryAddress: string;
    toAddress: string;
    feeAmount: BigNumber;
    gasPriceGwei: BigNumber;
    gasLimit: BigNumber;
    signer: ethers.Signer;
  */

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

      // const fromAssetHash = toHex(toBytes(fromTokenId));
      // const toAssetHash = toHex(toBytes(toTokenDenom));
      const nonce = 0; /* temp */
      const chainId = getOfficialChainIdFromBridgingChainId(
        convertToSupportedBridgingChainId(fromToken.chain_id) ?? SupportedBridgingChainId.MAINNET,
      );
      const chainInfo = getChainInfo(chainId);

      const { bridgeEntranceAddr, feeAddress } = chainInfo.bridgeInfo;
      const tokenCreator = fromToken.creator;

      const bridgeEntranceAbi = ABIs.bridgeEntrance;

      // const contract = getContract({address: bridgeEntranceAddr, abi: ABIs.bridgeEntrance, });
      const ethAmount = fromToken.token_address === NATIVE_TOKEN_ADDRESS ? amount : BigInt(0);

      // Send Transaction
      // For now just use promise to delay to simulate transaction
      await new Promise((resolve) => setTimeout(resolve, 3000));

      return "0x075635e30c9be33cc77dfb65490d9cabe27943adf1356f41efac050dccca3d8be";
    },
    error: null,
  };

  // const bridgeDepositParams = {
  //   fromToken,
  //   toToken,
  //   amount,
  //   fromAddress,
  //   recoveryAddress,
  //   toAddress,
  //   feeAmount: BN_ZERO,
  //   feeAmount: /* network === Network.MainNet ? withdrawFee!.amount.shiftedBy(toToken.decimals.toNumber()) : BN_ZERO */,
  //   gasPriceGwei,
  //   gasLimit: new BigNumber(getEvmGasLimit(carbonNetwork)),
  //   signer
  // }

  //   const fromTokenId = fromToken.id; // sample: "brkl.1.2.797e04"
  //   const fromTokenAddress = appendHexPrefix(fromToken.address);
  //   const toTokenDenom = toToken.denom; // sample: "zbrkl.1.18.b8c24f"

  //   const recoveryAddressHex = ethers.utils.hexlify(AddressUtils.SWTHAddress.getAddressBytes(recoveryAddress, carbonNetwork));

  //   const fromAssetHash = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(fromTokenId));
  //   const toAssetHash = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(toTokenDenom));
  //   const nonce = /* temp */ 0;
  //   const chainId = await library?.getSigner().getChainId() ?? 2; // need to check this
  //   const chainInfo = getChainInfo(chainId);
  //   const bridgeEntranceAddr = chainInfo.bridgeInfo?.bridgeEntranceAddr; // might not be the correc chainId format

  //   const contract = new ethers.Contract(bridgeEntranceAddr, ABIs.bridgeEntrance, signer);
  //   const feeAddress = appendHexPrefix(chainInfo.bridgeInfo?.feeAddress);

  //   const tokenCreator = fromToken.creator;

  //   const targetAddressBytes = AddressUtils.SWTHAddress.getAddressBytes(tokenCreator, carbonNetwork);
  //   const targetProxyHash = ethers.utils.hexlify(targetAddressBytes);

  //   const ethAmount = fromToken.tokenAddress === NativeTokenHash ? amount : BN_ZERO;
  //   const bridgeResultTx = await contract.connect(signer).lock(
  //     fromTokenAddress, // the asset to deposit (from) (0x00 if eth)
  //     [
  //       targetProxyHash, // _targetProxyHash
  //       recoveryAddressHex, // _recoveryAddress
  //       fromAssetHash, // _fromAssetHash
  //       feeAddress, // _feeAddress
  //       toAddress, // _toAddress the L1 address to bridge to
  //       toAssetHash, // _toAssetHash
  //     ],
  //     [
  //       amount.toString(10), // amount
  //       feeAmount.toString(10), // fee amount
  //       amount.toString(10),
  //     ], // callAmount
  //     {
  //       ...gasPriceGwei && ({ gasPrice: gasPriceGwei.shiftedBy(9).toString(10) }),
  //       ...gasLimit && ({ gasLimit: gasLimit.toString(10) }),
  //       nonce,
  //       value: ethAmount.toString(10),
  //     }
  //   );

  //   signCompleteCallback?.();
}
