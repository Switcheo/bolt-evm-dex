import React from "react";
import styled from "styled-components";
import { HeaderRow, LoadedRow } from "./TokenRow";

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1366px;
  background-color: ${({ theme }) => theme.bg1};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  margin-left: auto;
  margin-right: auto;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.bg3};
`;

const TokenDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 100%;
  width: 100%;
`;

const transactionsHistory = [
  {
    id: 1,
    date: "2021-09-01",
    assetName: "Ether",
    assetSymbol: "ETH",
    sourceChain: "Ethereum",
    destinationChain: "Polygon",
    sourceTransactionHash: "0x070b93bff08baf9dcb2f0b6978a98ae15a658ecf0771c01af4c6e39aa97bd5b5",
    destinationTransactionHash: "0x87dbf3c06fad4287cea9a6cd2e9918f675a28b3e279c213b584a8dae737c2b12",
    bridgeTransactionHash: "0x87dbf3c06fad4287cea9a6cd2e9918f675a28b3e279c213b584a8dae737c2b12",
    status: "Confirmed",
    moreDetails: "https://polygonscan.com/tx/0x87dbf3c06fad4287cea9a6cd2e9918f675a28b3e279c213b584a8dae737c2b12",
  },
  {
    id: 2,
    date: "2022-03-12",
    assetName: "Bitcoin",
    assetSymbol: "BTC",
    sourceChain: "Bitcoin",
    destinationChain: "Ethereum",
    sourceTransactionHash: "0x20e312b7e5eb47d6341b8e1ff2bc6d30c65d47f5ce71ff42d9425765770480b2",
    destinationTransactionHash: "0x2f23c19b68b12385fd4344823abf28b9c9784f5a7cb6a1f675a3465c4df7d68f",
    bridgeTransactionHash: "0x2f23c19b68b12385fd4344823abf28b9c9784f5a7cb6a1f675a3465c4df7d68f",
    status: "Confirmed",
    moreDetails: "https://etherscan.io/tx/0x2f23c19b68b12385fd4344823abf28b9c9784f5a7cb6a1f675a3465c4df7d68f",
  },
  {
    id: 3,
    date: "2022-06-05",
    assetName: "Cardano",
    assetSymbol: "ADA",
    sourceChain: "Cardano",
    destinationChain: "Binance Smart Chain",
    sourceTransactionHash: "0x7301a9a5d1b751684f855941ae90ae2d6bfe014aa6f4e9e2be32e3ff07e8dabf",
    destinationTransactionHash: "0x5b65caed4068f5327e3f4e5f678c826021d45a8c0c2f27f45989d0f5f7e6c143",
    bridgeTransactionHash: "0x5b65caed4068f5327e3f4e5f678c826021d45a8c0c2f27f45989d0f5f7e6c143",
    status: "Confirmed",
    moreDetails: "https://bscscan.com/tx/0x5b65caed4068f5327e3f4e5f678c826021d45a8c0c2f27f45989d0f5f7e6c143",
  },
  {
    id: 4,
    date: "2022-07-18",
    assetName: "Polkadot",
    assetSymbol: "DOT",
    sourceChain: "Polkadot",
    destinationChain: "Kusama",
    sourceTransactionHash: "0x3f1a5d85d6a03c1b7d464a8f9b824d0dc81d1e5c9ff32e3f14a3fcb25ed47f1e",
    destinationTransactionHash: "0x2ebce2c4326503d680303f0f2e3e9e50be2d2e380e4c35d2f5e2da0de075e45f",
    bridgeTransactionHash: "0x2ebce2c4326503d680303f0f2e3e9e50be2d2e380e4c35d2f5e2da0de075e45f",
    status: "Confirmed",
    moreDetails:
      "https://kusama.subscan.io/extrinsic/0x2ebce2c4326503d680303f0f2e3e9e50be2d2e380e4c35d2f5e2da0de075e45f",
  },
  {
    id: 5,
    date: "2022-10-02",
    assetName: "XRP",
    assetSymbol: "XRP",
    sourceChain: "Ripple",
    destinationChain: "Stellar",
    sourceTransactionHash: "0x9e80a5e94207e7bea6e5b9b38af0a935b6786c9d122a26a930e5b94ac7081a78",
    destinationTransactionHash: "0xc3f4b7c29a8296c0a0c77d2740de44fd4f16a8d0c2d34a071869bfb4a087d65a",
    bridgeTransactionHash: "0xc3f4b7c29a8296c0a0c77d2740de44fd4f16a8d0c2d34a071869bfb4a087d65a",
    status: "Confirmed",
    moreDetails:
      "https://stellarscan.io/transaction/0xc3f4b7c29a8296c0a0c77d2740de44fd4f16a8d0c2d34a071869bfb4a087d65a",
  },
  {
    id: 6,
    date: "2023-01-09",
    assetName: "Litecoin",
    assetSymbol: "LTC",
    sourceChain: "Litecoin",
    destinationChain: "Binance Smart Chain",
    sourceTransactionHash: "0x40a1c2680d79c7c55feaf26a974d80d1b47dfdf53a0d334d3e76aa8de2294f2b",
    destinationTransactionHash: "0x63b7efb3d4216622e875d8c3a9b8283a51533ff31910911e9ad48684d2e8c9df",
    bridgeTransactionHash: "0x63b7efb3d4216622e875d8c3a9b8283a51533ff31910911e9ad48684d2e8c9df",
    status: "Confirmed",
    moreDetails: "https://bscscan.com/tx/0x63b7efb3d4216622e875d8c3a9b8283a51533ff31910911e9ad48684d2e8c9df",
  },
  {
    id: 7,
    date: "2023-03-21",
    assetName: "Chainlink",
    assetSymbol: "LINK",
    sourceChain: "Ethereum",
    destinationChain: "Avalanche",
    sourceTransactionHash: "0xc356f3e7e97e6ab88a1a4a03c1d86c3fd60e4c158200cc68ed648678f8d7216f",
    destinationTransactionHash: "0x99e876e7dbdb6c0b65b174d17017e91f8055e75f94de35c620d9fe1b067422c6",
    bridgeTransactionHash: "0x99e876e7dbdb6c0b65b174d17017e91f8055e75f94de35c620d9fe1b067422c6",
    status: "Confirmed",
    moreDetails:
      "https://cchain.explorer.avax.network/tx/0x99e876e7dbdb6c0b65b174d17017e91f8055e75f94de35c620d9fe1b067422c6",
  },
  {
    id: 8,
    date: "2023-04-14",
    assetName: "Bitcoin Cash",
    assetSymbol: "BCH",
    sourceChain: "Bitcoin Cash",
    destinationChain: "Ethereum",
    sourceTransactionHash: "0x54c9c9ef3dfc21daa54338ceba1b18675e014a457b97728e71ed439b6dcdd9e4",
    destinationTransactionHash: "0x24db1370c2b9ac064e6a7eb1f3b7f31b19dbf0d1e98e6ff186b45e3adbe3620d",
    bridgeTransactionHash: "0x24db1370c2b9ac064e6a7eb1f3b7f31b19dbf0d1e98e6ff186b45e3adbe3620d",
    status: "Confirmed",
    moreDetails: "https://etherscan.io/tx/0x24db1370c2b9ac064e6a7eb1f3b7f31b19dbf0d1e98e6ff186b45e3adbe3620d",
  },
  {
    id: 9,
    date: "2023-05-29",
    assetName: "Solana",
    assetSymbol: "SOL",
    sourceChain: "Solana",
    destinationChain: "Ethereum",
    sourceTransactionHash: "0x1c2eaa66f751fd0e33d4a96ae0e7684f4f6a92d3e362c3e99231b6880d510b60",
    destinationTransactionHash: "0x342e0ec07d4b68e5733a84a81fe0b31fbf9fc5b05e07016f5231bea3ee6857a6",
    bridgeTransactionHash: "0x342e0ec07d4b68e5733a84a81fe0b31fbf9fc5b05e07016f5231bea3ee6857a6",
    status: "Confirmed",
    moreDetails: "https://etherscan.io/tx/0x342e0ec07d4b68e5733a84a81fe0b31fbf9fc5b05e07016f5231bea3ee6857a6",
  },
  {
    id: 10,
    date: "2023-06-10",
    assetName: "Ethereum Classic",
    assetSymbol: "ETC",
    sourceChain: "Ethereum Classic",
    destinationChain: "Binance Smart Chain",
    sourceTransactionHash: "0x7b0320a11b9357c1009071c29c3d6df7cdd8125b3acbcc53a0a502738c4d0ae3",
    destinationTransactionHash: "0x98c3f16f6f8ae688b07af4dcefa27dbb69db0171367e743f23a154bcc6cb62ad",
    bridgeTransactionHash: "0x98c3f16f6f8ae688b07af4dcefa27dbb69db0171367e743f23a154bcc6cb62ad",
    status: "Confirmed",
    moreDetails: "https://bscscan.com/tx/0x98c3f16f6f8ae688b07af4dcefa27dbb69db0171367e743f23a154bcc6cb62ad",
  },
];

const BridgeHistoryTable = () => {
  return (
    <GridContainer>
      <HeaderRow />
      <TokenDataContainer>
        {transactionsHistory.map((transaction) => (
          <LoadedRow
            key={transaction.id}
            id={transaction.id}
            date={transaction.date}
            assetName={transaction.assetName}
            assetSymbol={transaction.assetSymbol}
            sourceChain={transaction.sourceChain}
            destinationChain={transaction.destinationChain}
            sourceTransactionHash={transaction.sourceTransactionHash}
            destinationTransactionHash={transaction.destinationTransactionHash}
            bridgeTransactionHash={transaction.bridgeTransactionHash}
            status={transaction.status}
            moreDetails={transaction.moreDetails}
          />
        ))}
      </TokenDataContainer>
    </GridContainer>
  );
};

export default BridgeHistoryTable;
