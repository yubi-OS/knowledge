# Post-quantum supply-chain verification readiness

Minted 2026-10-05 from yubi-OS/yubiOS `refs/pq-supply-chain-verification-readiness-2026-10-03.md`. Topic: post-quantum readiness of supply-chain verification, covering signature schemes, verification tooling, and what has to change for attestation chains to survive quantum-capable adversaries.

## Docs

1. [01-pq-signature-schemes-standards.md](01-pq-signature-schemes-standards.md) - ML-DSA (FIPS 204) and SLH-DSA (FIPS 205) as the standardized PQ signature pair, FN-DSA pending, and why the pair choice anchors the attestation chain.
2. [02-sigstore-cosign-pq-readiness.md](02-sigstore-cosign-pq-readiness.md) - Sigstore's ML-DSA selection in its protobuf spec, the Fulcio/Rekor PQ roadmap, and the spec-ready tooling-pending verdict.
3. [03-slsa-provenance-dsse-pq.md](03-slsa-provenance-dsse-pq.md) - SLSA provenance and in-toto attestations as signature-algorithm-agnostic formats; the DSSE envelope as the concrete substitution point.
4. [04-tuf-notary-update-frameworks.md](04-tuf-notary-update-frameworks.md) - TUF's four-role metadata as a studied PQ migration surface; Notary v2 with no surfaced PQ roadmap (recorded gap).
5. [05-hybrid-composite-signatures.md](05-hybrid-composite-signatures.md) - draft-ietf-lamps-pq-composite-sigs and dual-signature AND-verification patterns as the migration bridge.
6. [06-harvest-now-forge-later.md](06-harvest-now-forge-later.md) - Why public classical signatures on long-lived artifacts face retroactive forgery, not harvest-now-decrypt-later.
7. [07-operational-cost-pq-signatures.md](07-operational-cost-pq-signatures.md) - Signature and key size multipliers, rejection-sampling signing latency tails, and CI/CD integration costs.
8. [08-verification-tooling-readiness.md](08-verification-tooling-readiness.md) - Go crypto/mldsa (1.26 internal, 1.27 public plus x509), OpenSSL EVP ML-DSA-44/65/87, liboqs; primitives ready, verifier plumbing pending.
9. [09-migration-timelines-governance.md](09-migration-timelines-governance.md) - NIST IR 8547 deprecation schedule and CNSA 2.0 procurement gates, with software/firmware signing earliest.

## Research summary

- Results collected: 108 searXNG results (2 queries per subtopic, top 6 kept per query, 9 subtopics, no dig redos).
- Weight split: 62 results at weight >= 0.5 (authoritative backing), 46 at weight < 0.5 (labeled as weak backing in the docs where cited).
- Jev: 30 /api/decide requests (1 preflight probe, 1 outline validation with 9 questions, 28 weighting batches of up to 5 noul questions), usage 19,112 input tokens / 0 output tokens.
- Redo counts: 0 dig redos, 0 rescored results.
- Skipped docs: none. All 9 subtopics scored 1.0 or higher on the outline validation (t04 at 1.34 and t09 at 1.35 were marginal and stayed because their digs returned authoritative primary sources).
- Preflight 2026-10-05: searXNG 119 results healthy; /api/decide (clef) 200.

## Gaps

- Notary Project post-quantum support: no primary documentation surfaced in the dig; recorded in doc 04 as an open dependency rather than a claim.
- The DSSE signature-algorithm-agnostic property and the Sigstore roadmap dates are sourced only below weight 0.5 and are labeled as weak backing in docs 02 and 03.
