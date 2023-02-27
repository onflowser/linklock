import Test

pub fun setup() {
    let blockchain = Test.newEmulatorBlockchain()

    let communityAdmin = blockchain.createAccount()
    let wannaBeMember = blockchain.createAccount()

    let contractCode = Test.readFile("../contracts/Requirement.cdc")

    blockchain.useConfiguration(Test.Configuration({
        "Requirement": communityAdmin.address,
        "FungibleToken": communityAdmin.address,
        "FlowToken": communityAdmin.address
    }))

    deployContract(
        name: "Requirement",
        account: communityAdmin,
        arguments: [],
        blockchain: blockchain
    )

    // TODO: Deploy other contracts
}

pub fun deployContract(
    name: String, 
    account: Test.Account, 
    arguments: [AnyStruct], 
    blockchain: Test.Blockchain
) {
    let contractCode = Test.readFile("../contracts/".concat(name).concat(".cdc"))

    let deployError = blockchain.deployContract(
        name: name,
        code: contractCode,
        account: account,
        arguments: arguments
    )

    if (deployError != nil) {
        panic(deployError!.message)
    }
}