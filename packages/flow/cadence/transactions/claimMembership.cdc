import Membership from 0xf3fcd2c1a78f5eee
import FungibleToken from 0xee82856bf20e2aa6
import FlowToken from 0x0ae53cb6e3f42a79

// TODO: Provide requirements via params
transaction() {
    let signer: AuthAccount
    // The Vault resource that holds the tokens that are being transferred
    let claimerVault: @FungibleToken.Vault

    prepare(signer: AuthAccount) {
        // TODO: Expose as param
        let amount: UFix64 = 1.0 // Set this to 1.0 to pass test requirement

        self.signer = signer

         // Get a reference to the signer's stored vault
        let vaultRef = signer.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault)
			?? panic("Could not borrow reference to the owner's Vault!")

        // Withdraw tokens from the signer's stored vault
        self.claimerVault <- vaultRef.withdraw(amount: amount)
    }

    pre {}

    execute {
        let membership <- Membership.claimMembership(
            adminAddress: 0xf8d6e0586b0a20c7,
            claimerAddress: self.signer.address,
            claimerVault: <- self.claimerVault
        )

        self.signer.save(<- membership, to: /storage/member)
        self.signer.link<&Membership.Member>(/public/member, target: /storage/member)
    }

    post {}
}
