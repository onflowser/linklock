import "MembershipRequirement"
import FungibleToken from 0xee82856bf20e2aa6

pub contract MembershipProtocol {
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

    pub resource MembershipDefinition {
        pub var name: String
        // Expiration interval in milliseconds
        pub var expirationInterval: UFix64
        pub var requirement: RequirementDefinition

        init(name: String, expirationInterval: UFix64, requirement: RequirementDefinition) {
            self.name = name
            self.expirationInterval = expirationInterval
            self.requirement = requirement
        }
    }

    // TODO: This resource should implement NFT interface
    // TODO: Should we name this `Membership` instead?
    pub resource Membership {
        pub var validUntilTimestamp: UFix64

        init(validUntilTimestamp: UFix64) {
            self.validUntilTimestamp = validUntilTimestamp
        }

        pub fun isValid(): Bool {
            let currentTimestamp = getCurrentBlock().timestamp
            return self.validUntilTimestamp < currentTimestamp
        }
    }

    pub fun defineMembership(
        name: String,
        expirationInterval: UFix64,
        requirement: RequirementDefinition
    ): @MembershipDefinition {
        return <- create MembershipDefinition(
            name: name,
            expirationInterval: expirationInterval,
            requirement: requirement
        )
    }

    pub fun claimMembership(
        adminAddress: Address,
        claimerAddress: Address,
        claimerVault: @FungibleToken.Vault
    ): @Membership {
        // For now just use example membership claim directly
        // Later we will retrieve the membership definition from `adminAccount` storage
        // and call `claimRequirement` on membership claim contracts
        let adminAccount = getAccount(adminAddress)

        let definition = adminAccount.getCapability(/public/membership)
            .borrow<&MembershipDefinition>()
			?? panic("Could not borrow reference to membership definition")

        let requirementAddress = getAccount(definition.requirement.contractAddress)

        let requirementContract = requirementAddress.contracts.borrow<&MembershipRequirement>(
            name: definition.requirement.contractName
        )!
        requirementContract.claimRequirement(
            claimerAddress: claimerAddress,
            adminAddress: adminAddress,
            expectedPrice: definition.requirement.price,
            claimerVault: <- claimerVault
        )

        let currentTimestamp = getCurrentBlock().timestamp
        return <- create Membership(
            validUntilTimestamp: currentTimestamp + definition.expirationInterval
        )
    }
}
