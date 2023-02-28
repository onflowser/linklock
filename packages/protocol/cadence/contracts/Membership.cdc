import "MembershipRequirement"
import "MembershipDefinition"
import NonFungibleToken from "./standard/NonFungibleToken.cdc"
import FungibleToken from "./standard/FungibleToken.cdc"
import MetadataViews from "./standard/MetadataViews.cdc"

pub contract Membership: NonFungibleToken {

    /// Total supply of all membrship NFTs
    pub var totalSupply: UInt64
    /// Total supply of membership NFT per each membership definition ID
    pub var totalMembershipSupplyPerDefinition: {UInt64: UInt64}

    /// The event that is emitted when the contract is created
    pub event ContractInitialized()

    /// The event that is emitted when an NFT is withdrawn from a Collection
    pub event Withdraw(id: UInt64, from: Address?)

    /// The event that is emitted when an NFT is deposited to a Collection
    pub event Deposit(id: UInt64, to: Address?)

    pub event Claim(adminAddress: Address, membershipDefinitionId: UInt64, member: Address)
    pub event Redeem(adminAddress: Address, membershipDefinitionId: UInt64, member: Address)

    /// Membership Storage and Public Paths
    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath

    /// Membership definition Storage and Public Paths
    pub let DefinitionStoragePath: StoragePath
    pub let DefinitionPublicPath: PublicPath

    /// The core resource that represents a Non Fungible Token.
    /// New instances will be created using the NFTMinter resource
    /// and stored in the Collection resource
    ///
    pub resource NFT: NonFungibleToken.INFT, MetadataViews.Resolver {

        /// The unique ID that each NFT has
        pub let id: UInt64

        /// Metadata fields
        pub let name: String
        pub let description: String
        pub let thumbnail: String
        access(self) let metadata: {String: AnyStruct}

        /// Membership definition info
        // TODO: We shouldn't store admin address, since original admin can transfer the membership definition to another account
        pub let adminAddress: Address
        pub let membershipDefinitionId: UInt64

        /// Membership expiration UNIX timestamp.
        pub var validUntilTimestamp: UFix64

        init(
            id: UInt64,
            name: String,
            description: String,
            thumbnail: String,
            validUntilTimestamp: UFix64,
            adminAddress: Address,
            membershipDefinitionId: UInt64
        ) {
            self.id = id
            self.name = name
            self.description = description
            self.thumbnail = thumbnail
            self.metadata = {}
            self.validUntilTimestamp = validUntilTimestamp
            self.adminAddress = adminAddress
            self.membershipDefinitionId = membershipDefinitionId
        }

        access(contract) fun redeem(membershipDefinition: &MembershipDefinition.NFT) {
            let currentTimestamp = getCurrentBlock().timestamp
            let redeemedExpirationTimestamp = currentTimestamp + membershipDefinition.expirationInterval

            self.validUntilTimestamp = redeemedExpirationTimestamp
        }

         pub fun isValid(): Bool {
             let currentTimestamp = getCurrentBlock().timestamp
             return self.validUntilTimestamp < currentTimestamp
         }

        /// Function that returns all the Metadata Views implemented by a Non Fungible Token
        ///
        /// @return An array of Types defining the implemented views. This value will be used by
        ///         developers to know which parameter to pass to the resolveView() method.
        ///
        pub fun getViews(): [Type] {
            return [
                Type<MetadataViews.Display>(),
                Type<MetadataViews.Serial>(),
                Type<MetadataViews.NFTCollectionData>()
            ]
        }

        /// Function that resolves a metadata view for this token.
        ///
        /// @param view: The Type of the desired view.
        /// @return A structure representing the requested view.
        ///
        pub fun resolveView(_ view: Type): AnyStruct? {
             switch view {
                 case Type<MetadataViews.Display>():
                     return MetadataViews.Display(
                         name: self.name,
                         // TODO: Nicer timestamp formatting
                         description: self.description
                            .concat(" | ")
                            .concat("Valid until timestamp: ")
                            .concat(self.validUntilTimestamp.toString()),
                         thumbnail: MetadataViews.HTTPFile(
                             url: self.thumbnail
                         )
                     )
                 case Type<MetadataViews.Editions>():
                     // TODO: Each membership definition represents an edition
                     return nil
                 case Type<MetadataViews.Serial>():
                     return MetadataViews.Serial(
                         self.id
                     )
                 case Type<MetadataViews.ExternalURL>():
                     // TODO: Implement link to membership protocol website
                     return nil
                 case Type<MetadataViews.NFTCollectionData>():
                     return MetadataViews.NFTCollectionData(
                         storagePath: Membership.CollectionStoragePath,
                         publicPath: Membership.CollectionPublicPath,
                         // TODO: Do we need to implement private path?
                         providerPath: /private/membership,
                         publicCollection: Type<&Membership.Collection{Membership.MembershipCollectionPublic}>(),
                         publicLinkedType: Type<&Membership.Collection{Membership.MembershipCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(),
                         providerLinkedType: Type<&Membership.Collection{Membership.MembershipCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Provider,MetadataViews.ResolverCollection}>(),
                         createEmptyCollectionFunction: (fun (): @NonFungibleToken.Collection {
                             return <-Membership.createEmptyCollection()
                         })
                     )
                 case Type<MetadataViews.NFTCollectionDisplay>():
                     // TODO: Implement
                     return nil
                 case Type<MetadataViews.Traits>():
                     // TODO: We could support traits that would represent different access permision?
                     return nil

             }
            return nil
        }
    }

    pub resource interface MembershipCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowMembershipNFT(id: UInt64): &NFT? {
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow Membership NFT reference: the ID of the returned reference is incorrect"
            }
        }
    }

    /// The resource that will be holding the NFTs inside any account.
    /// In order to be able to manage NFTs any account will need to create
    /// an empty collection first
    ///
    pub resource Collection: MembershipCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection {
        // dictionary of NFT conforming tokens
        // NFT is a resource type with an `UInt64` ID field
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init () {
            self.ownedNFTs <- {}
        }

        /// Removes an NFT from the collection and moves it to the caller
        ///
        /// @param withdrawID: The ID of the NFT that wants to be withdrawn
        /// @return The NFT resource that has been taken out of the collection
        ///
        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            // TODO: Should we disallow withdrawal?
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }

        /// Adds an NFT to the collections dictionary and adds the ID to the id array
        ///
        /// @param token: The NFT resource to be included in the collection
        ///
        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @Membership.NFT

            let id: UInt64 = token.id

            // add the new token to the dictionary which removes the old one
            let oldToken <- self.ownedNFTs[id] <- token

            emit Deposit(id: id, to: self.owner?.address)

            destroy oldToken
        }

        /// Helper method for getting the collection IDs
        ///
        /// @return An array containing the IDs of the NFTs in the collection
        ///
        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        /// Gets a reference to an NFT in the collection so that
        /// the caller can read its metadata and call its methods
        ///
        /// @param id: The ID of the wanted NFT
        /// @return A reference to the wanted NFT resource
        ///
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }

        /// Gets a reference to an NFT in the collection so that
        /// the caller can read its metadata and call its methods
        ///
        /// @param id: The ID of the wanted NFT
        /// @return A reference to the wanted NFT resource
        ///
        pub fun borrowMembershipNFT(id: UInt64): &NFT? {
            if self.ownedNFTs[id] != nil {
                // Create an authorized reference to allow downcasting
                let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
                return ref as! &NFT
            }

            return nil
        }

        /// Gets a reference to the NFT only conforming to the `{MetadataViews.Resolver}`
        /// interface so that the caller can retrieve the views that the NFT
        /// is implementing and resolve them
        ///
        /// @param id: The ID of the wanted NFT
        /// @return The resource reference conforming to the Resolver interface
        ///
        pub fun borrowViewResolver(id: UInt64): &AnyResource{MetadataViews.Resolver} {
            let nft = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
            let exampleNFT = nft as! &Membership.NFT
            return exampleNFT as &AnyResource{MetadataViews.Resolver}
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    /// Allows anyone to create a new empty collection
    ///
    /// @return The new Collection resource
    ///
    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    /// Extends the given membership by the specified duration.
    pub fun redeemMembership(
        membership: @NFT,
        claimerAddress: Address,
        claimerVault: @FungibleToken.Vault
    ): @NFT {
        let membershipDefinition = self.getMembershipDefinition(
            adminAddress: membership.adminAddress,
            membershipDefinitionId: membership.membershipDefinitionId,
        )
        self.executeClaimRequirement(
            membershipDefinition: membershipDefinition,
            adminAddress: membership.adminAddress,
            claimerAddress: claimerAddress,
            claimerVault: <- claimerVault
        )

        membership.redeem(membershipDefinition: membershipDefinition)

        emit Redeem(
            adminAddress: membership.adminAddress,
            membershipDefinitionId: membershipDefinition.id,
            member: claimerAddress
        )

        return <- membership
    }

    // TODO: Emit membership specific events (e.g. renew)
    pub fun claimMembership(
        adminAddress: Address,
        membershipDefinitionId: UInt64,
        claimerAddress: Address,
        claimerVault: @FungibleToken.Vault
    ): @NFT {
        let membershipDefinition = self.getMembershipDefinition(
            adminAddress: adminAddress,
            membershipDefinitionId: membershipDefinitionId,
        )
        self.executeClaimRequirement(
           membershipDefinition: membershipDefinition,
           adminAddress: adminAddress,
           claimerAddress: claimerAddress,
           claimerVault: <- claimerVault
        )

        if (self.totalMembershipSupplyPerDefinition[membershipDefinition.id] == nil) {
            // Initialize membership-card supply
            self.totalMembershipSupplyPerDefinition[membershipDefinition.id] = 0
        }

        var currentSupplyForDefinition = self.totalMembershipSupplyPerDefinition[membershipDefinition.id]!

        if (currentSupplyForDefinition >= membershipDefinition.maxSupply) {
            panic("Max membership supply reached")
        }

        let currentTimestamp = getCurrentBlock().timestamp
        let membership <- create NFT(
            id: self.totalSupply,
            // TODO: Provide custom/dynamic metadata?
            name: membershipDefinition.name,
            description: membershipDefinition.description,
            thumbnail: membershipDefinition.thumbnail,
            validUntilTimestamp: currentTimestamp + membershipDefinition.expirationInterval,
            adminAddress: adminAddress,
            membershipDefinitionId: membershipDefinitionId
        )

        self.totalMembershipSupplyPerDefinition[membershipDefinition.id] = currentSupplyForDefinition + UInt64(1)
        self.totalSupply = self.totalSupply + UInt64(1)

        emit Claim(
            adminAddress: adminAddress,
            membershipDefinitionId: membershipDefinitionId,
            member: claimerAddress
        )

        // TODO: Should we deposit NFT here instead of returning?
        // See: https://github.com/onflow/protocol-nft/blob/master/contracts/ExampleNFT.cdc#L325
        return <- membership
    }

    access(contract) fun executeClaimRequirement(
        membershipDefinition: &MembershipDefinition.NFT,
        adminAddress: Address,
        claimerAddress: Address,
        claimerVault: @FungibleToken.Vault
    ) {
        let requirementAccount = getAccount(membershipDefinition.requirement.contractAddress)

        let requirementContract = requirementAccount.contracts.borrow<&MembershipRequirement>(
            name: membershipDefinition.requirement.contractName
        )!
        requirementContract.claimRequirement(
            claimerAddress: claimerAddress,
            adminAddress: adminAddress,
            expectedPrice: membershipDefinition.requirement.price,
            claimerVault: <- claimerVault
        )
    }

    access(contract) fun getMembershipDefinition(
        adminAddress: Address,
        membershipDefinitionId: UInt64,
    ): &MembershipDefinition.NFT {
        let membershipDefinitionCollection = getAccount(adminAddress)
             .getCapability(MembershipDefinition.CollectionPublicPath)
             .borrow<&AnyResource{MembershipDefinition.MembershipDefinitionCollectionPublic}>()
             ?? panic("Could not borrow reference to membership definition collection")

        let definition = membershipDefinitionCollection
            .borrowMembershipDefinitionNFT(id: membershipDefinitionId)
            ?? panic("Could not borrow reference to membership definition NFT")

        return definition
    }

    init() {
        // Initialize the total supply
        self.totalSupply = 0
        self.totalMembershipSupplyPerDefinition = {}

        // Set the named paths
        self.CollectionStoragePath = /storage/membership
        self.CollectionPublicPath = /public/membership
        self.DefinitionStoragePath = /storage/membership_definition
        self.DefinitionPublicPath = /public/membership_definition

        emit ContractInitialized()
    }
}
