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
};

const FlowContext = React.createContext<FlowState>({} as FlowState);

const flowService = FlowService.create();

export function FlowProvider(props: FlowProviderProps) {
  const [fclUser, setFclUser] = useState<FclCurrentUser | undefined>();
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
    flowService.subscribeCurrentUser(setFclUser);
  }, []);

  return (
    <FlowContext.Provider value={{ currentUser }}>
      {props.children}
    </FlowContext.Provider>
  );
}

export function useFlow() {
  return useContext(FlowContext);
}
