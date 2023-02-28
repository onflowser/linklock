import NonFungibleToken from 0xNonFungibleToken
import FungibleToken from 0xFungibleToken
import MetadataViews from 0xMetadataViews
import MembershipDefinition from 0xMembershipDefinition

/// This transaction is what an account would run
/// to set itself up to receive NFTs
transaction {

    prepare(signer: AuthAccount) {
        // Return early if the account already has a collection
        if signer.borrow<&MembershipDefinition.Collection>(from: MembershipDefinition.CollectionStoragePath) != nil {
            log("Collection is already setup")
            return
        }

        // Create a new empty collection
        let collection <- MembershipDefinition.createEmptyCollection()

        // save it to the account
        signer.save(<-collection, to: MembershipDefinition.CollectionStoragePath)

        // create a public capability for the collection
        signer.link<&{
            MembershipDefinition.MembershipDefinitionCollectionPublic,
            NonFungibleToken.CollectionPublic,
            MetadataViews.ResolverCollection
        }>(
            MembershipDefinition.CollectionPublicPath,
            target: MembershipDefinition.CollectionStoragePath
        )
    }
}
