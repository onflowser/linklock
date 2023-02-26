// @ts-ignore missing Cadence type declarations
import claimMembership from "./cadence/transactions/claimMembership.cdc";
// @ts-ignore missing Cadence type declarations
import createMembership from "./cadence/transactions/createMembership.cdc";
// @ts-ignore missing Cadence type declarations
import setupMembershipCollection from "./cadence/transactions/setupMembershipCollection.cdc";
// @ts-ignore missing Cadence type declarations
import setupMembershipDefinitionCollection from "./cadence/transactions/setupMembershipDefinitionCollection.cdc";
// @ts-ignore missing Cadence type declarations
import getFlowTokenBalance from "./cadence/scripts/getFlowTokenBalance.cdc";
// @ts-ignore missing Cadence type declarations
import getMembershipDefinitionsByAdmin from "./cadence/scripts/getMembershipDefinitionsByAdmin.cdc";
// @ts-ignore missing Cadence type declarations
import getMembershipsByAccount from "./cadence/scripts/getMembershipsByAccount.cdc";

export type CadenceTransactions = {
  claimMembership: string;
  createMembership: string;
  setupMembershipCollection: string;
  setupMembershipDefinitionCollection: string;
};

export type CadenceScripts = {
  getFlowTokenBalance: string;
  getMembershipsByAccount: string;
  getMembershipDefinitionsByAdmin: string;
};

export type MembershipNFT = {
  uuid: string;
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  adminAddress: string;
  membershipDefinitionId: string;
  metadata: Record<string, unknown>;
  // Membership expiration UNIX timestamp.
  validUntilTimestamp: string;
};

export type MembershipRequirement = {
  price: string;
  contractName: string;
  contractAddress: string;
};

export type MembershipDefinition = {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  maxSupply: string;
  // Expiration interval in seconds
  expirationInterval: string;
  requirement: MembershipRequirement;
};

export const transactions: CadenceTransactions = {
  claimMembership,
  createMembership,
  setupMembershipCollection,
  setupMembershipDefinitionCollection,
};

export const scripts: CadenceScripts = {
  getFlowTokenBalance,
  getMembershipsByAccount,
  getMembershipDefinitionsByAdmin,
};
