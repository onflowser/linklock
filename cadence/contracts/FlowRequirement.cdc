import Requirement from "./Requirement.cdc"
import FungibleToken from "./standard/FungibleToken.cdc"
import FlowToken from "./standard/FlowToken.cdc"

pub contract FlowRequirement: Requirement {

    pub fun claimRequirement(
        claimerAddress: Address,
        adminAddress: Address,
        expectedPrice: UFix64,
        claimerVault: @FungibleToken.Vault
    ) {
        pre {
            claimerVault.balance == expectedPrice: "Balance must be equal to the required requiredAmount"
        }

        // Validate vault type (otherwise actor could sent any kind of fungible token)
        let vault <- claimerVault as! @FlowToken.Vault

        // Get a reference to the recipient's Receiver
        let receiverRef =  getAccount(adminAddress)
            .getCapability(/public/flowTokenReceiver)
            .borrow<&{FungibleToken.Receiver}>()
			?? panic("Could not borrow receiver reference to the recipient's Vault")

        // Deposit the withdrawn tokens in the recipient's receiver
        receiverRef.deposit(from: <-vault)
    }
}