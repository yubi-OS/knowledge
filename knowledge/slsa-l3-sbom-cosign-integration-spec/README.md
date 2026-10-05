# slsa-l3-sbom-cosign-integration-spec

Knowledge corpus on SLSA Build L3, SPDX SBOM, and cosign integration for CI workflows: the spec surface for attaching provenance attestations, SBOMs, and signatures to built images, and the pitfalls hit making it work.

Minted 2026-10-05 from the yubi-OS/yubiOS refs/ source doc `slsa-l3-sbom-cosign-integration-spec-2026-08-04.md` via the knowledge-corpus-mint flow. The source doc itself is not copied here; it is the input the outline was decomposed from.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | 01-slsa-v1-build-levels.md | SLSA v1.0 Build levels L1/L2/L3, the no-Build-L4 fact, Source track split, L3 isolation bar |
| 02 | 02-provenance-predicate-v1.md | Provenance predicate shape: DSSE envelope, in-toto Statement v1, v0.2 vs v1.0, buildType publication |
| 03 | 03-slsa-github-generator.md | slsa-github-generator container and generic reusable workflows, BYOB, pinning discipline |
| 04 | 04-cosign-keyless-github-actions.md | cosign keyless signing via GitHub Actions OIDC: permissions, Fulcio, identity pinning, trust caveats |
| 05 | 05-spdx-sbom-syft.md | SPDX SBOM generation with Syft and attachment as cosign spdxjson attestations, policy enforcement |
| 06 | 06-rekor-v2-transparency-log.md | Rekor v2 tiles, witness quorum, TUF endpoint discovery, the cosign version floor for writes |
| 07 | 07-verifier-gate.md | Verifier gates: slsa-verifier, cosign verify-attestation, actions/attest-build-provenance, boundaries |
| 08 | 08-builder-isolation-options.md | Builder isolation options: GitHub-hosted ephemeral, hardened self-hosted, TEE-backed confidential containers |
| 09 | 09-integration-pitfalls.md | CI integration pitfalls: permissions, identity pinning, version lockstep, Rekor v2 floor, disclosure |

## Research summary

- Results collected: 93 (from 18 searXNG queries, 9 subtopics x 2 queries, top 6 kept per query after dedup).
- Weight split: 53 results at weight >= 0.5 (primary or strong authoritative), 40 below 0.5 (aggregators, weak explainers, off-topic; cited only when labeled weak in doc text).
- Jev requests: 21 (1 probe, 1 outline validation with 9 score questions, 19 noul weighting batches of 5), usage 16483 input / 0 output tokens.
- Redo counts: 0. All 18 dig queries returned 40+ raw results on first attempt.
- Skipped docs: none. All 9 subtopics validated load-bearing or marginal-with-strong-dig and were authored.
- Marginal subtopics kept on dig strength: 06-rekor-v2-transparency-log (outline score 1.15, dig returned 12 results with 10 high-weight) and 08-builder-isolation-options (score 1.58, 8 high-weight).
- Off-topic results filtered by weighting and excluded from claims: rekor.ai (0.05, unrelated company), rentwithcosign.com (0.03, rental housing), merriam-webster.com (0.04, dictionary).

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

## Research DB

Under `research-db/`: `preflight.json`, `outline.json`, `archive.json` (one entry per collected result with its noul decision record), `jev-log.json` (one entry per jev HTTP request), `db.ts` (TypeScript interfaces for every shape), and `digs/<NN>-<slug>.json` (per-doc dig records). All plain UTF-8 JSON.
