# Refederated Identity in OIDC and Sigstore: Multi-Federation as a Privacy Lever

Knowledge corpus minted from yubi-OS/yubiOS `refs/refederated-identity-oidc-sigstore-privacy-2026-08-07.md` (source topic: re-federated identity in OIDC and Sigstore, multi-federation as a privacy lever for transparency-log and artifact-attestation ecosystems).

## Docs

| doc | scope |
|---|---|
| 01-federated-unfederated-refederated.md | The three cloud-identity trust patterns and the rule that refederation must revoke or supersede the old trust |
| 02-oidc-refederation-mechanics.md | RP-side changes that constitute OIDC refederation and the four common triggers |
| 03-sigstore-fulcio-rekor-refederation.md | Fulcio and Rekor behavior when the OIDC provider changes: trust lists, identity breaks, log continuity |
| 04-workload-identity-ci-oidc.md | CI and workload OIDC federation: GitHub Actions, Google Cloud Workload Identity Federation, issuer anchors |
| 05-rekor-v2-sharding-cross-issuer.md | Rekor v2 tile-backed sharding, witness quorum, and the v1 versus v2 difference for cross-issuer attestation |
| 06-slsa-provenance-continuity.md | SLSA provenance fields that break under refederation and what continuity requires of the verifier |
| 07-multifederation-privacy-lever.md | When multi-federation helps privacy and when it hurts, with cited evidence both ways |
| 08-pairwise-subjects-sd-jwt.md | Pairwise per-audience subject identifiers, salt derivation, and SD-JWT selective disclosure (RFC 9901) |
| 09-trust-model-constraints.md | The privacy-preserving multi-federation trust model as a MUST / MUST NOT / NEVER constraint contract |
| 10-supply-chain-multibuilder-privacy.md | Pairwise workload identities and short-lived certs for unlinkable builders in attestation ecosystems |

## Research summary

- Results collected: 120 (10 subtopics, 2 searXNG queries each, top 6 kept per query)
- Weight split: 67 authoritative (weight >= 0.5), 53 weak (weight < 0.5), 0 unweighted
- Jev requests: 25 (1 outline score request, 24 noul weighting batches of 5), usage 20454 input / 0 output tokens
- Redos: 0 dig redos (every query returned results on first attempt); 2 transient HTTP 429 rate limits during weighting, both recovered by the standard 30s retry
- Skipped docs: none. All 10 subtopics scored 1.16 to 1.89 on the score metric (0 = padding), none dropped
- Verification method: every factual claim in the docs carries its source URL and jev weight; claims with weight < 0.5 are labeled weak backing in the text

Preflight 2026-10-05: searXNG 93 results healthy (13 engines listed, several rate-limited but results flowing); /api/decide (clef) 200
