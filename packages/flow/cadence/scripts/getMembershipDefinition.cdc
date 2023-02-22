// This script reads the balance field of an account's FlowToken Balance
import Membership from 0xf3fcd2c1a78f5eee

pub fun main(acc: Address): &Membership.Definition {

    let definition = getAccount(acc)
        .getCapability(/public/membership)
        .borrow<&Membership.Definition>()
        ?? panic("Could not borrow membership definition reference")

    return definition
}
