import { darken, transparentize } from "polished";
import { useRef, useState } from "react";
import { Menu, X } from "react-feather";
import { NavLink } from "react-router-dom";
import { Text } from "rebass";
import styled, { DefaultTheme } from "styled-components";
import { useAccount, useBalance, useNetwork } from "wagmi";
import Logo from "../../assets/branding/horizontal-logo-white.svg";
import { useOnClickOutside } from "../../hooks/useOnOutsideClick";
import { ConnectKitLightButton } from "../Button";
import { YellowCard } from "../Card";
import Row, { RowFixed } from "../Row";

const HeaderFrame = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0.5rem 1rem;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    width: calc(100%);
    position: relative;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`

  `}
`;

const HeaderRow = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
   width: 100%;
   justify-content: space-between;
  `};
`;

const HeaderLinks = styled(Row)`
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem 0 1rem 1rem;
    justify-content: flex-end;
`};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`;

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    max-width: 960px;
    padding: 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    height: 72px;
    border-radius: 12px 12px 0 0;
    background-color: ${({ theme }: { theme: DefaultTheme }) => theme.bg1};
  `};
`;

const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  /* addresses safari's lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};
`;

const AccountElement = styled.div<{ $active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => (props.$active ? props.theme.bg1 : props.theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  &:focus {
    border: 1px solid blue;
  }
`;

const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`;

const NetworkCard = styled(YellowCard)`
  border-radius: 12px;
  padding: 8px 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`;

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`;

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  &:hover {
    cursor: pointer;
  }
`;

const LogoIcon = styled.div`
  transition: transform 0.3s ease;
  display: flex;
  &:hover {
    transform: rotate(-5deg);
  }
`;

const StyledNavLink = styled(NavLink)`
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

  &.active {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
  }

  &:hover,
  &:focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 1.25rem;
    padding: 0.5rem 0.75rem;
    font-weight: 500;
  `};
`;

export const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};
  margin-left: 8px;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  &:hover,
  &:focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`;

const NavbarToggle = styled.span`
  cursor: pointer;
  /* color: rgba(255, 255, 255, 0.8); */
  font-size: 24px;
`;

const HamburgerMenu = styled(Menu)`
  display: none;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: block;
  `};
`;

const MobileMenuOverlay = styled.div<{ $show: boolean }>`
  display: ${({ $show }) => ($show ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => transparentize(0.3, theme.modalBG)};
  z-index: 99;
`;

const MobileMenu = styled.div<{ $modalHeight: number }>`
  display: none;
  flex-direction: column;
  position: fixed;
  top: 10px; // adjust this value to move the menu down
  left: 0;
  right: 0;
  margin: 0 auto;
  height: ${({ $modalHeight }) => $modalHeight}vh;
  width: 95%;
  border-radius: 2rem;

  background-color: ${({ theme }) => theme.bg1};
  padding: 2rem;
  z-index: 100;
  overflow-y: scroll;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: flex;
  `};
`;

const NETWORK_LABELS: { [key: number]: string } = {
  1: "Ethereum",
  11155111: "Sepolia",
  16481: "Pivotal Sepolia",
};

const Header = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, isError } = useBalance({
    address,
    chainId: chain?.id,
  });

  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setIsOpen(false));

  return (
    <HeaderFrame>
      <HeaderRow>
        <Title href=".">
          <LogoIcon>
            <img width={"180px"} src={Logo} alt="Bolt Logo" />
          </LogoIcon>
        </Title>
        <NavbarToggle onClick={() => setIsOpen(!isOpen)}>
          <HamburgerMenu />
        </NavbarToggle>
        <HeaderLinks>
          <StyledNavLink id={`swap-nav-link`} to={"/swap"}>
            Swap
          </StyledNavLink>
          <StyledNavLink id={`pool-nav-link`} to={"/pool"}>
            Pool
          </StyledNavLink>
          {/* <StyledNavLink id={`mint-nav-link`} to={"/mint"}>
            Mint
          </StyledNavLink> */}
          <StyledNavLink id={`issue-nav-link`} to={"/issue"}>
            Issue
          </StyledNavLink>
          <StyledNavLink id={`bridge-nav-link`} to={"/bridge"}>
            Bridge
          </StyledNavLink>
          {/* <StyledNavLink id={`bridge-history-nav-link`} to={"/bridge-history"}>
            Bridge History
          </StyledNavLink> */}
        </HeaderLinks>
      </HeaderRow>
      <HeaderControls>
        <HeaderElement>
          <HideSmall>
            {chain && NETWORK_LABELS[chain.id] && (
              <NetworkCard title={NETWORK_LABELS[chain.id]}>
                <Text style={{ whiteSpace: "nowrap" }}>{NETWORK_LABELS[chain.id]}</Text>
              </NetworkCard>
            )}
          </HideSmall>
          <AccountElement $active={isConnected} style={{ pointerEvents: "auto" }}>
            {isConnected && !isLoading && !isError && data && (
              <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                {data.formatted.slice(0, 10)} {data.symbol}
              </BalanceText>
            )}
            <ConnectKitLightButton padding="8px" width="unset" $borderRadius="12px" />
          </AccountElement>
        </HeaderElement>
      </HeaderControls>
      <MobileMenuOverlay $show={isOpen}>
        <MobileMenu $modalHeight={50} ref={ref}>
          <X
            style={{
              alignSelf: "flex-end",
              cursor: "pointer",
            }}
            onClick={() => setIsOpen(false)}
          />
          <StyledNavLink id={`swap-nav-link`} to={"/swap"} onClick={() => setIsOpen(false)}>
            Swap
          </StyledNavLink>
          <StyledNavLink id={`pool-nav-link`} to={"/pool"} onClick={() => setIsOpen(false)}>
            Pool
          </StyledNavLink>
          {/* <StyledNavLink id={`mint-nav-link`} to={"/mint"} onClick={() => setIsOpen(false)}>
            Mint
          </StyledNavLink> */}
          <StyledNavLink id={`issue-nav-link`} to={"/issue"} onClick={() => setIsOpen(false)}>
            Issue
          </StyledNavLink>
          <StyledNavLink id={`bridge-nav-link`} to={"/bridge"} onClick={() => setIsOpen(false)}>
            Bridge
          </StyledNavLink>
          {/* <StyledNavLink id={`bridge-history-nav-link`} to={"/bridge-history"} onClick={() => setIsOpen(false)}>
            Bridge History
          </StyledNavLink> */}
        </MobileMenu>
      </MobileMenuOverlay>
    </HeaderFrame>
  );
};

export default Header;
