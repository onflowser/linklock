import NonFungibleToken from 0xf8d6e0586b0a20c7
import FungibleToken from 0xee82856bf20e2aa6
import MetadataViews from 0xf8d6e0586b0a20c7
import MembershipDefinition from 0xf3fcd2c1a78f5eee

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
