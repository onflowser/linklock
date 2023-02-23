// This script reads the balance field of an account's FlowToken Balance
import Membership from 0xf3fcd2c1a78f5eee

pub fun main(address: Address): &Membership.MembershipDefinition {

    let definition = getAccount(address)
        .getCapability(Membership.DefinitionPublicPath)
        .borrow<&Membership.MembershipDefinition>()
        ?? panic("Could not borrow membership definition reference")

    return definition
}
