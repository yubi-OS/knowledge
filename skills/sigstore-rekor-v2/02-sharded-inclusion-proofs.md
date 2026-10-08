# 02 - Sharded inclusion proofs and the verification flow

Scope: what a Rekor v2 inclusion proof contains, how a consumer verifies it end to end against a tile's checkpoint and witness quorum, and where verification breaks in practice.

## What an inclusion proof covers in v2

In Rekor v1, an inclusion proof is a single Merkle path against one global tree. In Rekor v2 the proof is tile-scoped: the entry's position in the tile's Merkle tree plus a path to the tile root (source doc, yubi-OS/yubiOS skills/sigstore-rekor-v2/SKILL.md). The tile's checkpoint itself is signed by the tile's witness quorum and carries the Merkle root, the tile ID, and the previous tile's hash, so proofs chain tile to tile (source doc).

The upstream Rekor documentation describes the general contract that has carried across versions: Rekor provides a REST API-based server for validation and a transparency log for storage, with a CLI application to make and verify entries, query the log for inclusion proofs, and run integrity verification (https://docs.sigstore.dev/logging/overview/, weight 0.94). The dedicated transparency-log documentation lives under the Sigstore docs logging section (https://docs.sigstore.dev/logging/, weight 0.92).

## The five verification steps

A consumer such as `cosign verify-attestation` verifies a Rekor v2 entry in five steps (source doc):

1. Fetch the inclusion proof for the entry.
2. Verify the inclusion proof against the tile's Merkle root.
3. Verify the tile's Merkle root against the tile's checkpoint.
4. Verify the checkpoint's signature against the witness quorum.
5. Optionally verify the previous-tile-hash chain for log continuity.

Step 5 is the continuity check that distinguishes v2: because each tile checkpoint commits to the previous tile's hash, a verifier can walk the chain and confirm no tile was replaced or dropped. A weak-weight dig source describes the same shape from the monitor's perspective: the v2 consistency check must identify the correct shard in the sharded log environment, fetch a signed checkpoint, and verify against it, using the rekor-tiles library (https://deepwiki.com/sigstore/rekor-monitor/2.2-rekor-v2-consistency-checking, weight 0.10, weak backing).

## What changed for clients at GA

The Sigstore GA announcement states the client-side story plainly: Rekor v1 continues to run in parallel with Rekor v2, and clients using the publicly distributed SigningConfig and TrustedRoot files automatically and seamlessly transition to using Rekor v2 and verifying entries (https://blog.sigstore.dev/rekor-v2-ga/, weight 0.83). In other words, the five-step flow above is already embedded in shipped cosign behavior; a pipeline that does not pin its own endpoints picks it up without code changes.

For general signature verification the flow is documented in the cosign verifying docs: verification of an artifact, blob, or container image is where Sigstore's guarantees are exercised (https://docs.sigstore.dev/cosign/verifying/verify/, weight 0.78).

## When verification fails

The cosign repository README documents a failure mode that maps directly to this skill: "Verification fails with no signatures found: You may be verifying an image signature that requires support for Rekor v2 transparency" (https://github.com/sigstore/cosign, weight 0.63). That is the diagnostic to reach for when `cosign verify-attestation` reports a transparency-log error against a v2-era artifact with an outdated client. Two other weak sources round out the failure picture: a 2026 writeup notes that everything a verifier needs (certificate, signature, inclusion proof, timestamp) arrives in one JSON file resolvable against a TUF-distributed trust root, which is what makes admission-time verification self-contained (https://bex.co/blog/2026/09/22/sigstore-keyless-rekor-v2-cosign-v3-admission, weight 0.09, weak backing); a community Python tool exists for verifying inclusion and consistency proofs against Rekor outside cosign (https://pypi.org/project/rekor-verifier/, weight 0.11, weak backing).

## Debugging checklist

Working from the five steps, a failed v2 verification has a small set of causes:

1. Outdated client. The installed cosign predates v2 support; the "no signatures found" message is the documented tell (https://github.com/sigstore/cosign, weight 0.63).
2. Stale TUF metadata. The checkpoint cannot be verified because the witness keys or endpoints are stale; this is the TUF rotation failure mode covered in doc 03.
3. Wrong shard. The proof references a tile the client cannot locate; the monitor-side description of shard identification is the same operation (https://deepwiki.com/sigstore/rekor-monitor/2.2-rekor-v2-consistency-checking, weight 0.10, weak backing).
4. Quorum not met. The checkpoint signature count is below the tile's quorum threshold; per the source doc, if you trust any witness, the tile is only as trustworthy as that witness, which is why the quorum check is not skippable.

## In-toto statements are unchanged

The attestation payload inside the verified bundle is identical across log generations: both Rekor v1 and v2 accept the same `_type: https://in-toto.io/Statement/v1` envelope with `predicateType: https://slsa.dev/provenance/v1`, and the migration from v1 to v2 is purely a log-side change (source doc). Cosign's built-in support for creating and signing in-toto attestations from a local predicate file is documented independently of the log version (https://docs.sigstore.dev/cosign/verifying/attestation/, weight 0.67). This separation is what makes the v2 migration invisible to the attestation format.
