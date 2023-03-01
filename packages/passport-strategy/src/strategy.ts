const passport = require("passport-strategy");
import {
  FlowNetwork,
  FlowSignature,
  MembershipService,
} from "@membership/client";

export type MembershipStrategyConfig = {
  network: FlowNetwork;
  adminAddress: string;
  membershipDefinitionId: string;
};

export class MembershipStrategy extends passport.Strategy {
  public name = "membership-strategy";
  private membershipService: MembershipService;
  private config: MembershipStrategyConfig;

  constructor(config: MembershipStrategyConfig) {
    super();
    this.config = config;
    this.membershipService = new MembershipService({
      network: config.network,
    });
  }

  authenticate(req, options) {
    const { message, signature } = req.query ?? {};

    if (!message) {
      return this.error("Message not present in request body");
    }

    if (!signature) {
      return this.error("Signature not present in request body");
    }

    return this.verifySignature(message, signature);
  }

  private verifySignature(message: string, signature: string) {
    let parsedSignatures: FlowSignature[];
    try {
      parsedSignatures = JSON.parse(signature);
    } catch (e) {
      return this.error("Invalid signature format");
    }

    this.membershipService
      .isValidSignature(message, parsedSignatures)
      .then((isValid) => {
        if (!isValid) {
          this.fail("Invalid signature");
        } else {
          this.verifyMembership(parsedSignatures);
        }
      })
      .catch((error) => {
        this.error(error);
      });
  }

  private verifyMembership(parsedSignatures: FlowSignature[]) {
    this.membershipService
      .getMembershipInstancesByAccount(parsedSignatures[0].addr)
      .then((memberships) => {
        const targetMembership = memberships.find(
          (membership) =>
            membership.membershipDefinitionId ===
            this.config.membershipDefinitionId
        );
        if (!targetMembership) {
          return this.fail("Membership not found");
        }
        const isExpired =
          +targetMembership.validUntilTimestamp < Date.now() / 1000;
        if (isExpired) {
          return this.fail("Membership expired");
        }
        this.success(targetMembership);
      })
      .catch((error) => {
        this.error(error);
      });
  }
}
