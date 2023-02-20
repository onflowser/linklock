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
                expirationInterval: 100000,
                requirement: Membership.RequirementDefinition(
                    price: 1.0,
                    contractName: "Test", 
                    contractAddress: 0x1
                )
            ), 
            to: /storage/membership
        )
        self.signer.link<&Membership.Definition>(/public/membership, target: /storage/membership)
    }

    post {}
}
