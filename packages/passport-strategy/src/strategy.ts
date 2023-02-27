const passport = require("passport-strategy");
import { FlowNetwork, FlowSignature, MembershipService } from "@membership/client";

export type MembershipStrategyConfig = {
  network: FlowNetwork;
};

export class MembershipStrategy extends passport.Strategy {
  public name = "membership-strategy";
  private membershipService: MembershipService;

  constructor(config: MembershipStrategyConfig) {
    super();
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

    let parsedSignatures: FlowSignature[];
    try {
      parsedSignatures = JSON.parse(signature);
    } catch (e) {
      return this.error("Invalid signature format");
    }

    this.membershipService
      .isValidSignature(message, parsedSignatures)
      .then((isValid) => {
        if (isValid) {
          // TODO: Validate that user is a member
          const user = { id: "0x1" };
          this.success(user);
        } else {
          this.fail("Invalid signature");
        }
      })
      .catch((error) => {
        this.error(error);
      });
  }
}
