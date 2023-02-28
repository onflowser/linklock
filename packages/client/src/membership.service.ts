// @ts-ignore missing fcl typescript declarations
import * as fcl from "@onflow/fcl";
// @ts-ignore missing fcl typescript declarations
import * as type from "@onflow/types";
import {
  MembershipDefinition,
  MembershipInstance,
  transactions,
  scripts,
} from "@membership/protocol";
import { FlowNetwork, getAccessNodeApi } from "./utils";

export type ClaimMembershipOptions = {
  adminAddress: string;
  membershipDefinitionId: string;
  paymentAmount: string;
  fungibleTokenStoragePath: string;
};

export type RedeemMembershipOptions = {
  membershipId: string;
  paymentAmount: string;
  fungibleTokenStoragePath: string;
};

export type FlowSignature = {
  addr: string;
  f_type: string;
  f_vsn: string;
  keyId: number;
  signature: string;
};

export type TransactionError = {
  // Human friendly error message.
  message: string;
  // Raw Cadence error stack trace.
  raw: string;
};

export type TransactionResult = {
  transactionId: string;
  error: null | TransactionError;
};

export type MembershipServiceConfig = {
  network: FlowNetwork;
};

export class MembershipService {
  constructor(config: MembershipServiceConfig) {
    const { network } = config;
    console.log("Configuring for", network);
    fcl.config({
      "flow.network": network,
      "accessNode.api": getAccessNodeApi(network),
      "0xMembershipRequirement": this.getDefaultContractAddress(network),
      "0xFlowRequirement": this.getDefaultContractAddress(network),
      "0xMembership": this.getDefaultContractAddress(network),
      "0xMembershipDefinition": this.getDefaultContractAddress(network),
      "0xFungibleToken": this.getFungibleTokenAddress(network),
      "0xNonFungibleToken": this.getNftContractAddress(network),
      "0xMetadataViews": this.getMetadataContractAddress(network),
      "0xFlowToken": this.getFlowTokenAddress(network),
    });
  }

  public async signMessage(message: string) {
    const signedMsg = Buffer.from(message).toString("hex");
    return await fcl.currentUser.signUserMessage(signedMsg);
  }

  public async isValidSignature(
    message: string,
    signatures: FlowSignature[]
  ): Promise<boolean> {
    // TODO: Does this work?
    // Refer to: https://developers.flow.com/tools/fcl-js/reference/proving-authentication
    return await fcl.AppUtils.verifyUserSignatures(
      Buffer.from(message).toString("hex"),
      signatures
    );
  }

  // TODO: Can we setup and claim membership in a single transaction?
  // See how this is done at .find:
  // https://github.com/findonflow/find/blob/main/transactions/createProfile.cdc
  public async setupMembershipCollection() {
    return this.sendTransaction({
      cadence: transactions.setupMembershipCollection,
    });
  }

  public async setupMembershipDefinitionCollection() {
    return this.sendTransaction({
      cadence: transactions.setupMembershipDefinitionCollection,
    });
  }

  public async claimMembership(
    options: ClaimMembershipOptions
  ): Promise<unknown> {
    return this.sendTransaction({
      cadence: transactions.claimMembership,
      args: (arg: any, t: any) => [
        arg(options.adminAddress, t.Address),
        arg(Number(options.membershipDefinitionId), t.UInt64),
        arg(Number(options.paymentAmount).toFixed(1), t.UFix64),
        arg(options.fungibleTokenStoragePath, t.String),
      ],
    });
  }

  public async redeemMembership(
    options: RedeemMembershipOptions
  ): Promise<unknown> {
    return this.sendTransaction({
      cadence: transactions.redeemMembership,
      args: (arg: any, t: any) => [
        arg(Number(options.membershipId), t.UInt64),
        arg(Number(options.paymentAmount).toFixed(1), t.UFix64),
        arg(options.fungibleTokenStoragePath, t.String),
      ],
    });
  }

  public async createMembership(
    definition: Omit<MembershipDefinition, "id">
  ): Promise<unknown> {
    return this.sendTransaction({
      cadence: transactions.createMembership,
      args: (arg: any, t: any) => [
        arg(definition.name, t.String),
        arg(definition.description, t.String),
        arg(definition.thumbnail, t.String),
        arg(Number(definition.expirationInterval).toFixed(1), t.UFix64),
        arg(Number(definition.maxSupply), t.UInt64),
        arg(Number(definition.requirement.price).toFixed(1), t.UFix64),
        arg(definition.requirement.contractName, t.String),
        arg(definition.requirement.contractAddress, t.Address),
      ],
    });
  }

  public async getFlowBalance(address: string): Promise<number> {
    return fcl
      .send([
        fcl.script(scripts.getFlowTokenBalance),
        fcl.args([fcl.arg(address, type.Address)]),
      ])
      .then(fcl.decode)
      .then(Number);
  }

  public async getMembershipInstancesByAccount(
    address: string
  ): Promise<MembershipInstance[]> {
    return fcl
      .send([
        fcl.script(scripts.getMembershipsByAccount),
        fcl.args([fcl.arg(address, type.Address)]),
      ])
      .then(fcl.decode);
  }

  public async getMembershipDefinitionsByAdmin(
    adminAddress: string
  ): Promise<MembershipDefinition[]> {
    return fcl
      .send([
        fcl.script(scripts.getMembershipDefinitionsByAdmin),
        fcl.args([fcl.arg(adminAddress, type.Address)]),
      ])
      .then(fcl.decode);
  }

  private async sendTransaction(
    options: Record<string, unknown>
  ): Promise<TransactionResult> {
    const transactionId = await fcl.mutate({
      proposer: fcl.currentUser,
      payer: fcl.currentUser,
      authorizations: [fcl.currentUser],
      limit: 100,
      ...options,
    });
    try {
      await fcl.tx(transactionId).onceSealed();
      return {
        transactionId,
        error: null,
      };
    } catch (rawError) {
      return Promise.reject({
        transactionId,
        error: {
          message: this.getHumanFriendlyError(String(rawError)),
          raw: String(rawError),
        },
      });
    }
  }

  // Extracts a human friendly error message from raw Cadence error stack trace.
  private getHumanFriendlyError(rawCadenceError: string) {
    // TODO: Improve this logic and extract it into helper library for reuse
    // EXAMPLE RAW CADENCE ERROR:
    // execution error code 1101: [Error Code: 1101] error caused by: 1 error occurred:
    // 	* transaction execute failed: [Error Code: 1101] cadence runtime error: Execution failed:
    //   --> 354b095525c8fbdb6bb5ee5d28d701ef7afb81ca770cff1c1874841e897db595:39:26
    //    |
    // 39 |         let membership <- Membership.claimMembership(
    //    |                           ^
    //
    // error: panic: Max membership supply reached
    //    --> f3fcd2c1a78f5eee.Membership:325:12
    //     |
    // 325 |             panic("Max membership supply reached")
    //     |             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    const errorLines = rawCadenceError.split("\n");

    const rawPanicError = errorLines.find((line) => line.includes("panic"));
    const rawError = errorLines.find((line) => line.includes("error"));

    const unFormattedMessage =
      rawPanicError || rawError || "Smart contract threw an error";

    return unFormattedMessage.replace(/error|panic|:/g, "");
  }

  private getFlowTokenAddress(network: FlowNetwork) {
    // https://developers.flow.com/flow/core-contracts/flow-token
    switch (network) {
      case "mainnet":
        return "0x1654653399040a61";
      case "testnet":
        return "0x7e60df042a9c0868";
      case "local":
        return "0x0ae53cb6e3f42a79";
    }
  }

  private getFungibleTokenAddress(network: FlowNetwork) {
    // https://docs.onflow.org/core-contracts/fungible-token
    switch (network) {
      case "mainnet":
        return "0xf233dcee88fe0abe";
      case "testnet":
        return "0x9a0766d93b6608b7";
      case "local":
        return "0xee82856bf20e2aa6";
    }
  }

  private getNftContractAddress(network: FlowNetwork) {
    switch (network) {
      case "local":
        return "0x120e725050340cab";
      case "testnet":
        return "0x631e88ae7f1d7c20";
      default:
        throw new Error(`Network ${network} not yet supported`);
    }
  }

  private getMetadataContractAddress(network: FlowNetwork) {
    switch (network) {
      case "local":
        return "0x120e725050340cab";
      case "testnet":
        return "0x631e88ae7f1d7c20";
      default:
        throw new Error(`Network ${network} not yet supported`);
    }
  }

  private getDefaultContractAddress(network: FlowNetwork) {
    switch (network) {
      case "local":
        return "0xe03daebed8ca0615";
      case "testnet":
        return "0x358daba93d60587b";
      default:
        throw new Error(`Network ${network} not yet supported`);
    }
  }
}
