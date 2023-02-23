import type { AppProps } from "next/app";
import { MembershipProvider } from "ui";
import {Layout} from "../components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MembershipProvider>
      <Layout>
          <Component {...pageProps} />
      </Layout>
    </MembershipProvider>
  );
}
