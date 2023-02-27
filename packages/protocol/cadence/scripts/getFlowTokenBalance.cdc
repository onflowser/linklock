// This script reads the balance field of an account's FlowToken Balance
import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken

pub fun main(address: Address): UFix64 {

    let vaultRef = getAccount(address)
        .getCapability(/public/flowTokenBalance)
        .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    return vaultRef.balance
}
