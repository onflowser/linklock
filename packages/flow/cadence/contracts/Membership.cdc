import "MembershipRequirement"
import "MembershipDefinition"
import NonFungibleToken from 0xf8d6e0586b0a20c7
import FungibleToken from 0xee82856bf20e2aa6
import MetadataViews from 0xf8d6e0586b0a20c7

pub contract Membership: NonFungibleToken {

    /// Total supply of all membrship NFTs
    pub var totalSupply: UInt64
    /// Total supply of MembershipDefinition NFTs
    pub var totalDefinitionSupply: UInt64
    /// Total supply of membership NFT per each membership definition ID
    pub var totalMembershipSupplyPerDefinition: {UInt64: UInt64}

    /// The event that is emitted when the contract is created
    pub event ContractInitialized()

    /// The event that is emitted when an NFT is withdrawn from a Collection
    pub event Withdraw(id: UInt64, from: Address?)

    /// The event that is emitted when an NFT is deposited to a Collection
    pub event Deposit(id: UInt64, to: Address?)

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

        pub var adminAddress: Address
        pub var validUntilTimestamp: UFix64

        init(
            id: UInt64,
            name: String,
            description: String,
            thumbnail: String,
            metadata: {String: AnyStruct},
            validUntilTimestamp: UFix64,
            adminAddress: Address,
        ) {
            self.id = id
            self.name = name
            self.description = description
            self.thumbnail = thumbnail
            self.metadata = metadata
            self.validUntilTimestamp = validUntilTimestamp
            self.adminAddress = adminAddress
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
            // TODO: Implement metadata views
            return []
        }

        /// Function that resolves a metadata view for this token.
        ///
        /// @param view: The Type of the desired view.
        /// @return A structure representing the requested view.
        ///
        pub fun resolveView(_ view: Type): AnyStruct? {
            // TODO: Implement metadata view resolution
            return nil
        }
    }

    pub resource interface MembershipNFTCollectionPublic {
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
    pub resource Collection: MembershipNFTCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection {
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

    // TODO: Add renew/redeem membership function
    // TODO: Add membership specific events (e.g. renew)
    // TODO: Pass definition NFT as argument instead?
    pub fun claimMembership(
        adminAddress: Address,
        membershipDefinitionId: UInt64,
        claimerAddress: Address,
        claimerVault: @FungibleToken.Vault
    ): @NFT {
         let membershipDefinitionCollection = getAccount(adminAddress)
             .getCapability(MembershipDefinition.CollectionPublicPath)
             .borrow<&AnyResource{MembershipDefinition.MembershipDefinitionNFTCollectionPublic}>()
             ?? panic("Could not borrow reference to membership definition collection")

        let definition = membershipDefinitionCollection
            .borrowMembershipDefinitionNFT(id: membershipDefinitionId)
            ?? panic("Could not borrow reference to membership definition NFT")

        let requirementAddress = getAccount(definition.requirement.contractAddress)

        let requirementContract = requirementAddress.contracts.borrow<&MembershipRequirement>(
            name: definition.requirement.contractName
        )!
        requirementContract.claimRequirement(
            claimerAddress: claimerAddress,
            adminAddress: adminAddress,
            expectedPrice: definition.requirement.price,
            claimerVault: <- claimerVault
        )

        if (self.totalMembershipSupplyPerDefinition[definition.id] == nil) {
            // Initialize membership supply
            self.totalMembershipSupplyPerDefinition[definition.id] = 0
        }

        var currentSupplyForDefinition = self.totalMembershipSupplyPerDefinition[definition.id]!

        if (currentSupplyForDefinition >= definition.maxSupply) {
            panic("Max membership supply reached")
        }

        let currentTimestamp = getCurrentBlock().timestamp
        let membership <- create NFT(
            id: self.totalSupply,
            name: definition.name,
            description: "",
            thumbnail: "",
            metadata: {},
            validUntilTimestamp: currentTimestamp + definition.expirationInterval,
            adminAddress: adminAddress
        )

        self.totalMembershipSupplyPerDefinition[definition.id] = currentSupplyForDefinition + UInt64(1)
        self.totalSupply = self.totalSupply + UInt64(1)

        // TODO: Should we deposit NFT here instead of returning?
        // See: https://github.com/onflow/flow-nft/blob/master/contracts/ExampleNFT.cdc#L325
        return <- membership
    }

    init() {
        // Initialize the total supply
        self.totalSupply = 0
        self.totalDefinitionSupply = 0
        self.totalMembershipSupplyPerDefinition = {}

        // Set the named paths
        self.CollectionStoragePath = /storage/membership
        self.CollectionPublicPath = /public/membership
        self.DefinitionStoragePath = /storage/membership_definition
        self.DefinitionPublicPath = /public/membership_definition

        emit ContractInitialized()
    }
}
