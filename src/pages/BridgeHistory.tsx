import { Plus } from "react-feather";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { ButtonPrimary } from "../components/Button";
import { RowBetween } from "../components/Row";
import BridgeHistoryTable from "../components/Table";

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 24px;
`;

const BridgeHistoryContainer = styled.div`
  width: 100%;
  min-width: 320px;
  margin-top: -50px;

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    padding-top: 48px;
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
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
        <RowBetween>
          <ActiveText>Bridging History</ActiveText>
          <ButtonPrimary as={Link} to="/bridge" width="unset" padding="10px 16px" $borderRadius="16px">
            <Plus size={16} style={{ marginRight: 8 }} />
            New Transfer
          </ButtonPrimary>
        </RowBetween>
      </TitleContainer>

      <BridgeHistoryTable />
    </BridgeHistoryContainer>
  );
};

export default BridgeHistory;
