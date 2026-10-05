# Jev Corpus

Knowledge corpus minted 2026-10-05 from yubi-OS/yubiOS `refs/` source document `refs_corpus/jev-corpus-2026-10-01.md`. Topic: the Jev Corpus engine, the corpus-math toolset (null-standardized audits, lens candidates, atom plans, tautology classification, drift, placements) ported to a Cloudflare Worker as deterministic, parity-tested JavaScript and exposed as `/api/jev/corpus/*`.

## Docs

| NN | slug | scope |
|---|---|---|
| 01 | null-standardized-corpus-audit | Null corpora, permutation and randomization, null-standardized z scores and dBc magnitude |
| 02 | spherical-harmonic-curve-basis | Spherical harmonics as a complete basis on S^2, stereographic projection, geodesic metric |
| 03 | tautology-classification-drift | Tautology versus circular reasoning, concept drift, reference windows and re-measurement |
| 04 | atom-plans-descent | Descent steps, discrete gradients, Boltzmann acceptance, dry-run atom plans |
| 05 | cloudflare-workers-api-routes | Worker routing, schema DDL, idempotency keys, auth and purity guardrails |
| 06 | parity-testing-reference-implementations | Fixture generation, pinned references, tolerance floors, never-re-derive |
| 07 | parallel-build-lanes-integration | Contracts for parallel lanes, the integration bill, cross-lane defect classes |
| 08 | evolution-loop-measured-metrics | Measured gains per cycle, approval gates, proposals versus directives |
| 09 | deterministic-math-versus-decision-models | Deterministic math engine separated from the LLM decision layer, reproducibility |
| 10 | console-human-first-redesign | Progressive disclosure, dashboard structure, accessibility in operator consoles |

## Research summary

- Results collected: 132 unique (deduplicated by URL) across 22 queries (10 subtopics x 2 seed queries) plus a 2-query redo for subtopic 08.
- Weight split (jev noul probability): 49 results at weight >= 0.5 (authoritative backing), 83 results at weight < 0.5 (weak backing, labeled in text).
- Jev requests: 27 total to /api/decide (1 outline score validation, 1 preflight probe, 25 noul weighting batches). Usage: 22973 input tokens, 0 output tokens, model clef.
- Redos: 1 (subtopic 08, dig redone with different queries after the first 12 results weighted almost entirely low; redo landed Microsoft Learn approval-gates docs at 0.95/0.96 and OWASP Cornucopia at 0.75).
- Skipped docs: none. All 10 subtopics kept at outline validation (scores 0.94 to 1.90, none dropped) and all 10 authored.
- Preflight 2026-10-05: searXNG 176 probe results healthy (14 engines unresponsive or suspended: google, brave, duckduckgo CAPTCHA, qwant CAPTCHA and others; remaining engines delivered); /api/decide (clef) 200.

## Research DB

Under `research-db/`: `preflight.json`, `outline.json`, `archive.json` (132 weighted results with full decision records), `digs/<NN>-<slug>.json` (one per doc, with per-query raw counts and the redo log), `jev-log.json` (one entry per /api/decide request with usage tokens), and `db.ts` (TypeScript interfaces for all shapes).
