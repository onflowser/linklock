// @ts-ignore missing fcl typescript declarations
import * as fcl from "@onflow/fcl";
// @ts-ignore missing fcl typescript declarations
import * as type from "@onflow/types";
import { AppEnvironment, getConfig } from "../utils";
import { transactions, scripts } from "@membership/flow";

export type FclCurrentUser = { addr: string };

export class FlowService {
  private static instance: FlowService;

  static create() {
    if (!this.instance) {
      this.instance = new FlowService();
      this.instance.init();
    }
    return this.instance;
  }

  public init() {
    const { environment } = getConfig();
    fcl.config({
      "app.detail.title": "Membership protocol", // TODO: Change name
      env: this.getFlowEnv(environment),
      "app.detail.icon": "", // TODO: Add path to icon
      "accessNode.api": this.getAccessNodeApi(environment),
      "discovery.wallet": this.getDiscoveryWallet(environment),

      "0xFungibleToken": this.getFungibleTokenAddress(environment),
      "0xFlowToken": this.getFlowTokenAddress(environment),
    });
  }

  public authenticate(): Promise<FclCurrentUser> {
    return fcl.authenticate();
  }

  public unauthenticate(): Promise<void> {
    return fcl.unauthenticate();
  }

  public subscribeCurrentUser(onChanged: (user: FclCurrentUser) => void) {
    fcl.currentUser.subscribe(onChanged);
  }

  public async getFlowBalance(address: string): Promise<number> {
    return fcl
      .send([
        fcl.script(scripts.getFlowBalance),
        fcl.args([fcl.arg(address, type.Address)]),
      ])
      .then(fcl.decode)
      .then(Number);
  }

  private async sendTransaction(cadence: string, args: any[]) {
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

  private getFlowTokenAddress(env: AppEnvironment) {
    // https://developers.flow.com/flow/core-contracts/flow-token
    switch (env) {
      case "production":
        return "0x1654653399040a61";
      case "staging":
        return "0x7e60df042a9c0868";
      case "development":
        return "0x0ae53cb6e3f42a79";
    }
  }

  private getFungibleTokenAddress(env: AppEnvironment) {
    // https://docs.onflow.org/core-contracts/fungible-token
    switch (env) {
      case "production":
        return "0xf233dcee88fe0abe";
      case "staging":
        return "0x9a0766d93b6608b7";
      case "development":
        return "0xee82856bf20e2aa6";
    }
  }

  private getAccessNodeApi(env: AppEnvironment) {
    switch (env) {
      case "production":
        return "https://rest-mainnet.onflow.org/v1"; // TODO: this is probably not a correct address
      case "staging":
        return "https://access-testnet.onflow.org";
      case "development":
      default:
        return "http://localhost:8888";
    }
  }

  private getDiscoveryWallet(env: AppEnvironment) {
    switch (env) {
      case "production":
      case "staging":
        return "https://fcl-discovery.onflow.org/testnet/authn";
      case "development":
        return "http://localhost:8701/fcl/authn";
    }
  }

  private getFlowEnv(env: AppEnvironment) {
    switch (env) {
      case "production":
        return "mainnet";
      case "staging":
        return "testnet";
      case "development":
        return "local";
    }
  }
}