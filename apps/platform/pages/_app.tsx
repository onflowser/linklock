import type { AppProps } from "next/app";
import React from "react";
import { ThemeProvider } from "styled-components";
import DefaultLayout from "../components/layouts/MainLayout";
import { GlobalStyle } from "../components/GlobalStyles";
import { Toaster } from "react-hot-toast";
import { theme } from "../common/theme";
import { SWRConfig } from "swr";
import Head from "next/head";
import { config } from "../common/config";
import { MembershipProvider } from "@membership/client";

function App({ Component, pageProps }: AppProps) {
  // @ts-ignore
  const Layout = Component.Layout || DefaultLayout;

  return (
    <>
      <Head>
        <title>Buy me a Flow tea</title>
      </Head>
      <Toaster />
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <SWRConfig
          value={{
            refreshInterval: 3000,
            fetcher: (resource, init) =>
              fetch(config.apiHost + resource, init).then((res) => res.json()),
          }}
        >
          <MembershipProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </MembershipProvider>
        </SWRConfig>
      </ThemeProvider>
    </>
  );
}

export default App;
