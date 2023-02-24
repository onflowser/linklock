// @ts-ignore
import * as fcl from "@onflow/fcl";
// @ts-ignore
import * as t from "@onflow/types";
import { config, AppEnvironment, getDomain } from "./config";

export type FlowTeaInfo = {
  name: string;
  websiteUrl: string;
  description: string;
};

fcl.config({
  "app.detail.title": "FlowTea",
  env: getFlowEnv(config.environment),
  "app.detail.icon": getIconUrl(),
  "accessNode.api": getAccessNodeApi(config.environment),
  "discovery.wallet": getDiscoveryWallet(config.environment),
  "0xFungibleToken": getFungibleTokenAddress(config.environment),
  "0xFlowTea": config.flow.deploymentAccountAddress,
});

function getAccessNodeApi(env: AppEnvironment) {
  switch (env) {
    case "production":
      return "https://rest-mainnet.onflow.org/v1"; // TODO: this is probably not a correct address
    case "staging":
      return "https://access-testnet.onflow.org";
    case "development":
    default:
      return "http://localhost:8080";
  }
}

function getDiscoveryWallet(env: AppEnvironment) {
  switch (env) {
    case "production":
    case "staging":
      return "https://fcl-discovery.onflow.org/testnet/authn";
    case "development":
      return "http://localhost:8701/fcl/authn";
  }
}

function getFungibleTokenAddress(env: AppEnvironment) {
  // https://docs.onflow.org/core-contracts/fungible-token/
  switch (env) {
    case "production":
      return "0xf233dcee88fe0abe";
    case "staging":
      return "0x9a0766d93b6608b7";
    case "development":
      return "0xee82856bf20e2aa6";
  }
}

function getFlowEnv(env: AppEnvironment) {
  switch (env) {
    case "production":
      return "mainnet";
    case "staging":
      return "testnet";
    case "development":
      return "local";
  }
}

function getIconUrl() {
  const path = "/images/logo-BMFT-no-text.svg";
  return getDomain() + path;
}

export function isAddress(userId: string | undefined) {
  return userId?.startsWith("0x");
}
