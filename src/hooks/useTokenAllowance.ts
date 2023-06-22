import { useMemo } from "react";
import { useSingleCallResult } from "../store/modules/multicall/hooks";
import { TokenAmount } from "../utils/entities/fractions/tokenAmount";
import { Token } from "../utils/entities/token";
import { useTokenContract } from "./useContract";

export function useTokenAllowance(token?: Token, owner?: string, spender?: string): TokenAmount | undefined {
  const contract = useTokenContract(token?.address, false);

  const inputs = useMemo(() => [owner, spender], [owner, spender]);
  const allowance = useSingleCallResult(contract, "allowance", inputs).result;

  return useMemo(
    () => (token && allowance ? new TokenAmount(token, BigInt(allowance.toString())) : undefined),
    [token, allowance],
  );
}
