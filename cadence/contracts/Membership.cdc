import "ExampleRequirementClaim"
import FungibleToken from 0xee82856bf20e2aa6

pub contract Membership {
    // TODO: Implement NonFungibleToken interface
    // TODO: add `isValid` function that checks if membership isn't expired

    pub struct RequirementHook {
        // TODO: Add `fungibleAmount` parameter
        // TODO: Add `nonFungibleAmount` parameter?
        pub let contractName: String
        pub let contractAddress: Address

        init(contractName: String, contractAddress: Address) {
            self.contractName = contractName
            self.contractAddress = contractAddress
        }
    }

    pub resource Definition {
        pub var name: String
        pub var requirements: [RequirementHook]
        // TODO: Add duration param (membership expires after duration)

        init(name: String, requirements: [RequirementHook]) {
            self.name = name
            self.requirements = requirements
        }
    }

    pub fun defineMembership(name: String, requirements: [RequirementHook]): @Definition {
        return <- create Definition(name: name, requirements: requirements)
    }

    pub fun claimMembership(adminAddress: Address, claimerAddress: Address, claimerVault: @FungibleToken.Vault?) {
        // For now just use example membership claim directly
        // Later we will retrieve the membership definition from `adminAccount` storage
        // and call `claimRequirement` on membership claim contracts
        ExampleRequirementClaim.claimRequirement(claimerAddress: claimerAddress, claimerVault: <- claimerVault)
    }
}