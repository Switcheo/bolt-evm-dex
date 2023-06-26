import { BRIDGEABLE_WRAPPED_DENOMS, WRAPPER_MAPPINGS } from "../constants/bridge";
import { convertToSupportedBridgingChainId, getOfficialChainIdFromBridgingChainId } from "../constants/chains";
import { TokenResponse } from "../store/modules/bridge/services/types";
import { BridgeableToken } from "./entities/bridgeableToken";

export function getBridgeableTokens(tokenResponse: TokenResponse) {
  const bridgeableDenoms = BRIDGEABLE_WRAPPED_DENOMS;
  const tokens = tokenResponse?.tokens;

  const tokensMap: Record<string, { [chainId: number]: BridgeableToken }> = {};

  if (!tokens) return;

  Object.entries(WRAPPER_MAPPINGS).forEach(([wrappedDenom, sourceDenom]) => {
    if (!bridgeableDenoms.includes(wrappedDenom)) return;

    const wrappedToken = tokens.find((d) => d.denom === wrappedDenom);
    const sourceToken = tokens.find((d) => d.denom === sourceDenom);
    // If either token is not found, return. Need to have both tokens to add to the bridgeTokenResult
    if (!wrappedToken || !sourceToken) return;

    // Convert to supported chain id. If not supported, check if its switcheo chain id 4
    const wrappedTokenChain =
      convertToSupportedBridgingChainId(wrappedToken.chain_id) ?? (wrappedToken.chain_id === "4" ? 4 : null);
    const sourceTokenChain =
      convertToSupportedBridgingChainId(sourceToken.chain_id) ?? (sourceToken.chain_id === "4" ? 4 : null);

    // If either token chain is not found, return. Need to have both tokens to add to the bridgeTokenResult
    if (!wrappedTokenChain || !sourceTokenChain || sourceTokenChain.toString() !== "4") return;

    if (!tokensMap[sourceDenom]) {
      tokensMap[sourceDenom] = {
        [sourceTokenChain]: new BridgeableToken(
          sourceTokenChain,
          add0x(sourceToken.bridge_address),
          sourceToken.bridge_id,
          sourceToken.creator,
          sourceToken.denom,
          sourceToken.id,
          getOfficialChainIdFromBridgingChainId(sourceTokenChain),
          add0x(sourceToken.token_address),
          Number(sourceToken.decimals),
          sourceToken.symbol,
          sourceToken.name,
        ),
      };
    }

    tokensMap[sourceDenom][wrappedTokenChain] = new BridgeableToken(
      wrappedTokenChain,
      add0x(wrappedToken.bridge_address),
      wrappedToken.bridge_id,
      wrappedToken.creator,
      wrappedToken.denom,
      wrappedToken.id,
      getOfficialChainIdFromBridgingChainId(wrappedTokenChain),
      add0x(wrappedToken.token_address),
      Number(wrappedToken.decimals),
      wrappedToken.symbol,
      wrappedToken.name,
    );
  });
  return tokensMap;
}

// Function that adds 0x to a hex string if it is not already present
export function add0x(hex: string): string {
  return hex.slice(0, 2) === "0x" ? hex : `0x${hex}`;
}

export interface SerializedBridgeableToken {
  bridgeChainId: number;
  bridgeAddress: string;
  bridgeId: string;
  tokenCreator: string;
  tokenDenom: string;
  carbonTokenId: string;
  chainId: number;
  address: string;
  decimals: number;
  symbol?: string;
  name?: string;
}

export function serializeBridgeableToken(bridgeableToken: BridgeableToken) {
  return {
    bridgeChainId: bridgeableToken.bridgeChainId,
    bridgeAddress: bridgeableToken.bridgeAddress,
    bridgeId: bridgeableToken.bridgeId,
    tokenCreator: bridgeableToken.tokenCreator,
    tokenDenom: bridgeableToken.tokenDenom,
    carbonTokenId: bridgeableToken.carbonTokenId,
    chainId: bridgeableToken.chainId,
    address: bridgeableToken.address,
    decimals: bridgeableToken.decimals,
    symbol: bridgeableToken.symbol,
    name: bridgeableToken.name,
  };
}

export function deserializeBridgeableToken(serializedBridgeableToken: SerializedBridgeableToken | null) {
  if (!serializedBridgeableToken) return;
  return new BridgeableToken(
    serializedBridgeableToken.bridgeChainId,
    serializedBridgeableToken.bridgeAddress,
    serializedBridgeableToken.bridgeId,
    serializedBridgeableToken.tokenCreator,
    serializedBridgeableToken.tokenDenom,
    serializedBridgeableToken.carbonTokenId,
    serializedBridgeableToken.chainId,
    serializedBridgeableToken.address,
    serializedBridgeableToken.decimals,
    serializedBridgeableToken.symbol,
    serializedBridgeableToken.name,
  );
}

export function serializeBridgeableTokensMap(
  bridgeableTokensMap: Record<string, { [chainId: number]: BridgeableToken }> | undefined,
) {
  if (!bridgeableTokensMap) return;
  const serializedBridgeableTokensMap: Record<string, { [chainId: number]: SerializedBridgeableToken }> = {};
  Object.entries(bridgeableTokensMap).forEach(([sourceDenom, bridgeableTokens]) => {
    serializedBridgeableTokensMap[sourceDenom] = {};
    Object.entries(bridgeableTokens).forEach(([chainId, bridgeableToken]) => {
      serializedBridgeableTokensMap[sourceDenom][Number(chainId)] = serializeBridgeableToken(bridgeableToken);
    });
  });
  return serializedBridgeableTokensMap;
}
