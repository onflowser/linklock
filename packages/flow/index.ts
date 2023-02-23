// @ts-ignore missing Cadence type declarations
import claimMembership from "./cadence/transactions/claimMembership.cdc";
// @ts-ignore missing Cadence type declarations
import defineMembership from "./cadence/transactions/defineMembership.cdc";
// @ts-ignore missing Cadence type declarations
import getFlowTokenBalance from "./cadence/scripts/getFlowTokenBalance.cdc";
// @ts-ignore missing Cadence type declarations
import getMembershipDefinition from "./cadence/scripts/getMembershipDefinition.cdc";
// @ts-ignore missing Cadence type declarations
import getMembershipNft from "./cadence/scripts/getMembershipNft.cdc";

export type CadenceTransactions = {
  claimMembership: string;
  defineMembership: string;
};

export type CadenceScripts = {
  getFlowTokenBalance: string;
  getMembershipDefinition: string;
  getMembershipNft: string;
};

export type Membership = {
  uuid: string;
  validUntilTimestamp: string;
};

export type MembershipRequirement = {
  price: string;
  contractName: string;
  contractAddress: string;
};

export type MembershipDefinition = {
  name: string;
  expirationInterval: string;
  requirement: MembershipRequirement;
};

export const transactions: CadenceTransactions = {
  claimMembership,
  defineMembership,
};

export const scripts: CadenceScripts = {
  getFlowTokenBalance,
  getMembershipDefinition,
  getMembershipNft,
};
