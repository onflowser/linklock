import passport from "passport";
import express from "express";
import passportMembership from "@membership/passport";
const MembershipStrategy = passportMembership.Strategy;

const app = express();
const port = 3004;

app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
// app.use(passport.session());

const exampleUser = {
  id: "0x1",
};

passport.use(
  new MembershipStrategy(function (req, callback) {
    const isValid = false;
    // Do your custom user finding logic here, or set to false based on req object
    callback(null, isValid ? exampleUser : false);
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  // Custom logic for finding user
  done(null, exampleUser);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post(
  "/login",
  passport.authenticate("membership-strategy", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/protected");
  }
);

app.get("/protected", (req, res) => {
  res.send("Hello Member!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
