---
title: "What a 'valid address' actually means on Ethereum, TRON, and Solana"
description: "One chain hides its checksum in the casing, one bakes it into the encoding, and one skips it entirely. Lessons from validating deposit addresses on a payment platform that supported all three."
ogTitle: "What 'valid address' means on ETH, TRON, and Solana"
ogDescription: "Optional checksum, mandatory checksum, no checksum. How three address formats fail differently when real money flows through your validator."
date: 2026-07-20
author: Samiul
topics: [Ethereum, TRON, Solana, Addresses, Checksums, Payments]
draft: true 
---

A user opens a support ticket: "I withdrew USDT and it never arrived." You pull up the withdrawal. The address passed validation. The transaction confirmed. The explorer shows the funds sitting exactly where you sent them. The problem is that nobody controls that address, and nobody ever will.

I spent a good while working on a crypto payment platform that handled deposits and withdrawals across Ethereum, TRON, and Solana. Address validation sounds like the boring part of that job. It's a regex, right? Ship it and move on to the interesting stuff.

It's not a regex. Or rather, if it is a regex, you've already lost money and you just haven't noticed yet. These three chains have wildly different opinions about what an address even *is*, and the differences are exactly the kind that don't show up in testing. Everything works fine until the one user who pastes a corrupted address, and then it works fine for them too. That's the problem.

Let me walk through each chain the way I wish someone had walked me through them.

---

## Ethereum: the checksum is optional, which means it's optional

An Ethereum address is 20 bytes, hex-encoded, with a `0x` prefix. Forty hex characters. Any 40 hex characters. There is no checksum baked into the format, no magic prefix, no validity rule beyond "is this hex". If a user fat-fingers one character, the result is still a perfectly valid Ethereum address. It just belongs to nobody.

The ecosystem's answer to this is [EIP-55](https://eips.ethereum.org/EIPS/eip-55), and it's genuinely clever. It hides a checksum in the *capitalization* of the letters. You take the lowercase address, hash it with keccak256, and for each letter in the address, you uppercase it if the corresponding nibble of the hash is 8 or higher. The result looks like this:

```
0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed
```

That mixed casing isn't random. It encodes roughly 15 bits of checksum on a typical address, which catches a single-character typo with about 99.99% probability. No format change, fully backward compatible, and any tool that doesn't know about EIP-55 just sees a normal address.

Here's the catch, and this is the part that matters if you're accepting addresses from users: **an all-lowercase address is also valid.** It has to be, for backward compatibility. So the standard validation logic goes:

1. Mixed case? Verify the EIP-55 checksum, reject on mismatch.
2. All lowercase (or all uppercase)? Accept it. There's no checksum to check.

Which means the checksum only protects users whose wallet preserved the casing all the way to your input field. In practice, addresses get lowercased constantly. Databases with case-insensitive collation, some ENS tooling, users typing addresses by hand, a script somewhere calling `.toLowerCase()` for comparison and accidentally persisting the result. Every one of those strips the checksum, and your validator will happily wave through whatever comes out the other side.

On our platform we saw this from the other direction too: we *generated* deposit addresses, and early on we stored them lowercased. Fine for lookups. Then those addresses got displayed to users, copied into external wallets, and every safety net EIP-55 could have provided was already gone before the user even saw the address. We fixed it by checksumming at the display boundary, always. If an address leaves your system, it leaves in EIP-55 form. It costs you one keccak call.

One more thing that trips people up is that format validity says nothing about the *chain*. `0x` plus 40 hex characters is a valid address on Ethereum, BSC, Polygon, Arbitrum, and every other EVM chain. USDT exists on most of them. When a user picks the wrong network at withdrawal, your address validator cannot save them, because the address genuinely is valid on both chains. That's a UX problem you solve with confirmation screens and network warnings, not with validation logic.

---

## TRON: a real checksum, and a familiar face underneath

TRON addresses look nothing like Ethereum addresses:

```
TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
```

Thirty-four characters, always starts with `T`, Base58 alphabet. But peel back the encoding and it's the same animal. A TRON address is a 20-byte payload, exactly like Ethereum's, with a `0x41` version byte in front, run through Base58Check. Same elliptic curve, same keypair derivation. The same private key controls the "same" address on both chains, just dressed differently. TRON also has a raw hex representation (`41` followed by the 20 bytes) that you'll see in API responses, so your validator needs to handle both or normalize early.

The important difference is Base58Check. That "Check" suffix is doing real work. The last 4 bytes of the decoded address are a checksum, the first 4 bytes of a double SHA-256 over the payload. It's not optional and it's not cosmetic. Corrupt any character and the checksum fails on decode. The odds of a random mangled string passing are about 1 in 4.3 billion.

This is Bitcoin's address scheme, inherited wholesale, and honestly it's the right design. The checksum survives case changes (there's only one valid casing per address, since Base58 is case sensitive by nature), survives copy-paste through any system, and can't be silently stripped the way EIP-55 can. Of the three chains here, TRON is the only one where "the address decoded successfully" actually means something strong.

So TRON validation was the easy one for us? Mostly, yes. The footguns were in the edges.

- **The hex form.** If your withdrawal flow accepts `41`-prefixed hex because some integration sends it that way, you've just accepted an address format with no checksum at all. Normalize to Base58Check at the boundary and validate there.
- **The Ethereum relationship cuts both ways.** Because the underlying payload is identical, it's mechanically trivial to convert an Ethereum address to a TRON one. Some users know this and expect it to work. It does work, cryptographically, but only if the same party actually holds the key on both chains. A user converting their exchange-hosted Ethereum deposit address into TRON format and sending TRX to it is sending money to an address the exchange has never derived and will never watch. We saw variations of this. The funds aren't burned, technically. They're just behind a key that the rightful-ish owner's custodian doesn't know it has.

---

## Solana: there is no checksum, and that's not a typo

Here's where it gets fun. A Solana address is a 32-byte ed25519 public key, Base58 encoded. Note what's missing from that sentence: any mention of a checksum. Base58, not Base58Check. The encoding is pure. Decode the string, and if you get 32 bytes, congratulations, that's a structurally valid Solana address.

If you're coming from Bitcoin or TRON, this feels like someone forgot a step. But it's a deliberate trade. Base58 has no visually ambiguous characters (no `0`/`O`, no `I`/`l`), the addresses are long, and Solana's position is essentially that humans shouldn't be transcribing addresses by hand anyway. Copy-paste doesn't introduce single-character errors. Which is true, right up until it isn't: OCR from a screenshot, an address relayed over a phone call, a chat app that mangles a string, malware that swaps clipboard contents. When one of those happens on Ethereum, EIP-55 might catch it. On TRON, Base58Check almost certainly catches it. On Solana, if the corrupted string still decodes to 32 bytes, your validator says yes.

There's a length wrinkle too. People love to write `^[1-9A-HJ-NP-Za-km-z]{32,44}$` and call it done. Base58 doesn't map cleanly to fixed lengths: 32 bytes usually encodes to 43 or 44 characters, but leading zero bytes in the key shorten the string, so the valid range really is that wide. Which also means length can't disambiguate chains for you. A TRON address is 34 characters of Base58; a Solana key with enough leading zeros can be too, and yes, it can even start with `T`. It's rare, but "rare" in a payment system means "will happen, at the worst time, to a confused user." Chain detection by string shape is a heuristic, not a guarantee. If your product infers the network from the pasted address, have a tiebreak plan.

The actual decode check is cheap, so do the real thing:

```ts
import bs58 from "bs58";

function isValidSolanaAddress(input: string): boolean {
  try {
    return bs58.decode(input).length === 32;
  } catch {
    return false;
  }
}
```

But structural validity is only half the Solana story, because Solana's account model gives you a second, sneakier question, valid address *of what*?

Every 32-byte value is an address, but not every address is a wallet. Program derived addresses (PDAs) are deliberately off the ed25519 curve, meaning no private key exists for them. Associated token accounts, where SPL tokens like USDC actually live, are PDAs. So when a user gives you a "USDC address" on Solana, they might hand you their wallet address (on-curve, you derive the ATA and send there) or the token account itself (off-curve, valid, spendable by its owner). Both are legitimate deposit targets and your withdrawal flow has to handle both. We initially added an on-curve check as a safety filter, thinking off-curve meant garbage. It rejected real token accounts within days. The on-curve check is useful information, not a validity gate. What it *is* good for: if someone submits an off-curve address as a destination for native SOL, or as an account you expect to sign something later, that deserves a warning, because nothing can ever sign from it.

---

## Side by side

| | Ethereum | TRON | Solana |
|---|---|---|---|
| Raw form | 20 bytes | 20 bytes + `0x41` version byte | 32-byte ed25519 pubkey |
| Encoding | Hex, `0x` prefix | Base58Check | Base58 |
| Checksum | EIP-55, optional, in the casing | 4-byte double SHA-256, mandatory | None |
| Typo caught? | ~99.99% if mixed case, 0% if lowercased | ~100% | 0% if result decodes to 32 bytes |
| "Valid" tells you | It's 40 hex chars | Payload intact, it's a TRON-shaped address | It's 32 bytes |
| Sneaky failure mode | Lowercasing strips the checksum silently | Hex form bypasses the checksum | Token account vs wallet ambiguity |

The pattern worth internalizing: on TRON, validation failure is loud and validation success is meaningful. On Ethereum, success is only meaningful when the input was mixed case. On Solana, success means almost nothing beyond "well-formed," and the real questions start after decoding.

---

## What this looked like in practice

The rules we converged on, after learning most of them the expensive way:

**Validate at the boundary, normalize immediately.** One canonical form per chain, everywhere inside the system. EIP-55 for Ethereum, Base58Check for TRON, the Base58 string as-given for Solana. Every conversion between forms happens in one audited module, not scattered across services.

**Never lowercase an Ethereum address in a code path that can reach a user.** Compare case-insensitively if you must, but store and display checksummed. The checksum you preserve is the last line of defense for every downstream wallet and user.

**Reject bad EIP-55 checksums hard.** If the casing is mixed and the checksum fails, that is not a formatting quirk. That is a corrupted address, and it is the single highest-signal rejection your validator will ever make. Don't "helpfully" lowercase and retry.

**Treat address validity and destination correctness as separate checks.** The validator answers "is this well-formed for this chain." It cannot answer "is this the right chain for this asset" or "does the counterparty actually control this." Those need their own guardrails: network confirmation steps, warnings on first-time addresses, and on Solana, explicit handling for wallet vs token account destinations.

**Log the raw input.** When a user disputes a withdrawal, the difference between "they pasted a corrupted address" and "we corrupted it" is the difference between a sympathetic support reply and an incident report. You want the exact bytes they gave you, before any normalization touched them.

None of this is exotic. It's maybe two days of careful work per chain. But the failure mode of skipping it isn't an error message or a crash. It's a confirmed, irreversible transaction to an address that decodes perfectly and belongs to no one. The chain did exactly what you asked. That's the whole problem with getting this layer wrong: by the time you find out, the money already went exactly where you told it to.

---

> If you take one thing from this: a "valid address" is three different claims on these three chains, and only one of them (TRON's) comes with a strong guarantee built into the format. Design your validation around what each chain actually promises, not around what a regex can express.
