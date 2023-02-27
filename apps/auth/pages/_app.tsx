import type { AppProps } from "next/app";
import { MembershipProvider } from "@membership/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MembershipProvider>
      <Component {...pageProps} />
    </MembershipProvider>
  );
}
