import { SupportedChainId } from "constants/chains";
import { RPC_URLS } from "constants/networks";

/**
 * Get the RPC URL for the specified chain ID.
 * @param {SupportedChainId} chainId - The chain ID.
 * @returns {string} The RPC URL for the specified chain ID.
 */
export const getRpcUrl = (chainId: SupportedChainId) => {
  switch (chainId) {
    case SupportedChainId.MAINNET:
      return RPC_URLS[SupportedChainId.MAINNET][0];
    default:
      return RPC_URLS[chainId][0];
  }
};

// export const switchChain = async (chainId: SupportedChainId) => {
//   const provider = (window as any).ethereum;
//   if (provider) {
//     try {
//       await provider.request({
//         method: "wallet_switchEthereumChain",
//         params: [{ chainId: `0x${chainId.toString(16)}` }],
//       });
//     } catch (switchError) {
//       // This error code indicates that the chain has not been added to MetaMask.
//       if (switchError.code === 4902) {
//         try {
//           await provider.request({
//             method: "wallet_addEthereumChain",
//             params: [
//               {
//                 chainId: `0x${chainId.toString(16)}`,
//                 chainName: getChainName(chainId),
//                 nativeCurrency: {
//                   name: "BOLT",
//                   symbol: "BOLT",
//                   decimals: 18,
//                 },
//                 rpcUrls: [getRpcUrl(chainId)],
//                 blockExplorerUrls: ["https://etherscan.io"],
//               },
//             ],
//           });
//         } catch (addError) {
//           // handle "add" error
//           console.log(addError);
//         }
//       }
//       // handle other "switch" errors
//       console.log(switchError);
//     }
//   }
// }
