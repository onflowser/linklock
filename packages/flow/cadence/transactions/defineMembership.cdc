import MembershipDefinition from 0xf3fcd2c1a78f5eee

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

    prepare(signer: AuthAccount) {
        self.signer = signer
    }

    pre {}

    execute {
        // TODO: Handle case when collection is already in storage
        self.signer.save<@MembershipDefinition.NFT>(
            <-MembershipDefinition.create(
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
            ),
            to: MembershipDefinition.CollectionStoragePath
        )
        self.signer.link<&MembershipDefinition.NFT>(
            MembershipDefinition.CollectionPublicPath,
            target: MembershipDefinition.CollectionStoragePath
        )
    }

    post {}
}
