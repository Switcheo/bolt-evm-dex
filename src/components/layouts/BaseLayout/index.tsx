import { Outlet } from "react-router-dom";
import styled from "styled-components";
import backgroundImagePath from "../../../assets/svg/background_gradient.svg";
import Header from "../../Header";
import Polling from "../../Header/Polling";
import Popups from "../../Popups";
import SideMenuBar from "../../SideMenuBar.tsx";

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow-x: hidden;
  height: 100vh;
  background-image: url(${backgroundImagePath});
  -o-background-size: 100% 100%;
  -webkit-background-size: 100% 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  width: 100%;
`;

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`;

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  flex: 1;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 16px;
    padding-top: 2rem;
  `};
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  flex: 1;
  height: 100%;
  padding: 0 20vw;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0 2rem;
  `};
`;

const Marginer = styled.div`
  margin-top: 5rem;
`;

const BaseLayout = () => {
  return (
    <AppWrapper>
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
      <BodyWrapper>
        <SideMenuBar />
        <ContentContainer>
          <Outlet />
        </ContentContainer>
        <Popups />
        <Polling />
        <Marginer />
      </BodyWrapper>
    </AppWrapper>
  );
};

export default BaseLayout;
