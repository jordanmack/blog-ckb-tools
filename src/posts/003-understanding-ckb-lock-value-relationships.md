---
# REQUIRED FIELDS
title: "Understanding CKB Lock Value Relationships"
slug: "understanding-ckb-lock-value-relationships"
permalink: /posts/{{ slug }}/
date: 2025-09-18
layout: layouts/post.njk

# STANDARD FIELDS  
tags: ["post", "lock-script", "addresses", "cryptography", "keys", "scripts", "smart-contracts"]
author: "Jordan Mack"
id: "lock-value-relationships"  # Used for image folder: /assets/images/posts/lock-value-relationships/

# OPTIONAL FIELDS
# pinned: true  # Uncomment to pin post
# updated: 2025-09-10  # Only add when post is actually updated
post-image: "/assets/images/posts/lock-value-relationships/post-image.jpg"
---

In CKB smart contract development, it is important to understand how different lock-related values connect to each other. These values form a chain of cryptographic relationships that are used throughout smart contract development for purposes such as ownership verification, address generation, and cross-referencing between different scripts.

[[toc]]

## The Value Derivation Chain

Here's how all lock-related values connect in CKB at a high level:

<style>
.diagram-box { background-color: #1a1a1a; border: 1px solid #333333; border-radius: 0.5rem; padding: 1.5rem; margin: 1.5rem 0; font-family: 'Courier New', monospace; font-size: 0.9rem; line-height: 1.8; }
.diagram-line { display: flex; align-items: center; margin-bottom: 0.5rem; }
.value { color: #4fc3f7; font-weight: 600; display: inline-block; width: 110px; text-align: left; }
.transform { color: #ffa726; font-style: italic; display: inline-block; width: 260px; text-align: center; margin: 0; }
.result { color: #66bb6a; font-weight: 600; display: inline-block; width: 110px; text-align: right; }
.arrow { color: #666666; margin: 0 12px; }
.legend-value { color: #4fc3f7; font-weight: 600; }
.legend-transform { color: #ffa726; font-style: italic; }
.legend-result { color: #66bb6a; font-weight: 600; }
</style>

<div class="diagram-box">
<div class="diagram-line">
<span class="value">Private Key</span><span class="arrow">→</span><span class="transform">secp256k1 elliptic curve</span><span class="arrow">→</span><span class="result">Public Key</span>
</div>
<div class="diagram-line">
<span class="value">Public Key</span><span class="arrow">→</span><span class="transform">blake160 (ckbhash + truncate)</span><span class="arrow">→</span><span class="result">Lock Arg</span>
</div>
<div class="diagram-line">
<span class="value">Lock Arg</span><span class="arrow">→</span><span class="transform">add code_hash + hash_type</span><span class="arrow">→</span><span class="result">Lock Script</span>
</div>
<div class="diagram-line">
<span class="value">Lock Script</span><span class="arrow">→</span><span class="transform">ckbhash (molecule serialized)</span><span class="arrow">→</span><span class="result">Lock Hash</span>
</div>
<div class="diagram-line">
<span class="value">Lock Script</span><span class="arrow">→</span><span class="transform">bech32m encoding</span><span class="arrow">→</span><span class="result">Address</span>
</div>
<div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #333;">
<div class="diagram-line">
<span class="legend-value">Starting Value</span><span class="arrow">→</span><span class="legend-transform">Transformation</span><span class="arrow">→</span><span class="legend-result">Resulting Value</span>
</div>
</div>
</div>

## Understanding Each Value
Below we will explain each of the values and their relationships with each other in more detail. On CKB you can use any cryptographic algorithm you want, but most wallets rely on `secp256k1` because that is what is used for the fallback lock `secp256k1-blake160-sighash-all`. Our descriptions and examples will all assume this lock.

### Private Key (32 bytes)
The chain starts with a secret private key that is never shared but used to prove ownership. This is your fundamental credential for controlling CKB cells and assets.

```javascript
// Private keys are represented as hex strings in CCC.
const privateKey = "0xd00c06bfd800d27397002dca6fb0993d5ba6399b4238b2f29ee9deb97593d2bc";
```

**Why it matters:** Your private key is the root of all ownership verification in CKB. During transaction validation, you use this key to create digital signatures that prove you control specific cells without revealing the key itself.

**Further Learning:**
- [Public Key Cryptography (YouTube Video)](https://www.youtube.com/watch?v=AQDCe585Lnc)

### Public Key (33 bytes)
The public key is derived from the private key using `secp256k1` elliptic curve cryptography. This is the shareable counterpart to your private key that enables others to verify your signatures.

```javascript
import {SignerCkbPrivateKey, ccc} from "@ckb-ccc/core";

// Initialize CCC client (testnet example).
const client = new ccc.ClientPublicTestnet();

// Create a signer from the private key.
const signer = new SignerCkbPrivateKey(client, privateKey);
const publicKey = signer.publicKey;
// Example: 0x03fe6c6d09d1a0f70255cddf25c5ed57d41b5c08822ae710dc10f8c88290e0acdf (33 bytes).

// Or derive manually using secp256k1.
// const secp256k1 = require('secp256k1');
// const publicKey = "0x" + Buffer.from(secp256k1.publicKeyCreate(Buffer.from(privateKey.slice(2), 'hex'), true)).toString('hex');
```

**Why it matters:** Your public key enables signature verification without exposing your private key. It's also the starting point for generating your unique account identifier (lock arg) that distinguishes your cells from all other users.

**Further Learning:**
- [Public Key Cryptography (YouTube Video)](https://www.youtube.com/watch?v=AQDCe585Lnc)

### Lock Arg (20 bytes)
The lock arg is generated by applying `ckbhash` to the public key and taking the first 20 bytes (`blake160`). This is the same length as both Bitcoin and Ethereum.

```javascript
import {hashCkb, ccc} from "@ckb-ccc/core";

// Derive from public key to show the transformation.
const lockArg = hashCkb(publicKey).slice(0, 42);
// Example: "0xc8328aabcd9b9e8e64fbc566c4385c3bdeb219d7" (20 bytes).

// Or get it from an address object.
// const addressObj = await signer.getAddressObjSecp256k1();
// const lockArg = addressObj.script.args;
```

**Why it matters:** This value uniquely identifies your "account" when placed in the `args` field of the `secp256k1-blake160-sighash-all` lock script. The `args` value is how the code knows who owns the cell. It serves as an identifier for the basis of authentication, and also a label on cells that can be searched for when building transactions.

**Further Learning:**
- [Using the CKBHash Function in CKB Development](/posts/using-the-ckbhash-function-in-ckb-development/)
- [secp256k1_blake160_sighash_all Script Implementation](https://github.com/nervosnetwork/ckb-system-scripts/blob/master/c/secp256k1_blake160_sighash_all.c)

### Lock Script (Structure)
The complete script structure that defines cell ownership. This identifies the script code that is executed with your unique identifier to create a lock that is only accessible with your private key.

```javascript
import {Script, ccc} from "@ckb-ccc/core";

// Create a lock script using CCC.
const lockScript = ccc.Script.from({
	codeHash: "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
	hashType: "type",
	args: "0xc8328aabcd9b9e8e64fbc566c4385c3bdeb219d7"
});

// Or get it from an address object.
// const addressObj = await signer.getAddressObjSecp256k1();
// const lockScript = addressObj.script;
```

**Key components:**
- **`codeHash`**: The hash that identifies the script code to execute.
- **`hashType`**: Used to indicate how to interpret the code hash.
- **`args`**: Your unique identifier (the lock arg derived from your public key).

**Why it matters:** A lock script is a structure that defines ownership rules for cells. It specifies script code (smart contract) that will execute to validate ownership and arguments provided to the code (lock arg) that determine who can access it.

**Further Learning:**
- [Introduction to CKB Script Programming](https://docs.nervos.org/docs/script/intro-to-script)
- [Build a Simple Lock Script](https://docs-new.nervos.org/docs/dapp/simple-lock)

### Lock Hash (32 bytes)
A unique identifier for the complete lock script structure, calculated by hashing the script structure after being serialized with `molecule`.

```javascript
import {hashCkb, ccc} from "@ckb-ccc/core";

// Manual calculation to show the transformation.
const lockHash = hashCkb(lockScript.toBytes());
// Example: "0x32e555f3ff8e135cece1351a6a2971518392c1e30375c1e006ad0ce8eac07947".

// Or use the built-in method (more common).
// const lockHash = lockScript.hash();
// This performs: hashCkb(molecule_encode(lockScript)).
```

**Why it matters:** A lock script is a structure comprised of a code hash, hash type, and lock args. This complete component structure is what determines ownership of cells, but it's not easily referenced since it is three long fields. By serializing and hashing the lock script into a lock hash we end up with a space-efficient identifier that can be easily referenced by smart contracts.

**Further Learning:**
- [Serialization and Molecule in CKB](https://docs.nervos.org/docs/serialization/serialization-molecule-in-ckb)
- [Molecule Serialization Specification](https://github.com/nervosnetwork/molecule)
- [Molecule Tools Documentation](https://docs.nervos.org/docs/serialization/tools-molecule)
- [Script Hash Calculation in CKB](https://docs.ckb.dev/docs/rfcs/0022-transaction-structure/0022-transaction-structure)

### Address (Human-Readable)
The single line representation of your lock script that encodes all the data about the lock script structure in a human-readable format that's easy to share and has checksum validation to prevent mistakes.

```javascript
import {ccc} from "@ckb-ccc/core";

// Create address from lock script to show the transformation.
const address = ccc.Address.fromScript(lockScript, client).toString();
// Example: "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqwgx292hnvmn68xf779vmzrshpmm6epn4c0cgwga".

// Or get it directly from the signer (more common).
// const address = (await signer.getAddressObjSecp256k1()).toString();
```

**Why it matters:** Addresses provide a standardized way to share the complete lock script structure in a way that is human-readable and also reversible. A lock hash is similar in that it provides a more concise way to reference a lock script, but since it uses one-way hashing the full lock script structure cannot be extracted. When transferring funds to someone the full lock script is needed, which is why addresses must be used instead of lock hashes.

**Further Learning:**
- [CKB Address Technical Explanation](https://docs-new.nervos.org/docs/tech-explanation/ckb-address)
- [CKB RFC 0021: CKB Address Format](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0021-ckb-address-format/0021-ckb-address-format.md)

## Acquiring Values with CCC

Here's how to obtain each lock-related value using CCC as the library was designed to be used. Rather than manually calculating each transformation, CCC provides high-level methods that handle the derivation chain internally:

```javascript
import {SignerCkbPrivateKey, Script, ccc} from "@ckb-ccc/core";

// Initialize CCC client.
const client = new ccc.ClientPublicTestnet(); // Use ClientPublicMainnet() for mainnet.

// 1. Start with a private key.
const privateKey = "0xd00c06bfd800d27397002dca6fb0993d5ba6399b4238b2f29ee9deb97593d2bc";

// Create signer from private key.
const signer = new SignerCkbPrivateKey(client, privateKey);

// 2. Get public key from signer.
const publicKey = signer.publicKey;

// Get complete address object (contains all derived values).
const addressObj = await signer.getAddressObjSecp256k1();

// 3. Extract lock arg from address object.
const lockArg = addressObj.script.args;

// 4. Extract lock script from address object.
const lockScript = addressObj.script;

// 5. Calculate lock hash from lock script.
const lockHash = lockScript.hash();

// 6. Get human-readable address.
const address = addressObj.toString();

console.log("Lock Value Chain:");
console.log(`1. Private Key: ${privateKey}`);
console.log(`2. Public Key: ${publicKey}`);
console.log(`3. Lock Arg: ${lockArg}`);
console.log(`4. Lock Script:`, lockScript);
console.log(`5. Lock Hash: ${lockHash}`);
console.log(`6. Address: ${address}`);
```

For a complete working example with both CCC and Lumos implementations, see the [Lock Value Relationships Demo (GitHub)](https://github.com/sonami-tech/lock-value-relationships-demo).

## Further Learning

Additional resources and learning materials are available for those interested in deepening their understanding of CKB development.

- [Nervos Developer Documentation](https://docs.nervos.org/)
- [Nervos University](https://university.nervos.org/)
- [Lock Value Relationships Demo (GitHub)](https://github.com/sonami-tech/lock-value-relationships-demo)
