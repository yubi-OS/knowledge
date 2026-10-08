# 06 - Cosign integration path

Scope: the publish-and-verify loop through cosign for Rekor v2 entries, the verification commands and their failure modes, and the anti-patterns that break them.

## The publish path

The yubiOS integration is a two-command loop (source doc, yubi-OS/yubiOS skills/sigstore-rekor-v2/SKILL.md): `cosign sign-attestation` publishes an attestation to a Sigstore-hosted tile or a private tile, and `cosign verify-attestation` retrieves and verifies the entry through the TUF-discovered endpoint. The tile model of doc 01 and the TUF discovery of doc 03 are what the commands ride on; neither is invoked directly by the user.

The upstream command documentation describes verification as checking the claims on an image against the transparency log (https://github.com/sigstore/cosign/blob/main/doc/cosign_verify-attestation.md, weight 0.73). Attestation creation has built-in cosign support: you can create and sign an in-toto attestation from a local predicate file (https://docs.sigstore.dev/cosign/verifying/attestation/, weight 0.67). Blob attestations are covered by the same family: `cosign attest-blob` and `cosign verify-blob-attestation` shipped with the cosign 2.0 release (https://blog.sigstore.dev/cosign-2-0-released/, weight 0.67).

The general signature verification flow, of which attestation verification is the strongest case, is documented in the cosign verifying guide: when an artifact, blob, or container image is verified, the full supply-chain guarantee is exercised (https://docs.sigstore.dev/cosign/verifying/verify/, weight 0.78).

## When to route through Rekor v2

Per the source doc, use Rekor v2 when:

1. Adding a new SLSA Build L3 attestation that should be logged to Rekor v2, via `cosign sign-attestation` or a Rekor v2 client directly.
2. Configuring `cosign verify-attestation` to verify a Rekor v2 entry.
3. Designing the witness quorum for a high-assurance Rekor v2 deployment.
4. Migrating a Sigstore pipeline from Rekor v1 to Rekor v2.
5. Debugging a failed inclusion-proof verification where `cosign verify-attestation` reports a transparency-log error.
6. Designing the TUF SigningConfig for a private Rekor v2 deployment.

Do NOT route through Rekor when logging certificates (Fulcio's certid-transparency log is separate), working with Rekor v1 (see the `slsa-provenance` skill), handling OIDC token issuance (Fulcio again), or signing private artifacts without transparency via `--tlog-upload=false` (source doc).

## Failure modes at the cosign layer

The documented diagnostic to know: verification failing with "no signatures found" may mean the image signature requires Rekor v2 transparency support that the installed client lacks (https://github.com/sigstore/cosign, weight 0.63). That error class plus the five-step verification flow of doc 02 gives a complete debugging surface: outdated client, stale TUF metadata, wrong shard, or quorum below threshold.

Third-party production deployments document the working configuration: the NVIDIA AICR contributor guide describes signing keyless attestations to Rekor v2 by default, with the signing path wired so contributors can reason about transparency-log behavior (https://docs.nvidia.com/aicr/contributor-guide/rekor-v-2-signing/, weight 0.16, weak backing). A 2026 practitioner writeup on the keyless signing model describes the verification bundle as one JSON file containing certificate, signature, inclusion proof, and timestamp, resolvable against a TUF-distributed trust root, which is what makes admission-time verification self-contained (https://bex.co/blog/2026/09/22/sigstore-keyless-rekor-v2-cosign-v3-admission, weight 0.09, weak backing).

## Anti-patterns in the cosign path

From the source doc:

1. Hardcoding the Rekor v2 endpoint. This bypasses TUF endpoint discovery and defeats the rotation mechanism. Let the SigningConfig resolve the tile server.
2. Caching TUF metadata for more than 7 days. The metadata timestamp expires and `cosign verify-attestation` fails even though no rotation happened.
3. Single-witness quorum for a private deployment. The log is then no better than Rekor v1.
4. Publishing to a tile without verifying the witness set first. The checkpoint signature is the only tie to the witness set.
5. Re-signing existing v1 entries into v2 during migration. Unnecessary; the verifier handles both logs transparently.

For the offline signing variant of these rules, where the pipeline intentionally has no transparency log at all, see doc 07.

## Where cosign ends and Rekor begins

The boundary matters for routing: Fulcio issues the OIDC-backed certificates, Rekor (v1 or v2) holds the transparency-log entry, and cosign is the client that produces and consumes both. The Sigstore project surface covers this trio (https://www.sigstore.dev/, weight 0.94). A yubiOS request that names a trigger without the artifact it acts on routes to the owning surface rather than improvising here (source doc).
