import styled from "styled-components";
import { useGetRelaysQuery } from "../../store/modules/bridgeHistory/services/bridgeHistory";
import { HeaderRow, LoadedRow } from "./TokenRow";
import { useAccount } from "wagmi";

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
  border: 1px solid ${({ theme }) => theme.backgroundOutline};
`;

const TokenDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 100%;
  width: 100%;
`;

const BridgeHistoryTable = () => {
  const { address } = useAccount();
  const { data, error, isLoading } = useGetRelaysQuery({
    bridgeType: "polynetwork",
    searchTerm: address,
  }, {
    refetchOnFocus: false,
  });

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  return (
    <GridContainer>
      <HeaderRow />
      <TokenDataContainer>
        {data.data.map((transaction) => (
          <LoadedRow
            key={transaction.id}
            id={transaction.id}
            date={transaction.created_at}
            assetName={transaction.source_blockchain}
            assetSymbol={transaction.destination_blockchain}
            sourceChain={transaction.source_blockchain}
            destinationChain={transaction.destination_blockchain}
            sourceTransactionHash={transaction.source_tx_hash}
            destinationTransactionHash={transaction.destination_tx_hash}
            bridgeTransactionHash={transaction.bridging_tx_hash}
            status={transaction.status}
            moreDetails={transaction.status}
          />
        ))}
        {data.data.length === 0 && (
          <div style={{ textAlign: "center", padding: "20px" }}>No transactions found</div>
        )}
      </TokenDataContainer>
    </GridContainer>
  );
};

export default BridgeHistoryTable;
