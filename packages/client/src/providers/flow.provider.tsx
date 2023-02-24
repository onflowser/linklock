import React, { useContext, useEffect, useMemo, useState } from "react";
import { FclCurrentUser, FlowService } from "../services/flow.service";
import { useFlowBalance } from "../hooks/cache";

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
};

const FlowContext = React.createContext<FlowState>({} as FlowState);

const flowService = FlowService.create();

export function FlowProvider(props: FlowProviderProps) {
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
          raw: fclUser
        }
        : undefined,
    [fclUser, flowBalance]
  );

  useEffect(() => {
    flowService.subscribeCurrentUser(setFclUser);
  }, []);

  async function login() {

  }

  async function logout() {

  }

  return (
    <FlowContext.Provider value={{ login, logout, currentUser, isLoggedIn: Boolean(currentUser), isLoggingIn, isLoggingOut }}>
      {props.children}
    </FlowContext.Provider>
  );
}

export function useFlow() {
  return useContext(FlowContext);
}
