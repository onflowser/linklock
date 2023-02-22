// @ts-ignore Cadence type declarations
import claimMembership from "./cadence/transactions/claimMembership.cdc";
// @ts-ignore Cadence type declarations
import defineMembership from "./cadence/transactions/defineMembership.cdc";

export type CadenceTransactions = {
  claimMembership: string;
  defineMembership: string;
};

export const transactions: CadenceTransactions = {
  claimMembership,
  defineMembership,
};
