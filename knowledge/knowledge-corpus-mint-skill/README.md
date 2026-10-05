# knowledge-corpus-mint-skill

Minted knowledge corpus on: minting knowledge corpora from a request: outline decomposition, jev-validated research digs, parallel authoring, and landing a cited corpus in a repo with a typed research DB.

Source: yubi-OS/yubiOS refs/knowledge-corpus-mint-skill-2026-09-29.md (the knowledge-corpus-mint skill conceptualization doc).

## Docs

- [01-outline-decomposition.md]: How a free-form research request is decomposed into a doc outline: decomposition by domain joints (subsystems, lifecycle stages, comparison axes, key decisions), one-line scopes, and seed query authoring.
- [02-decision-model-outline-validation.md]: Using a typed decision model (score/choice metrics returning probabilities) to validate which outline docs are load-bearing before spending dig budget: the cheap-kill pruning principle.
- [03-metasearch-dig.md]: Running web research digs through a self-hosted SearXNG metasearch proxy: query formulation, result capture (title, url, content), rate limiting and pacing, batching, and engine health probing.
- [04-source-quality-weighting.md]: Weighting every collected search result by source authority before citation: primary versus aggregator judgment, probability-as-weight semantics, and redo-on-failure contracts for the weighting call.
- [05-parallel-subagent-authoring.md]: Fanning out one author subagent per doc: the returned-markdown contract, citation discipline where every factual claim carries its source and weight, the thin-dig redo rule, and skip-as-gap.
- [06-typed-research-db.md]: Designing the typed research database that ships with a corpus: preflight record, outline with validation answers, per-result archive with decision records, per-dig records, and a request log, with TypeScript interfaces mirroring each JSON shape.
- [07-git-data-api-landing.md]: Landing a corpus in a GitHub repo without cloning: the blob-tree-commit-ref chain, draft PR creation, directory collision checks, and post-push verification by re-fetching and parsing every pushed file.
- [08-orchestrator-owned-commits.md]: Why the orchestrator rather than each subagent owns the single atomic commit in a mint: avoiding branch races across parallel agents, one reviewable PR, and wave-based cadence for multi-corpus runs.
- [09-provenance-honesty-discipline.md]: Corpus minting as an honesty contract: never inventing facts, deleting unsourced claims instead of softening them, padding prohibition, cannot-author as a success signal, and audit trails that let a reviewer re-run verification.

## Research summary

- Results collected: 107
- Weight split: high (>= 0.5) 42 / low (< 0.5) 65
- Jev requests: 34, usage 33974 input / 0 output tokens
- Redos: 1 weighting redo (first weighting pass returned 200 for all 22 batches but the client failed to record answers due to a variable shadowing bug; all 107 results rescored with a corrected parser, batch size 10). 0 dig redos.
- Skipped docs: none

Preflight 2026-10-05: searXNG 40 results healthy; /api/decide (clef) 200

