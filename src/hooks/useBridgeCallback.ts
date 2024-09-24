import { Address, parseEther } from "viem";
import { getAccount, getPublicClient, getWalletClient } from "wagmi/actions";
import { getChainInfo } from "../constants/chainInfo";
import {
  getChainNameFromId,
  SupportedChainId,
} from "../constants/chains";
import { useTransactionAdder } from "../store/modules/transactions/hooks";
import { Currency } from "../utils/entities/currency";
import { sepolia as baseSepolia } from "wagmi/chains";
import { getDefaultConfig } from "connectkit";
import { createConfig, http } from "wagmi";

export enum BridgeCallbackState {
  INVALID,
  LOADING,
  VALID,
}

export interface BridgeTx {
  srcToken: Currency | undefined;
  destToken: Currency | undefined;
  srcChain: SupportedChainId;
  destChain: SupportedChainId;
  feeAmount: string;
  amount: bigint;
  srcAddr: Address;
  destAddr: Address;
}

const walletConnectProjectId = import.meta.env.WALLET_CONNECT_PROJECT_ID;
const pivotal = {
  id: 16481,
  name: "Pivotal Sepolia",
  network: "Pivotal Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://sepolia.pivotalprotocol.com"] },
    default: { http: ["https://sepolia.pivotalprotocol.com"] },
  },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://sepolia.pivotalscan.xyz" },
  },
};
const sepolia = {
  ...baseSepolia,
  rpcUrls: {
    ...baseSepolia.rpcUrls,
    default: { http: ["https://eth-sepolia.g.alchemy.com/v2/7y0_VO9hXrNuU0iroPAPEnhFkDX13XY2"] },
    public: { http: ["https://eth-sepolia.g.alchemy.com/v2/7y0_VO9hXrNuU0iroPAPEnhFkDX13XY2"] },
  }
}

const config = createConfig(
  getDefaultConfig({
    appName: "Pivotal Swap",
    walletConnectProjectId,
    transports: {
      [pivotal.id]: http("https://sepolia.pivotalprotocol.com"),
      [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/7y0_VO9hXrNuU0iroPAPEnhFkDX13XY2'),
    },
    chains: [pivotal, sepolia],
  }),
);

export const getEvmGasLimit = (evmChain: SupportedChainId) => {
  switch (evmChain) {
    default:
      return 250000;
  }
};

export const useBridgeCallback = (bridgeTx: BridgeTx | undefined) => {
  const addTransaction = useTransactionAdder();

  if (!bridgeTx)
    return {
      state: BridgeCallbackState.INVALID,
      callback: null,
      error: "Missing dependencies",
    };

  const { srcToken, destToken, srcChain, destChain, amount, srcAddr, destAddr } = bridgeTx;

  if (!srcToken || !destToken || !amount || !srcChain || !destChain || !srcAddr || !destAddr) {
    return {
      state: BridgeCallbackState.INVALID,
      callback: null,
      error: "Missing dependencies",
    };
  }

  const bridgeCallback = async () => {
    const { chainId } = getAccount(config);
    const publicClient = getPublicClient(config, {
      chainId: chainId
    });
    // const chainId = await getNetwork();
    const walletClient = await getWalletClient(config,{ 
      chainId: chainId 
    });

    if (!walletClient) return;
    const [address] = await walletClient.getAddresses();
    const chainInfo = getChainInfo(srcChain);

    const ethAmount = parseEther(String(amount));

    // Prepare the config for the bridging
    // const result = await estimateGas(config, {
    //   to: `0x${chainInfo.bridgeInfo.bridgeProxy.replace(/^0x/, '')}`,
    //   value: ethAmount,
    // })
    // const result = await prepareSendTransaction({
    //   to: chainInfo.bridgeInfo.bridgeProxy,
    //   value: ethAmount,
    // });
    const hash = await walletClient.sendTransaction({
      address,
      to: `0x${chainInfo.bridgeInfo.bridgeProxy.replace(/^0x/, '')}`,
      value: ethAmount,
  });

    const transactionReceipt = await publicClient?.waitForTransactionReceipt({
      hash,
      timeout: 30_000,
    });

    if (transactionReceipt) {
      addTransaction(transactionReceipt, {
        summary: `Bridge ${srcToken.symbol} (${getChainNameFromId(srcChain)}) to ${destToken.symbol} (${getChainNameFromId(destChain)})`,
      });
    }

    return hash;
  };

  return {
    state: BridgeCallbackState.VALID,
    callback: bridgeCallback,
    error: null,
  };
};
