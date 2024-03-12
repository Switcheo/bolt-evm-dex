import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Text } from "rebass";
import styled, { useTheme } from "styled-components";
import { useAccount } from "wagmi";
import uImage from "../assets/images/big_unicorn.png";
import noise from "../assets/images/noise.png";
import { ButtonPrimary, ButtonSecondary } from "../components/Button";
import Card from "../components/Card";
import { AutoColumn } from "../components/Column";
import FullPositionCard from "../components/PositionCard";
import { RowBetween, RowFixed } from "../components/Row";
import { useTokenBalancesWithLoadingIndicator } from "../hooks/balances/useTokenBalancesWithLoadingIndicator";
import { usePairs } from "../hooks/pairs/usePairs";
import { toV2LiquidityToken, useTrackedTokenPairs } from "../store/modules/user/hooks";
import { ExternalLink, HideSmall, StyledInternalLink, TYPE } from "../theme";
import { Pair } from "../utils/entities/pair";

const Dots = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: ".";
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: ".";
    }
    33% {
      content: "..";
    }
    66% {
      content: "...";
    }
  }
`;

const PageWrapper = styled.div`
  max-width: 640px;
  margin-top: 8rem;
  width: 100%;
`;

const TitleRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
`;

const ButtonRow = styled(RowFixed)`
  gap: 8px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    flex-direction: row-reverse;
    justify-content: space-between;
  `};
`;

const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`;

const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  background-color: transparent;
  width: fit-content;
  border: ${({ theme }) => theme.border1};
  border-radius: 8px;
  color: ${({ theme }) => theme.text1};
  transition: box-shadow 0.25s ease-in-out;

  &:hover {
    border: ${({ theme }) => theme.borderHover};
    box-shadow: 0 2px 15px 0 rgba(176, 127, 254, 0.25);
  }

  &:focus {
    border: ${({ theme }) => theme.borderHover};
    outline: none;
  }
`;

const EmptyProposals = styled.div`
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const CardBGImage = styled.span<{ $desaturate?: boolean }>`
  background: url(${uImage});
  width: 1000px;
  height: 600px;
  position: absolute;
  border-radius: 12px;
  opacity: 0.4;
  top: -100px;
  left: -100px;
  transform: rotate(-15deg);
  user-select: none;

  ${({ $desaturate }) => $desaturate && `filter: saturate(0)`}
`;

export const CardNoise = styled.span`
  background: url(${noise});
  background-size: cover;
  mix-blend-mode: overlay;
  border-radius: 12px;
  width: 100%;
  height: 100%;
  opacity: 0.15;
  position: absolute;
  top: 0;
  left: 0;
  user-select: none;
`;

export const CardSection = styled(AutoColumn)<{ $disabled?: boolean }>`
  padding: 1rem;
  z-index: 1;
  opacity: ${({ $disabled }) => $disabled && "0.4"};
`;

const AnalyticsLink = styled(ExternalLink)`
  color: ${({ theme }) => theme.white};
`;

export default function Pool() {
  const theme = useTheme();
  const { address } = useAccount();

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs();
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  );
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  );
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    address ?? undefined,
    liquidityTokens,
  );

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan("0"),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  );

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens));
  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    v2Pairs?.some((V2Pair) => !V2Pair);

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair));

  // const hasV1Liquidity = useUserHasLiquidityInAllTokens();

  // // show liquidity even if its deposited in rewards contract
  // const stakingInfo = useStakingInfo();
  // const stakingInfosWithBalance = stakingInfo?.filter((pool) => JSBI.greaterThan(pool.stakedAmount.raw, BIG_INT_ZERO));
  // const stakingPairs = usePairs(stakingInfosWithBalance?.map((stakingInfo) => stakingInfo.tokens));

  // // remove any pairs that also are included in pairs with stake in mining pool
  // const v2PairsWithoutStakedAmount = allV2PairsWithLiquidity.filter((v2Pair) => {
  //   return (
  //     stakingPairs
  //       ?.map((stakingPair) => stakingPair[1])
  //       .filter((stakingPair) => stakingPair?.liquidityToken.address === v2Pair.liquidityToken.address).length === 0
  //   );
  // });

  return (
    <>
      <PageWrapper>
        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: "100%" }}>
            <TitleRow style={{ marginTop: "1rem" }} padding={"0"}>
              <HideSmall>
                <TYPE.mediumHeader style={{ marginTop: "0.5rem", justifySelf: "flex-start" }}>
                  Your Liquidity
                </TYPE.mediumHeader>
              </HideSmall>
              <ButtonRow>
                <ResponsiveButtonPrimary
                  id="join-pool-button"
                  as={Link}
                  padding="6px 8px"
                  $borderRadius="12px"
                  to="/add/ETH"
                >
                  <Text fontWeight={500} fontSize={16}>
                    Add Liquidity
                  </Text>
                </ResponsiveButtonPrimary>
                <ResponsiveButtonSecondary as={Link} padding="6px 8px" to="/create/ETH">
                  Create a pair
                </ResponsiveButtonSecondary>
              </ButtonRow>
            </TitleRow>

            {!address ? (
              <Card padding="40px">
                <TYPE.body color={theme?.text3} textAlign="center">
                  Connect to a wallet to view your liquidity.
                </TYPE.body>
              </Card>
            ) : v2IsLoading ? (
              <EmptyProposals>
                <TYPE.body color={theme?.text3} textAlign="center">
                  <Dots>Loading</Dots>
                </TYPE.body>
              </EmptyProposals>
            ) : allV2PairsWithLiquidity?.length > 0 ? (
              <>
                <AnalyticsLink href={"https://uniswap.info/account/" + address}>
                  Account analytics and accrued fees
                  <span> ↗</span>
                </AnalyticsLink>
                {allV2PairsWithLiquidity.map((v2Pair) => (
                  <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                ))}
                {/* {stakingPairs.map(
                  (stakingPair, i) =>
                    stakingPair[1] && ( // skip pairs that arent loaded
                      <FullPositionCard
                        key={stakingInfosWithBalance[i].stakingRewardAddress}
                        pair={stakingPair[1]}
                        stakedBalance={stakingInfosWithBalance[i].stakedAmount}
                      />
                    ),
                )} */}
              </>
            ) : (
              <EmptyProposals>
                <TYPE.body color={theme?.text3} textAlign="center">
                  No liquidity found.
                </TYPE.body>
              </EmptyProposals>
            )}

            {/* This part is modified such that the migrate text is gone */}
            <AutoColumn justify={"center"} gap="md">
              <Text textAlign="center" fontSize={14} style={{ padding: ".5rem 0 .5rem 0" }}>
                Don't see a pool you joined?
                <StyledInternalLink id="import-pool-link" to={"/find"}>
                  Import it
                </StyledInternalLink>
              </Text>
            </AutoColumn>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  );
}
