import { SupportedChainId } from "./chains";

/*
 * Not using this yet. Just adding it for future reference.
 */

export const NATIVE_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";

export const V2_FACTORY_ADDRESSES = {
  [SupportedChainId.MAINNET]: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
  [SupportedChainId.BOLTCHAIN]: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
};

export const V2_ROUTER_ADDRESSES = {
  [SupportedChainId.MAINNET]: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  [SupportedChainId.BOLTCHAIN]: "0xF74Abbf5deABaEb15186E16A8B6abB9DDDBFB757",
};

export const MULTICALL_ADDRESSES = {
  [SupportedChainId.MAINNET]: "0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441",
  [SupportedChainId.BOLTCHAIN]: "0x01C3cb5b4CEF6069762B4390A38aC908E3278a29",
  [SupportedChainId.POLYGON]: "0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb",
  [SupportedChainId.BSC]: "0xa1B2b503959aedD81512C37e9dce48164ec6a94d",
};

export const LOCK_PROXY_ADDRESSES = {
  [SupportedChainId.MAINNET]: "0x9a016ce184a22dbf6c17daa59eb7d3140dbd1c54",
  [SupportedChainId.BOLTCHAIN]: "0x14Df1aE0D4B5b55A4E666c6cD4fBDD187b9dD2cA",
  [SupportedChainId.POLYGON]: "0x43138036d1283413035B8eca403559737E8f7980",
  [SupportedChainId.BSC]: "0xb5d4f343412dc8efb6ff599d790074d0f1e8d430",
};

export const BRIDGE_ENTRANCE_ADDRESSES = {
  [SupportedChainId.MAINNET]: "0x93fd29ff3b662c9e5e15681bb3b139d6ce2ca9c5",
  [SupportedChainId.BOLTCHAIN]: "0x93fd29ff3b662c9e5e15681bb3b139d6ce2ca9c5",
  [SupportedChainId.POLYGON]: "0x75d302266926CB34B7564AAF3102c258234A35F2",
  [SupportedChainId.BSC]: "0x93fd29ff3b662c9e5e15681bb3b139d6ce2ca9c5",
};

export const BALANCE_READER_ADDRESSES = {
  [SupportedChainId.MAINNET]: "0xe5e83cdba612672785d835714af26707f98030c3",
  [SupportedChainId.BOLTCHAIN]: "0xe5e83cdba612672785d835714af26707f98030c3",
  [SupportedChainId.POLYGON]: "0x7F31D17944a3147C31C3b55B71ebDcC57B6aCC84",
  [SupportedChainId.BSC]: "0x2b18c5e1edaa7e27d40fec8d0b7d96c5eefa35df",
};
