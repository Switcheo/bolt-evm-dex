const BRIDGE_ENTRANCE_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_lockProxy",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "fromAssetAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "toChainId",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "fromAssetDenom",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "recoveryAddress",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "txArgs",
        type: "bytes",
      },
    ],
    name: "LockEvent",
    type: "event",
  },
  {
    inputs: [],
    name: "ETH_ASSET_HASH",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_assetHash",
        type: "address",
      },
      {
        internalType: "bytes[]",
        name: "_bytesValues",
        type: "bytes[]",
      },
      {
        internalType: "uint256[]",
        name: "_uint256Values",
        type: "uint256[]",
      },
    ],
    name: "lock",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "lockProxy",
    outputs: [
      {
        internalType: "contract ILockProxy",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export default BRIDGE_ENTRANCE_ABI;