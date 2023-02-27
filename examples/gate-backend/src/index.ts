import passport from "passport";
import express from "express";
import { MembershipStrategy } from "@membership/passport";

const app = express();
const port = 3004;

app.use(require("cookie-parser")());
app.use(require("body-parser").json());
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

const membershipStrategy = new MembershipStrategy({
  network: "local",
});

passport.use(membershipStrategy);

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
  passport.authenticate(membershipStrategy.name, { failureRedirect: "/login" }),
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
