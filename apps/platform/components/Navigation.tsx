import Link from "next/link";
import { PrimaryButton } from "./PrimaryButton";
import styled from "styled-components";
import { theme } from "../common/theme";
import {
  UnstyledButton,
  useFlow,
  useGetDomainNameInfo,
} from "@membership/client";
import { Avatar } from "./Avatar";
import { useRouter } from "next/router";
import { handleQueryParamKey } from "../common/utils";

export function Navigation() {
  const router = useRouter();
  const domainOrAddress = router.query[handleQueryParamKey] as string;
  const { data: domainInfo } = useGetDomainNameInfo(domainOrAddress);
  const { login, logout, isLoggingIn, isLoggingOut, isLoggedIn, currentUser } =
    useFlow();

  return (
    <Container>
      <Content>
        <Link href="/">
          <img
            style={{ height: "100%" }}
            src="/images/logos/logo-horizontal.svg"
            alt=""
          />
        </Link>
        <NavigationRightButtons>
          {isLoggedIn ? (
            <>
              <UnstyledButton
                title="Go to your profile"
                onClick={() => router.push(`/${currentUser?.address}`)}
              >
                <Avatar size={50} address={currentUser?.address} imageUrl={domainInfo?.avatar} />
              </UnstyledButton>
              <PrimaryButton isLoading={isLoggingOut} onClick={() => logout()}>
                Logout
              </PrimaryButton>
            </>
          ) : (
            <>
              <PrimaryButton isLoading={isLoggingIn} onClick={() => login()}>
                Login with Wallet
              </PrimaryButton>
            </>
          )}
        </NavigationRightButtons>
      </Content>
    </Container>
  );
}

const Container = styled.nav`
  padding: 20px;
  background: ${theme.colors.white};

  .nav-profile-content {
    max-width: 1360px;
    width: 99%;
    margin: 0 auto;
    height: 100px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const Content = styled.div`
  max-width: 1360px;
  margin: 0 auto;
  height: ${theme.layout.navbar_height};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavigationRightButtons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: end;
`;
