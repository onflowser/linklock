import NonFungibleToken from 0xf8d6e0586b0a20c7
import FungibleToken from 0xee82856bf20e2aa6
import MetadataViews from 0xf8d6e0586b0a20c7
import Membership from 0xf3fcd2c1a78f5eee

/// This transaction is what an account would run
/// to set itself up to receive NFTs
transaction {

    prepare(signer: AuthAccount) {
        // Return early if the account already has a collection
        if signer.borrow<&Membership.Collection>(from: Membership.CollectionStoragePath) != nil {
            log("Collection is already setup")
            return
        }

        // Create a new empty collection
        let collection <- Membership.createEmptyCollection()

        // save it to the account
        signer.save(<-collection, to: Membership.CollectionStoragePath)

        // create a public capability for the collection
        signer.link<&{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(
            Membership.CollectionPublicPath,
            target: Membership.CollectionStoragePath
        )
    }
}
