import "Membership"

transaction(
    name: String,
    expirationInterval: UFix64,
    flowPrice: UFix64
) {
    let signer: AuthAccount

    prepare(signer: AuthAccount) {
        self.signer = signer
    }

    pre {}

    execute {
        self.signer.save<@Membership.MembershipDefinition>(
            <-Membership.defineMembership(
                name: name,
                expirationInterval: expirationInterval,
                requirement: Membership.RequirementDefinition(
                    price: flowPrice,
                    // TODO: Accept these via params
                    contractName: "FlowRequirement",
                    contractAddress: 0xf3fcd2c1a78f5eee
                )
            ),
            to: Membership.DefinitionStoragePath
        )
        self.signer.link<&Membership.MembershipDefinition>(
            Membership.DefinitionPublicPath,
            target: Membership.DefinitionStoragePath
        )
    }

    post {}
}
