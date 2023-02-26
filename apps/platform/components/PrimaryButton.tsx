import { ButtonHTMLAttributes, ReactChildren } from "react";
import styled from "styled-components";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactChildren | string | (string | number)[];
  isLoading?: boolean;
};

// TODO: merge PrimaryLink & PrimaryButton into a single button component
export function PrimaryButton({ isLoading, children, color, ...props }: Props) {
  // if (color === 'green') {
  //   props['background-color'] = var(--main-dark-color);
  // }

    let StyledButton = Container;
  if (color === 'green') {

      StyledButton = styled(Container)`
        background-color: var(--green-color);
      `;
  }

  return (
    <StyledButton {...props}>
      {/* TODO: replace with a proper loader animation */}
      {isLoading ? "Loading..." : children}
    </StyledButton>
  );
}

const Container = styled.button`
  background-color: var(--main-dark-color);
  max-width: 250px;
  max-height: 49px;
  padding: 1.2rem 37px;
  border-radius: 33px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
  text-align: center;
  border: none;
  cursor: pointer;
`;
