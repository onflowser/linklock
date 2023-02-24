import Link from "next/link";
import styled from "styled-components";
import { ProfileDropdown } from "../ProfileDropdown";
import { Footer } from "../Footer";

export default function LoginLayout({ children }: any) {
  return (
    <>
      <Navigation>
        <Link href="/">
          <img src="./images/logo-BMFT-vertical.svg" alt="" />
        </Link>
        <ProfileDropdown style={{ position: "absolute", right: 50 }} />
      </Navigation>
      {children}
      <Footer />
    </>
  );
}

const Navigation = styled.nav`
  background-color: #fff;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;

  & > img {
    max-width: 150px;
    width: 100%;
  }
`;
