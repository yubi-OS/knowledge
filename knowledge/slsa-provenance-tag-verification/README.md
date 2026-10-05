# slsa-provenance-tag-verification

Corpus minted from `yubi-OS/yubiOS refs/slsa-provenance-tag-verification-2026-09-08.md`.

**Topic:** verifying SLSA provenance on tag-built images, the standing checklist for confirming that provenance attestations match the tag, digest, and builder expectations.

## Docs

| NN | file | scope |
|----|------|-------|
| 01 | [01-digest-not-tag.md](01-digest-not-tag.md) | Verifying by digest, not tag: resolving the handed reference and why tags cannot anchor verification |
| 02 | [02-attestation-discovery.md](02-attestation-discovery.md) | Enumerating registry attestations (in-toto manifests in the image index, cosign pulls) and confirming provenance exists |
| 03 | [03-signature-verification.md](03-signature-verification.md) | Verifying the attestation signature with cosign verify-attestation against the expected key or keyless identity |
| 04 | [04-predicate-inspection.md](04-predicate-inspection.md) | Inspecting the SLSA predicate: buildDefinition, externalParameters, resolvedDependencies vs the claimed inputs |
| 05 | [05-builder-identity.md](05-builder-identity.md) | Matching builder identity (slsa-github-generator builder.id, reusable workflows, buildType) and what mismatches mean |
| 06 | [06-slsa-verifier-check.md](06-slsa-verifier-check.md) | Running slsa-verifier as the independent second check: source-uri, builder-id flags, and failure interpretation |
| 07 | [07-tag-built-semantics.md](07-tag-built-semantics.md) | Tag-built semantics: per-build attestations, source-tag matching, and when digest-level matching is required |
| 08 | [08-failure-quarantine-record.md](08-failure-quarantine-record.md) | Failure discipline: quarantine, fail-closed verification, tool-skew triage, and recording verification evidence |

## Research summary

- Results collected: 90 (searXNG, 16 queries across 8 subtopics, top 6 kept per query, deduplicated within subtopic)
- Weight split: 48 high (jev noul >= 0.5, authoritative backing) / 42 low (< 0.5, weak backing, labeled in text)
- jev requests: 25 (1 probe, 1 outline score validation, 23 noul weighting batches), usage 14415 input tokens / 0 output tokens
- Redo counts: 0 dig redos; 2 decide requests hit 429 and were redone per the redo rule (sleep 30s, re-send), all results weighted, 0 unweighted
- Skipped docs: none. All 8 outline subtopics scored load-bearing (1.52 to 1.87) and authored.

## Research DB

`research-db/` holds the typed audit trail: `preflight.json`, `outline.json`, `archive.json` (one entry per collected result with its full noul decision record), `digs/<NN>-<slug>.json` (per-subtopic dig records), `jev-log.json` (one entry per jev HTTP request), and `db.ts` (interfaces for all shapes).

## Preflight

Preflight 2026-10-05: searXNG 93 results healthy (probe) plus 49 results on a real corpus query; 12 upstream engines showed Suspended or CAPTCHA states under sibling-agent load, recorded verbatim in preflight.json; /api/decide (clef) 200.
