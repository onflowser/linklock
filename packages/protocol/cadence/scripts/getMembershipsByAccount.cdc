// This script reads the balance field of an account's FlowToken Balance
import Membership from 0xMembership
import NonFungibleToken from 0xNonFungibleToken

pub fun main(memberAddress: Address): [&Membership.NFT] {

    let membershipCollection = getAccount(memberAddress)
        .getCapability(Membership.CollectionPublicPath)
        .borrow<&AnyResource{Membership.MembershipCollectionPublic}>()

    if (membershipCollection == nil) {
        return []
    }

    let ownedNftIds = membershipCollection!.getIDs()

    let nfts: [&Membership.NFT] = []

    for nftId in ownedNftIds {
        nfts.append(membershipCollection!.borrowMembershipNFT(id: nftId)!)
    }

    return nfts
}
