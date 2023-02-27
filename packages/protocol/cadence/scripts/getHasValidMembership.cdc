// This script reads the balance field of an account's FlowToken Balance
import Membership from 0xf3fcd2c1a78f5eee
import NonFungibleToken from 0xf8d6e0586b0a20c7

pub fun main(memberAddress: Address, membershipId: UInt64): Bool {

    let membershipCollection = getAccount(memberAddress)
        .getCapability(Membership.CollectionPublicPath)
        .borrow<&AnyResource{Membership.MembershipCollectionPublic}>()

    if (membershipCollection == nil) {
        return false
    }

    let membership = membershipCollection!.borrowMembershipNFT(id: membershipId)

    return membership?.isValid() ?? false
}
