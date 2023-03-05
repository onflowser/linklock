import Image from "next/image";
import bmft_logo_ver from "../public/images/logos/logo-no-text.svg";
import Link from "next/link";
import styled from "styled-components";

export function Footer() {
  return (
    <Container>
      <FooterImageWrapper>
        <Image alt="Logo" src={bmft_logo_ver} fill sizes="100vw" />
      </FooterImageWrapper>
      <FooterText>
        Supportify is built by{" "}
        <Link href={"https://github.com/onflowser"} passHref target="_blank">
          Flowser team
        </Link>
      </FooterText>
    </Container>
  );
}

const Container = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.colors.secondary};
  padding: ${({ theme }) => theme.gutter.xl};
  color: ${({ theme }) => theme.colors.white};
  padding: 6rem 0;
`;

const FooterImageWrapper = styled.div`
  margin-bottom: 2em;
  height: 5rem;
  width: 10rem;
  position: relative;
`;

const FooterText = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 21px;
  //padding: 2rem;
  text-align: center;

  color: ${({ theme }) => theme.colors.white};
`;
