import "Membership"

// TODO: Provide requirements via params
transaction() {
    let signer: AuthAccount

    prepare(signer: AuthAccount) {
        self.signer = signer
    }

    pre {}

    execute {
        self.signer.save<@Membership.Definition>(
            <-Membership.defineMembership(
                name: "Test",
                expirationInterval: 100000.0,
                requirement: Membership.RequirementDefinition(
                    price: 1.0,
                    contractName: "FlowRequirement",
                    contractAddress: 0xf3fcd2c1a78f5eee
                )
            ),
            to: /storage/membership
        )
        self.signer.link<&Membership.Definition>(/public/membership, target: /storage/membership)
    }

    post {}
}
