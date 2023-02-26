import Membership from 0xf3fcd2c1a78f5eee
import FungibleToken from 0xee82856bf20e2aa6
import NonFungibleToken from 0xf8d6e0586b0a20c7

transaction(
    membershipId: UInt64,
    paymentAmount: UFix64,
    fungibleTokenStoragePath: String
) {
    let signer: AuthAccount

    /// Reference to the receiver's collection
    let claimerCollectionRef: &{NonFungibleToken.CollectionPublic}

    // The Vault resource that holds the tokens that are being transferred
    let claimerVault: @FungibleToken.Vault

    prepare(signer: AuthAccount) {
        self.signer = signer

         // Get a reference to the signer's stored vault
        let vaultRef = signer.borrow<&FungibleToken.Vault>(
            from: StoragePath(identifier: fungibleTokenStoragePath)!
        ) ?? panic("Could not borrow reference to the owner's Vault!")

        // Withdraw tokens from the signer's stored vault
        self.claimerVault <- vaultRef.withdraw(amount: paymentAmount)

        self.claimerCollectionRef = getAccount(signer.address)
            .getCapability(Membership.CollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not get claimer reference to the membership NFT Collection")
    }

    pre {}

    execute {
        let membership <- self.claimerCollectionRef.withdraw(withdrawID: membershipId)
        let renewedMembership <- Membership.redeemMembership(
            membership: <- membership
            claimerAddress: self.signer.address,
            claimerVault: <- self.claimerVault
        )

        self.claimerCollectionRef.deposit(token: <- renewedMembership)
    }

    post {}
}
