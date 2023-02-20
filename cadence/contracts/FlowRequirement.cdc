import "Requirement"
import FungibleToken from 0xee82856bf20e2aa6
import FlowToken from 0x0ae53cb6e3f42a79

pub contract FlowRequirement: Requirement {
    // Requirement params
    pub let requiredAmount: UFix64

    init() {
        // TODO: This should be defined on `RequirementHook` struct instead (and passed as param)
        self.requiredAmount = 1.0
    }

    pub fun claimRequirement(claimerAddress: Address, claimerVault: @FungibleToken.Vault?): Bool {
        pre {
            claimerVault?.balance == self.requiredAmount: "Balance must be equal to the required requiredAmount"
        }
        // Admin address, predefined for now
        let to: Address = 0xe03daebed8ca0615

        // Validate vault type (otherwise actor could sent any kind of fungible token)
        let vault <- claimerVault as! @FlowToken.Vault?

        // Get a reference to the recipient's Receiver
        let receiverRef =  getAccount(to)
            .getCapability(/public/flowTokenReceiver)
            .borrow<&{FungibleToken.Receiver}>()
			?? panic("Could not borrow receiver reference to the recipient's Vault")

        // Deposit the withdrawn tokens in the recipient's receiver
        receiverRef.deposit(from: <-vault!)

        // Should we return true/false or just panic / not panic instead?
        return true
    }
}