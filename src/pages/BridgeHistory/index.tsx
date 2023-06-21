import BridgeHistoryTable from "components/Table";
import React from "react";
import styled from "styled-components";

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 24px;
`;

const BridgeHistoryContainer = styled.div`
  width: 100%;
  min-width: 320px;
  margin-top: -50px;

  @media only screen and (max-width: ${({ theme }) => `768px`}) {
    padding-top: 48px;
  }

  @media only screen and (max-width: ${({ theme }) => `640px`}) {
    padding-top: 20px;
  }
`;

const TitleContainer = styled.div`
  margin-bottom: 32px;
  max-width: 1366px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
`;

const BridgeHistory = () => {
  return (
    <BridgeHistoryContainer>
      <TitleContainer>
        <ActiveText>Bridging History</ActiveText>
      </TitleContainer>
      <BridgeHistoryTable />
    </BridgeHistoryContainer>
  );
};

export default BridgeHistory;
