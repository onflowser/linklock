import FungibleToken from "./standard/FungibleToken.cdc"

pub contract interface Requirement {
    // TODO: Add metadata fields (e.g. which token is the requirement)

    pub fun claimRequirement(
        claimerAddress: Address,
        adminAddress: Address,
        expectedPrice: UFix64,
        claimerVault: @FungibleToken.Vault
    )
}