import { SupportedBridgingChainId, SupportedChainId } from "../../constants/chains";
import { Token } from "./token";
import { validateAndParseAddress } from "./utils";

export class BridgeableToken extends Token {
  public readonly bridgeChainId: SupportedBridgingChainId | 4;
  public readonly bridgeAddress: string; // essentially the lockProxy address
  public readonly bridgeId: string;
  public readonly tokenCreator: string;
  public readonly tokenDenom: string;

  public constructor(
    bridgeChainId: SupportedBridgingChainId | 4,
    bridgeAddress: string,
    bridgeId: string,
    tokenCreator: string,
    tokenDenom: string,
    chainId: SupportedChainId,
    address: string,
    decimals: number,
    symbol?: string,
    name?: string,
  ) {
    super(chainId, address, decimals, symbol, name);
    this.bridgeChainId = bridgeChainId;
    this.bridgeAddress = validateAndParseAddress(bridgeAddress);
    this.bridgeId = bridgeId;
    this.tokenCreator = tokenCreator;
    this.tokenDenom = tokenDenom;
  }
}
