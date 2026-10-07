# internal-nonlex-tokens Knowledge Corpus

Knowledge corpus for the yubiOS skill `skills/internal-nonlex-tokens` (ground source: `yubi-OS/yubiOS skills/internal-nonlex-tokens/SKILL.md`, 50,574 B, fetched 2026-10-07). The corpus explicates the non-lexical token substrate: representing content as fingerprints, embeddings, hashes, and byte compounds, then routing, comparing, and recalling without reading the source text (5 operations, 2 invariants, 3 token classes).

## Docs

| NN | slug | scope |
|---|---|---|
| 01 | philosophy-and-three-failure-modes | Why non-lexical processing exists: context bloat, token cost, surface area; the flipped default; lineage patterns marked not-implemented in v1 |
| 02 | when-to-use-and-not-use | The 7 apply conditions and 5 do-not-use conditions; comprehension vs comparison boundary |
| 03 | five-operations-two-invariants | fingerprint / compare / recall / route / transform plus the no-lexical-decode and content-addressed invariants |
| 04 | token-classes | Hash vs embedding vs hybrid: cost, exactness, and semantic tradeoffs; per-content-type selection |
| 05 | token-format-serialization | Canonical JSON envelopes per class, versioning rule, serialization rule, three inline test vectors |
| 06 | lifecycle-and-migration | Four migration cases, legacy flags, explicit re-fingerprinting, Phase 2 migrate() note |
| 07 | process-and-guidelines | The 5-step process and 10 guidelines, constraint-first selection, compare-vs-lexical-diff |
| 08 | calibration-and-audit-trail | 8-field per-operation log template, 3 calibration gates, doubt-driven-development pairing |
| 09 | anti-patterns-and-red-flags | The 9 anti-patterns and 10 red-flag signals, with external evidence for the two failure directions |
| 10 | integration-knowledge-sources-rsi-history | Pairing map across 10 skills, version-pinned citations, 10-cycle RSI changelog ending at fixpoint v1.10 |

## Research summary

- Results collected: 180 archive entries (20 initial queries x top 6 kept = 120, plus 10 redo queries x top 6 kept = 60; deduped per doc for citation).
- Weight split: 9 high (>= 0.5) / 171 low (< 0.5) of 180. The noul model scored strictly; most usable sources (Wikipedia, git-scm book, semver.org) landed below 0.5 and are cited as weak-backed and labeled in text.
- Primary-backed docs: 04 (Hugging Face all-MiniLM-L6-v2 model card, 0.51), 05 (OpenAI embeddings docs, 0.73), 06 (LWN Git hash algorithm, 0.63), 07 (arXiv 1910.09129, 0.58), 08 (OpenSearch ss4o, 0.50), 09 (arXiv 1711.05535, 0.72; simhash-py, 0.61), 10 (IPFS CID spec, 0.79; ipfs.tech, 0.50). Docs 01, 02, 03 carry zero primary sources; every citation in them is weak-backed and labeled as such.
- jev: 13 requests via DefAPI direct (api.defapi.org/api/v1/decisions, model typesafe/jev-1.13), usage 21558 input / 3802 output tokens, 0 failures.
- Redos: 5 (docs 01, 02, 03, 05, 06), one each, with different queries per the REDO RULE; logged in research-db/digs/.
- Skipped docs: none. All 10 subtopics authored.

Preflight 2026-10-06: campaign preflight healthy (orchestrator); agent-side probe skipped for speed; DefAPI direct used for all jev calls, 0 failures on 13 requests. Outline validation: all 10 subtopics kept (scores 1.22 to 1.92, none at 0).

## Structure

- `NN-<slug>.md`: 10 authored docs (679 to 1081 words each)
- `research-db/`: schema v2 (preflight.json, outline.json, archive.json, digs/*.json, jev-log.json, db.ts)
