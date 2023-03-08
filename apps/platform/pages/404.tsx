import { useRouter } from "next/router";
import styled from "styled-components";
import { SizedBox } from "@membership/react";

export default function Custom404() {
  const router = useRouter();
  const isAccountNotFound =
    router.asPath.split("/").filter(Boolean).length === 1;

  return (
    <Container>
      <img src="/images/oops.svg" />
      <SizedBox height={20} />
      {isAccountNotFound ? (
        <>
          <h1>Couldn&apos;t find this account. </h1>
          <p>Maybe try a different address or domain name (.find or FlowNS)?</p>
        </>
      ) : (
        <h1>Page not found</h1>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
`;

const Title = styled.h1``;
