const LOCK_PROXY_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_swthToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_ccmProxyAddress",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "_counterpartChainId",
        type: "uint64",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "fromAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint64",
        name: "toChainId",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "toAssetHash",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "toAddress",
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "toAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "txArgs",
        type: "bytes",
      },
    ],
    name: "UnlockEvent",
    type: "event",
  },
  {
    inputs: [],
    name: "ETH_ADDRESS",
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
    inputs: [],
    name: "SALT_PREFIX",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_argsBz",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
      {
        internalType: "uint64",
        name: "_fromChainId",
        type: "uint64",
      },
    ],
    name: "addExtension",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "ccmProxy",
    outputs: [
      {
        internalType: "contract CCMProxy",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "counterpartChainId",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_ownerAddress",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_swthAddress",
        type: "bytes",
      },
    ],
    name: "createWallet",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "currentNonce",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_receivingAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "extensionTransfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "extensions",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_ownerAddress",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_swthAddress",
        type: "bytes",
      },
      {
        internalType: "bytes32",
        name: "_bytecodeHash",
        type: "bytes32",
      },
    ],
    name: "getWalletAddress",
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
        name: "_tokenAddress",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_targetProxyHash",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "_toAddress",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "_toAssetHash",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "_feeAddress",
        type: "bytes",
      },
      {
        internalType: "uint256[]",
        name: "_values",
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
    inputs: [
      {
        internalType: "address payable",
        name: "_walletAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_targetProxyHash",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "_toAssetHash",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "_feeAddress",
        type: "bytes",
      },
      {
        internalType: "uint256[]",
        name: "_values",
        type: "uint256[]",
      },
      {
        internalType: "uint8",
        name: "_v",
        type: "uint8",
      },
      {
        internalType: "bytes32[]",
        name: "_rs",
        type: "bytes32[]",
      },
    ],
    name: "lockFromWallet",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_argsBz",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "_fromContractAddr",
        type: "bytes",
      },
      {
        internalType: "uint64",
        name: "_fromChainId",
        type: "uint64",
      },
    ],
    name: "registerAsset",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "registry",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_argsBz",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
      {
        internalType: "uint64",
        name: "_fromChainId",
        type: "uint64",
      },
    ],
    name: "removeExtension",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "seenMessages",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "swthToken",
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
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "tokenFallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_argsBz",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "_fromContractAddr",
        type: "bytes",
      },
      {
        internalType: "uint64",
        name: "_fromChainId",
        type: "uint64",
      },
    ],
    name: "unlock",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "wallets",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

export default LOCK_PROXY_ABI;