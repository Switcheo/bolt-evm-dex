import { SupportedChainId } from "../constants/chains";

const ETHERSCAN_PREFIXES: { [key: number]: string } = {
  1: "",
  3: "ropsten.",
  4: "rinkeby.",
  5: "goerli.",
  42: "kovan.",
};

export function getEtherscanLink(
  chainId: number,
  data: string,
  type: "transaction" | "token" | "address" | "block",
): string {
  let prefix = "";

  switch (chainId) {
    case SupportedChainId.MAINNET:
      prefix = `https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]}etherscan.io`;
      break;
    case SupportedChainId.PIVOTAL_SEPOLIA:
      prefix = `http://sepolia.pivotalscan.xyz`;
      break;
    default:
      prefix = `https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]}etherscan.io`;
      break;
  }

  switch (type) {
    case "transaction": {
      return `${prefix}/tx/${data}`;
    }
    case "token": {
      return `${prefix}/token/${data}`;
    }
    case "block": {
      return `${prefix}/block/${data}`;
    }
    case "address":
    default: {
      return `${prefix}/address/${data}`;
    }
  }
}
