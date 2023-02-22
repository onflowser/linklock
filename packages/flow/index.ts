// @ts-ignore missing Cadence type declarations
import claimMembership from "./cadence/transactions/claimMembership.cdc";
// @ts-ignore missing Cadence type declarations
import defineMembership from "./cadence/transactions/defineMembership.cdc";
// @ts-ignore missing Cadence type declarations
import getFlowBalance from "./cadence/scripts/getFlowBalance.cdc";
// @ts-ignore missing Cadence type declarations
import getMembershipDefinition from "./cadence/scripts/getMembershipDefinition.cdc";

export type CadenceTransactions = {
  claimMembership: string;
  defineMembership: string;
};

export type CadenceScripts = {
  getFlowBalance: string;
  getMembershipDefinition: string;
};

export const transactions: CadenceTransactions = {
  claimMembership,
  defineMembership,
};

export const scripts: CadenceScripts = {
  getFlowBalance,
  getMembershipDefinition,
};
