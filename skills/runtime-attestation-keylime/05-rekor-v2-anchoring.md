# 05 - Rekor v2 anchoring

Scope: Sigstore Rekor v2, the tile-backed transparency log, and cosign verify-attestation as the anchoring component of the evidence shape. Ground source: the yubiOS skill names "all anchored to Rekor v2" as the fourth evidence component, and the yubiOS CI attestations gate verifies against Rekor v2 per the `sigstore-rekor-v2` skill.

## What Rekor v2 is

Rekor v2, also known as rekor-tiles or Rekor on Tiles, is a redesigned and modernized Rekor, Sigstore's signature transparency log. It transitions the backend to a modern, tile-backed transparency log implementation to simplify maintenance and lower operational costs (source: https://github.com/sigstore/rekor-tiles, jev weight 0.66). The design builds on the active development in the Certificate Transparency ecosystem: Rekor v2 is backed by a tile-based log and uses a modernized version of Trillian called Trillian-Tessera (source: https://github.com/sigstore/rekor, jev weight 0.84).

The migration is real and sequenced: Rekor v1 is in maintenance mode while v2 development proceeds in the rekor-tiles repo. Sigstore announced the v2 alpha in April 2025 (source: https://blog.sigstore.dev/rekor-v2-alpha/, jev weight 0.67) and general availability followed (source: https://blog.sigstore.dev/rekor-v2-ga/, jev weight 0.69).

## Why tiles

The v1 architecture was a transparency log built on a single Merkle Tree that can grow indefinitely as entries are added, which presents operational issues over time; v1 answered with log sharding into multiple Merkle Trees (source: https://docs.sigstore.dev/logging/sharding/, jev weight 0.77). The tile-based design of v2 addresses the same growth problem structurally instead of retrofitting shards, which is why the yubiOS evidence shape pins the anchor component to v2 rather than v1.

## Cosign as the verification tool

The cosign CLI is the standard client for signing and verifying attestations against the log. Key verified facts:

- cosign provides `cosign verify-attestation` for verifying attestation statements attached to images; its documentation covers bundle verification material handling, including allowing X.509 certificate chains in bundle verification material for v0.3+ bundles (source: https://github.com/sigstore/cosign/blob/main/doc/cosign_verify-attestation.md, jev weight 0.85).
- The general verification format is `cosign verify [--key <key path>|<key url>|<kms uri>] <image uri>`, with keyless verification also supported (source: https://docs.sigstore.dev/cosign/verifying/verify/, jev weight 0.86).
- Bundles carry everything needed for offline verification: the bundle annotation is always included by default for keyless signing, so default `cosign sign` functionality includes all materials needed for offline verification; in an air-gapped environment the image and signatures must be available locally on the filesystem (source: https://github.com/sigstore/cosign, jev weight 0.82).
- Cosign 2.0 extended attestation to bare blobs: blob attestation and verification with `cosign attest-blob` and `cosign verify-blob-attestation`, plus flag-to-environment-variable mapping such as `COSIGN_CERTIFICATE_IDENTITY=email` for `--certificate-identity=email` (source: https://blog.sigstore.dev/cosign-2-0-released/, jev weight 0.72).

## The anchor role in the evidence shape

The source doc makes Rekor v2 the fourth component of the evidence shape: quote, measurement, evidence bundle, Rekor v2 anchor. The anchor is what converts a private attestation into a publicly verifiable fact:

1. The evidence bundle is produced by one of the three legs (Keylime quote, in-toto / SLSA provenance, confidential-VM report).
2. The bundle is signed and anchored in the Rekor v2 tile-backed log, which records inclusion in a tamper-evident, publicly readable structure.
3. Any later verifier, human or machine, re-derives the inclusion proof from the log and confirms the bundle existed at a point in time and has not been altered or removed.

This is the property the yubiOS CI attestations gate depends on: `cosign verify-attestation` against Rekor v2 checks not just that the artifact was signed by the expected identity, but that the attestation's existence is witnessed by a transparency log that cannot silently rewrite history.

## Practical notes for the yubiOS gate

- Prefer bundles with offline verification material so the gate does not hard-depend on log availability at verify time; the bundle format exists precisely so verification works air-gapped.
- For blob-level evidence (for example, attesting a boot measurement file rather than an OCI image), use the Cosign 2.0 blob attestation path.
- Treat v1 as legacy: new anchors should target v2 tiles, and any tooling written against v1-only APIs should be scheduled for migration.

Weak-backing note: a third-party explainer at https://beefed.ai/en/cosign-sigstore-signing-attestation (jev 0.12) and an unrelated namesake at https://www.rentwithcosign.com/ (jev 0.04) were excluded from claim support.
