// @ts-ignore missing Cadence type declarations
import claimMembership from "./cadence/transactions/claimMembership.cdc";
// @ts-ignore missing Cadence type declarations
import defineMembership from "./cadence/transactions/defineMembership.cdc";
// @ts-ignore missing Cadence type declarations
import setupAccount from "./cadence/transactions/setupAccount.cdc";
// @ts-ignore missing Cadence type declarations
import getFlowTokenBalance from "./cadence/scripts/getFlowTokenBalance.cdc";
// @ts-ignore missing Cadence type declarations
import getMembershipDefinition from "./cadence/scripts/getMembershipDefinition.cdc";
// @ts-ignore missing Cadence type declarations
import getMembershipNFTs from "./cadence/scripts/getMembershipNFTs.cdc";

export type CadenceTransactions = {
  claimMembership: string;
  defineMembership: string;
  setupAccount: string;
};

export type CadenceScripts = {
  getFlowTokenBalance: string;
  getMembershipDefinition: string;
  getMembershipNFTs: string;
};

export type MembershipNFT = {
  uuid: string;
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  adminAddress: string;
  metadata: Record<string, unknown>;
  validUntilTimestamp: string;
};

export type MembershipRequirement = {
  price: string;
  contractName: string;
  contractAddress: string;
};

export type MembershipDefinition = {
  name: string;
  description: string;
  thumbnail: string;
  maxSupply: number;
  expirationInterval: string;
  requirement: MembershipRequirement;
};

export const transactions: CadenceTransactions = {
  claimMembership,
  defineMembership,
  setupAccount,
};

export const scripts: CadenceScripts = {
  getFlowTokenBalance,
  getMembershipDefinition,
  getMembershipNFTs,
};
