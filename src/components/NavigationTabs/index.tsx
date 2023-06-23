import { darken } from "polished";
import { ArrowLeft } from "react-feather";
import { Link as HistoryLink, NavLink } from "react-router-dom";
import styled from "styled-components";
import { useAppDispatch } from "../../store/hooks";
import { resetMintState } from "../../store/modules/mint/mintSlice";
import { RowBetween } from "../Row";
import Settings from "../Settings";

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`;

const StyledNavLink = styled(NavLink)<{ $active: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;

  ${({ $active, theme }) =>
    $active &&
    `
      border-radius: 12px;
      font-weight: 600;
      color: ${theme.text1};
    `}

  &:hover,
  &:focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`;

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
`;

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.text1};
`;

export function SwapPoolTabs({ $active }: { $active: "swap" | "pool" }) {
  return (
    <Tabs style={{ marginBottom: "20px", display: "none" }}>
      <StyledNavLink id={`swap-nav-link`} to={"/swap"} $active={$active === "swap"}>
        Swap
      </StyledNavLink>
      <StyledNavLink id={`pool-nav-link`} to={"/pool"} $active={$active === "pool"}>
        Pool
      </StyledNavLink>
    </Tabs>
  );
}

export function FindPoolTabs() {
  return (
    <Tabs>
      <RowBetween style={{ padding: "1rem 1rem 0 1rem" }}>
        <HistoryLink to="/pool">
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>Import Pool</ActiveText>
        <Settings />
      </RowBetween>
    </Tabs>
  );
}

export function AddRemoveTabs({ adding, creating }: { adding: boolean; creating: boolean }) {
  // reset states on back
  const dispatch = useAppDispatch();

  return (
    <Tabs>
      <RowBetween style={{ padding: "1rem 1rem 0 1rem" }}>
        <HistoryLink
          to="/pool"
          onClick={() => {
            adding && dispatch(resetMintState());
          }}
        >
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>{creating ? "Create a pair" : adding ? "Add Liquidity" : "Remove Liquidity"}</ActiveText>
        <Settings />
      </RowBetween>
    </Tabs>
  );
}
