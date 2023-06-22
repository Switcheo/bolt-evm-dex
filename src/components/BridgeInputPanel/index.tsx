import { darken } from "polished";
import { useCallback, useState } from "react";
import styled, { useTheme } from "styled-components";
import { Address, useAccount, useBalance, useNetwork } from "wagmi";
import { ReactComponent as DropDown } from "../../assets/images/dropdown.svg";
import { TYPE } from "../../theme";
import { BridgeableToken } from "../../utils/entities/bridgeableToken";
import { Token } from "../../utils/entities/token";
import NumericalInput from "../NumericalInput";
import { RowBetween } from "../Row";
import BridgeCurrencyModal from "./BridgeCurrencyModal";

const InputPanel = styled.div<{ $hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ $hideInput }) => ($hideInput ? "8px" : "20px")};
  background-color: ${({ theme }) => theme.bg2};
  z-index: 1;
`;

const Container = styled.div<{ $hideInput: boolean }>`
  border-radius: ${({ $hideInput }) => ($hideInput ? "8px" : "20px")};
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: ${({ theme }) => theme.bg1};
`;

const StyledTokenName = styled.span<{ $active?: boolean }>`
  ${({ $active }) => ($active ? "  margin: 0 0.25rem 0 0.75rem;" : "  margin: 0 0.25rem 0 0.25rem;")}
  font-size:  ${({ $active }) => ($active ? "20px" : "16px")};
`;

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  &.span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`;

const InputRow = styled.div<{ $selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ $selected }) => ($selected ? "0.75rem 0.5rem 0.75rem 1rem" : "0.75rem 0.75rem 0.75rem 1rem")};
`;

const CurrencySelect = styled.button<{ $selected: boolean }>`
  align-items: center;
  height: 2.2rem;
  font-size: 20px;
  font-weight: 500;
  background-color: ${({ $selected, theme }) => ($selected ? theme.bg1 : theme.primary1)};
  color: ${({ $selected, theme }) => ($selected ? theme.text1 : theme.white)};
  border-radius: 12px;
  box-shadow: ${({ $selected }) => ($selected ? "none" : "0px 6px 10px rgba(0, 0, 0, 0.075)")};
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;

  &:focus,
  &:hover {
    background-color: ${({ $selected, theme }) => ($selected ? theme.bg2 : darken(0.05, theme.primary1))};
  }
`;

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledDropDown = styled(DropDown)<{ $selected: boolean }>`
  margin: 0 0.25rem 0 0.5rem;
  height: 35%;

  &.path {
    stroke: ${({ $selected, theme }) => ($selected ? theme.text1 : theme.white)};
    stroke-width: 1.5px;
  }
`;

const StyledBalanceMax = styled.button`
  height: 28px;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: 0.5rem;
  font-size: 0.875rem;

  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.primaryText1};
  &:hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  &:focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`;

interface BridgeInputPanelProps {
  value: string;
  showMaxButton: boolean;
  id: string;
  hideBalance?: boolean;
  customBalanceText?: string;
  label?: string;
  currency?: BridgeableToken | null;
  onUserInput: (value: string) => void;
  onCurrencySelect?: (currency: BridgeableToken) => void;
  onMax?: () => void;
}

const BridgeInputPanel = ({
  value,
  showMaxButton,
  id,
  hideBalance = false,
  customBalanceText,
  label = "Input",
  currency,
  onUserInput,
  onCurrencySelect,
  onMax,
}: BridgeInputPanelProps) => {
  const theme = useTheme();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const {
    data: selectedCurrencyBalance,
    isError,
    isLoading,
  } = useBalance({
    address,
    chainId: chain?.id,
    token: currency?.address as Address,
  });

  // State
  const [modalOpen, setModalOpen] = useState(false);

  // Handlers
  const handleDismissSearch = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);

  return (
    <InputPanel id={id}>
      <Container $hideInput={false}>
        <LabelRow>
          <RowBetween>
            <TYPE.body color={theme?.text2} fontWeight={500} fontSize={14}>
              {label}
            </TYPE.body>
            {address && (
              <TYPE.body
                onClick={onMax}
                color={theme?.text2}
                fontWeight={500}
                fontSize={14}
                style={{ display: "inline", cursor: "pointer" }}
              >
                {!hideBalance && !!currency && selectedCurrencyBalance && !isError && !isLoading
                  ? (customBalanceText ?? "Balance: ") + selectedCurrencyBalance.formatted
                  : " -"}
              </TYPE.body>
            )}
          </RowBetween>
        </LabelRow>
        <InputRow $selected={false}>
          <>
            <NumericalInput
              className="token-amount-input"
              value={value}
              onUserInput={(val) => {
                onUserInput(val);
              }}
            />
            {address && currency && showMaxButton && <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax>}
          </>
          <CurrencySelect
            $selected={!!currency}
            className="open-currency-select-button"
            onClick={() => {
              setModalOpen(true);
            }}
          >
            <Aligner>
              <StyledTokenName className="token-symbol-container" $active={Boolean(currency && currency.symbol)}>
                {(currency && currency.symbol && currency.symbol.length > 20
                  ? currency.symbol.slice(0, 4) +
                    "..." +
                    currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                  : currency?.symbol) || "Select Token"}
              </StyledTokenName>
              <StyledDropDown $selected={!!currency} />
            </Aligner>
          </CurrencySelect>
        </InputRow>
      </Container>
      {onCurrencySelect && (
        <BridgeCurrencyModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
        />
      )}
    </InputPanel>
  );
};

export default BridgeInputPanel;
