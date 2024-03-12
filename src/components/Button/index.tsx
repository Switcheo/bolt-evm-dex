import { ConnectKitButton } from "connectkit";
import { darken, lighten } from "polished";
import { forwardRef } from "react";
import { ChevronDown } from "react-feather";
import { ButtonProps, Button as RebassButton } from "rebass/styled-components";
import styled from "styled-components";
import { RowBetween } from "../Row";

const Base = styled(RebassButton)<{
  padding?: string;
  width?: string;
  $borderRadius?: string;
  $altDisabledStyle?: boolean;
}>`
  padding: ${({ padding }) => (padding ? padding : "8px 16px")};
  width: ${({ width }) => (width ? width : "100%")};
  font-weight: 500;
  text-align: center;
  border-radius: 20px;
  border-radius: ${({ $borderRadius }) => $borderRadius && $borderRadius};
  outline: none;
  border: 1px solid transparent;
  color: white;
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  &:disabled {
    cursor: auto;
  }

  > * {
    user-select: none;
  }
`;

export const ButtonPrimary = styled(Base)`
  border-radius: 8px;
  background: ${({ theme }) => theme.primaryGradient};
  color: white;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.primary1)};
    background-color: ${({ theme }) => darken(0.05, theme.primary1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.primary1)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.primary1)};
    background-color: ${({ theme }) => darken(0.1, theme.primary1)};
  }
  &:disabled {
    background-color: ${({ theme, $altDisabledStyle, disabled }) =>
      $altDisabledStyle ? (disabled ? theme.bg3 : theme.primary1) : theme.bg3};
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
    opacity: ${({ $altDisabledStyle }) => ($altDisabledStyle ? "1" : ".25")};
  }
`;

const ConnectedButtonBorderGradient = styled.div`
  flex: 1;
  border-radius: 8px;
  position: relative; /* Position relative to allow absolute positioning inside */
  display: flex;
  border: ${({ theme }) => `1px solid ${theme.grey25}`};
  transition: border-color 300ms step-start, color 500ms step-start;
  background-color: transparent;

    &:before {
      content: "";
      position: absolute;
      top: -2px; /* Adjust these values as needed to fit your design */
      left: -2px;
      right: -2px;
      bottom: -2px;
      border-radius: 8px; /* Match your container's border-radius */
      border: 2px solid transparent;
      background: ${({ theme }) => `${theme.primaryGradient} border-box`};
      -webkit-mask: 
        linear-gradient(#fff 0 0) padding-box, 
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: destination-out;
      mask-composite: exclude;
      pointer-events: none; /* Ignore mouse events on the pseudo-element */
    }
  }
`;

export const ConnectedButton = styled(Base)`
  background: ${({ theme }) => theme.greyGradient5};
  border-radius: 8px;
  color: ${({ theme }) => theme.grey50};
  font-size: 16px;
  padding: 6px 12px;
  font-weight: 500;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme, disabled }) => !disabled && darken(0.03, theme.primary5)};
    background-color: ${({ theme, disabled }) => !disabled && darken(0.03, theme.primary5)};
  }
  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.03, theme.primary5)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme, disabled }) => !disabled && darken(0.05, theme.primary5)};
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.primary5)};
  }
  :disabled {
    opacity: 0.4;
    &:hover {
      cursor: auto;
      background-color: ${({ theme }) => theme.primary5};
      box-shadow: none;
      border: 1px solid transparent;
      outline: none;
    }
  }
`;

const WalletBtnGradientWrapper = styled.div`
  position: relative;
  &:hover {
    .btn-gradient {
      opacity: 1;
      background: ${({ theme }) => theme.primaryGradient};
      filter: blur(4px);
    }
  }
`;

const WalletBtnGradient = styled.div`
  opacity: 0;
  z-index: -99999;
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 8px 12px;
  transition: opacity 0.25s ease-in-out;
  border-radius: 8px;
`;

const WalletBtnWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  color: white;
  &:focus {
    border: 1px solid blue;
  }
`;

export const DisconnectedButton = styled(ConnectedButton)`
  background: ${({ theme }) => theme.primaryGradient};
  color: white;
  border: 0;
`;

export const ButtonGray = styled(Base)`
  background-color: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text2};
  font-size: 16px;
  font-weight: 500;
  &:focus {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.bg4)};
  }
  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.bg4)};
  }
  &:active {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.1, theme.bg4)};
  }
`;

export const ButtonSecondary = styled(Base)`
  border: 1px solid ${({ theme }) => theme.primary4};
  color: ${({ theme }) => theme.primary1};
  background-color: transparent;
  font-size: 16px;
  border-radius: 12px;
  padding: ${({ padding }) => (padding ? padding : "10px")};

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.primary4};
    border: 1px solid ${({ theme }) => theme.primary3};
  }
  &:hover {
    border: 1px solid ${({ theme }) => theme.primary3};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.primary4};
    border: 1px solid ${({ theme }) => theme.primary3};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
  a:hover {
    text-decoration: none;
  }
`;

export const ButtonPink = styled(Base)`
  background-color: ${({ theme }) => theme.primary1};
  color: white;

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.primary1)};
    background-color: ${({ theme }) => darken(0.05, theme.primary1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.primary1)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.primary1)};
    background-color: ${({ theme }) => darken(0.1, theme.primary1)};
  }
  &:disabled {
    background-color: ${({ theme }) => theme.primary1};
    opacity: 50%;
    cursor: auto;
  }
`;

export const ButtonUNIGradient = styled(ButtonPrimary)`
  color: white;
  padding: 4px 8px;
  height: 36px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.bg3};
  background: radial-gradient(174.47% 188.91% at 1.84% 0%, #ff007a 0%, #2172e5 100%), #edeef2;
  width: fit-content;
  position: relative;
  cursor: pointer;
  border: none;
  white-space: no-wrap;
  &:hover {
    opacity: 0.8;
  }
  :active {
    opacity: 0.9;
  }
`;

export const ButtonOutlined = styled(Base)`
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: transparent;
  color: ${({ theme }) => theme.text1};

  &:focus {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:hover {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:active {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`;

export const ButtonGhost = styled(ButtonOutlined)`
  border: transparent;
`;

export const ButtonEmpty = styled(Base)`
  background-color: transparent;
  color: ${({ theme }) => theme.primary1};
  display: flex;
  justify-content: center;
  align-items: center;

  &:focus {
    text-decoration: underline;
  }
  &:hover {
    text-decoration: none;
  }
  &:active {
    text-decoration: none;
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`;

export const ButtonWhite = styled(Base)`
  border: 1px solid #edeef2;
  background-color: ${({ theme }) => theme.bg1};
  color: black;

  &:focus {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    box-shadow: 0 0 0 1pt ${darken(0.05, "#edeef2")};
  }
  &:hover {
    box-shadow: 0 0 0 1pt ${darken(0.1, "#edeef2")};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${darken(0.1, "#edeef2")};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`;

const ButtonConfirmedStyle = styled(Base)`
  background-color: ${({ theme }) => lighten(0.5, theme.green1)};
  color: ${({ theme }) => theme.green1};
  border: 1px solid ${({ theme }) => theme.green1};

  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`;

const ButtonErrorStyle = styled(Base)`
  border: 1px solid ${({ theme }) => theme.red1};
  background-color: transparent;
  padding: 8px 16px;
  border-radius: 8px;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.red1)};
    background-color: ${({ theme }) => darken(0.05, theme.red1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.red1)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.red1)};
    background-color: ${({ theme }) => darken(0.1, theme.red1)};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
    box-shadow: none;
    border: 1px solid ${({ theme }) => theme.red1};
  }
`;

export function ButtonConfirmed({
  confirmed,
  $altDisabledStyle,
  ...rest
}: { confirmed?: boolean; $altDisabledStyle?: boolean } & ButtonProps) {
  if (confirmed) {
    return <ButtonConfirmedStyle {...rest} />;
  } else {
    return <ButtonPrimary {...rest} $altDisabledStyle={$altDisabledStyle} />;
  }
}

export function ButtonError({
  $error,
  ...rest
}: { $error?: boolean } & ButtonProps & {
    padding?: string | undefined;
    width?: string | undefined;
    $borderRadius?: string | undefined;
    $altDisabledStyle?: boolean | undefined;
  }) {
  if ($error) {
    return <ButtonErrorStyle {...rest} />;
  } else {
    return <ButtonPrimary {...rest} />;
  }
}

export function ButtonDropdown({
  disabled = false,
  children,
  ...rest
}: { disabled?: boolean } & ButtonProps & {
    padding?: string;
    width?: string;
    $borderRadius?: string;
    $altDisabledStyle?: boolean;
  }) {
  return (
    <ButtonPrimary {...rest} disabled={disabled}>
      <RowBetween>
        <div style={{ display: "flex", alignItems: "center" }}>{children}</div>
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonPrimary>
  );
}

export function ButtonDropdownGrey({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonGray {...rest} disabled={disabled} style={{ borderRadius: "20px" }}>
      <RowBetween>
        <div style={{ display: "flex", alignItems: "center" }}>{children}</div>
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonGray>
  );
}

interface ButtonDropdownLightProps extends ButtonProps {
  disabled?: boolean;
  padding?: string;
  width?: string;
  $borderRadius?: string;
  $altDisabledStyle?: boolean;
}

export const ButtonDropdownLight = forwardRef<HTMLButtonElement, ButtonDropdownLightProps>(
  ({ disabled = false, children, ...rest }, ref) => {
    return (
      <ButtonGhost ref={ref} {...rest} disabled={disabled}>
        <RowBetween>
          <div style={{ display: "flex", alignItems: "center" }}>{children}</div>
          <ChevronDown size={24} />
        </RowBetween>
      </ButtonGhost>
    );
  },
);

export function ButtonRadio({ active, ...rest }: { active?: boolean } & ButtonProps) {
  if (!active) {
    return <ButtonWhite {...rest} />;
  } else {
    return <ButtonPrimary {...rest} />;
  }
}

export function ConnectKitLightButton({
  ...props
}: ButtonProps & {
  padding?: string | undefined;
  width?: string | undefined;
  $borderRadius?: string | undefined;
  $altDisabledStyle?: boolean | undefined;
}) {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <>
            {isConnected ? (
              <ConnectedButtonBorderGradient>
                <ConnectedButton onClick={show} {...props}>
                  {ensName ?? truncatedAddress}
                </ConnectedButton>
              </ConnectedButtonBorderGradient>
            ) : (
              <WalletBtnGradientWrapper>
                <WalletBtnGradient className="btn-gradient" />
                <WalletBtnWrapper>
                  <DisconnectedButton onClick={show} {...props}>
                    Connect Wallet
                  </DisconnectedButton>
                </WalletBtnWrapper>
              </WalletBtnGradientWrapper>
            )}
          </>
        );
      }}
    </ConnectKitButton.Custom>
  );
}
