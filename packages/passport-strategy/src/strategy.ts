/**
 * Module dependencies.
 */
const passport = require("passport-strategy");

export class MembershipStrategy extends passport.Strategy {
  public name = "membership-strategy";
  public verify: any;

  constructor(verify) {
    if (!verify) {
      throw new TypeError("MembershipStrategy requires a verify callback");
    }
    super();
    this.verify = verify;
  }

  authenticate(req, options) {
    const verified = (err, user, info) => {
      if (err) {
        return this.error(err);
      }
      if (!user) {
        return this.fail(info);
      }
      this.success(user, info);
    };

    try {
      if (this.verify.length === 3) {
        this.verify(req, options, verified);
      } else {
        this.verify(req, verified);
      }
    } catch (ex) {
      return this.error(ex);
    }
  }
}
