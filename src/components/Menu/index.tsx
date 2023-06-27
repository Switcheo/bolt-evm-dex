import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { createContext, useContext, useMemo, useState } from "react";
import styled, { useTheme } from "styled-components";
import { getChainInfo } from "../../constants/chainInfo";
import { getBridgingChainIdFromName, getOfficialChainIdFromBridgingChainId } from "../../constants/chains";
import { TYPE } from "../../theme";
import { ButtonDropdownLight } from "../Button";

const StyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
  width: 100%;
`;

const MenuItem = styled(DropdownMenu.Item)`
  display: flex;
  flex-direction: row;
  flex: 1;
  padding: 0.5rem 0.5rem;
  align-items: center;

  color: ${({ theme }) => theme.text2};
  &:hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
  & > svg {
    margin-right: 8px;
  }

  &[data-highlighted] {
    /* Remove border */
    outline: none;
  }
`;

// Show ellipsis if the text is too long
const InlineText = styled.span`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const LOGO_SIZE = 20;

const Logo = styled.img`
  height: ${LOGO_SIZE}px;
  width: ${LOGO_SIZE}px;
  margin-right: 12px;
  display: flex;
  flex-direction: row;
`;

const MenuList = styled(DropdownMenu.Content)`
  min-width: 8.125rem;
  background-color: ${({ theme }) => theme.bg2};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 12px;
  padding: 0.5rem;
  /* display: flex;
  flex-direction: column; */
  font-size: 1rem;
  z-index: 500;
`;

interface MenusContext {
  openId: number | null;
  close: () => void;
  open: (id: number) => void;
}

const MenusContext = createContext<MenusContext>({} as MenusContext);

interface MenusProps {
  children: React.ReactNode;
}

const Menus = ({ children }: MenusProps) => {
  const [openId, setOpenId] = useState<number | null>(null);
  const close = () => setOpenId(null);
  const open = (id: number) => setOpenId(id);

  const value = useMemo(() => ({ openId, close, open }), [openId]);

  return <MenusContext.Provider value={value}>{children}</MenusContext.Provider>;
};

const Menu = ({ children }: MenusProps) => {
  return (
    <DropdownMenu.Root>
      <StyledMenu>{children}</StyledMenu>
    </DropdownMenu.Root>
  );
};

interface ToggleProps {
  id: number;
  children: React.ReactNode;
}

const Toggle = ({ id, children }: ToggleProps) => {
  const theme = useTheme();
  const { openId, close, open } = useContext(MenusContext);

  const handleClick = () => {
    openId === null || openId !== id ? open(id) : close();
  };

  return (
    <>
      <DropdownMenu.Trigger asChild>
        <ButtonDropdownLight padding="0.5rem" onClick={handleClick} $borderRadius="0.75rem">
          <TYPE.body color={theme?.text2} fontWeight={500} fontSize={14}>
            {children}
          </TYPE.body>
        </ButtonDropdownLight>
      </DropdownMenu.Trigger>
    </>
  );
};

interface ListProps {
  id: number;
  children: React.ReactNode;
}

const List = (props: ListProps) => {
  const { openId } = useContext(MenusContext);

  if (openId !== props.id) return null;

  return (
    <DropdownMenu.Portal>
      <MenuList sideOffset={8} loop align="end">
        {props.children}
      </MenuList>
    </DropdownMenu.Portal>
  );
};

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const Button = ({ children, onClick }: ButtonProps) => {
  const { close } = useContext(MenusContext);

  const bridgingChainId = getBridgingChainIdFromName(children as string);
  const officialChainId = getOfficialChainIdFromBridgingChainId(bridgingChainId);
  const chainInfo = getChainInfo(officialChainId);

  return (
    <MenuItem
      onClick={() => {
        onClick && onClick();
        close();
      }}
    >
      <Logo src={chainInfo.logoUrl} alt={`${chainInfo.label}-logo`} />
      {typeof children === "string" ? <InlineText>{children}</InlineText> : children}
    </MenuItem>
  );
};

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
