import styled from "styled-components";

const ToggleElement = styled.span<{ $isActive?: boolean; $isOnSwitch?: boolean }>`
  padding: 0.35rem 0.6rem;
  border-radius: 6px;
  background: ${({ theme, $isActive, $isOnSwitch }) =>
    $isActive ? ($isOnSwitch ? theme.primaryGradient : theme.text4) : "none"};
  color: ${({ theme, $isActive, $isOnSwitch }) =>
    $isActive ? ($isOnSwitch ? theme.white : theme.text3) : theme.text2};
  font-size: 1rem;
  font-weight: ${({ $isOnSwitch }) => ($isOnSwitch ? "500" : "400")};
  &:hover {
    user-select: ${({ $isOnSwitch }) => ($isOnSwitch ? "none" : "initial")};
    box-shadow: ${({ $isOnSwitch, $isActive }) => $isActive && $isOnSwitch && "0 0 6px #1FC8FD"};
    background: ${({ theme, $isActive, $isOnSwitch }) =>
      $isActive ? ($isOnSwitch ? theme.primaryGradient : theme.text3) : "none"};
    color: ${({ theme, $isActive }) => ($isActive ? theme.white : theme.text3)};
  }
`;

const StyledToggle = styled.button<{ $isActive?: boolean; activeElement?: boolean }>`
  border-radius: 6px;
  border: none;
  background: ${({ theme }) => theme.bg3};
  display: flex;
  width: fit-content;
  cursor: pointer;
  outline: none;
  padding: 0;
`;

export interface ToggleProps {
  id?: string;
  $isActive: boolean;
  toggle: () => void;
}

export default function Toggle({ id, $isActive, toggle }: ToggleProps) {
  return (
    <StyledToggle id={id} $isActive={$isActive} onClick={toggle}>
      <ToggleElement $isActive={$isActive} $isOnSwitch={true}>
        ON
      </ToggleElement>
      <ToggleElement $isActive={!$isActive} $isOnSwitch={false}>
        OFF
      </ToggleElement>
    </StyledToggle>
  );
}
