import { ChangeEvent, RefObject, useCallback, useMemo, useRef, useState } from "react";
import styled, { useTheme } from "styled-components";
import { isAddress } from "viem";
import { useAccount } from "wagmi";
import { CurrencyModalView } from ".";
import { useToken } from "../../hooks/Tokens";
import { useRemoveUserAddedToken, useUserAddedTokens } from "../../store/modules/user/hooks";
import { ButtonText, ExternalLink, ExternalLinkIcon, TrashIcon, TYPE } from "../../theme";
import { Token } from "../../utils/entities/token";
import { getEtherscanLink } from "../../utils/getExplorerLink";
import Card from "../Card";
import Column from "../Column";
import CurrencyLogo from "../CurrencyLogo";
import Row, { RowBetween, RowFixed } from "../Row";
import { PaddedColumn, SearchInput, Separator } from "./CurrencySearch";
import ImportRow from "./ImportRow";

const Wrapper = styled.div`
  width: 100%;
  height: calc(100% - 60px);
  position: relative;
  padding-bottom: 60px;
`;

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  border-radius: 20px;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  border-top: 1px solid ${({ theme }) => theme.bg3};
  padding: 20px;
  text-align: center;
`;

export default function ManageTokens({
  setModalView,
  setImportToken,
}: {
  setModalView: (view: CurrencyModalView) => void;
  setImportToken: (token: Token) => void;
}) {
  const { chain } = useAccount();
  const chainId = chain?.id;

  const [searchQuery, setSearchQuery] = useState<string>("");
  const theme = useTheme();

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>();
  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    const checksummedInput = isAddress(input) ? input : undefined;
    setSearchQuery(checksummedInput || input);
  }, []);

  // if they input an address, use it
  const isAddressSearch = isAddress(searchQuery);
  const searchToken = useToken(searchQuery);

  // all tokens for local lisr
  const userAddedTokens: Token[] = useUserAddedTokens();
  const removeToken = useRemoveUserAddedToken();

  const handleRemoveAll = useCallback(() => {
    if (chainId && userAddedTokens) {
      userAddedTokens.map((token) => {
        return removeToken(chainId, token.address);
      });
    }
  }, [removeToken, userAddedTokens, chainId]);

  const tokenList = useMemo(() => {
    return (
      chainId &&
      userAddedTokens.map((token) => (
        <RowBetween key={token.address} width="100%">
          <RowFixed>
            <CurrencyLogo currency={token} size={"20px"} />
            <ExternalLink href={getEtherscanLink(chainId, token.address, "address")}>
              <TYPE.main ml={"10px"} fontWeight={600}>
                {token.symbol}
              </TYPE.main>
            </ExternalLink>
          </RowFixed>
          <RowFixed>
            <TrashIcon onClick={() => removeToken(chainId, token.address)} />
            <ExternalLinkIcon href={getEtherscanLink(chainId, token.address, "address")} />
          </RowFixed>
        </RowBetween>
      ))
    );
  }, [userAddedTokens, chainId, removeToken]);

  return (
    <Wrapper>
      <Column style={{ width: "100%", flex: "1 1" }}>
        <PaddedColumn gap="14px">
          <Row>
            <SearchInput
              type="text"
              id="token-search-input"
              placeholder={"0x0000"}
              value={searchQuery}
              autoComplete="off"
              ref={inputRef as RefObject<HTMLInputElement>}
              onChange={handleInput}
            />
          </Row>
          {searchQuery !== "" && !isAddressSearch && <TYPE.error error={true}>Enter valid token address</TYPE.error>}
          {searchToken && (
            <Card backgroundColor={theme?.bg2} padding="10px 0">
              <ImportRow
                token={searchToken}
                showImportView={() => setModalView(CurrencyModalView.importToken)}
                setImportToken={setImportToken}
                style={{ height: "fit-content" }}
              />
            </Card>
          )}
        </PaddedColumn>
        <Separator />
        <PaddedColumn gap="lg">
          <RowBetween>
            <TYPE.main fontWeight={600}>
              {userAddedTokens?.length} Custom {userAddedTokens.length === 1 ? "Token" : "Tokens"}
            </TYPE.main>
            {userAddedTokens.length > 0 && (
              <ButtonText onClick={handleRemoveAll}>
                <TYPE.blue>Clear all</TYPE.blue>
              </ButtonText>
            )}
          </RowBetween>
          {tokenList}
        </PaddedColumn>
      </Column>
      <Footer>
        <TYPE.darkGray>Tip: Custom tokens are stored locally in your browser</TYPE.darkGray>
      </Footer>
    </Wrapper>
  );
}
