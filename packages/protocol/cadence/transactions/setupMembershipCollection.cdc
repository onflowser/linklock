import NonFungibleToken from 0xNonFungibleToken
import FungibleToken from 0xFungibleToken
import MetadataViews from 0xMetadataViews
import Membership from 0xMembership

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
        signer.link<&{
            Membership.MembershipCollectionPublic,
            NonFungibleToken.CollectionPublic,
            MetadataViews.ResolverCollection
        }>(
            Membership.CollectionPublicPath,
            target: Membership.CollectionStoragePath
        )
    }
}
