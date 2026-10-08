# sigstore-rekor-v2 knowledge corpus

Knowledge corpus minted from the yubiOS skill `sigstore-rekor-v2` (yubi-OS/yubiOS skills/sigstore-rekor-v2/SKILL.md, the primary source of record). Topic: the Sigstore Rekor v2 transparency log - tile-backed hash-only log with sharded inclusion proofs, TUF SigningConfig endpoint discovery, witness co-signing, the Rekor v1 to v2 differences, and the cosign integration path.

## Docs

1. [01-tile-architecture.md](01-tile-architecture.md) - how Rekor v2 (rekor-tiles) structures the log as many small Merkle tree tiles, what each tile carries, and why the tile model replaced the single-tree design.
2. [02-sharded-inclusion-proofs.md](02-sharded-inclusion-proofs.md) - what a Rekor v2 inclusion proof contains and the 5-step consumer verification flow against tile checkpoints.
3. [03-tuf-signingconfig.md](03-tuf-signingconfig.md) - TUF SigningConfig runtime endpoint discovery, the 6-month key rotation and 7-day metadata timestamp, and the yubiOS cache convention.
4. [04-witness-quorum.md](04-witness-quorum.md) - witness co-signing, the public 2-of-3 default, the 3-of-5 private-deployment recommendation, and quorum failure modes.
5. [05-v1-vs-v2.md](05-v1-vs-v2.md) - property-by-property Rekor v1 vs v2 comparison, GA announcement, unchanged in-toto format, forward-only migration.
6. [06-cosign-integration.md](06-cosign-integration.md) - the cosign sign-attestation / verify-attestation loop, when to route through Rekor v2, and the anti-patterns.
7. [07-offline-signing-migration.md](07-offline-signing-migration.md) - yubiOS offline signing without a transparency log after cosign v3.x deprecated --tlog-upload=false (OMN-157 record).
8. [08-yubios-touchpoints.md](08-yubios-touchpoints.md) - position in the yubiOS skill landscape, related skills, Fulcio boundary, 10-primitive mapping.

## Research summary

- Results collected: 41 unique results from 12 dig queries (6 web-shaped subtopics, 2 queries each; 2 internal-record subtopics skipped digs per brief).
- Weight split: 18 high (weight >= 0.5), 23 low (weight < 0.5), of 41 total.
- Jev requests: 5 (1 outline score validation + 4 noul weighting batches), usage 6634 input / 878 output tokens, via DefAPI direct (https://api.defapi.org/api/v1/decisions, model typesafe/jev-1.13).
- Redos: 0 (all 12 dig queries succeeded on the first attempt; all weighting batches succeeded on the first attempt).
- Skipped docs: none. 8 of 8 outline subtopics authored; outline validation dropped 0 (scores 0.58 to 1.9; marginal subtopics 3, 4 kept because their digs returned primary-weight Sigstore sources).
- Known gap: the GA timeline (source doc says 2026-05; low-weight dig mirrors say October 2025) is recorded as a dated drift note in doc 05, not resolved.
- Preflight 2026-10-06: searXNG healthy (campaign preflight, orchestrator-side); DefAPI direct /api/v1/decisions (typesafe/jev-1.13) 200 on first call.

## Research DB

Full provenance under research-db/ (schema v2): preflight.json, outline.json, archive.json (41 weighted entries), digs/ (8 dig records), jev-log.json (5 requests), db.ts (interfaces).
