// @ts-ignore missing Cadence type declarations
import claimMembership from "./cadence/transactions/claimMembership.cdc";
// @ts-ignore missing Cadence type declarations
import defineMembership from "./cadence/transactions/defineMembership.cdc";
// @ts-ignore missing Cadence type declarations
import getFlowBalance from "./cadence/scripts/getFlowBalance.cdc";

export type CadenceTransactions = {
  claimMembership: string;
  defineMembership: string;
};

export type CadenceScripts = {
  getFlowBalance: string;
};

export const transactions: CadenceTransactions = {
  claimMembership,
  defineMembership,
};

export const scripts: CadenceScripts = {
  getFlowBalance,
};
