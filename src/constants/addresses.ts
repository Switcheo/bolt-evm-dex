import { Address } from "viem";
import { SupportedChainId } from "./chains";

interface AddressMap {
  [chainId: number]: Address;
}

export const NATIVE_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";

export const WETH_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  [SupportedChainId.PIVOTAL_SEPOLIA]: "0x5abA3177A50424C750Ab34d1708D818EDB9a8201",
};

export const V2_FACTORY_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
  [SupportedChainId.PIVOTAL_SEPOLIA]: "0xC428448C8B64831FF7CB9E57f4A7e5bCB0e400E7",
};

export const V2_ROUTER_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  [SupportedChainId.PIVOTAL_SEPOLIA]: "0x3dB08D939C3275c8bE3D9F656d040Da9d2F1d8e9",
};

export const MULTICALL_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: "0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441",
  [SupportedChainId.SEPOLIA]: "0x25eef291876194aefad0d60dff89e268b90754bb",
  [SupportedChainId.PIVOTAL_SEPOLIA]: "0xc12Ab3A49eb977055A91334f5b4fF1154aaFd863",
};

export const BOLT_ERC20_ADDRESS = "0x333668EF1b9aa9E8a944b6331fF591Fb94EcD126";
