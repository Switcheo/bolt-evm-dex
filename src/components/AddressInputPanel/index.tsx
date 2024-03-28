import { HTMLProps, useCallback, useState } from "react";
import styled from "styled-components";
import { isAddress } from "viem";
import { useAccount, useNetwork } from "wagmi";
import { ReactComponent as WalletIconSvg } from "../../assets/svg/wallet_icon.svg";
import { getEtherscanLink } from "../../utils/getExplorerLink";
import { RowBetween } from "../Row";

const InputPanel = styled.div`
  border-radius: 8px;
  background-color: ${({ theme }) => theme.grey10};
  width: 100%;
`;

export const ExplorerButtonWrapper = styled.a`
  background-color: transparent;
  margin-top: 8px;
  padding: 4px 8px;
  border: ${({ theme }) => theme.border1};
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.text1};
  transition: box-shadow 0.25s ease-in-out;
  text-decoration: none; // Removes the underline from the link
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border: ${({ theme }) => theme.borderHover};
    box-shadow: 0 2px 15px 0 rgba(176, 127, 254, 0.25);
  }

  &:active {
    background: ${({ theme }) => theme.primaryGradient};
    color: ${({ theme }) => theme.black};
  }

  &:focus {
    border: ${({ theme }) => theme.borderHover};
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  margin-right: 0.5rem;
`};
`;
export function ExplorerButton({
  children,
  href,
  ...rest
}: Omit<HTMLProps<HTMLAnchorElement>, "as" | "ref"> & {
  href?: string;
}) {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      // Optionally, you can add additional logic here (like tracking)
      window.open(href || "#", "_blank");
    },
    [href],
  );

  return (
    <ExplorerButtonWrapper href={href} onClick={handleClick} {...rest}>
      {children}
    </ExplorerButtonWrapper>
  );
}

// https://forum.freecodecamp.org/t/how-to-make-a-css-border-gradient-with-transparent-background/571903/4
const InputBorderGradientContainer = styled.div<{ $error: boolean; $isActive: boolean }>`
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  position: relative; /* Position relative to allow absolute positioning inside */
  display: flex;
  border: ${({ $error, theme }) => `1px solid ${$error ? theme.red1 : theme.grey25}`};
  transition: border-color 300ms step-start, color 500ms step-start;
  background-color: transparent;

  ${({ $isActive, theme }) =>
    $isActive &&
    `
    &:before {
      content: "";
      position: absolute;
      top: -2px; /* Adjust these values as needed to fit your design */
      left: -2px;
      right: -2px;
      bottom: -2px;
      border-radius: 8px; /* Match your container's border-radius */
      border: 2px solid transparent;

      background: ${theme.primaryGradient} border-box;
      -webkit-mask: 
        linear-gradient(#fff 0 0) padding-box, 
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: destination-out;
      mask-composite: exclude;
      pointer-events: none; /* Ignore mouse events on the pseudo-element */
    }
  `}
`;

const WalletIconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4.5px;
  background: transparent;
  height: 20px;
  width: 28px;
  padding: 5px;
  border: 1px solid ${({ theme }) => theme.grey25};
  cursor: pointer;
`;

const WalletIcon = styled(WalletIconSvg)`
  width: 12px;
  height: 12px;
`;

const Input = styled.input<{ $error?: boolean }>`
  font-size: 1.2rem;
  outline: none;
  border: none;
  flex: 1 1 auto;
  width: 0;
  background-color: transparent;
  transition: color 300ms ${({ $error }) => ($error ? "step-end" : "step-start")};
  color: ${({ $error, theme }) => ($error ? theme.red1 : theme.textLight)};
  overflow: hidden;
  text-overflow: ellipsis;
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

const ETHERSCAN_TEXT = "View on Explorer";
const INPUT_PLACEHOLDER = "Wallet Address / ENS...";
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

  const [isInputActive, setIsInputActive] = useState(false);

  const error = Boolean(value.length > 0 && !isConnecting && !address);

  return (
    <>
      <InputPanel id={id}>
        <InputBorderGradientContainer $error={error} $isActive={isInputActive}>
          <RowBetween>
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
              onFocus={() => setIsInputActive(true)}
              onBlur={() => setIsInputActive(false)}
              value={value}
            />
            {!isAddress(value) && address && (
              <WalletIconButton onClick={() => onChange(address)}>
                <WalletIcon />
              </WalletIconButton>
            )}
          </RowBetween>
        </InputBorderGradientContainer>
      </InputPanel>
      {isAddress(value) && chain && address && (
        <RowBetween>
          <ExplorerButton href={getEtherscanLink(chain.id, address, "address")} style={{ fontSize: "14px" }}>
            {ETHERSCAN_TEXT}
          </ExplorerButton>
        </RowBetween>
      )}
    </>
  );
}
