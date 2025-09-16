---
# REQUIRED FIELDS
title: "Using the CKBHash Function in CKB Development"
slug: "using-the-ckbhash-function-in-ckb-development"
permalink: /posts/{{ slug }}/
date: 2025-09-10
layout: layouts/post.njk

# STANDARD FIELDS  
tags: ["post", "ckbhash", "blake2b", "cryptography", "development", "hashing", "smart-contracts"]
author: "Jordan Mack"
id: "ckbhash"  # Used for image folder: /assets/images/posts/ckbhash/

# OPTIONAL FIELDS
# pinned: true  # Uncomment to pin post
# updated: 2025-09-10  # Only add when post is actually updated
---

When building smart contracts on CKB you are free to use any cryptographic function that you wish to use. However, many of the system scripts and within the commonly used libraries rely on Blake2b.

In this post we describe some of the specific CKB conventions on how to use it properly with the existing foundations. In most cases, you will rely on libraries that handle all of these details for you. However, advanced smart contract designs might benefit from understanding the specifics of how it is commonly used on CKB.

## The CKB Blake2b Standard (ckbhash)

Within the libraries you will find a function called "**ckbhash**". This is the a specific configuration of Blake2b:

- **Algorithm**: blake2b-256 (outputs 32 bytes).
- **Personalization**: "ckb-default-hash".
- **Common Variant**: blake160 (blake2b-256 truncated to first 20 bytes (160 bits)).

Blake2b-256 is always used for the ckbhash function. However, you will see some places that reference "blake160". This is still blake2b-256, but the hash hash been truncated to the first 20 byptes (160 bits).

The ckbhash function automatically applies the "ckb-default-hash" personalization, so you never need to manually configure the blake2b parameters when using library functions.

## Common Uses in CKB

The ckbhash function is used throughout CKB for:

1. **Secp256k1 Lock Arg (Blake160)** - The Secp256k1 lock requires a ckbhash of the public key truncated to the first 20 bytes.
2. **Script Hash Calculation** - Hashing serialized script structures for identification.
3. **Transaction Hashing** - Creating transaction identifiers (excluding witnesses).
4. **Transaction Witness Hash** - Hashing the complete serialized transaction including witnesses for block headers.
5. **Cell Data Hashing** - Generating data hashes for type scripts and cell references.
6. **Signing Message Construction** - Creating the message to sign by hashing tx hash plus witness data.

### 1. Public Key to Secp256k1 Lock Arg (Blake160)

Converts an secp256k1 public key into the required arg for the commonly used secp256k1_blake160_sighash_all lock, which is used in most wallets.

```javascript
import { Secp256k1Signer } from "@ckb-ccc/secp256k1";

const signer = new Secp256k1Signer(privateKey);
const lockArg = await signer.getRecommendedLockScriptArgs();  // Internally: ckbhash(publicKey).slice(0, 20)
```

### 2. Script Hash Calculation

Generates a unique identifier for any script by hashing its serialized structure, which is used for script identification and locating cells.

```javascript
import { Script } from "@ckb-ccc/core";

const script = new Script(
	"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",	// codeHash
	"type",																	// hashType
	"0xb39bbc0b3673c7d36450bc14cfcdad2d559c6c64"							// args
);

const scriptHash = script.hash();  // Internally: ckbhash(molecule_encode(script))
```

### 3. Transaction Hashing

Creates a unique identifier for transactions by hashing the raw transaction data, which excludes witnesses and is used for transaction references.

```javascript
import { Transaction } from "@ckb-ccc/core";

const tx = new Transaction(/* ... */);
const txHash = tx.hash();  // Internally: ckbhash(molecule_encode(raw_transaction))
```

### 4. Transaction Witness Hash

Computes the complete transaction hash including all witness data, which is used in block headers for the witness merkle tree.

```javascript
import { Transaction } from "@ckb-ccc/core";

const tx = new Transaction(/* ... */);
const witnessHash = tx.hashWithWitness();  // Internally: ckbhash(molecule_encode(full_transaction))
```

### 5. Cell Data Hashing

Generates a hash of cell data content, which is used by type scripts for data integrity verification and locating cells.

```javascript
import { ckbHasher } from "@ckb-ccc/core";

const hasher = ckbHasher();
hasher.update(cellData);
const dataHash = hasher.digest();  // Internally: ckbhash(cellData)
```

### 6. Signing Message Construction

Builds the final message to be signed by combining transaction hash with witness data, which ensures signatures cover the complete transaction context.

```javascript
import { Signer } from "@ckb-ccc/core";

const signature = await signer.signTransaction(tx);  // Internally: sign(ckbhash(txHash + witnessData))
```

## Complete Example with CCC

This example demonstrates the complete workflow from private key to script hash, showing how ckbhash is used at multiple stages: first to generate the blake160 lock arg from a public key, then to create a unique script identifier.

```javascript
import { Script } from "@ckb-ccc/core";
import { Secp256k1Signer } from "@ckb-ccc/secp256k1";

// Create signer from private key
const signer = new Secp256k1Signer("0xd00c06bfd800d27397002dca6fb0993d5ba6399b4238b2f29ee9deb97593d2bc");

// Get blake160 lock arg
const lockArg = await signer.getRecommendedLockScriptArgs();

// Create lock script
const lockScript = new Script(
	"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",  // mainnet secp256k1
	"type",
	lockArg
);

// Get script hash
const scriptHash = lockScript.hash();
```

## Further Reading

- **[How to Sign a Transaction](https://docs.nervos.org/docs/how-tos/how-to-sign-a-tx)** - Detailed explanation of transaction signing process.
- **[CCC Documentation](https://docs.nervos.org/docs/sdk-and-devtool/ccc)** - Official CCC usage guide.
- **[CKB System Scripts Repository](https://github.com/nervosnetwork/ckb-system-scripts)** - Source code for all CKB system scripts.
- **[CKB RFCs - Transaction Structure (RFC 0022)](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md)** - Defines the official ckbhash function specification.
- **[CKB RFCs - Genesis Script List (RFC 0024)](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0024-ckb-genesis-script-list/0024-ckb-genesis-script-list.md)** - Lists all system scripts including secp256k1_blake160_sighash_all.
