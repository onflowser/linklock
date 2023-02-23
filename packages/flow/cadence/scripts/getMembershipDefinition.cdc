// This script reads the balance field of an account's FlowToken Balance
import MembershipProtocol from 0xf3fcd2c1a78f5eee

pub fun main(address: Address): &MembershipProtocol.MembershipDefinition {

    let definition = getAccount(address)
        .getCapability(/public/membership)
        .borrow<&MembershipProtocol.MembershipDefinition>()
        ?? panic("Could not borrow membership definition reference")

    return definition
}
