# 03 - SLSA provenance, DSSE, and in-toto under post-quantum migration

Scope: SLSA provenance, DSSE envelopes, and in-toto attestations: what signature-format and key changes post-quantum migration requires.

## The provenance layer is format-stable, signature-variable

SLSA provenance is verifiable information about software artifacts describing where, when, and how something was produced, used to track an artifact back through all the moving parts of a supply chain (source: https://slsa.dev/provenance/, weight 0.85; earlier v0.1 definition: https://slsa.dev/spec/v0.1/provenance, weight 0.82; current v1 spec: https://slsa.dev/provenance/v1, weight 0.95). Nothing in that framing pins the signature algorithm.

The in-toto Attestation Framework defines the format for attestations and their metadata, ships vetted predicate formats for common use cases, and provides protobuf definitions plus language bindings for tooling integration (source: https://github.com/in-toto/attestation, weight 0.88). The attestation framework is developed independently of the in-toto specification itself (source: https://in-toto.io/docs/specs/, weight 0.93).

## DSSE is the hinge point

Sigstore cosign signs in-toto attestation payloads using the DSSE signing spec and verifies them with cosign verify-attestation (source: https://docs.sigstore.dev/cosign/verifying/attestation/, weight 0.92). DSSE is therefore the concrete surface where a PQ signature substitution happens for SLSA-style provenance.

One analysis states the DSSE envelope used by SLSA provenance and in-toto attestations is signature-algorithm-agnostic, so post-quantum signatures can be adopted without changing the attestation schema itself, provided signing and verification tooling are updated (source: https://staging.encryptionconsulting.com/pqc-software-supply-chain-signatures-attestations-sboms/, weight 0.27, weak backing; from a staging site, treat as a working hypothesis to confirm against the DSSE spec, not as settled fact).

## Where the algorithm actually shows up

Three artifacts carry the algorithm choice in a provenance chain. First, the DSSE signature over the in-toto statement. Second, the Sigstore keyless path, where the signature is an ECDSA signature over the attestation bundle elements. Third, the Rekor log entry that seals it: the transparency log records signature metadata using RFC 3161 timestamps and Trillian Merkle trees, which carry their own algorithm considerations (source: https://www.systemshardening.com/articles/cicd/post-quantum-artifact-signing/, weight 0.40, weak backing).

## Readiness verdict

The attestation schema layer needs no redesign for PQ: provenance documents, in-toto statements, and DSSE envelopes are key-type agnostic by construction. What has to change is narrower and concrete: the signer's key type, the verifier's accepted algorithm list, and the trust-bundle distribution that tells verifiers which root to trust. A readiness checklist should therefore test DSSE envelopes signed with an ML-DSA key end to end through cosign-style verification, and treat the Rekor entry format as the second-order dependency that follows Sigstore's own migration (doc 02).
