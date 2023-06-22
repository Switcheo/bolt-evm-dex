import { Token } from "./entities/token";

export const getMaxAmountInput = (token: Token, balance: bigint): bigint => {
  const decimals = BigInt(token.decimals);
  const maxAmount = balance / BigInt(10) ** decimals;
  return maxAmount;
};
