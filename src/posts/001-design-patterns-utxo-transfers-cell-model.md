---
# REQUIRED FIELDS
title: "Design Patterns: UTXO Transfers Using the Cell Model"
slug: "design-patterns-utxo-transfers-cell-model"
permalink: /posts/{{ slug }}/
date: 2025-09-02
layout: layouts/post.njk

# STANDARD FIELDS  
tags: ["post", "utxo", "cell-model", "blockchain", "design-patterns", "cota", "smt"]
author: "Jordan Mack"
id: "utxo-transfers"  # Used for image folder: /assets/images/posts/utxo-transfers/

# OPTIONAL FIELDS
# pinned: true  # Uncomment to pin post
# updated: 2025-09-03 # Only add when post is actually updated
---

This document explores different patterns for transferring digital assets between two parties using the Nervos CKB Cell Model. While focused on the CKB blockchain, these patterns may also apply to other UTXO blockchains that implement state rent.

State rent is essential because it ensures sustainable network economics and prevents out of control cost spirals. However, it introduces unique challenges that require innovative design patterns to maintain usability.

Some of the transfer patterns mentioned in this document are tied directly to specific asset protocols. This document aims to focus specifically on the transfer patterns introduced, not the details of the asset protocols themselves.

[[toc]]

## Challenges of State Rent

State rent presents unique obstacles for UTXO-based token transfers that don't exist in traditional blockchain models. Understanding these challenges is essential for designing effective transfer patterns.

CKB implements state rent through a simple economic model: **1 CKB token equals 1 byte of permanent on-chain storage capacity**. When you create a cell containing smart contracts, assets such as tokens and NFTs, or any other data, the cell's capacity must cover the storage cost of all these components. This capacity remains locked the entire time the asset exists on-chain. When the assets are destroyed and the cell is consumed, the locked CKB is returned.

The amount of CKB that must be locked depends on the amount of required on-chain data, which can vary from asset to asset. For the most basic asset, the CKB native token, the cost is 61 CKB. For an SUDT token, the cost is 142 CKB. For assets such as NFTs, the cost varies but is usually in the 150-200 CKB range. For fully on-chain DOBs, the cost can easily exceed thousands of CKB.

The challenge is that when you send an asset to someone else, a cell must be created to hold it. This introduces additional costs to the sender if they pay the state rent for the receiver. However, there are multiple patterns to mitigate this depending on the situation.

## Cell Model Asset Transfer Design Patterns

Several patterns can be used to address state rent costs for asset transfers. Each pattern balances simplicity, cost distribution, and trust requirements differently.

```
Diagram Conventions:
- [Content] = Cell (contains assets and CKB capacity).
- (Content) = Descriptive notes about the state.
- TX fees not included for simplicity.
```

### Sender Pays State Rent Pattern

The sender covers all state rent costs for the receiver's new cell. The asset transfer creates a cell owned by the receiver with capacity paid entirely by the sender.

```
Task: Send 50 CAT coin to receiver.

Initial State:
Sender: [200 CAT coin + 500 CKB]    Receiver: (no assets or cells)

After Transfer:
Sender: [150 CAT coin + 358 CKB]    Receiver: [50 CAT coin + 142 CKB]
        (remaining in cell)                   (new asset cell)
```

**Pros:**
- Most simple and compatible method to implement.
- No CKB requirements for receiver.
- Single step process.

**Cons:**
- Sender must pay extra CKB for the receiver's cell.
- Scales poorly as CKB price increases.
- Costs create high barriers for frequent transfers.

### Send and Refund Pattern

The sender pays state rent initially, then the receiver refunds the CKB capacity back to the sender. This requires trust on the part of the sender, and the receiver must actively participate after receiving the asset.

```
Task: Send 50 DOG coin to receiver.

Initial State:
Sender: [200 DOG coin + 500 CKB]    Receiver: [300 CKB]

After Transfer:
Sender: [150 DOG coin + 358 CKB]    Receiver: [50 DOG coin + 142 CKB]
        (remaining in cell)                   (new asset cell)
                                              [300 CKB]
                                              (original cell)

After Refund:
Sender: [150 DOG coin + 358 CKB]    Receiver: [50 DOG coin + 142 CKB]
        (original cell)                       (new asset cell)
        [142 CKB]                             [158 CKB]
        (new cell for refunded CKB)           (remaining from original)
```

**Pros:**
- Sender does not pay the CKB for the receiver's cell.
- Conceptually simple process that is easy to implement.

**Cons:**
- Receiver must have CKB to pay the refund.
- Receiver must be trusted to send back the CKB.
- Requires automated bots for receiving applications.
- No automated solutions exist for user to user transfers.

### Anyone-Can-Pay (ACP) Pattern

The receiver creates a special cell which unlocks for any user when it detects that it is receiving additional assets, but remains securely locked in other scenarios. This is similar to a mail drop box, where anyone can make a deposit but it's not possible to take anything back out.

The receiver must create an ACP cell ahead of time to hold the specific asset they want to receive. This only needs to be done once per asset, and then it can receive indefinitely.

```
Task: Send 50 PIG coin to receiver.

Initial State:
Sender: [200 PIG coin + 500 CKB]    Receiver: [300 CKB]

After ACP Cell Creation (One-time):
Sender: [200 PIG coin + 500 CKB]    Receiver: [ACP Cell: 142 CKB]
        (unchanged)                           (new ACP cell)
                                              [158 CKB]
                                              (remaining regular cell)

After Transfer:
Sender: [150 PIG coin + 500 CKB]    Receiver: [ACP Cell: 50 PIG coin + 142 CKB]
        (remaining in cell)                   (assets added to ACP cell)
                                              [158 CKB]
                                              (remaining regular cell)
```

**Pros:**
- Sender does not pay the CKB for the receiver's cell (after refund).
- Mature and tested pattern and implementation.
- No trust requirements.

**Cons:**
- Receiver must have CKB to create the ACP cell.
- ACP cells must be pre-deployed by receivers for each asset.
- Limited wallet and tooling support.
- More complex smart contract logic.

**Resources:**
- [Anyone-Can-Pay Lock Script RFC](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0026-anyone-can-pay/0026-anyone-can-pay.md) - Official specification for ACP lock script.
- [Anyone-Can-Pay Repository](https://github.com/cryptape/anyone-can-pay) - Current implementation and documentation.
- [OmniLock Repository](https://github.com/cryptape/omnilock) - Advanced lock script that also supports anyone-can-pay functionality.

### Cheque Cell Pattern

Implements a mechanism similar to a bank cheque where the sender creates a special cell that can be "cashed" by the receiver. The receiver must provide their own CKB capacity to claim the asset, and the CKB used for the cheque cell is returned to the sender. If the cheque remains unclaimed after 6 epochs, the sender can withdraw the assets and reclaim the capacity.

```
Task: Send 50 DUCK coin to receiver.

Initial State:
Sender: [200 DUCK coin + 500 CKB]    Receiver: [300 CKB]

After Cheque Creation:
Sender: [150 DUCK coin + 338 CKB]    Receiver: [300 CKB]
        (remaining in cell)                    (unchanged)
        [Cheque Cell: 50 DUCK coin + 162 CKB]
        (new cheque cell)

After Claim:
Sender: [150 DUCK coin + 338 CKB]    Receiver: [50 DUCK coin + 142 CKB]
        (original cell)                        (new asset cell)
        [162 CKB]                              [158 CKB]
        (returned from cheque)                 (remaining regular cell)

After Withdraw (if unclaimed after 6 epochs):
Sender: [150 DUCK coin + 338 CKB]    Receiver: [300 CKB]
        (original cell)                        (unchanged)
        [50 DUCK coin + 162 CKB]
        (withdrawn from cheque)
```

**Pros:**
- Sender does not pay the CKB for the receiver's cell.
- Does not require the receiver to pre-deploy asset receiver cells.
- No trust requirements.

**Cons:**
- Receiver must have CKB to claim assets to a cell they own.
- Unclaimed assets require the sender to undergo another step to recover.
- Very limited wallet and tooling support.
- More complex smart contract logic.

**Resources:**
- [Cheque Lock RFC](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0039-cheque-lock/0039-cheque-lock.md) - Official RFC specification for cheque lock.
- [Cheque Lock Script](https://github.com/nervosnetwork/ckb-cheque-script) - Official cheque script implementation and documentation.
- [Cheque Cell Tutorial](https://docs.nervos.org/docs/essays/cheque/) - Step-by-step implementation tutorial.
- [CKB-Cheque Examples](https://github.com/nervosnetwork/ckb-cheque-script/tree/master/examples) - Usage examples and integration guides.

### CoTA (Compact Token Aggregator) Pattern

CoTA is an NFT protocol which uses Sparse Merkle Trees (SMT) to manage large amounts of data off-chain while maintaining security guarantees on-chain. CoTA can be thought of as a layer 1.5 protocol that operates internally using the account-model, storing both data and ownership information in a distributed cell structure on top of UTXOs.

Each user creates a single permanent CoTA cell that becomes part of the distributed asset registry. Inside of each CoTA cell is a single SMT root hash consisting of exactly 32 bytes that provide provable information about the assets contained within the cell. The amount of data remains the same in a CoTA cell regardless of how many NFTs or how much data is associated with the user. An unlimited amount of NFTs can be created and held without increasing state rent costs.

CoTA builds on its distributed cell structure to add an innovative transfer mechanism that eliminate the immediate onboarding costs for new users to receive assets. CoTA assets operate on layer 1.5, which uses internal ownership tracking that is separate from the cell model. When assets are transferred on CoTA, they are marked for recipients without leaving the sender's cell. This means that CoTA NFTs effectively bypass the state rent requirements, allowing NFTs to be minted for near-zero cost and can be sent to new users who hold no CKB. The caveat being that the receiver cannot transfer an NFT again until they complete the one-time CoTA cell registration process and complete the claim process which moves the NFT from the original sender's CoTA cell to their own CoTA cell.

The CoTA transfer process involves four distinct stages:

| Stage | Sender | Receiver | Transfer&nbsp;Capability | Notes |
|:------|:-------|:---------|:-------------------|:------|
| Initial | Owns NFT | No NFT | Transferable. | NFT resides in sender's cell. |
| After Transfer | No NFT | Owns NFT (unclaimed) | Non-transferable. | Ownership marked, NFT still in sender's cell. |
| After Registration | No NFT | Owns NFT (unclaimed) | Non-transferable. | Receiver creates CoTA cell for claiming. |
| After Claim | No NFT | Owns NFT<br>(claimed) | Transferable. | NFT moved to receiver's cell. |

The registration process has a one-time fee of 150CKB, which is non-refundable since the cell that is created effectively becomes part of CoTA's distributed cell structure. Registration is required to claim an NFT that has been marked for transfer, but it is not a requirement. Recipients will see unclaimed NFTs in their wallets just like normal NFTs, but they must register and claim if they want to send the NFT to someone else.

The following diagram illustrates how these stages work in practice with specific CKB capacity movements:

```
Task: Send 1 FISH NFT to receiver.

Initial State:
Sender: [CoTA Cell: 1 FISH NFT + 150 CKB]    Receiver: [150 CKB]
        (NFT in CoTA cell; NFT owned by sender)        (regular cell)
Aggregator: Sender owns 1 FISH NFT. Transfer possible.

After Transfer (Ownership Marked):
Sender: [CoTA Cell: 1 FISH NFT + 150 CKB]    Receiver: [150 CKB]
        (NFT unmoved; owned by receiver)               (regular cell)
Aggregator: Receiver owns 1 FISH NFT. Unclaimed; transfer unavailable.

After Registration (Required for receiver claim; optional):
Sender: [CoTA Cell: 1 FISH NFT + 150 CKB]    Receiver: [CoTA Cell: 150 CKB]
        (unchanged)                                    (converted to CoTA cell)
Aggregator: Receiver owns 1 FISH NFT. Unclaimed; transfer unavailable.

After Claim (Optional):
Sender: [CoTA Cell: 0 FISH NFT + 150 CKB]    Receiver: [CoTA Cell: 1 FISH NFT + 150 CKB]
        (NFT moved out of sender's cell)               (NFT moved to receiver's cell)
Aggregator: Receiver owns 1 FISH NFT. Transfer possible.
```

**Pros:**
- Sender does not pay the CKB for the receiver's CoTA cell.
- Does not require the receiver to pre-deploy asset receiver cells.
- Zero state rent cost for unclaimed transfers; claiming is not strictly required. 
- No trust requirements.

**Cons:**
- Receiver must have CKB to register a CoTA cell before claiming.
- CoTA's layer 1.5 protocol has some incompatibilities with other protocols.  
- Requires an off-chain aggregator service for interpreting data.
- Limited wallet and tooling support.
- Transactions are more complex and must be generated using the CoTA SDK in conjunction with an aggregator.

**Resources:**
- [CoTA Protocol Overview](https://www.cotadev.io/docs/protocols/cota_main) - Official protocol documentation.
- [CoTA SDK JavaScript](https://github.com/nervina-labs/cota-sdk-js) - JavaScript SDK for CoTA integration.
- [CoTA SDK Examples](https://github.com/nervina-labs/cota-sdk-js/tree/develop/example) - Usage examples and integration guides.

### Public Relay Cells Pattern (ACP Enhancement; Experimental)

Public relay cells are an optional enhancement to the Anyone-Can-Pay pattern that address the concurrency limitations by introducing public storage cells that act as temporary holding areas for token transfers. This pattern solves the collision problem where multiple simultaneous transfers to the same ACP cell would fail due to the deterministic nature of transfers on CKB.

In addition to increasing throughput to a single address by allowing parallel deposits, relay cells can serve as temporary holding areas for new users who haven't yet deployed their own ACP cells. This allows new users to receive tokens without any upfront CKB requirement, dramatically lowering the barrier to entry into the ecosystem.

The relay cells are serviced by a decentralized network of fulfillment bots that monitor deposits and deliver tokens to their final destinations. These bots compete to process transfers, earning small fees for providing this collection and delivery service. This creates a permissionless marketplace where anyone can operate a fulfillment bot, ensuring system resilience without single points of failure while creating earning opportunities for operators providing fulfillment services.

```
Task: Send 50 BIRD coin to receiver (via relay cells).

Initial State:
Sender: [200 BIRD coin + 500 CKB]    Receiver: [ACP Cell: 142 CKB]
        (sender's cell)                       (empty ACP cell)
Relay Pool: [Relay Cell 1: 142 CKB]
            [Relay Cell 2: 142 CKB] 
            [Relay Cell 3: 142 CKB]
            (multiple relay cells available)

After Deposit to Relay:
Sender: [150 BIRD coin + 500 CKB]    Receiver: [ACP Cell: 142 CKB]
        (remaining in cell)                   (unchanged)
Relay Pool: [Relay Cell 1: 50 BIRD coin + 142 CKB]
            [Relay Cell 2: 142 CKB]           (tokens stored with target)
            [Relay Cell 3: 142 CKB]
            
After Service Collection:
Sender: [150 BIRD coin + 500 CKB]    Receiver: [ACP Cell: 50 BIRD coin + 142 CKB]
        (unchanged)                           (tokens delivered by service)
Relay Pool: [Relay Cell 1: 142 CKB]
            [Relay Cell 2: 142 CKB]          (relay cell cleared)
            [Relay Cell 3: 142 CKB]
```

**Pros:**
- Sender does not pay the CKB for the receiver's cell.
- Does not require the receiver to pre-deploy asset receiver cells (ACP cells).
- No trust requirements.

**Cons:**
- Receiver must eventually have CKB to claim assets to a cell they own.
- Unclaimed assets may be returned or forfeited.
- Emerging incomplete standard with no implementation.

**Challenges:**
As this standard is still a work in progress, several challenges remain to be addressed. One concern is the potential for relay cell clogging if tokens remain unclaimed for extended periods. Proposed solutions include implementing asset forfeiture mechanisms after certain timeframes, which would incentivize timely claiming while preventing permanent blockage of relay resources.

**Resources:**
- [Public Relay Cells Discussion](https://talk.nervos.org/t/a-ckb-efficient-and-anti-collision-xudt-transfer-scheme-on-ckb-l1/8765) - Original proposal and community discussion on Nervos Talk.

### Harbor Pattern (Fractal Standard; Experimental)

Harbor is a pattern within the Fractal token standard which is currently in early development stages. The Fractal standard takes inspiration from CoTA, using Sparse Merkle Trees (SMT) to manage asset data off-chain while maintaining security guarantees on-chain. However, Fractal utilizes the Cell Model for ownership designation instead of a layer 1.5 account model structure. Harbors have similarities to public relay cells in being publicly available areas for asset storage, but Harbors can be used both as temporary storage and permanent storage.

A Fractal cell contains a single SMT root hash consisting of exactly 32 bytes, similar to a CoTA cell. The amount of data always remains the same regardless of how many assets are associated with the user, allowing for an unlimited amount of assets to be held without increasing state rent costs. A Fractal cell uses normal locks and allows the owner to control all assets within the cell.

A Harbor cell is a special kind of Fractal cell, which is created by anyone for public use. Anyone can store a Fractal asset in any Harbor by paying a small "parking fee" to the operator. Multiple Harbors can be created by anyone to create a competitive marketplace that keeps fees reasonable while providing parallelism for concurrent transfers. Should an operator wish to close their Harbor to recoup the CKB being used for state rent, they are free to do so at any time. However, if there are any Fractal assets stored within the harbor they are trying to close, they must migrate them to another open harbor and pay the parking fee for each asset.

Harbor cells can serve as holding areas for new users who haven't yet acquired any CKB to create their own Fractal cell, allowing them to bypass the state rent requirements. Since Fractal cells can hold any number of assets, they never will experience a "clogging" scenario that could happen with a public relay cell. For this reason, a Fractal cell is suitable for permanent storage. However, some smart contracts may not be able to operate normally with assets in a Harbor, and may still require withdrawal to a normal Fractal cell.

**Note:** The Fractal Standard and Harbor pattern are in very early development and specifications may change significantly.

The Harbor transfer process involves up to four distinct stages:

| Stage | Sender | Receiver | Transfer&nbsp;Capability | Notes |
|:------|:-------|:---------|:-------------------|:------|
| Initial | Owns assets | No assets | Transferable. | Assets reside in sender's cell or a Harbor cell. |
| After Transfer | No assets | Owns assets (in&nbsp;Harbor) | Transferable. | Ownership marked, assets transferred to Harbor cell. |
| After Registration | No assets | Owns assets (in&nbsp;Harbor) | Transferable. | Receiver creates Fractal cell for claiming. Optional. |
| After Claim | No assets | Owns assets | Transferable. | Assets moved to receiver's cell. Optional. |

The registration process requires 150CKB to create a Fractal cell, which is refundable if the cell is later destroyed. Registration is required to claim assets that have been stored in a Harbor, but it is not strictly necessary for ownership. Recipients use Harbor-stored assets as if they were holding them directly and can transfer them to other users as needed.

The following diagram illustrates how these stages work in practice with specific CKB capacity movements:

```
Task: Send 75 WOLF coin to receiver.

Initial State:
Sender: [Fractal Cell: 75 WOLF coin + 150 CKB]    Receiver: [150 CKB]
        (assets in Fractal cell; owned by sender)          (regular cell)
Aggregator: Sender owns 75 WOLF coin. Transfer possible.

After Transfer to Harbor:
Sender: [Fractal Cell: 0 WOLF coin + 150 CKB]    Receiver: [150 CKB]
        (assets moved to Harbor; owned by receiver)        (regular cell)
Harbor: [Harbor Cell: 75 WOLF coin + 150 CKB]
        (assets stored; owned by receiver)
Aggregator: Receiver owns 75 WOLF coin. In Harbor; transfer possible.

After Registration (Required for receiver claim; optional):
Sender: [Fractal Cell: 0 WOLF coin + 150 CKB]    Receiver: [Fractal Cell: 150 CKB]
        (unchanged)                                        (converted to Fractal cell)
Harbor: [Harbor Cell: 75 WOLF coin + 150 CKB]
        (assets stored; owned by receiver)
Aggregator: Receiver owns 75 WOLF coin. In Harbor; transfer possible.

After Claim (Optional):
Sender: [Fractal Cell: 0 WOLF coin + 150 CKB]    Receiver: [Fractal Cell: 75 WOLF coin + 150 CKB]
        (unchanged)                                        (assets moved to receiver's cell)
Harbor: [Harbor Cell: 150 CKB]
        (assets in harbor cleared after claim)
Aggregator: Receiver owns 75 WOLF coin. Transfer possible.
```

**Pros:**
- Sender does not pay the CKB for the receiver's cell.
- Does not require the receiver to pre-deploy asset receiver cells.
- No trust requirements.

**Cons:**
- Receiver must eventually have CKB to claim assets to a cell they own.
- Requires an off-chain aggregator service for interpreting data.
- Transactions are more complex and must be generated using the Fractal SDK in conjunction with an aggregator.
- Emerging incomplete standard with no implementation.

## Closing

The Cell Model's state rent requirement creates unique challenges for asset transfers that have sparked innovative design patterns that offer different trade-offs between simplicity, cost, trust, and user experience.

This document explores seven distinct transfer patterns for addressing state rent challenges in UTXO-based asset transfers:

1. **Sender Pays State Rent** - The most straightforward approach where senders cover all capacity costs for receivers' new cells. While simple to implement and requiring no CKB from receivers, it scales poorly as CKB prices increase and creates barriers for frequent transfers.

2. **Send and Refund** - A trust-based pattern where senders initially pay state rent, then receivers refund the capacity. Conceptually simple but requires active receiver participation and trust, with limited automated solutions for user-to-user transfers.

3. **Anyone-Can-Pay (ACP)** - A mature, trustless solution using special cells that unlock when receiving assets. Requires receivers to pre-deploy cells for each asset type and has concurrency limitations, but offers proven reliability for users.

4. **Cheque Cell** - Implements a bank cheque-like mechanism where senders create claimable cells with automatic withdrawal after timeout. Provides trustless transfers without pre-deployment requirements but adds complexity for managing unclaimed assets.

5. **CoTA (Compact Token Aggregator)** - An innovative layer 1.5 protocol using Sparse Merkle Trees for off-chain data management. Virtually eliminates state rent for unclaimed transfers and allows near zero-cost minting, but requires off-chain aggregator infrastructure and has protocol incompatibilities.

6. **Public Relay Cells (Experimental)** - An ACP enhancement using intermediate public storage cells to address concurrency limitations. Enables parallel deposits and serves new users without upfront CKB requirements, but relies on decentralized fulfillment bots and remains in experimental stages.

7. **Harbor (Fractal Standard; Experimental)** - An emerging pattern within the Fractal token standard that combines the use of Sparse Merkle Trees for off-chain data management with decentralized public cells for asset storage. Allows for near zero-cost minting and eliminates state rent for newly onboarded users. However, the standard is in very early development with no current implementation.

### Which Pattern to Use?

**For Simple Applications:**
- Use "Sender Pays State Rent" for low-volume transfers where simplicity matters most.
- Consider "Send and Refund" for applications which inherently require trust and the pattern offers few drawbacks.

**For Production Applications:**
- Choose "Anyone-Can-Pay" for mature applications where deposits are made to an application where pre-deploying ACP cells is possible.
- Select "Cheque Cell" when receivers cannot pre-deploy cells but trustless transfers are essential.
- Consider "CoTA" for NFT applications where low-cost NFTs and unclaimed transfers provide significant user experience benefits.

**For Future Applications:**
- Evaluate "Public Relay Cells" as a solution to scale ACP's concurrency limitations.
- Monitor "Harbor" development for future ultra-low-cost asset solutions.
