// This script reads the balance field of an account's FlowToken Balance
import Membership from 0xf3fcd2c1a78f5eee

pub fun main(memberAddress: Address): &Membership.Member {

    let definition = getAccount(memberAddress)
        .getCapability(/public/member)
        .borrow<&Membership.Member>()
        ?? panic("Could not borrow membership reference")

    return definition
}
