// This script reads the balance field of an account's FlowToken Balance
import MembershipDefinition from 0xf3fcd2c1a78f5eee
import NonFungibleToken from 0xf8d6e0586b0a20c7

pub fun main(adminAddress: Address): [&MembershipDefinition.NFT] {

    let membershipDefinitionCollection = getAccount(adminAddress)
        .getCapability(MembershipDefinition.CollectionPublicPath)
        .borrow<&AnyResource{MembershipDefinition.MembershipDefinitionNFTCollectionPublic}>()

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
