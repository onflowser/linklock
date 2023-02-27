/**
 * Module dependencies.
 */
const passport = require("passport-strategy");
const util = require("util");

/**
 * `Strategy` constructor.
 *
 * @api public
 */
function Strategy(verify) {
  if (!verify) {
    throw new TypeError("MembershipStrategy requires a verify callback");
  }
  passport.Strategy.call(this);
  this.name = "membership-strategy";
  this._verify = verify;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on the contents of a form submission.
 * @param {Object} req HTTP request object.
 * @api protected
 */
Strategy.prototype.authenticate = function (req, options) {
  let self = this;

  function verified(err, user, info) {
    if (err) {
      return self.error(err);
    }
    if (!user) {
      return self.fail(info);
    }
    self.success(user, info);
  }

  try {
    if (this._verify.length === 3) {
      this._verify(req, options, verified);
    } else {
      this._verify(req, verified);
    }
  } catch (ex) {
    return self.error(ex);
  }
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
