---
# REQUIRED FIELDS
title: "The Blake2b Pattern in CKB Development"
slug: "the-blake2b-pattern-in-ckb-development"
permalink: /posts/{{ slug }}/
date: 2025-09-10
layout: layouts/post.njk

# STANDARD FIELDS  
tags: ["post", "cryptography", "blake2b", "development", "smart-contracts"]
author: "Jordan Mack"
id: "ckb-002"  # Used for image folder: /assets/images/posts/ckb-002/

# OPTIONAL FIELDS
# pinned: true  # Uncomment to pin post
# updated: 2025-09-10  # Only add when post is actually updated
---

When working with CKB (Nervos), you'll encounter blake2b hashing everywhere. Understanding this consistent pattern is crucial for CKB development, as it's the cryptographic foundation for addresses, script hashes, and transaction signing.

## The CKB Blake2b Standard

CKB uses a specific configuration of blake2b throughout the platform:

- **Algorithm**: blake2b-256 (outputs 32 bytes)
- **Personalization**: "ckb-default-hash"
- **Common variant**: blake160 (truncated to first 20 bytes)

This standardization ensures consistency and predictability across all CKB components.

## Why Blake2b?

CKB chose blake2b over alternatives like SHA-256 or keccak256 for several reasons:

1. **Performance**: Blake2b is faster than MD5, SHA-1, SHA-2, and SHA-3 on modern 64-bit platforms
2. **Security**: Provides strong cryptographic guarantees with no known vulnerabilities
3. **Flexibility**: Supports variable output lengths and personalization
4. **Simplicity**: No need for HMAC construction; personalization is built-in

## Common Uses in CKB

### 1. Public Key to Lock Arg (Blake160)

The most common pattern - converting a public key to a lock arg:

```javascript
import blake2b from "blake2b";

function publicKeyToLockArg(publicKey) {
	const blake2bHash = blake2b(
		32,                                    // Output length: 32 bytes
		null,                                  // No key
		null,                                  // No salt
		new TextEncoder().encode("ckb-default-hash")  // Personalization
	);
	
	blake2bHash.update(hexToUint8Array(publicKey));
	const hash = blake2bHash.digest();
	
	// Take first 20 bytes (160 bits) - this is "blake160"
	return uint8ArrayToHex(hash.slice(0, 20));
}
```

### 2. Script Hash Calculation

When calculating a script hash, CKB hashes the serialized script structure:

```javascript
// Using Lumos helper (recommended)
import {utils} from "@ckb-lumos/base";
const {computeScriptHash} = utils;

const scriptHash = computeScriptHash({
	codeHash: "0x9bd7e06f...",
	hashType: "type",
	args: "0xb39bbc0b3673c7d36450bc14cfcdad2d559c6c64"
});
```

### 3. Transaction Signing

For transaction signatures, CKB uses the full blake2b-256 hash:

```javascript
// Transaction signing message construction
const message = blake2b(32, null, null, 
	new TextEncoder().encode("ckb-default-hash"))
	.update(txHash)
	.update(witnessData)
	.digest();
```

### 4. Cell Data Hashing

When referencing cells by data hash:

```javascript
const dataHash = ckbHash(cellData);  // Full 32-byte blake2b hash
```

## The Personalization String

The "ckb-default-hash" personalization is critical. It:

- Prevents cross-protocol attacks
- Ensures CKB hashes are domain-specific
- Makes accidental hash collisions with other systems impossible

Never omit this personalization - it's a security feature, not just a convention.

## Blake160 vs Full Hash

**Use Blake160 (20 bytes) for:**
- Lock args from public keys
- Compact identifiers where 160 bits of security is sufficient

**Use Full Blake2b (32 bytes) for:**
- Script hashes
- Transaction hashes
- Cell data hashes
- Any cryptographic commitment requiring maximum security

## Implementation with Lumos

Lumos provides the `ckbHash()` helper that implements the standard pattern:

```javascript
import {utils} from "@ckb-lumos/base";
const {ckbHash} = utils;

// Equivalent implementations:
// Manual
const manual = blake2b(32, null, null, 
	new TextEncoder().encode("ckb-default-hash"))
	.update(data)
	.digest();

// Lumos helper
const withLumos = ckbHash(data);
```

## Common Pitfalls

1. **Forgetting personalization**: Always include "ckb-default-hash"
2. **Wrong truncation**: Blake160 is first 20 bytes, not last
3. **Encoding confusion**: Ensure consistent hex/byte array conversions
4. **Hash type mixing**: Don't confuse blake2b with keccak256 (used in Ethereum)

## Practical Example: Complete Flow

```javascript
// Complete example showing the blake2b pattern
import {ckbHash} from "@ckb-lumos/base";

// 1. Start with private key
const privateKey = "0xd00c06bfd800d27397002dca6fb0993d5ba6399b4238b2f29ee9deb97593d2bc";

// 2. Generate public key
const publicKey = secp256k1.publicKeyCreate(hexToUint8Array(privateKey));

// 3. Apply blake2b with personalization, truncate to 20 bytes
const lockArg = ckbHash(publicKey).substring(0, 42); // 0x prefix + 40 hex chars

// 4. Create lock script
const lockScript = {
	codeHash: "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
	hashType: "type",
	args: lockArg
};

// 5. Calculate script hash (full blake2b of serialized script)
const scriptHash = computeScriptHash(lockScript);
```

## Comparison with Other Blockchains

| Blockchain | Hash Function | Public Key → Address |
|------------|--------------|---------------------|
| CKB | blake2b-256 | blake160 (first 20 bytes) |
| Ethereum | keccak256 | Last 20 bytes of keccak256 |
| Bitcoin | SHA256 + RIPEMD160 | Hash160 (SHA256 then RIPEMD160) |

## Conclusion

The blake2b pattern in CKB is remarkably consistent: always use blake2b-256 with "ckb-default-hash" personalization. Whether you're generating lock args, calculating script hashes, or signing transactions, this pattern remains the same. Understanding this foundation will make your CKB development journey much smoother.

Remember: when in doubt, use the Lumos `ckbHash()` helper - it implements the pattern correctly and saves you from potential mistakes.