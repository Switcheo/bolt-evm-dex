import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Header from "../../Header";
import Polling from "../../Header/Polling";
import Popups from "../../Popups";
import SideMenuBar from "../../SideMenuBar.tsx";

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow-x: hidden;
`;

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`;

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 100px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 16px;
    padding-top: 2rem;
  `};
`;

const Marginer = styled.div`
  margin-top: 5rem;
`;

const BaseLayout = () => {
  return (
    <>
      <AppWrapper>
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <SideMenuBar />
        <BodyWrapper>
          <Popups />
          <Polling />
          <Outlet />
          <Marginer />
        </BodyWrapper>
      </AppWrapper>
    </>
  );
};

export default BaseLayout;
