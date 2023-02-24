import React from "react";
import { FlowProvider } from "./flow.provider";

export type MembershipProviderProps = {
  children: React.ReactNode;
};

// Root provider that should be exposed to 3rd party consumers
export function MembershipProvider(props: MembershipProviderProps) {
  return <FlowProvider>{props.children}</FlowProvider>;
}
