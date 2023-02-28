import MembershipDefinition from 0xMembershipDefinition
import NonFungibleToken from 0xNonFungibleToken

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
