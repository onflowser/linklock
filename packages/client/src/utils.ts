export type FlowNetwork = "local" | "mainnet" | "testnet";

export function getAccessNodeApi(env: FlowNetwork) {
  switch (env) {
    case "mainnet":
      return "https://rest-mainnet.onflow.org"; // TODO: this is probably not a correct address
    case "testnet":
      return "https://rest-testnet.onflow.org";
    case "local":
    default:
      return "http://localhost:8888";
  }
}

export function getDiscoveryWallet(env: FlowNetwork) {
  switch (env) {
    case "mainnet":
    case "testnet":
      return "https://fcl-discovery.onflow.org/testnet/authn";
    case "local":
      return "http://localhost:8701/fcl/authn";
  }
}
