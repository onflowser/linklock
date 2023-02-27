import React from "react";
import { FlowProvider } from "./flow.provider";
import { Toaster } from "react-hot-toast";

export type MembershipProviderProps = {
  children: React.ReactNode;
};

// Root provider that should be exposed to 3rd party consumers
export function MembershipProvider(props: MembershipProviderProps) {
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <FlowProvider>{props.children}</FlowProvider>
    </div>
  );
}
