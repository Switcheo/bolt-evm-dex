import { useCallback, useEffect, useState } from "react";
import { Plus } from "react-feather";
import { Text } from "rebass";
import styled from "styled-components";
import { useAccount } from "wagmi";
import { ButtonDropdownLight } from "../components/Button";
import { BlueCard, LightCard } from "../components/Card";
import { AutoColumn, ColumnCenter } from "../components/Column";
import CurrencyLogo from "../components/CurrencyLogo";
import CurrencySearchModal from "../components/CurrencySearchModal";
import { FindPoolTabs } from "../components/NavigationTabs";
import { MinimalPositionCard } from "../components/PositionCard";
import Row from "../components/Row";
import { useTokenBalance } from "../hooks/balances/useTokenBalance";
import { usePair } from "../hooks/pairs/usePair";
import { usePairAdder } from "../store/modules/user/hooks";
import { StyledInternalLink, TYPE } from "../theme";
import { currencyId } from "../utils/currencyId";
import { Currency, ETHER } from "../utils/entities/currency";
import { TokenAmount } from "../utils/entities/fractions/tokenAmount";
import AppBody from "./AppBody";

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1,
}

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

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

export default function PoolFinder() {
  const { address } = useAccount();

  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1);

  const [currency0, setCurrency0] = useState<Currency | null>(ETHER);
  const [currency1, setCurrency1] = useState<Currency | null>(null);

  const [pairState, pair] = usePair(currency0 ?? undefined, currency1 ?? undefined);
  const addPair = usePairAdder();
  useEffect(() => {
    if (pair) {
      addPair(pair);
    }
  }, [pair, addPair]);

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS && pair && pair.reserve0.raw === BigInt(0) && pair.reserve1.raw === BigInt(0),
    );

  const position: TokenAmount | undefined = useTokenBalance(address ?? undefined, pair?.liquidityToken);
  const hasPosition = Boolean(position && position.raw > 0);

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency);
      } else {
        setCurrency1(currency);
      }
    },
    [activeField],
  );

  const handleSearchDismiss = useCallback(() => {
    setShowSearch(false);
  }, [setShowSearch]);

  const prerequisiteMessage = (
    <LightCard padding="45px 10px">
      <Text textAlign="center">
        {!address ? "Connect to a wallet to find pools" : "Select a token to find your liquidity."}
      </Text>
    </LightCard>
  );

  return (
    <AppBody>
      <FindPoolTabs />
      <AutoColumn style={{ padding: "1rem" }} gap="md">
        <BlueCard>
          <AutoColumn gap="10px">
            <TYPE.link fontWeight={400} color={"primaryText1"}>
              <b>Tip:</b> Use this tool to find pairs that don&apos;t automatically appear in the interface.
            </TYPE.link>
          </AutoColumn>
        </BlueCard>
        <ButtonDropdownLight
          onClick={() => {
            setShowSearch(true);
            setActiveField(Fields.TOKEN0);
          }}
        >
          {currency0 ? (
            <Row>
              <CurrencyLogo currency={currency0} />
              <Text fontWeight={500} fontSize={20} marginLeft={"12px"}>
                {currency0.symbol}
              </Text>
            </Row>
          ) : (
            <Text fontWeight={500} fontSize={20} marginLeft={"12px"}>
              Select a Token
            </Text>
          )}
        </ButtonDropdownLight>

        <ColumnCenter>
          <Plus size="16" color="#888D9B" />
        </ColumnCenter>

        <ButtonDropdownLight
          onClick={() => {
            setShowSearch(true);
            setActiveField(Fields.TOKEN1);
          }}
        >
          {currency1 ? (
            <Row>
              <CurrencyLogo currency={currency1} />
              <Text fontWeight={500} fontSize={20} marginLeft={"12px"}>
                {currency1.symbol}
              </Text>
            </Row>
          ) : (
            <Text fontWeight={500} fontSize={20} marginLeft={"12px"}>
              Select a Token
            </Text>
          )}
        </ButtonDropdownLight>

        {hasPosition && (
          <ColumnCenter
            style={{ justifyItems: "center", backgroundColor: "", padding: "12px 0px", borderRadius: "12px" }}
          >
            <Text textAlign="center" fontWeight={500}>
              Pool Found!
            </Text>
            <StyledInternalLink to={`/pool`}>
              <Text textAlign="center">Manage this pool.</Text>
            </StyledInternalLink>
          </ColumnCenter>
        )}

        {currency0 && currency1 ? (
          pairState === PairState.EXISTS ? (
            hasPosition && pair ? (
              <MinimalPositionCard pair={pair} border="1px solid #CED0D9" />
            ) : (
              <LightCard padding="45px 10px">
                <AutoColumn gap="sm" justify="center">
                  <Text textAlign="center">You don&#39;t have liquidity in this pool yet.</Text>
                  <StyledInternalLink to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                    <Text textAlign="center">Add liquidity.</Text>
                  </StyledInternalLink>
                </AutoColumn>
              </LightCard>
            )
          ) : validPairNoLiquidity ? (
            <LightCard padding="45px 10px">
              <AutoColumn gap="sm" justify="center">
                <Text textAlign="center">No pool found.</Text>
                <StyledInternalLink to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                  Create pool.
                </StyledInternalLink>
              </AutoColumn>
            </LightCard>
          ) : pairState === PairState.INVALID ? (
            <LightCard padding="45px 10px">
              <AutoColumn gap="sm" justify="center">
                <Text textAlign="center" fontWeight={500}>
                  Invalid pair.
                </Text>
              </AutoColumn>
            </LightCard>
          ) : pairState === PairState.LOADING ? (
            <LightCard padding="45px 10px">
              <AutoColumn gap="sm" justify="center">
                <Text textAlign="center">
                  Loading
                  <Dots />
                </Text>
              </AutoColumn>
            </LightCard>
          ) : null
        ) : (
          prerequisiteMessage
        )}
      </AutoColumn>

      <CurrencySearchModal
        isOpen={showSearch}
        onCurrencySelect={handleCurrencySelect}
        onDismiss={handleSearchDismiss}
        showCommonBases
        selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
      />
    </AppBody>
  );
}
