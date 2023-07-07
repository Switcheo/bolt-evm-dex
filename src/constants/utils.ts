import JSBI from "jsbi";
import { Hash } from "viem";
import { Percent } from "../utils/entities/fractions/percent";
import { SupportedChainId } from "./chains";

interface HashMap {
  [chainId: number]: Hash;
}

// ************************************************************
// URLS
// ************************************************************

export const WSS_FAUCET_URL = "wss://faucet.devnet.boltchain.com/faucet-smart/api";

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50;
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20;

export const ONE_BIPS = new Percent("1", "10000");

export const INIT_CODE_HASH_MAP: HashMap = {
  [SupportedChainId.MAINNET]: "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f",
  [SupportedChainId.BOLTCHAIN]: "0x44143914e8635a0469aba189b8de6b2de637056633de24e05952c535e6eefae6",
  // [SupportedChainId.POLYGON]: "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f",
  // [SupportedChainId.BSC]: "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f",
};

export const BIPS_BASE = BigInt(10000);

// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(BigInt(100), BIPS_BASE); // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(BigInt(300), BIPS_BASE); // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(BigInt(500), BIPS_BASE); // 5%

export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(BigInt(1000), BIPS_BASE); // 10%

export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(BigInt(50), BigInt(10000));
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(BigInt(1500), BIPS_BASE); // 15%

export const ZERO_PERCENT = new Percent("0");
export const ONE_HUNDRED_PERCENT = new Percent("1");
export const BIG_INT_ZERO = JSBI.BigInt(0);

// URLS
export const BASE_CARBON_API_URL = "https://api.carbon.network/";
export const CARBON_TOKENS_API_URL = "carbon/coin/v1/tokens?pagination.limit=1000";
export const CARBON_BRIDGES_API_URL = "carbon/coin/v1/bridges?pagination.limt=1000";

export const BASE_HYDROGEN_API_URL = "https://hydrogen-api.carbon.network/";
export const HYDROGEN_FEES_API_URL = "fee_quote";
export const HYDROGEN_BRIDGE_RELAY_API_URL = "relays";

export const DEFAULT_CARBON_TOKEN_DECIMALS = 8;
