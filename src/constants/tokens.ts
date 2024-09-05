import { Token } from "../utils/entities/token";
import { WETH_ADDRESSES } from "./addresses";
import { SupportedChainId } from "./chains";

interface TokenRecord {
  [chainId: number]: Token;
}

const WETH_PIVOTAL_SEPHOLIA: Token = new Token(
  SupportedChainId.PIVOTAL_SEPOLIA,
  WETH_ADDRESSES[SupportedChainId.PIVOTAL_SEPOLIA],
  18,
  "WETH",
  "Wrapped Ether",
);

export const WETH_TOKENS: TokenRecord = {
  [SupportedChainId.PIVOTAL_SEPOLIA]: WETH_PIVOTAL_SEPHOLIA,
};

