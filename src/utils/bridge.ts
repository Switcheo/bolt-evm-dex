import { ChainId } from "@bolt-dex/sdk";
import { BRIDGEABLE_EVM_CHAINS, BRIDGEABLE_TOKENS, MAIN_TOKEN_DENOMS, SimpleMap } from "constants/index";
import { Token } from "state/bridge/actions";

// /**
//  * Returns the SWTH denom on the specified chain
//  * @param {Blockchain} chain the chain to query the SWTH denom for
//  * @returns {SimpleMap<string>}
//  */
// export const getTokenDenoms = (chain: ChainId) => {
//   return MAIN_TOKEN_DENOMS[chain]
// }

/**
 * Returns a mapping of chains to their respective SWTH Token Info
 * @returns {SimpleMap<Token>}
 */
export const getSwthBridgeTokens = (tokens: Token[]) => {
  let ret: SimpleMap<Token> = {};
  const swthBridgeDenoms = MAIN_TOKEN_DENOMS;
  Object.entries(swthBridgeDenoms).forEach(([chain, denom]) => {
    const token = tokens.find((token) => token.denom === denom);
    if (token) {
      ret[chain] = token;
    }
  });
  return ret;
};

// Temp
const wrapper = {
  wrapper_mappings: {
    "dxcad.1.2.67dde7": "dxcad.1.18.9dfb98",
    "efees.1.2.586fb5": "fees.1.18.c061fe",
    "elunr.1.2.e2121e": "lunr.1.18.fa4af7",
    "eport.1.2.7d4912": "port.1.18.b2261e",
    "ezil.1.2.f1b7e4": "zil.1.18.1a4a06",
    "swth.1.14.fffdbf": "swth",
    "swth.1.17.dbb4d5": "swth",
    "swth.1.18.4ef38b": "swth",
    "swth.1.19.6f83d0": "swth",
    "swth.1.6.5bc06b": "swth",
    "swthe.1.2.683ddd": "swth",
    "swthn.1.4.2624e1": "swth",
    "zbnb.1.18.c406be": "bnb.1.6.773edb",
    "zbrkl.1.18.b8c24f": "brkl.1.2.797e04",
    "zeth.1.18.54437c": "eth.1.2.942d87",
    "zil.1.17.3997a2": "zil.1.18.1a4a06",
    "zil.1.19.0f16f8": "zil.1.18.1a4a06",
    "zil.1.6.52c256": "zil.1.18.1a4a06",
    "zmatic.1.18.45185c": "matic.1.17.3254b4",
    "zopul.1.18.4bcdc9": "opul.1.2.d9af8f",
    "ztraxx.1.18.9c8e35": "traxx.1.2.9442ae",
    "zusdt.1.18.1728e9": "usdt.1.2.556c4e",
    "zwbtc.1.18.a9cb60": "wbtc.1.2.786598",
    "zxcad.1.18.35137d": "xcad.1.2.9bb504",
  },
  pagination: {
    next_key: null,
    total: "24",
  },
};

export const BRIDGEABLE_WRAPPED_DENOMS = {
  [ChainId.MAINNET]: [
    "zusdt.1.18.1728e9",
    "zeth.1.18.54437c",
    "zwbtc.1.18.a9cb60",
    "zxcad.1.18.35137d",
    "eport.1.2.7d4912",
    "efees.1.2.586fb5",
    "elunr.1.2.e2121e",
    "ezil.1.2.f1b7e4",
    "dxcad.1.2.67dde7",
    "zbrkl.1.18.b8c24f",
    "zopul.1.18.4bcdc9",
    "ztraxx.1.18.9c8e35",
    "swth.1.19.6f83d0",
    "swth.1.6.5bc06b",
    "swth.1.18.4ef38b",
    "swth.1.17.dbb4d5",
    "zbnb.1.18.c406be",
    "swthe.1.2.683ddd",
    "zil.1.17.3997a2",
    "zil.1.19.0f16f8",
    "zil.1.6.52c256",
    "zmatic.1.18.45185c",
  ],
  [ChainId.BOLTCHAIN]: ["swth.1.111.ae86f6", "swth.1.502.976cb7"],
};

export const bridgeableIncludes = (chain: number) => {
  return BRIDGEABLE_EVM_CHAINS.includes(chain);
};

export const getBridgeableTokens = (bridgeableTokens: Token[], networkFrom: string) => {
  //   const { bridgeableTokens } = useBridgeState()
  const tokens: Token[] = bridgeableTokens;
  const bridgeableDenoms = BRIDGEABLE_WRAPPED_DENOMS[ChainId.MAINNET];
  const tokenChains: SimpleMap<SimpleMap> = {};
  const bridgeTokenResult: BridgeableToken[] = [];

  Object.entries(wrapper.wrapper_mappings).forEach(([wrappedDenom, sourceDenom]) => {
    if (!bridgeableDenoms.includes(wrappedDenom)) {
      return;
    }

    // Find the wrapped token and the source token in the tokens array
    // Check if denom === wrappedDenom / sourceDenom
    const wrappedToken = tokens.find((d) => d.denom === wrappedDenom)!;
    const sourceToken = tokens.find((d) => d.denom === sourceDenom)!;

    let wrappedChain = Number(wrappedToken?.chain_id);
    let sourceChain = Number(sourceToken?.chain_id);

    // Check if the chain is bridgeable
    if (
      !wrappedChain ||
      !bridgeableIncludes(wrappedChain) ||
      !sourceChain ||
      (!bridgeableIncludes(sourceChain) && sourceChain !== 4)
    ) {
      return;
    }

    if (!tokenChains[sourceDenom]) {
      tokenChains[sourceDenom] = { [sourceChain]: sourceDenom };
    }
    tokenChains[sourceDenom][wrappedChain] = wrappedDenom;

    if (sourceChain === 4) {
      addSwthMapping(bridgeTokenResult, wrappedToken, MAIN_TOKEN_DENOMS, tokenChains[sourceDenom]);
    } else {
      addMapping(bridgeTokenResult, wrappedToken, sourceToken, tokenChains[sourceDenom]);
      addMapping(bridgeTokenResult, sourceToken, wrappedToken, tokenChains[sourceDenom]);
    }
  });

  const bridgeableTokenChainId = BRIDGEABLE_TOKENS[networkFrom];
  // const wrapperTokenSwthDenom = MAIN_TOKEN_DENOMS[bridgeableTokenChainId];

  // Filter the bridgeTokenResult to only include objects that object.blockchain == bridgeableTokenChainId
  const filteredBridgeTokenResult = bridgeTokenResult.filter((obj) => obj.blockchain === bridgeableTokenChainId);

  return filteredBridgeTokenResult;
};

export interface BridgeableToken {
  blockchain: number;
  tokenAddress: string;
  lockproxyAddress: string;
  decimals: number;
  denom: string;
  tokenId: string;
  chains: SimpleMap;
}

const addMapping = (r: BridgeableToken[], a: Token, b: Token, chains: SimpleMap) => {
  const aChain = Number(a.chain_id);
  r.push({
    blockchain: aChain,
    tokenAddress: a.token_address.toLowerCase(),
    lockproxyAddress: a.bridge_address,
    decimals: Number(a.decimals),
    denom: a.denom,
    tokenId: a.id,
    chains,
  });
};

const addSwthMapping = (r: BridgeableToken[], a: Token, b: { [key: string]: string }, chains: SimpleMap) => {
  const aChain = Number(a.chain_id);
  r.push({
    blockchain: aChain,
    tokenAddress: a.token_address.toLowerCase(),
    lockproxyAddress: a.bridge_address,
    decimals: Number(a.decimals),
    denom: a.denom,
    tokenId: a.id,
    chains,
  });
};
