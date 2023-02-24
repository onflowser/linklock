import Link from "next/link";
import { ProfileDropdown } from "./ProfileDropdown";
import { PrimaryButton } from "./PrimaryButton";
import styled from "styled-components";
import { useFcl } from "../common/user-context";
import { theme } from "../common/theme";

export function Navigation() {
  const { login, logout, isLoggingIn, isLoggingOut, isLoggedIn } = useFcl();

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
              <ProfileDropdown style={{ marginRight: 20 }} />
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
