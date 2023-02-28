// This script reads the balance field of an account's FlowToken Balance
import MembershipDefinition from 0xMembershipDefinition
import NonFungibleToken from 0xNonFungibleToken

pub fun main(adminAddress: Address): [&MembershipDefinition.NFT] {

    let membershipDefinitionCollection = getAccount(adminAddress)
        .getCapability(MembershipDefinition.CollectionPublicPath)
        .borrow<&AnyResource{MembershipDefinition.MembershipDefinitionCollectionPublic}>()

    if (membershipDefinitionCollection == nil) {
        return []
    }

    let ownedNftIds = membershipDefinitionCollection!.getIDs()

    let nfts: [&MembershipDefinition.NFT] = []

    for nftId in ownedNftIds {
        nfts.append(membershipDefinitionCollection!.borrowMembershipDefinitionNFT(id: nftId)!)
    }

    return nfts
}
