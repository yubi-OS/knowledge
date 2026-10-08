# 04 - Witness co-signing and quorum design

Scope: what a Rekor v2 tile's witness quorum is, how the public deployment composes it, the quorum design yubiOS recommends for private deployments, and the failure modes a wrong quorum creates.

## What a witness quorum is

A Rekor v2 tile's witness quorum is the set of independent witnesses that co-sign the tile's checkpoint (source doc, yubi-OS/yubiOS skills/sigstore-rekor-v2/SKILL.md). The checkpoint commits to the tile's Merkle root, the tile ID, and the previous tile's hash; the quorum's co-signatures are what make that checkpoint trustworthy. A weak-weight practitioner source frames the division of labor: Rekor log witnessing and checkpoint co-signing concern log consistency, while the identity, issuer, log operator, and verification configuration sit in the trust model around them (https://witnesses.now/prior-art/sigstore-rekor/, weight 0.08, weak backing).

Another weak source confirms the direction of the live deployment: the current Sigstore deployment uses multiple independent witnesses, and the standard verification flow now requires checking that the checkpoint you received is co-signed by a quorum (https://safeguard.sh/resources/blog/sigstore-rekor-transparency-log-deep-dive-2026, weight 0.10, weak backing). The Sigstore documentation hub is the primary surface for the logging system these witnesses protect (https://docs.sigstore.dev/logging/, weight 0.92; https://www.sigstore.dev/, weight 0.94).

## How the public deployment composes witnesses

The Sigstore public deployment uses multiple independent witnesses run by different organizations: the Sigstore project's witness, a CNCF-hosted witness, and an academic witness are the examples the source doc gives. This organizational diversity is the design property that matters: no single operator controls the majority of a tile's checkpoint signatures.

The default quorum in the source doc is 2-of-3. A witness compromise therefore invalidates at most one tile, not the whole log (source doc), which is the containment property the tile model buys over Rekor v1's single root key.

## Designing a quorum for a private deployment

For an enterprise running its own Rekor v2 deployment, the source doc's recommendations are:

1. Use a 3-of-5 witness quorum: 5 witnesses, at least 3 must co-sign for the checkpoint to be valid.
2. Run witnesses on infrastructure with diverse trust: different cloud providers, different geographic regions, different operators.
3. Rotate the witness set every 6 months, matching the TUF rotation cadence covered in doc 03.

The 3-of-5 threshold is a deliberate step up from the public default of 2-of-3. With 3 required signatures, a single compromised witness cannot forge a checkpoint, and even two compromised witnesses leave the tile unforgeable. The diversity requirements exist because colocated witnesses share failure modes: one cloud provider outage or one compromised operator account takes out multiple witnesses at once.

## Why the quorum check is not skippable

The source doc lists two anti-patterns that come from skipping or weakening the quorum discipline:

1. Publishing to a tile without verifying the witness set first. The tile's checkpoint signature is the only thing tying it to the witness set; if you trust any witness, the tile is only as trustworthy as that witness.
2. Single-witness quorum. This defeats the entire purpose of Rekor v2's tile plus quorum model. A single witness can be compromised, and the log would be no better than Rekor v1 with its single root key.

These are not theoretical: the verification flow in doc 02 includes the quorum check as step 4 precisely because a checkpoint that fails quorum validation must not be treated as log-anchored.

## What the dig could not confirm

The dig found primary-weight Sigstore surfaces for the logging system itself (weights 0.92 and 0.94) but no primary source stating the public deployment's exact witness count or quorum thresholds. The 2-of-3 default and the three-organization example composition remain source-doc claims; the dig's weak sources independently corroborate that multiple independent witnesses are in use and that quorum checking is part of the standard verification flow. An unrelated third-party project independently shows the C2SP witness pattern of independent witnesses fetching each checkpoint and co-signing with their own Ed25519 key (https://github.com/YASSERRMD/siqlah, weight 0.03, weak backing); it is context for the witnessing pattern only, not a Rekor fact.
