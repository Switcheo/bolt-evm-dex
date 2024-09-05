import { useMemo } from "react";
import { Address, getAddress, isAddress } from "viem";
import { useSingleContractMultipleData } from "../../store/modules/multicall/hooks";
import { Currency, ETHER } from "../../utils/entities/currency";
import { CurrencyAmount } from "../../utils/entities/fractions/currencyAmount";
import { Token } from "../../utils/entities/token";
import { useMulticallContract } from "../useContract";
import { useTokenBalances } from "./useTokenBalances";

/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */
export function useETHBalances(uncheckedAddresses?: (string | undefined)[]): {
  [address: Address]: CurrencyAmount | undefined;
} {
  const multicallContract = useMulticallContract();

  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
            .map((address) => (address && isAddress(address) ? address : false))
            .filter((a): a is Address => a !== false)
        : [],
    [uncheckedAddresses],
  );

  const results = useSingleContractMultipleData(
    multicallContract,
    "getEthBalance",
    addresses.map((address) => [address]),
  );

  return useMemo(
    () =>
      addresses.reduce<{ [address: string]: CurrencyAmount }>((memo, address, i) => {
        const value = results?.[i]?.result?.[0];
        if (value) memo[address] = CurrencyAmount.ether(value);
        return memo;
      }, {}),
    [addresses, results],
  );
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[],
): (CurrencyAmount | undefined)[] {
  const tokens = useMemo(
    () => currencies?.filter((currency): currency is Token => currency instanceof Token) ?? [],
    [currencies],
  );

  const accountAddress = account ? getAddress(account) : undefined;

  const tokenBalances = useTokenBalances(accountAddress, tokens);
  const containsETH: boolean = useMemo(() => currencies?.some((currency) => currency === ETHER) ?? false, [currencies]);
  const ethBalance = useETHBalances(containsETH ? [account] : []);

  return useMemo(
    () =>
      currencies?.map((currency) => {
        if (!account || !currency || !accountAddress) return undefined;
        if (currency instanceof Token) return tokenBalances[currency.address];
        if (currency === ETHER) return ethBalance[accountAddress];
        return undefined;
      }) ?? [],
    [account, accountAddress, currencies, ethBalance, tokenBalances],
  );
}

export function useCurrencyBalance(account?: string, currency?: Currency): CurrencyAmount | undefined {
  return useCurrencyBalances(account, [currency])[0];
}
