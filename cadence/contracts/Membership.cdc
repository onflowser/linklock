import "FlowRequirement"
import FungibleToken from 0xee82856bf20e2aa6

pub contract Membership {
    // TODO: Implement NonFungibleToken interface
    // TODO: add `isValid` function that checks if membership isn't expired

    pub struct RequirementDefinition {
        pub let price: UFix64
        pub let contractName: String
        pub let contractAddress: Address

        init(price: UFix64, contractName: String, contractAddress: Address) {
            self.price = price
            self.contractName = contractName
            self.contractAddress = contractAddress
        }
    }

    pub resource Definition {
        pub var name: String
        // Expiration interval in milliseconds
        pub var expirationInterval: Int 
        pub var requirement: RequirementDefinition

        init(name: String, expirationInterval: Int, requirement: RequirementDefinition) {
            self.name = name
            self.expirationInterval = expirationInterval
            self.requirement = requirement
        }
    }

    pub fun defineMembership(name: String, expirationInterval: Int, requirement: RequirementDefinition): @Definition {
        return <- create Definition(
            name: name, 
            expirationInterval: expirationInterval, 
            requirement: requirement
        )
    }

    pub fun claimMembership(adminAddress: Address, claimerAddress: Address, claimerVault: @FungibleToken.Vault) {
        // For now just use example membership claim directly
        // Later we will retrieve the membership definition from `adminAccount` storage
        // and call `claimRequirement` on membership claim contracts
        FlowRequirement.claimRequirement(claimerAddress: claimerAddress, claimerVault: <- claimerVault)
    }
}