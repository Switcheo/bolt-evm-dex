import { useCallback } from "react";
import styled, { useTheme } from "styled-components";
import { isAddress } from "viem";
import { useAccount, useNetwork } from "wagmi";
import { ExternalLink, TYPE } from "../../theme";
import { getEtherscanLink } from "../../utils/getExplorerLink";
import { AutoColumn } from "../Column";
import { RowBetween } from "../Row";

const InputPanel = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: 1.25rem;
  background-color: ${({ theme }) => theme.bg1};
  z-index: 1;
  width: 100%;
`;

const ContainerRow = styled.div<{ $error: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1.25rem;
  border: 1px solid ${({ $error, theme }) => ($error ? theme.red1 : theme.bg2)};
  transition: border-color 300ms ${({ $error }) => ($error ? "step-end" : "step-start")},
    color 500ms ${({ $error }) => ($error ? "step-end" : "step-start")};
  background-color: ${({ theme }) => theme.bg1};
`;

const InputContainer = styled.div`
  flex: 1;
  padding: 1rem;
`;

const Input = styled.input<{ $error?: boolean }>`
  font-size: 1.25rem;
  outline: none;
  border: none;
  flex: 1 1 auto;
  width: 0;
  background-color: ${({ theme }) => theme.bg1};
  transition: color 300ms ${({ $error }) => ($error ? "step-end" : "step-start")};
  color: ${({ $error, theme }) => ($error ? theme.red1 : theme.primary1)};
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  width: 100%;
  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
  padding: 0px;
  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.text4};
  }
`;

const StyledLink = styled.a`
  text-decoration: none;
  font-size: 0.875rem;
  cursor: pointer;
  color: ${({ theme }) => theme.primary1};
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }

  &:focus {
    outline: none;
    text-decoration: underline;
  }

  :active {
    text-decoration: none;
  }
`;

const RECIPIENT_LABEL = "Recipient";
const ETHERSCAN_TEXT = "View on Explorer";
const FILL_WITH_WALLET_TEXT = "Fill with current wallet";
const INPUT_PLACEHOLDER = "Wallet Address or ENS name";
const INPUT_PATTERN = "^(0x[a-fA-F0-9]{40})$";

export default function AddressInputPanel({
  id,
  value,
  onChange,
}: {
  id?: string;
  // the typed string value
  value: string;
  // triggers whenever the typed value changes
  onChange: (value: string) => void;
}) {
  const theme = useTheme();
  const { address, isConnecting } = useAccount();
  const { chain } = useNetwork();

  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const input = event.target.value;
      const withoutSpaces = input.replace(/\s+/g, "");
      onChange(withoutSpaces);
    },
    [onChange],
  );

  const error = Boolean(value.length > 0 && !isConnecting && !address);

  return (
    <InputPanel id={id}>
      <ContainerRow $error={error}>
        <InputContainer>
          <AutoColumn gap="md">
            <RowBetween>
              <TYPE.black color={theme?.text2} fontWeight={500} fontSize={14}>
                {RECIPIENT_LABEL}
              </TYPE.black>
              {isAddress(value) && chain && address && (
                <ExternalLink href={getEtherscanLink(chain.id, address, "address")} style={{ fontSize: "14px" }}>
                  {ETHERSCAN_TEXT}
                </ExternalLink>
              )}
              {!isAddress(value) && address && (
                <StyledLink onClick={() => onChange(address)}>{FILL_WITH_WALLET_TEXT}</StyledLink>
              )}
            </RowBetween>
            <Input
              className="recipient-address-input"
              type="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              placeholder={INPUT_PLACEHOLDER}
              $error={error}
              pattern={INPUT_PATTERN}
              onChange={handleInput}
              value={value}
            />
          </AutoColumn>
        </InputContainer>
      </ContainerRow>
    </InputPanel>
  );
}
