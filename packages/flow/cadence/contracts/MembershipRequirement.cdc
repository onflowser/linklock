import FungibleToken from 0xee82856bf20e2aa6

pub contract interface MembershipRequirement {
    // TODO: Add metadata fields (e.g. which token is the requirement)

    pub fun claimRequirement(
        claimerAddress: Address,
        adminAddress: Address,
        expectedPrice: UFix64,
        claimerVault: @FungibleToken.Vault
    )
}
