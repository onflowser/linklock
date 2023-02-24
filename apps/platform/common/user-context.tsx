import React, { ReactChild, useContext, useEffect, useState } from "react";

// @ts-ignore
import * as fcl from "@onflow/fcl";
// @ts-ignore
import * as t from "@onflow/types";

// cadence files
// @ts-ignore
import getFlowBalanceCode from "../../../../../flowtea/cadence/scripts/get-flow-balance.cdc";
// @ts-ignore
import getAddressCode from "../../../../../flowtea/cadence/scripts/get-address.cdc";
// @ts-ignore
import getHandleCode from "../../../../../flowtea/cadence/scripts/get-handle.cdc";
// @ts-ignore
import getInfoCode from "../../../../../flowtea/cadence/scripts/get-info.cdc";
// @ts-ignore
import donateFlowCode from "../../../../../flowtea/cadence/transactions/donate.cdc";
// @ts-ignore
import registerFlowCode from "../../../../../flowtea/cadence/transactions/register.cdc";
// @ts-ignore
import updateFlowCode from "../../../../../flowtea/cadence/transactions/update.cdc";
import {
  FlowTeaInfo,
  getAddress,
  getFlowBalance,
  getHandle,
  getInfo,
} from "./fcl-service";
import useSWR, { KeyedMutator } from "swr";
import { config } from "./config";

type TxResult = { transactionId: string; status: any };

type FclContextProps = {
  user: null | FlowUser;
  info: null | undefined | FlowTeaInfo;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isLoadingUserInfo: boolean;
  isLoggedIn: boolean | undefined;
  isSendingDonation: boolean;
  isRegistered: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAddress: (handle: string) => Promise<null | string>;
  getHandle: (address: string) => Promise<null | string>;
  isHandleAvailable: (handle: string) => Promise<boolean>;
  fetchCurrentUserInfo: KeyedMutator<FlowTeaInfo | null>;
  getInfo: (address: string) => Promise<FlowTeaInfo | null>;
  donateFlow: (
    message: string,
    amount: number,
    recurring: boolean,
    receiverAddress: string
  ) => Promise<TxResult>;
  getFlowBalance: (address: string) => Promise<number>;
  register: (
    handle: string,
    name: string,
    websiteUrl: string,
    description: string
  ) => Promise<TxResult>;
  update: (
    name: string,
    websiteUrl: string,
    description: string
  ) => Promise<TxResult>;
  updateEmail: (email: string) => Promise<void>;
};

const defaultTxResult = { transactionId: "", status: "" };

export type FlowUser = {
  addr: string;
  cid: string;
  expiresAt: null;
  f_type: "USER";
  f_vsn: string;
  loggedIn: true;
  services: any[];
};

const defaultValue: FclContextProps = {
  user: null,
  info: null,
  isLoadingUserInfo: true,
  isLoggingIn: false,
  isLoggingOut: false,
  isLoggedIn: false,
  isRegistered: false,
  isSendingDonation: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  getAddress: () => Promise.resolve(null),
  getHandle: () => Promise.resolve(null),
  isHandleAvailable: () => Promise.resolve(false),
  fetchCurrentUserInfo: () => Promise.resolve(null),
  getInfo: () => Promise.resolve(null),
  donateFlow: () => Promise.resolve(defaultTxResult),
  getFlowBalance: () => Promise.resolve(0),
  register: () => Promise.resolve(defaultTxResult),
  update: () => Promise.resolve(defaultTxResult),
  updateEmail: () => Promise.resolve(),
};

const UserContext = React.createContext(defaultValue);

export function FclProvider({ children }: { children: ReactChild }) {
  const [user, setUser] = useState<FlowUser | null>(null);
  const { data: info, mutate: fetchCurrentUserInfo } =
    useSWR<FlowTeaInfo | null>(`info/${user?.addr}`, () =>
      user?.addr ? getInfo(user?.addr) : null
    );
  const [isLoggingIn, setLoggingIn] = useState(false);
  const [isLoggingOut, setLoggingOut] = useState(false);
  const [isSendingDonation, setIsSendingDonation] = useState(false);

  useEffect(() => fcl.currentUser().subscribe(setUser), []);

  useEffect(() => {
    if (user?.addr) {
      fetchCurrentUserInfo();
    }
  }, [user]);

  async function isHandleAvailable(handle: string) {
    return getAddress(handle)
      .then(() => false)
      .catch((e) =>
        e.toString().match("Handle not found") ? true : Promise.reject(e)
      );
  }

  async function register(
    handle: string,
    name: string,
    websiteUrl: string,
    description: string
  ) {
    return sendTransaction(registerFlowCode, [
      fcl.arg(handle, t.String),
      fcl.arg(name, t.String),
      fcl.arg(websiteUrl, t.String),
      fcl.arg(description, t.String),
    ]);
  }

  async function signMessage(message: string) {
    const signedMsg = Buffer.from(message).toString("hex");
    return await fcl.currentUser.signUserMessage(signedMsg);
  }

  async function updateEmail(email: string) {
    const signature = await signMessage(email);
    const response = await fetch(config.apiHost + "/users/email", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, signature }),
    });
    if (response.status != 200) {
      const data = await response.json();
      throw new Error(data.message);
    }
  }

  async function update(name: string, websiteUrl: string, description: string) {
    return sendTransaction(updateFlowCode, [
      fcl.arg(name, t.String),
      fcl.arg(websiteUrl, t.String),
      fcl.arg(description, t.String),
    ]);
  }

  async function donateFlow(
    message: string,
    amount: number,
    recurring: boolean,
    receiverAddress: string
  ) {
    try {
      setIsSendingDonation(true);
      return await sendTransaction(donateFlowCode, [
        fcl.arg(message, t.String),
        fcl.arg(`${Math.round(amount)}.0`, t.UFix64),
        fcl.arg(recurring, t.Bool),
        fcl.arg(receiverAddress, t.Address),
      ]);
    } finally {
      setIsSendingDonation(false);
    }
  }

  async function sendTransaction(cadence: string, args: any[]) {
    const transactionId = await fcl.mutate({
      cadence,
      args: () => args,
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 100,
    });

    return {
      transactionId,
      status: await fcl.tx(transactionId).onceSealed(),
    };
  }

  async function logout() {
    setLoggingOut(true);
    try {
      await fcl.unauthenticate();
    } finally {
      setLoggingOut(false);
    }
  }

  async function login() {
    setLoggingIn(true);
    try {
      return await fcl.authenticate();
    } finally {
      setLoggingIn(false);
    }
  }

  return (
    <UserContext.Provider
      value={{
        getFlowBalance,
        donateFlow,
        login,
        logout,
        update,
        updateEmail,
        register,
        getInfo,
        getAddress,
        getHandle,
        isHandleAvailable,
        fetchCurrentUserInfo,
        user,
        info,
        isSendingDonation,
        isLoadingUserInfo: info == undefined,
        isRegistered: Boolean(info),
        isLoggedIn: user?.loggedIn,
        isLoggingIn,
        isLoggingOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useFcl() {
  return useContext(UserContext);
}
