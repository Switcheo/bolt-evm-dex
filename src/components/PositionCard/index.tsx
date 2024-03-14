import JSBI from "jsbi";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Text } from "rebass";
import styled, { useTheme } from "styled-components";
import { useAccount } from "wagmi";
import { ReactComponent as ManageEdit } from "../../assets/svg/manage_edit.svg";
import { BIG_INT_ZERO } from "../../constants/utils";
import { useTokenBalance } from "../../hooks/balances/useTokenBalance";
import { useTotalSupply } from "../../hooks/Tokens";
import { useColor } from "../../hooks/useColor";
import { AnalyticsLink, ResponsiveButtonSecondary } from "../../pages/Pool";
import { TYPE } from "../../theme";
import { currencyId } from "../../utils/currencyId";
import { Percent } from "../../utils/entities/fractions/percent";
import { TokenAmount } from "../../utils/entities/fractions/tokenAmount";
import { Pair } from "../../utils/entities/pair";
import { unwrappedToken } from "../../utils/wrappedCurrency";
import { ButtonPrimary } from "../Button";
import { GreyCard, LightCard } from "../Card";
import { AutoColumn } from "../Column";
import { Dots } from "../ConfirmSwapModal/styleds";
import CurrencyLogo from "../CurrencyLogo";
import DoubleCurrencyLogo from "../DoubleLogo";
import { AutoRow, RowBetween, RowFixed } from "../Row";

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`;

const StyledPositionCard = styled(LightCard)<{ bgColor: string }>`
  border: none;
  background: ${({ theme }) => theme.glassBg};
  position: relative;
  overflow: hidden;
`;

const RemoveButton = styled(ResponsiveButtonSecondary)`
  width: 160px;
`;

interface PositionCardProps {
  pair: Pair;
  showUnwrapped?: boolean;
  border?: string;
  stakedBalance?: TokenAmount; // optional balance to indicate that liquidity is deposited in mining pool
}

export function MinimalPositionCard({ pair, showUnwrapped = false, border }: PositionCardProps) {
  const { address } = useAccount();
  const theme = useTheme();

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0);
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1);

  const [showMore, setShowMore] = useState(false);

  const userPoolBalance = useTokenBalance(address ?? undefined, pair.liquidityToken);
  const totalPoolTokens = useTotalSupply(pair.liquidityToken);

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined;

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined];

  return (
    <>
      {userPoolBalance && JSBI.greaterThan(userPoolBalance.raw, JSBI.BigInt(0)) ? (
        <GreyCard border={border}>
          <AutoColumn gap="12px">
            <FixedHeightRow>
              <RowFixed>
                <Text fontWeight={500} fontSize={16}>
                  Your position
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <FixedHeightRow onClick={() => setShowMore(!showMore)}>
              <RowFixed>
                <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={20} />
                <Text fontWeight={500} fontSize={20}>
                  {currency0.symbol}/{currency1.symbol}
                </Text>
              </RowFixed>
              <RowFixed>
                <Text fontWeight={500} fontSize={20}>
                  {userPoolBalance ? userPoolBalance.toSignificant(4) : "-"}
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <AutoColumn gap="4px">
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500} color={theme?.white50}>
                  Your pool share:
                </Text>
                <Text fontSize={16} fontWeight={500}>
                  {poolTokenPercentage ? poolTokenPercentage.toFixed(6) + "%" : "-"}
                </Text>
              </FixedHeightRow>
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  {currency0.symbol}:
                </Text>
                {token0Deposited ? (
                  <RowFixed>
                    <Text fontSize={16} fontWeight={500} marginLeft={"6px"}>
                      {token0Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  "-"
                )}
              </FixedHeightRow>
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  {currency1.symbol}:
                </Text>
                {token1Deposited ? (
                  <RowFixed>
                    <Text fontSize={16} fontWeight={500} marginLeft={"6px"}>
                      {token1Deposited?.toSignificant(6)}
                    </Text>
                  </RowFixed>
                ) : (
                  "-"
                )}
              </FixedHeightRow>
            </AutoColumn>
          </AutoColumn>
        </GreyCard>
      ) : (
        <LightCard>
          <TYPE.subHeader style={{ textAlign: "center" }}>
            <span role="img" aria-label="wizard-icon">
              ⭐️
            </span>{" "}
            By adding liquidity you&apos;ll earn 0.3% of all trades on this pair proportional to your share of the pool.
            Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.
          </TYPE.subHeader>
        </LightCard>
      )}
    </>
  );
}

export default function FullPositionCard({ pair, border, stakedBalance }: PositionCardProps) {
  const { address } = useAccount();
  const theme = useTheme();

  const currency0 = unwrappedToken(pair.token0);
  const currency1 = unwrappedToken(pair.token1);

  const [showMore, setShowMore] = useState(false);

  const userDefaultPoolBalance = useTokenBalance(address ?? undefined, pair.liquidityToken);
  const totalPoolTokens = useTotalSupply(pair.liquidityToken);

  // if staked balance balance provided, add to standard liquidity amount
  const userPoolBalance = stakedBalance ? userDefaultPoolBalance?.add(stakedBalance) : userDefaultPoolBalance;

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined;

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined];

  const backgroundColor = useColor(pair?.token0);

  return (
    <StyledPositionCard border={border} bgColor={backgroundColor}>
      <AutoColumn gap="12px">
        <FixedHeightRow>
          <AutoRow gap="8px">
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={20} />
            <Text fontWeight={500} fontSize={20}>
              {!currency0 || !currency1 ? <Dots>Loading</Dots> : `${currency0.symbol}/${currency1.symbol}`}
            </Text>
          </AutoRow>
          <RowFixed gap="8px">
            <ResponsiveButtonSecondary
              style={{ fontSize: "14px", padding: "2px 8px" }}
              onClick={() => setShowMore(!showMore)}
            >
              <ManageEdit style={{ marginRight: "8px" }} />
              Manage
            </ResponsiveButtonSecondary>
          </RowFixed>
        </FixedHeightRow>

        {showMore && (
          <AutoColumn gap="8px">
            <FixedHeightRow>
              <Text fontSize={16} fontWeight={500} color={theme?.grey50}>
                Your total pool tokens:
              </Text>
              <Text fontSize={16} fontWeight={500} color={theme?.grey}>
                {userPoolBalance ? userPoolBalance.toSignificant(4) : "-"}
              </Text>
            </FixedHeightRow>
            {stakedBalance && (
              <FixedHeightRow>
                <Text fontSize={16} fontWeight={500} color={theme?.grey50}>
                  Pool tokens in rewards pool:
                </Text>
                <Text fontSize={16} fontWeight={500} color={theme?.grey}>
                  {stakedBalance.toSignificant(4)}
                </Text>
              </FixedHeightRow>
            )}
            <FixedHeightRow>
              <RowFixed>
                <Text fontSize={16} fontWeight={500} color={theme?.grey50}>
                  Pooled {currency0.symbol}:
                </Text>
              </RowFixed>
              {token0Deposited ? (
                <RowFixed>
                  <Text fontSize={16} fontWeight={500} marginLeft={"6px"} color={theme?.grey}>
                    {token0Deposited?.toSignificant(6)}
                  </Text>
                  <CurrencyLogo size="20px" style={{ marginLeft: "8px" }} currency={currency0} />
                </RowFixed>
              ) : (
                "-"
              )}
            </FixedHeightRow>

            <FixedHeightRow>
              <RowFixed>
                <Text fontSize={16} fontWeight={500} color={theme?.grey50}>
                  Pooled {currency1.symbol}:
                </Text>
              </RowFixed>
              {token1Deposited ? (
                <RowFixed>
                  <Text fontSize={16} fontWeight={500} marginLeft={"6px"} color={theme?.grey}>
                    {token1Deposited?.toSignificant(6)}
                  </Text>
                  <CurrencyLogo size="20px" style={{ marginLeft: "8px" }} currency={currency1} />
                </RowFixed>
              ) : (
                "-"
              )}
            </FixedHeightRow>

            <FixedHeightRow>
              <Text fontSize={16} fontWeight={500} color={theme?.grey50}>
                Your pool share:
              </Text>
              <Text fontSize={16} fontWeight={500} color={theme?.grey}>
                {poolTokenPercentage
                  ? (poolTokenPercentage.toFixed(2) === "0.00" ? "<0.01" : poolTokenPercentage.toFixed(2)) + "%"
                  : "-"}
              </Text>
            </FixedHeightRow>
            {userDefaultPoolBalance && JSBI.greaterThan(userDefaultPoolBalance.raw, BIG_INT_ZERO) && (
              <RowBetween style={{ marginTop: "10px", gap: "8px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <ButtonPrimary
                    padding="8px"
                    $borderRadius="8px"
                    as={Link}
                    to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                    width="160px"
                  >
                    Add
                  </ButtonPrimary>
                  <RemoveButton
                    padding="8px"
                    $borderRadius="8px"
                    as={Link}
                    width="160px"
                    to={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}
                  >
                    Remove
                  </RemoveButton>
                </div>

                <AnalyticsLink
                  style={{ width: "100%", textAlign: "center" }}
                  href={`https://uniswap.info/account/${address}`}
                >
                  View accrued fees and analytics<span style={{ fontSize: "11px" }}>↗</span>
                </AnalyticsLink>
              </RowBetween>
            )}
            {stakedBalance && JSBI.greaterThan(stakedBalance.raw, BIG_INT_ZERO) && (
              <ButtonPrimary
                padding="8px"
                $borderRadius="8px"
                as={Link}
                to={`/uni/${currencyId(currency0)}/${currencyId(currency1)}`}
                width="100%"
              >
                Manage Liquidity in Rewards Pool
              </ButtonPrimary>
            )}
          </AutoColumn>
        )}
      </AutoColumn>
    </StyledPositionCard>
  );
}
