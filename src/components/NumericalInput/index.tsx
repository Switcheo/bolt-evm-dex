import React from "react";
import styled, { css } from "styled-components";
import { escapeRegExp } from "../../utils/regex";

type InputProps = {
  $error?: boolean;
  $fontSize?: string;
  $align?: "right" | "left";
} & Omit<React.HTMLProps<HTMLInputElement>, "ref" | "onChange" | "as">;

const StyledInput = styled.input<InputProps>`
  ${({ $error, theme }) => css`
    color: ${$error ? theme.red1 : theme.text1};
    background-color: transparent;
    ::placeholder {
      color: ${theme.text4};
    }
  `}
  width: 0;
  position: relative;
  font-weight: 500;
  border: none;
  flex: 1 1 auto;
  font-size: ${({ $fontSize }) => $fontSize ?? "24px"};
  text-align: ${({ $align }) => $align};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0;
  appearance: textfield;
  outline: none;

  ::-webkit-search-decoration,
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    appearance: none;
  }
`;

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`);

export const NumericalInput = React.memo(function NumericalInput({
  value,
  onUserInput,
  placeholder = "0.0",
  ...rest
}: InputProps & { value: string | number; onUserInput: (input: string) => void }) {
  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === "" || inputRegex.test(escapeRegExp(nextUserInput))) {
      onUserInput(nextUserInput);
    }
  };

  return (
    <StyledInput
      {...rest}
      value={value}
      onChange={(event) => {
        enforcer(event.target.value.replace(/,/g, "."));
      }}
      inputMode="decimal"
      title="Token Amount"
      autoComplete="off"
      autoCorrect="off"
      type="text"
      pattern="^[0-9]*[.,]?[0-9]*$"
      placeholder={placeholder}
      minLength={1}
      maxLength={79}
      spellCheck="false"
    />
  );
});

export default NumericalInput;
