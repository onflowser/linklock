import "MembershipRequirement"
import FungibleToken from "./standard/FungibleToken.cdc"
import FlowToken from "./standard/FlowToken.cdc"

pub contract FlowRequirement: MembershipRequirement {
    pub let fungibleTokenPath: PublicPath?

    pub fun getDescription(): String {
        return "Transfers provided FLOW token amount to community admin."
    }

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
        let receiverRef = getAccount(adminAddress)
            .getCapability(self.fungibleTokenPath!)
            .borrow<&{FungibleToken.Receiver}>()
			?? panic("Could not borrow receiver reference to the recipient's Vault")

        // Deposit the withdrawn tokens in the recipient's receiver
        receiverRef.deposit(from: <-(vault as! @FungibleToken.Vault))
    }

    init() {
        self.fungibleTokenPath = PublicPath(identifier: "flowTokenReceiver")
    }
}
