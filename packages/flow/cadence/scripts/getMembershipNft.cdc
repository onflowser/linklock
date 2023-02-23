// This script reads the balance field of an account's FlowToken Balance
import MembershipProtocol from 0xf3fcd2c1a78f5eee

pub fun main(memberAddress: Address): &MembershipProtocol.Membership {

    let definition = getAccount(memberAddress)
        .getCapability(/public/member)
        .borrow<&MembershipProtocol.Membership>()
        ?? panic("Could not borrow membership reference")

    return definition
}
