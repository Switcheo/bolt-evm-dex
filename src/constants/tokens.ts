import { Token } from "../utils/entities/token";
import { DAI_ADDRESSES, USDC_ADRESSSES, USDT_ADDRESSES, WETH_ADDRESSES } from "./addresses";
import { SupportedChainId } from "./chains";

interface TokenRecord {
  [chainId: number]: Token;
}

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in SupportedChainId]: Token[];
};

const WETH_MAINNET_TOKEN: Token = new Token(
  SupportedChainId.MAINNET,
  WETH_ADDRESSES[SupportedChainId.MAINNET],
  18,
  "WETH",
  "Wrapped Ether",
);
const WETH_POLYGON_TOKEN: Token = new Token(
  SupportedChainId.POLYGON,
  WETH_ADDRESSES[SupportedChainId.POLYGON],
  18,
  "WETH",
  "Wrapped Ether",
);
const WETH_BSC_TOKEN: Token = new Token(
  SupportedChainId.BSC,
  WETH_ADDRESSES[SupportedChainId.BSC],
  18,
  "WBNB",
  "Wrapped BNB",
);

const WETH_BOLTCHAIN_TOKEN: Token = new Token(
  SupportedChainId.BOLTCHAIN,
  WETH_ADDRESSES[SupportedChainId.BOLTCHAIN],
  18,
  "WETH",
  "Wrapped Ether",
);

export const DAI_MAINNET_TOKEN = new Token(
  SupportedChainId.MAINNET,
  DAI_ADDRESSES[SupportedChainId.MAINNET],
  18,
  "DAI",
  "Dai Stablecoin",
);
export const DAI_POLYGON_TOKEN = new Token(
  SupportedChainId.POLYGON,
  DAI_ADDRESSES[SupportedChainId.POLYGON],
  18,
  "DAI",
  "Dai Stablecoin",
);
export const DAI_BSC_TOKEN = new Token(
  SupportedChainId.BSC,
  DAI_ADDRESSES[SupportedChainId.BSC],
  18,
  "DAI",
  "Dai Stablecoin",
);

export const USDC_MAINNET_TOKEN = new Token(
  SupportedChainId.MAINNET,
  USDC_ADRESSSES[SupportedChainId.MAINNET],
  6,
  "USDC",
  "USD Coin",
);
export const USDC_POLYGON_TOKEN = new Token(
  SupportedChainId.POLYGON,
  USDC_ADRESSSES[SupportedChainId.POLYGON],
  6,
  "USDC",
  "USD Coin",
);
export const USDC_BSC_TOKEN = new Token(
  SupportedChainId.BSC,
  USDC_ADRESSSES[SupportedChainId.BSC],
  6,
  "USDC",
  "USD Coin",
);

export const USDT_MAINNET_TOKEN = new Token(
  SupportedChainId.MAINNET,
  USDT_ADDRESSES[SupportedChainId.MAINNET],
  6,
  "USDT",
  "Tether USD",
);
export const USDT_POLYGON_TOKEN = new Token(
  SupportedChainId.POLYGON,
  USDT_ADDRESSES[SupportedChainId.POLYGON],
  6,
  "USDT",
  "Tether USD",
);
export const USDT_BSC_TOKEN = new Token(
  SupportedChainId.BSC,
  USDT_ADDRESSES[SupportedChainId.BSC],
  6,
  "USDT",
  "Tether USD",
);

export const WETH_TOKENS: TokenRecord = {
  [SupportedChainId.MAINNET]: WETH_MAINNET_TOKEN,
  [SupportedChainId.POLYGON]: WETH_POLYGON_TOKEN,
  [SupportedChainId.BSC]: WETH_BSC_TOKEN,
  [SupportedChainId.BOLTCHAIN]: WETH_BOLTCHAIN_TOKEN,
};

export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [SupportedChainId.MAINNET]: [
    WETH_TOKENS[SupportedChainId.MAINNET],
    DAI_MAINNET_TOKEN,
    USDC_MAINNET_TOKEN,
    USDT_MAINNET_TOKEN,
  ],
  [SupportedChainId.POLYGON]: [WETH_TOKENS[SupportedChainId.POLYGON]],
  [SupportedChainId.BSC]: [WETH_TOKENS[SupportedChainId.BSC]],
  [SupportedChainId.BOLTCHAIN]: [WETH_TOKENS[SupportedChainId.BOLTCHAIN]],
  [SupportedChainId.CARBON]: [],
};

export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [SupportedChainId.MAINNET]: [
    WETH_TOKENS[SupportedChainId.MAINNET],
    DAI_MAINNET_TOKEN,
    USDC_MAINNET_TOKEN,
    USDT_MAINNET_TOKEN,
  ],
  [SupportedChainId.POLYGON]: [WETH_TOKENS[SupportedChainId.POLYGON]],
  [SupportedChainId.BSC]: [WETH_TOKENS[SupportedChainId.BSC]],
  [SupportedChainId.BOLTCHAIN]: [WETH_TOKENS[SupportedChainId.BOLTCHAIN]],
  [SupportedChainId.CARBON]: [],
};

export const ADDITIONAL_BASES: { [chainId in SupportedChainId]?: { [tokenAddress: string]: Token[] } } = {
  [SupportedChainId.MAINNET]: {},
};

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in SupportedChainId]?: { [tokenAddress: string]: Token[] } } = {
  [SupportedChainId.MAINNET]: {},
};

export const SUGGESTED_BASES: ChainTokenList = {
  [SupportedChainId.MAINNET]: [
    WETH_TOKENS[SupportedChainId.MAINNET],
    DAI_MAINNET_TOKEN,
    USDC_MAINNET_TOKEN,
    USDT_MAINNET_TOKEN,
  ],
  [SupportedChainId.POLYGON]: [WETH_TOKENS[SupportedChainId.POLYGON]],
  [SupportedChainId.BSC]: [WETH_TOKENS[SupportedChainId.BSC]],
  [SupportedChainId.BOLTCHAIN]: [WETH_TOKENS[SupportedChainId.BOLTCHAIN]],
  [SupportedChainId.CARBON]: [],
};

export const PINNED_PAIRS: { readonly [chainId in SupportedChainId]?: [Token, Token][] } = {
  [SupportedChainId.MAINNET]: [
    [
      new Token(SupportedChainId.MAINNET, "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643", 8, "cDAI", "Compound Dai"),
      new Token(
        SupportedChainId.MAINNET,
        "0x39AA39c021dfbaE8faC545936693aC917d5E7563",
        8,
        "cUSDC",
        "Compound USD Coin",
      ),
    ],
    [USDC_MAINNET_TOKEN, USDT_MAINNET_TOKEN],
    [DAI_MAINNET_TOKEN, USDT_MAINNET_TOKEN],
  ],
};
