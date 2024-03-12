import { Address } from "viem";
import { SupportedChainId } from "./chains";

interface AddressMap {
  [chainId: number]: Address;
}

export const NATIVE_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";

export const V2_FACTORY_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
  [SupportedChainId.BOLTCHAIN]: "0x39367ee3E3A757aAF5982F2F11Aad100D80E2890",
};

export const V2_ROUTER_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  [SupportedChainId.BOLTCHAIN]: "0x56B442Df23bB5B96cc70de053018e74C93f13288",
};

export const LOCK_PROXY_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: "0x9a016ce184a22dbf6c17daa59eb7d3140dbd1c54",
  [SupportedChainId.BOLTCHAIN]: "0x14Df1aE0D4B5b55A4E666c6cD4fBDD187b9dD2cA",
  [SupportedChainId.POLYGON]: "0x43138036d1283413035B8eca403559737E8f7980",
  [SupportedChainId.BSC]: "0xb5d4f343412dc8efb6ff599d790074d0f1e8d430",
};

export const BRIDGE_ENTRANCE_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: "0x93fd29ff3b662c9e5e15681bb3b139d6ce2ca9c5",
  [SupportedChainId.BOLTCHAIN]: "0x93fd29ff3b662c9e5e15681bb3b139d6ce2ca9c5",
  [SupportedChainId.POLYGON]: "0x75d302266926CB34B7564AAF3102c258234A35F2",
  [SupportedChainId.BSC]: "0x93fd29ff3b662c9e5e15681bb3b139d6ce2ca9c5",
};

export const BALANCE_READER_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: "0xe5e83cdba612672785d835714af26707f98030c3",
  [SupportedChainId.BOLTCHAIN]: "0xe5e83cdba612672785d835714af26707f98030c3",
  [SupportedChainId.POLYGON]: "0x7F31D17944a3147C31C3b55B71ebDcC57B6aCC84",
  [SupportedChainId.BSC]: "0x2b18c5e1edaa7e27d40fec8d0b7d96c5eefa35df",
};

export const WETH_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  [SupportedChainId.BOLTCHAIN]: "0xC77AaDe92c6164aE9f260277f4D2e2aFaeD08471",
  [SupportedChainId.POLYGON]: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
  [SupportedChainId.BSC]: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", // WBNB
};

export const DAI_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: "0x6b175474e89094c44da98b954eedeac495271d0f",
  [SupportedChainId.BOLTCHAIN]: "0x6B175474E89094C44Da98b954EedeAC495271d0F", // Not Real
  [SupportedChainId.POLYGON]: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  [SupportedChainId.BSC]: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
};

export const USDC_ADRESSSES: AddressMap = {
  [SupportedChainId.MAINNET]: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  [SupportedChainId.BOLTCHAIN]: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // Not Real
  [SupportedChainId.POLYGON]: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
  [SupportedChainId.BSC]: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
};

export const USDT_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  [SupportedChainId.BOLTCHAIN]: "0xdac17f958d2ee523a2206206994597c13d831ec7", // Not Real
  [SupportedChainId.POLYGON]: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
  [SupportedChainId.BSC]: "0x55d398326f99059ff775485246999027b3197955",
};

export const MULTICALL_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: "0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441",
  [SupportedChainId.BOLTCHAIN]: "0x999F8Eb5Ce76066f3c36B28af896F13B1FC9bf83",
  [SupportedChainId.POLYGON]: "0xa1B2b503959aedD81512C37e9dce48164ec6a94d",
  [SupportedChainId.BSC]: "0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb",
};

export const MAIN_DEV_RECOVERY_ADDRESS = "swth1cuekk8en9zgnuv0eh4hk7xtr2kghn69x0x6u7r";

export const BOLT_ERC20_ADDRESS = "0x333668EF1b9aa9E8a944b6331fF591Fb94EcD126";
