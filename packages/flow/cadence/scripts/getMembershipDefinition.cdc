// This script reads the balance field of an account's FlowToken Balance
import MembershipDefinition from 0xf3fcd2c1a78f5eee

pub fun main(
    adminAddress: Address,
    membershipDefinitionId: UInt64
): &MembershipDefinition.NFT {

    let definition = getAccount(adminAddress)
        .getCapability(MembershipDefinition.CollectionPublicPath)
        .borrow<&MembershipDefinition.Collection>()
        ?? panic("Could not borrow membership definition collection reference")

    return definition.borrowMembershipDefinitionNFT(id: membershipDefinitionId)!
}
