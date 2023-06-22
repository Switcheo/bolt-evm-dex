import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useAccount, useNetwork } from "wagmi";
import { AppDispatch, AppState } from "../..";
import { useTokenBalances } from "../../../hooks/balances/useTokenBalances";
import { usePair } from "../../../hooks/pairs/usePair";
import { useTotalSupply } from "../../../hooks/Tokens";
import { Currency } from "../../../utils/entities/currency";
import { CurrencyAmount } from "../../../utils/entities/fractions/currencyAmount";
import { Percent } from "../../../utils/entities/fractions/percent";
import { TokenAmount } from "../../../utils/entities/fractions/tokenAmount";
import { Pair } from "../../../utils/entities/pair";
import { wrappedCurrency } from "../../../utils/wrappedCurrency";
import { useAppSelector } from "../../hooks";
import { tryParseAmount } from "../swap/hooks";
import { Field, typeInput } from "./burnSlice";

export function useBurnState(): AppState["burn"] {
  return useAppSelector((state) => state.burn);
}

export function useDerivedBurnInfo(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
): {
  pair?: Pair | null;
  parsedAmounts: {
    [Field.LIQUIDITY_PERCENT]: Percent;
    [Field.LIQUIDITY]?: TokenAmount;
    [Field.CURRENCY_A]?: CurrencyAmount;
    [Field.CURRENCY_B]?: CurrencyAmount;
  };
  error?: string;
} {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const { independentField, typedValue } = useBurnState();

  // pair + totalsupply
  const [, pair] = usePair(currencyA, currencyB);

  // balances
  const relevantTokenBalances = useTokenBalances(address ?? undefined, [pair?.liquidityToken]);

  // Convert data to relevantTokenBalances

  const userLiquidity: undefined | TokenAmount = relevantTokenBalances?.[pair?.liquidityToken?.address ?? ""];

  const [tokenA, tokenB] = [wrappedCurrency(currencyA, chain?.id), wrappedCurrency(currencyB, chain?.id)];
  const tokens = {
    [Field.CURRENCY_A]: tokenA,
    [Field.CURRENCY_B]: tokenB,
    [Field.LIQUIDITY]: pair?.liquidityToken,
  };

  // liquidity values
  const totalSupply = useTotalSupply(pair?.liquidityToken);
  const liquidityValueA =
    pair &&
    totalSupply &&
    userLiquidity &&
    tokenA &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    totalSupply.raw >= userLiquidity.raw
      ? new TokenAmount(tokenA, pair.getLiquidityValue(tokenA, totalSupply, userLiquidity, false).raw)
      : undefined;
  const liquidityValueB =
    pair &&
    totalSupply &&
    userLiquidity &&
    tokenB &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    totalSupply.raw >= userLiquidity.raw
      ? new TokenAmount(tokenB, pair.getLiquidityValue(tokenB, totalSupply, userLiquidity, false).raw)
      : undefined;
  const liquidityValues: {
    [Field.CURRENCY_A]?: TokenAmount;
    [Field.CURRENCY_B]?: TokenAmount;
  } = {
    [Field.CURRENCY_A]: liquidityValueA,
    [Field.CURRENCY_B]: liquidityValueB,
  };

  let percentToRemove: Percent = new Percent(BigInt(0), BigInt(100));
  // user specified a %
  if (independentField === Field.LIQUIDITY_PERCENT) {
    percentToRemove = new Percent(BigInt(typedValue), BigInt("100"));
  }
  // user specified a specific amount of liquidity tokens
  else if (independentField === Field.LIQUIDITY) {
    if (pair?.liquidityToken) {
      const independentAmount = tryParseAmount(typedValue, pair.liquidityToken);
      if (independentAmount && userLiquidity && !independentAmount.greaterThan(userLiquidity)) {
        percentToRemove = new Percent(independentAmount.raw, userLiquidity.raw);
      }
    }
  }
  // user specified a specific amount of token a or b
  else {
    if (tokens[independentField]) {
      const independentAmount = tryParseAmount(typedValue, tokens[independentField]);
      const liquidityValue = liquidityValues[independentField];
      if (independentAmount && liquidityValue && !independentAmount.greaterThan(liquidityValue)) {
        percentToRemove = new Percent(independentAmount.raw, liquidityValue.raw);
      }
    }
  }

  const parsedAmounts: {
    [Field.LIQUIDITY_PERCENT]: Percent;
    [Field.LIQUIDITY]?: TokenAmount;
    [Field.CURRENCY_A]?: TokenAmount;
    [Field.CURRENCY_B]?: TokenAmount;
  } = {
    [Field.LIQUIDITY_PERCENT]: percentToRemove,
    [Field.LIQUIDITY]:
      userLiquidity && percentToRemove && percentToRemove.greaterThan(BigInt(0))
        ? new TokenAmount(userLiquidity.token, percentToRemove.multiply(userLiquidity.raw).quotient)
        : undefined,
    [Field.CURRENCY_A]:
      tokenA && percentToRemove && percentToRemove.greaterThan(BigInt(0)) && liquidityValueA
        ? new TokenAmount(tokenA, percentToRemove.multiply(liquidityValueA.raw).quotient)
        : undefined,
    [Field.CURRENCY_B]:
      tokenB && percentToRemove && percentToRemove.greaterThan(BigInt(0)) && liquidityValueB
        ? new TokenAmount(tokenB, percentToRemove.multiply(liquidityValueB.raw).quotient)
        : undefined,
  };

  let error: string | undefined;
  if (!address) {
    error = "Connect Wallet";
  }

  if (!parsedAmounts[Field.LIQUIDITY] || !parsedAmounts[Field.CURRENCY_A] || !parsedAmounts[Field.CURRENCY_B]) {
    error = error ?? "Enter an amount";
  }

  return { pair, parsedAmounts, error };
}

export function useBurnActionHandlers(): {
  onUserInput: (field: Field, typedValue: string) => void;
} {
  const dispatch = useDispatch<AppDispatch>();

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ independentField: field, typedValue }));
    },
    [dispatch],
  );

  return {
    onUserInput,
  };
}
