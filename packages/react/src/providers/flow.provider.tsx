import React, { useContext, useEffect, useMemo, useState } from "react";
import { ServiceRegistry } from "../services/service-registry";
import { useFlowBalance } from "../hooks/cache";
// @ts-ignore missing fcl typescript declarations
import * as fcl from "@onflow/fcl";

export type FclCurrentUser = { addr: string };

export type FlowProviderProps = {
  children: React.ReactNode;
};

export type CurrentUserInfo = {
  address: string;
  flowBalance?: number;
  raw: FclCurrentUser;
};

export type FlowState = {
  currentUser: CurrentUserInfo | undefined;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isLoggedIn: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAccountOwnershipProof: () => any;
};

const FlowContext = React.createContext<FlowState>({} as FlowState);

export function FlowProvider(props: FlowProviderProps) {
  const {membershipService} = ServiceRegistry.create();
  const [fclUser, setFclUser] = useState<FclCurrentUser | undefined>();
  // TODO: Implement these states
  const [isLoggingIn, setLoggingIn] = useState(false);
  const [isLoggingOut, setLoggingOut] = useState(false);
  const { data: flowBalance, error } = useFlowBalance(fclUser?.addr);
  const currentUser = useMemo<CurrentUserInfo | undefined>(
    () =>
      fclUser?.addr
        ? {
            address: fclUser.addr,
            flowBalance,
            raw: fclUser,
          }
        : undefined,
    [fclUser, flowBalance]
  );

  useEffect(() => {
    fcl.currentUser.subscribe(setFclUser);
  }, []);

  async function login() {
    await fcl.authenticate();
  }

  async function logout() {
    await fcl.unauthenticate();
  }

  async function getAccountOwnershipProof() {
    const message = "Authenticate to membership protocol"
    const signature = await membershipService.signMessage(message)
    return {message, signature}
  }

  return (
    <FlowContext.Provider
      value={{
        getAccountOwnershipProof,
        login,
        logout,
        currentUser,
        isLoggedIn: Boolean(currentUser),
        isLoggingIn,
        isLoggingOut,
      }}
    >
      {props.children}
    </FlowContext.Provider>
  );
}

export function useFlow() {
  return useContext(FlowContext);
}
