import FungibleToken from 0xee82856bf20e2aa6
pub contract interface Requirement {
    // TODO: Add metadata fields (e.g. which token is the requirement)

    pub fun claimRequirement(
        claimerAddress: Address, 
        price: UFix64,
        claimerVault: @FungibleToken.Vault
    )
}