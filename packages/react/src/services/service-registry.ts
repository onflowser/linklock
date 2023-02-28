// @ts-ignore missing fcl typescript declarations
import * as fcl from "@onflow/fcl";
import {
  FlowNetwork,
  getAccessNodeApi,
  getDiscoveryWallet,
  MembershipService,
} from "@membership/client";
import { DomainsService } from "@membership/domains";

export class ServiceRegistry {
  private static instance: ServiceRegistry;
  public membershipService!: MembershipService;
  public domainService!: DomainsService;

  static create() {
    if (!this.instance) {
      this.instance = new ServiceRegistry();
      this.instance.init();
    }
    return this.instance;
  }

  private init() {
    const network: FlowNetwork = "testnet";

    fcl.config({
      "app.detail.title": "LinkLock",
      "flow.network": network,
      "app.detail.icon": "https://i.ibb.co/8Kv2wDd/linklock-logo-1.png",
      "accessNode.api": getAccessNodeApi(network),
      "discovery.wallet": getDiscoveryWallet(network),
    });

    this.membershipService = new MembershipService({
      network,
    });

    this.domainService = new DomainsService();
  }
}
