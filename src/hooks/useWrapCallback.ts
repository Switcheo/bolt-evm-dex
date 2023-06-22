import JSBI from "jsbi";
import { useMemo } from "react";
import { Hash, parseUnits } from "viem";
import { useAccount, useNetwork } from "wagmi";
import { prepareWriteContract, writeContract } from "wagmi/actions";
import { wethABI } from "../constants/abis";
import { WETH_ADDRESSES } from "../constants/addresses";
import { WETH_TOKENS } from "../constants/tokens";
import { Currency, ETHER } from "../utils/entities/currency";
import { CurrencyAmount } from "../utils/entities/fractions/currencyAmount";
import { TokenAmount } from "../utils/entities/fractions/tokenAmount";
import { currencyEquals, Token } from "../utils/entities/token";
import { useCurrencyBalance } from "./balances/useCurrencyBalance";

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP,
}

interface WrapCallbackProps {
  inputCurrency: Token;
  outputCurrency: Token;
  typedValue: string;
}

interface WrapCallbackResponse {
  wrapType: WrapType;
  execute?: undefined | (() => Promise<Hash>);
  inputError?: string;
}

// try to parse a user entered amount for a given token
export function tryParseAmount(value?: string, currency?: Currency): CurrencyAmount | undefined {
  if (!value || !currency) {
    return undefined;
  }
  try {
    const typedValueParsed = parseUnits(value as `${number}`, currency.decimals).toString();
    if (typedValueParsed !== "0") {
      return currency instanceof Token
        ? new TokenAmount(currency, BigInt(typedValueParsed))
        : CurrencyAmount.ether(BigInt(typedValueParsed));
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error);
  }
  // necessary for all paths to return a value
  return undefined;
}

const wrapEther = async (inputAmount: JSBI, outputCurrency: Token, address: string, chainId: number) => {
  const data = await prepareWriteContract({
    address: WETH_ADDRESSES[chainId],
    abi: wethABI,
    functionName: "deposit",
    value: BigInt(inputAmount.toString()),
  });
  const { hash } = await writeContract(data.request);

  return hash;
};

const unwrapEther = async (inputAmount: JSBI, outputCurrency: Token, address: string, chainId: number) => {
  const data = await prepareWriteContract({
    address: WETH_ADDRESSES[chainId],
    abi: wethABI,
    functionName: "withdraw",
    args: [BigInt(inputAmount.toString())],
  });
  const { hash } = await writeContract(data.request);

  return hash;
};

/**
 * Given the selected input and output currency, return a wrap callback
 * @param inputCurrency the selected input currency
 * @param outputCurrency the selected output currency
 * @param typedValue the user input value
 */
export const useWrapCallback = ({
  inputCurrency,
  outputCurrency,
  typedValue,
}: WrapCallbackProps): WrapCallbackResponse => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  // const { data: balanceData } = useBalance({ address, chainId: chain?.id, token: inputCurrency.address });
  // const { data: balanceData } = useBalance({ address, chainId: chain?.id, token: inputCurrency.address });
  const balance = useCurrencyBalance(address ?? undefined, inputCurrency);

  // we can always parse the amount typed as the input currency, since wrapping is 1:1
  const inputAmount = useMemo(
    () => tryParseAmount(typedValue as `${number}`, inputCurrency),
    [inputCurrency, typedValue],
  );

  if (!chain?.id || !inputCurrency || !outputCurrency || !address) return { wrapType: WrapType.NOT_APPLICABLE };

  const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount);

  // If inputCurrency is Ether
  if (inputCurrency === ETHER && currencyEquals(WETH_TOKENS[chain.id], outputCurrency)) {
    return {
      wrapType: WrapType.WRAP,
      execute:
        sufficientBalance && inputAmount
          ? async () => await wrapEther(inputAmount.raw, outputCurrency, address, chain.id)
          : undefined,
      inputError: sufficientBalance ? undefined : "Insufficient ETH balance",
    };
  } else if (currencyEquals(WETH_TOKENS[chain.id], inputCurrency) && outputCurrency === ETHER) {
    return {
      wrapType: WrapType.UNWRAP,
      execute:
        sufficientBalance && inputAmount
          ? async () => await unwrapEther(inputAmount.raw, outputCurrency, address, chain.id)
          : undefined,
      inputError: sufficientBalance ? undefined : "Insufficient WETH balance",
    };
  } else {
    return { wrapType: WrapType.NOT_APPLICABLE };
  }
};
