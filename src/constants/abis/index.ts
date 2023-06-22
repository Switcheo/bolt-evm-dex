import { Interface } from "@ethersproject/abi";
import BRIDGE_ENTRANCE_ABI from "./bridge-entrance";
import ENS_REGISTRAR_ABI from "./ens";
import ENS_PUBLIC_RESOLVER_ABI from "./ens-public-resolver";
import ERC20ABI from "./erc20";
import ERC20_BYTES32_ABI from "./erc20-bytes32";
import LOCK_PROXY_ABI from "./lock-proxy";
import MULTICALL_ABI from "./multicall";
import IUniswapV2PairABI from "./pair";
import UNISWAP_V2_PAIR_ABI from "./uniswap-pair";
import UNISWAP_V2_ROUTER_ABI from "./uniswap-router";
import wethABI from "./weth";

const ERC20_INTERFACE = new Interface(ERC20ABI);
const PAIR_INTERFACE = new Interface(IUniswapV2PairABI);

export {
  wethABI,
  ERC20_INTERFACE,
  PAIR_INTERFACE,
  ENS_REGISTRAR_ABI,
  ENS_PUBLIC_RESOLVER_ABI,
  MULTICALL_ABI,
  UNISWAP_V2_ROUTER_ABI,
  ERC20_BYTES32_ABI,
  UNISWAP_V2_PAIR_ABI,
  BRIDGE_ENTRANCE_ABI,
  LOCK_PROXY_ABI,
};
