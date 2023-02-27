import FungibleToken from 0xee82856bf20e2aa6

pub contract interface MembershipRequirement {
    /// Path to the fungible token vault used in this requirement check.
    pub let fungibleTokenPath: PublicPath?

    // TODO: Pass claim requirement props to generate dynamic description
    /// Human-friendly description of this requirement logic.
    pub fun getDescription(): String {
        post {
            result.length > 10: "Description must be longer than 10 characters"
        }
    }

    // TODO: Pass requirement struct instead of individual values?
    pub fun claimRequirement(
        claimerAddress: Address,
        adminAddress: Address,
        expectedPrice: UFix64,
        claimerVault: @FungibleToken.Vault
    )
}
