import { useState } from "react";
import { Text } from "rebass";
import styled from "styled-components";
import { useAccount } from "wagmi";
import { useTokenBalance } from "../../hooks/balances/useTokenBalance";
import { useTotalSupply } from "../../hooks/Tokens";
import { TYPE } from "../../theme";
import { Percent } from "../../utils/entities/fractions/percent";
import { TokenAmount } from "../../utils/entities/fractions/tokenAmount";
import { Pair } from "../../utils/entities/pair";
import { unwrappedToken } from "../../utils/wrappedCurrency";
import { GreyCard, LightCard } from "../Card";
import { AutoColumn } from "../Column";
import { RowBetween, RowFixed } from "../Row";

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`;

interface PositionCardProps {
  pair: Pair;
  showUnwrapped?: boolean;
  border?: string;
  stakedBalance?: TokenAmount; // optional balance to indicate that liquidity is deposited in mining pool
}

export function MinimalPositionCard({ pair, showUnwrapped = false, border }: PositionCardProps) {
  const { address } = useAccount();

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0);
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1);

  const [showMore, setShowMore] = useState(false);

  const userPoolBalance = useTokenBalance(address ?? undefined, pair.liquidityToken);
  const totalPoolTokens = useTotalSupply(pair.liquidityToken);

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && totalPoolTokens.raw >= userPoolBalance.raw
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined;

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    totalPoolTokens.raw >= userPoolBalance.raw
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined];

  return (
    <>
      {userPoolBalance && userPoolBalance.raw > BigInt(0) ? (
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
                <Text fontSize={16} fontWeight={500}>
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
