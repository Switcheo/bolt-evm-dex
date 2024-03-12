import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

const MenuWrapper = styled.div`
  position: absolute;
  width: 20vw;
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`;

const MenuLinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-left: 2rem;
`;

const MenuLink = styled(Link)<{ $active?: boolean }>`
  width: 100%;
  display: flex;
  text-decoration: none;
  padding: 1rem 0;
  font-weight: 700;
  color: ${(props) => (props.$active ? "white" : "gray")};
  align-items: center;
  align-content: center;
  opacity: ${(props) => (props.$active ? "1" : ".5")};
  transition: all 0.2s ease-in-out;

  &:hover {
    color: white;
    opacity: 1; 
`;

const MenuLinkIcon = styled.div`
  margin-right: 16px;
  display: flex;
  align-items: center;
  align-content: center;
`;

export const navLinks = [
  { emoji: "🔄", label: "Swap", route: "/swap" },
  { emoji: "♾️", label: "Pool", route: "/pool" },
  { emoji: "⚒️", label: "Mint", route: "/mint" },
  { emoji: "✍️", label: "Issue", route: "/issue" },
  { emoji: "⛓️", label: "Bridge", route: "/bridge" },
  { emoji: "📋", label: "Bridge History", route: "/bridge-history" },
];

export default function SideMenuBar() {
  const current = useLocation();
  return (
    <MenuWrapper>
      <MenuLinkContainer>
        {navLinks.map((nav) => {
          return (
            <MenuLink key={nav.label} to={nav.route} $active={current.pathname === nav.route}>
              <MenuLinkIcon>{nav.emoji}</MenuLinkIcon>
              {nav.label}
            </MenuLink>
          );
        })}
      </MenuLinkContainer>
    </MenuWrapper>
  );
}
