import "MembershipRequirement"
import NonFungibleToken from "./standard/NonFungibleToken.cdc"
import FungibleToken from "./standard/FungibleToken.cdc"
import MetadataViews from "./standard/MetadataViews.cdc"

pub contract MembershipDefinition: NonFungibleToken {
    /// Total supply of all membership definition NFTs
    pub var totalSupply: UInt64

    /// The event that is emitted when the contract is created
    pub event ContractInitialized()

    /// The event that is emitted when an NFT is withdrawn from a Collection
    pub event Withdraw(id: UInt64, from: Address?)

    /// The event that is emitted when an NFT is deposited to a Collection
    pub event Deposit(id: UInt64, to: Address?)

    /// Membership Storage and Public Paths
    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath


    pub struct RequirementDefinition {
        pub let price: UFix64
        pub let contractName: String
        pub let contractAddress: Address

        init(price: UFix64, contractName: String, contractAddress: Address) {
            self.price = price
            self.contractName = contractName
            self.contractAddress = contractAddress
        }
    }

    pub resource NFT: NonFungibleToken.INFT, MetadataViews.Resolver {
        pub let id: UInt64

        /// Metadata fields
        pub let name: String
        pub let description: String
        pub let thumbnail: String
        access(self) let metadata: {String: AnyStruct}

        /// Expiration interval in seconds
        pub var expirationInterval: UFix64
        pub var maxSupply: UInt64
        pub var requirement: RequirementDefinition

        init(
            id: UInt64,
            name: String,
            description: String,
            thumbnail: String,
            metadata: {String: AnyStruct},
            expirationInterval: UFix64,
            maxSupply: UInt64,
            requirement: RequirementDefinition
        ) {
            self.id = id
            self.name = name
            self.description = description
            self.thumbnail = thumbnail
            self.metadata = metadata
            self.expirationInterval = expirationInterval
            self.maxSupply = maxSupply
            self.requirement = requirement
        }

        /// Function that returns all the Metadata Views implemented by a Non Fungible Token
        ///
        /// @return An array of Types defining the implemented views. This value will be used by
        ///         developers to know which parameter to pass to the resolveView() method.
        ///
        pub fun getViews(): [Type] {
            return [
                Type<MetadataViews.Display>(),
                Type<MetadataViews.Serial>()
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
                         description: self.description,
                         thumbnail: MetadataViews.HTTPFile(
                             url: self.thumbnail
                         )
                     )
                 case Type<MetadataViews.Serial>():
                     return MetadataViews.Serial(
                         self.id
                     )
                 case Type<MetadataViews.NFTCollectionData>():
                     return MetadataViews.NFTCollectionData(
                         storagePath: MembershipDefinition.CollectionStoragePath,
                         publicPath: MembershipDefinition.CollectionPublicPath,
                         // TODO: Do we need to implement private path?
                         providerPath: /private/membership,
                         publicCollection: Type<&MembershipDefinition.Collection{MembershipDefinition.MembershipDefinitionCollectionPublic}>(),
                         publicLinkedType: Type<&MembershipDefinition.Collection{MembershipDefinition.MembershipDefinitionCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(),
                         providerLinkedType: Type<&MembershipDefinition.Collection{MembershipDefinition.MembershipDefinitionCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Provider,MetadataViews.ResolverCollection}>(),
                         createEmptyCollectionFunction: (fun (): @NonFungibleToken.Collection {
                             return <-MembershipDefinition.createEmptyCollection()
                         })
                     )
             }
            return nil
        }
    }

    pub resource interface MembershipDefinitionCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowMembershipDefinitionNFT(id: UInt64): &NFT? {
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow Membership definition NFT reference: the ID of the returned reference is incorrect"
            }
        }
    }

    /// The resource that will be holding the NFTs inside any account.
    /// In order to be able to manage NFTs any account will need to create
    /// an empty collection first
    ///
    pub resource Collection: MembershipDefinitionCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection {
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
            // TODO: Implement withdrawal support, remove adminAddress from Membership.NFT
            // Disable withdrawals for now,
            // because we assume that `adminAddress`,
            // which used to specify membership along membershipDefinitionId,
            // will not change.
            panic("Membership definition withdrawal not supported yet")

            // let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            // emit Withdraw(id: token.id, from: self.owner?.address)

            // return <-token
        }

        /// Adds an NFT to the collections dictionary and adds the ID to the id array
        ///
        /// @param token: The NFT resource to be included in the collection
        ///
        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @NFT

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
        pub fun borrowMembershipDefinitionNFT(id: UInt64): &NFT? {
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
            let exampleNFT = nft as! &NFT
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

    pub fun create(
        name: String,
        description: String,
        thumbnail: String,
        expirationInterval: UFix64,
        maxSupply: UInt64,
        requirement: RequirementDefinition
    ): @NFT {
        pre {
            maxSupply > 0: "Max supply must be greater than 0"
            expirationInterval > 0.0: "Expiration interval must be greater than 0"
            name.length > 0: "Membership name must be set"
        }
        let definition <- create NFT(
            id: self.totalSupply,
            name: name,
            description: description,
            thumbnail: thumbnail,
            metadata: {},
            expirationInterval: expirationInterval,
            maxSupply: maxSupply,
            requirement: requirement
        )

        self.totalSupply = self.totalSupply + 1

        return <- definition
    }

    init() {
        // Initialize the total supply
        self.totalSupply = 0

        // Set the named paths
        self.CollectionStoragePath = /storage/membership_definition
        self.CollectionPublicPath = /public/membership_definition

        emit ContractInitialized()
    }
}
