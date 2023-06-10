import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import { useActiveWeb3React } from "hooks";


// export type BridgeableEvmChains = typeof BRIDGEABLE_CHAINS[number] & Partial<Blockchain>

// /**
// Returns the Ethereum client object based on the provided parameters.
// *
// @param {ConnectedCarbonSDK | CarbonSDK} sdk - The Carbon SDK object.
// @param {Blockchain} chain - The blockchain network to use.
// @param {CarbonSDK.Network} network - The Carbon SDK network to use.
// @returns {CarbonSDK.ETHClient} - The Ethereum client object.
// */
// export const getETHClient = (sdk: ConnectedCarbonSDK | CarbonSDK, chain: Blockchain, network: CarbonSDK.Network): CarbonSDK.ETHClient => {
//     if (network === CarbonSDK.Network.TestNet) {
//       return sdk.eth
//     } else if (evmIncludes(chain)) {
//                                      // @ts-ignore
//                                      return sdk[chain]
//                                    } else {
//       return sdk.eth
//     }
// }

// /**
// Checks if a given blockchain is bridgeable or not.
// @param {Blockchain} chain - The blockchain to check.
// @returns {boolean} - True if the blockchain is bridgeable, false otherwise.
// */
// export const evmIncludes = (chain: Blockchain): chain is BridgeableEvmChains => {
//   return BRIDGEABLE_CHAINS.includes(chain as BridgeableEvmChains)
// }

// // ASYNC FUNCTIONS

// export const bridgeAssetsFromEVM = (sdk: ConnectedCarbonSDK | CarbonSDK, chain: Blockchain, network: CarbonSDK.Network) => {
//   const ethClient = getETHClient(sdk, chain, network)

//   const { account, library} = useActiveWeb3React();

//   const gasPrice = library?.getGasPrice();
//   // const gasPriceWei = new BigNumber(ethers.utils.formatUnits(gasPrice, 'wei'))

//   // const approvalRequired = await isApprovalRequired(ethClient, account, gasPriceWei)

//   // if (approvalRequired) {
//   //   const allowance = await ethClient.checkAllowanceERC20(asset, account, `0x${address}`)
//   // }
// }