import { TransactionResponse } from "@ethersproject/providers";
import { useMemo } from "react";
import { parseUnits } from "viem";
import { useAccount, useNetwork } from "wagmi";
import { prepareWriteContract, waitForTransaction, writeContract } from "wagmi/actions";
import { wethABI } from "../constants/abis";
import { WETH_ADDRESSES } from "../constants/addresses";
import { WETH_TOKENS } from "../constants/tokens";
import { useTransactionAdder } from "../store/modules/transactions/hooks";
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

interface WrapCallbackArgs {
  inputAmount: CurrencyAmount;
  chainId: number;
  addTransaction: (
    response: TransactionResponse,
    customData?:
      | {
          summary?: string | undefined;
          approval?:
            | {
                tokenAddress: string;
                spender: string;
              }
            | undefined;
          claim?:
            | {
                recipient: string;
              }
            | undefined;
        }
      | undefined,
  ) => void;
}

const wrapEther = async ({ inputAmount, chainId }: WrapCallbackArgs) => {
  const data = await prepareWriteContract({
    address: WETH_ADDRESSES[chainId],
    abi: wethABI,
    functionName: "deposit",
    value: BigInt(inputAmount.raw.toString()),
  });
  const { hash } = await writeContract(data.request);

  await waitForTransaction({
    hash,
    chainId,
  });
  // addTransaction(hash, { summary: `Wrap ${inputAmount.toSignificant(6)} ETH to WETH` });
};

const unwrapEther = async ({ inputAmount, chainId }: WrapCallbackArgs) => {
  const data = await prepareWriteContract({
    address: WETH_ADDRESSES[chainId],
    abi: wethABI,
    functionName: "withdraw",
    args: [BigInt(inputAmount.raw.toString())],
  });
  const { hash } = await writeContract(data.request);

  await waitForTransaction({
    hash,
    chainId,
  });

  // addTransaction(transactionResponse, { summary: `Wrap ${inputAmount.toSignificant(6)} ETH to WETH` });
};

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE };

/**
 * Given the selected input and output currency, return a wrap callback
 * @param inputCurrency the selected input currency
 * @param outputCurrency the selected output currency
 * @param typedValue the user input value
 */
export default function useWrapCallback(
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  typedValue: string | undefined,
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { address } = useAccount();
  const chainId = useNetwork()?.chain?.id;

  const balance = useCurrencyBalance(address ?? undefined, inputCurrency);
  // we can always parse the amount typed as the input currency, since wrapping is 1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue]);
  const addTransaction = useTransactionAdder();

  return useMemo(() => {
    if (!chainId || !inputCurrency || !outputCurrency || !address) return NOT_APPLICABLE;

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount);

    if (inputCurrency === ETHER && currencyEquals(WETH_TOKENS[chainId], outputCurrency)) {
      return {
        wrapType: WrapType.WRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => await wrapEther({ inputAmount: inputAmount, chainId, addTransaction })
            : undefined,
        inputError: sufficientBalance ? undefined : "Insufficient ETH balance",
      };
    } else if (currencyEquals(WETH_TOKENS[chainId], inputCurrency) && outputCurrency === ETHER) {
      return {
        wrapType: WrapType.UNWRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => await unwrapEther({ inputAmount: inputAmount, chainId, addTransaction })
            : undefined,
        inputError: sufficientBalance ? undefined : "Insufficient WETH balance",
      };
    } else {
      return NOT_APPLICABLE;
    }
  }, [chainId, inputCurrency, outputCurrency, address, inputAmount, balance, addTransaction]);
}
