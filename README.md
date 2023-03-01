![image](https://user-images.githubusercontent.com/36109955/221982604-055a23ad-2e00-4e0d-ab31-b28e4fb95f95.png)

> Built at Flow 2023 Hackathon: https://devfolio.co/projects/linklock-2686

## What's it about?

Flow ecosystem lacks community tools and infrastructure. If you want to create a membership program with your own set of requirements for members (e.g. must pay a certain price, must own X and Y NFTs, must join our Discord server,...) it's currently not possible to do that without building your own solution from scratch.

LinkLock tries to solve that problem, by enabling communities and individuals to create membership programs (in form of membership NFTs), define a set of membership requirements (which can be extended by implementing your own smart contract "plugin"), and distribute them to their audience/users. We also support membership content gating/authorization functionality out of the box.

## Usage

> Note: This is not a stable version, but instead a MVP. The APIs could change.


### JavaScript client

#### Initialization

```typescript
import { MembershipService } from "@membership/client";

const membershipService = new MembershipService({
  network: "testnet",
});
```

#### Creating memberships

Before distributing your memberships to your users, you first need to create a membership program.

```typescript
const membership = await membershipService.createMembership({
  name: "My membership",
  description: "This is my first membership.",
  // Number of memberships that can be claimed by users.
  maxSupply: "2",
  // Expiration in days
  expirationInterval: "1000000",
  thumbnail: "https://example.com/my-thumbnail.png",
  requirement: {
    // Price in fungible tokens used in requirement contract
    price: "1.0",
    // Contract that implements Flow token requirement.
    // (requires use to pay certain FLOW amount to become a member)
    contractName: "FlowRequirement",
    // Deployment address of requirement contract.
    // (this is the testnet address of FlowRequirement contract)
    contractAddress: "0x",
  },
});

// ID of the membership (aka. membership definition ID)
console.log(membership.id)
```

### Authorization with Passport.js

We created a Passport.js authentication strategy to allow easy membership checks on the backend.

> Note: This is not yet available on NPM as a library.

```typescript
import { MembershipStrategy, buildAuthHandlerUrl } from "@membership/passport";

// The membership NFT ID 
const membershipDefinitionId = "6";
// The address of account that created a membership
const adminAddress = "0xde4a0b425de4053e";
// Points to the below endpoint (on local development instance)
const callbackUrl = `http://localhost:3004/callback`;

const membershipStrategy = new MembershipStrategy({
  network: "testnet",
  membershipDefinitionId,
  adminAddress,
});

passport.use(membershipStrategy);

// ...

app.get("/login", (req, res) => {
  res.redirect(
    buildAuthHandlerUrl({
      adminAddress,
      membershipDefinitionId,
      callbackUrl,
    })
  );
});

app.get(
  "/callback",
  passport.authenticate(membershipStrategy.name, { failureRedirect: "/login" }),
  function (req, res) {
    res.send("You are a valid member!")
  }
);
```
