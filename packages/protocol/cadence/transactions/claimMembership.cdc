import Membership from 0xMembership
import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken

transaction(
    adminAddress: Address,
    membershipDefinitionId: UInt64,
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
        let membership <- Membership.claimMembership(
            adminAddress: adminAddress,
            membershipDefinitionId: membershipDefinitionId,
            claimerAddress: self.signer.address,
            claimerVault: <- self.claimerVault
        )

        self.claimerCollectionRef.deposit(token: <- membership)
    }

    post {}
}
