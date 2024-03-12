import { Box, CardProps, Text } from "rebass";
import styled from "styled-components";

const Card = styled(Box)<{
  width?: string;
  padding?: string;
  border?: string;
  borderRadius?: string;
}>`
  width: ${({ width }) => width ?? "100%"};
  border-radius: 16px;
  padding: 1.25rem;
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
`;
export default Card;

export const LightCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: ${({ theme }) => theme.bg1};
`;

export const LightGreyCard = styled(Card)`
  background-color: ${({ theme }) => theme.bg2};
`;

export const GreyCard = styled(Card)`
  background-color: ${({ theme }) => theme.bg3};
`;

export const OutlineCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.bg3};
`;

export const YellowCard = styled(Card)`
  background-color: rgba(243, 132, 30, 0.05);
  color: ${({ theme }) => theme.yellow2};
  font-weight: 500;
`;

export const PinkCard = styled(Card)`
  background-color: rgba(255, 0, 122, 0.03);
  color: ${({ theme }) => theme.primary1};
  font-weight: 500;
`;

const TipCardStyled = styled(Card)`
  background-color: ${({ theme }) => theme.primary5};
  // background: ${({ theme }) => `1px solid ${theme.greyGradient10}`};
  border-radius: 10px;
  width: fit-content;
`;

export const TipCard = ({ children, ...rest }: CardProps) => {
  return (
    <TipCardStyled {...rest}>
      <Text color="white" fontWeight={500}>
        {children}
      </Text>
    </TipCardStyled>
  );
};
