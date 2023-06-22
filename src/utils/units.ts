import JSBI from "jsbi";
/**
 *
 * This file contains functions that modify or convert units.
 * For example, you need to convert a string to ChainId.
 *
 * @summary A file for functions that modify or convert units
 *
 */

import { Percent } from "./entities/fractions/percent";

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000));
}
