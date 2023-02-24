import Link from "next/link";
import { AnchorHTMLAttributes } from "react";
import styled from "styled-components";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

const RoundButtonLink = styled.a`
  background: ${(props) => props.theme.colors.primary} 0% 0% no-repeat
    padding-box;
  border-radius: 10rem;
  opacity: 1;

  text-decoration: none;
  color: ${(props) => props.theme.colors.white};
  display: block;

  padding: 0.8rem 1.8rem;
  font-weight: bold;
  white-space: nowrap;
`;

// TODO: merge PrimaryLink & PrimaryButton into a single button component
export default function RoundLink({ href, ...props }: Props) {
  return (
    <Link href={href} passHref>
      <RoundButtonLink {...props} />
    </Link>
  );
}
