import "Membership"

// TODO: Provide requirements via params
transaction(name: String) {
    let signer: AuthAccount

    prepare(signer: AuthAccount) {
        self.signer = signer    
    }

    pre {}

    execute {
        self.signer.save<@Membership.Definition>(
            <-Membership.defineMembership(name: name, requirements: [
                Membership.RequirementHook(contractName: "Test", 0x1)
            ]), 
            to: StoragePath(identifier: "membership")!
        )
    }

    post {}
}
