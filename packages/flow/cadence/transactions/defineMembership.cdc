import MembershipDefinition from 0xf3fcd2c1a78f5eee
import NonFungibleToken from 0xf8d6e0586b0a20c7

transaction(
    name: String,
    description: String,
    thumbnail: String,
    expirationInterval: UFix64,
    maxSupply: UInt64,
    requirementPrice: UFix64,
    requirementContractName: String,
    requirementContractAddress: Address,
) {
    let signer: AuthAccount

    /// Reference to the receiver's collection
    let claimerCollectionRef: &{NonFungibleToken.CollectionPublic}

    prepare(signer: AuthAccount) {
        self.signer = signer

        self.claimerCollectionRef = getAccount(signer.address)
            .getCapability(MembershipDefinition.CollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not get claimer reference to the NFT Collection")
    }

    pre {}

    execute {
        // TODO: rename defineMembership to createMembership
        // TODO: Rename getMembershipNFTs to getMemberships
        let membershipDefinition <- MembershipDefinition.create(
            name: name,
            description: description,
            thumbnail: thumbnail,
            expirationInterval: expirationInterval,
            maxSupply: maxSupply,
            requirement: MembershipDefinition.RequirementDefinition(
                price: requirementPrice,
                contractName: requirementContractName,
                contractAddress: requirementContractAddress
            )
        )
        self.claimerCollectionRef.deposit(token: <- membershipDefinition)
    }

    post {}
}
