import FungibleToken from 0xee82856bf20e2aa6

pub contract interface RequirementClaim {
    // TODO: Add metadata fields (e.g. which token is the requirement)

    // `sentVault` is non-nill in case the requirement includes 
    // paying the admin a certain amount of fungible tokens
    pub fun claimRequirement(
        claimerAddress: Address, 
        claimerVault: @FungibleToken.Vault?
    ): Bool
}