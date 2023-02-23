// This script reads the balance field of an account's FlowToken Balance
import Membership from 0xf3fcd2c1a78f5eee
import NonFungibleToken from 0xf8d6e0586b0a20c7

pub fun main(memberAddress: Address): [&NonFungibleToken.NFT] {

    let membershipCollection = getAccount(memberAddress)
        .getCapability(Membership.CollectionPublicPath)
        .borrow<&AnyResource{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow membership collection reference")

    let ownedNftIds = membershipCollection.getIDs()

    let nfts: [&NonFungibleToken.NFT] = []

    for nftId in ownedNftIds {
        nfts.append(membershipCollection.borrowNFT(id: nftId))
    }

    return nfts
}
