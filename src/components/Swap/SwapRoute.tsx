/* eslint-disable react-refresh/only-export-components */
import { Fragment, memo } from "react";
import { ChevronRight } from "react-feather";
import { Flex } from "rebass";
import { useTheme } from "styled-components";
import { TYPE } from "../../theme";
import { Trade } from "../../utils/entities/trade";
import { unwrappedToken } from "../../utils/wrappedCurrency";

export default memo(function SwapRoute({ trade }: { trade: Trade }) {
  const theme = useTheme();
  return (
    <Flex flexWrap="wrap" width="100%" justifyContent="flex-end" alignItems="center">
      {trade.route.path.map((token, i, path) => {
        const isLastItem: boolean = i === path.length - 1;
        const currency = unwrappedToken(token);
        return (
          <Fragment key={i}>
            <Flex alignItems="end">
              <TYPE.black fontSize={14} color={theme?.text1} ml="0.125rem" mr="0.125rem">
                {currency.symbol}
              </TYPE.black>
            </Flex>
            {isLastItem ? null : <ChevronRight size={12} color={theme?.text2} />}
          </Fragment>
        );
      })}
    </Flex>
  );
});
