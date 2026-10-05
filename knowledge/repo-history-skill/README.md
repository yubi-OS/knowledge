# repo-history-skill knowledge corpus

Deep-archival routines for repository history: joining git and Linear event history into a corpus, fitting sphere-geometry RSI curves on it, and refreshing the archive on a cadence.

Minted 2026-10-05 from yubi-OS/yubiOS `refs/repo-history-skill-2026-08-07.md`.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [01-join-git-linear.md](01-join-git-linear.md) | Joining git PRs and commits with tracker issues via reference regexes, merge_commit_sha links, and fallbacks. |
| 02 | [02-refreshable-archive.md](02-refreshable-archive.md) | Incremental refresh design: since/from/linear-since checkpoints, cache windows, idempotent merges. |
| 03 | [03-sphere-curve-fitting.md](03-sphere-curve-fitting.md) | PCA to 2 dimensions, stereographic S2 lift, Mobius reparameterization, fit metrics, sparse cells. |
| 04 | [04-primitive-basis.md](04-primitive-basis.md) | Deriving and validating the 9-primitive binary coverage basis for event corpora. |
| 05 | [05-rsi-loops.md](05-rsi-loops.md) | Bounded RSI loops on the archive: gap-map, hypothesis, edit, re-map, fixpoint, cycle caps. |
| 06 | [06-deep-research-hook.md](06-deep-research-hook.md) | Injecting deep-research topics via parallel subagent lanes as corpus items, then re-fitting. |
| 07 | [07-cold-start-prior-art.md](07-cold-start-prior-art.md) | Prior art: changelog generators, repo summarizers, tracker analytics, and the unoccupied join. |
| 08 | [08-output-audit-trail.md](08-output-audit-trail.md) | Output artifacts: archive and fit JSON, gap-map and changelog markdown, provenance, status comments. |
| 09 | [09-scale-and-risks.md](09-scale-and-risks.md) | Rate limits, search caps, curve fit sampling, asymmetric joins, body truncation, empty joins. |

## Research summary

- Results collected: 138 entries in `research-db/archive.json` (135 unique URLs), from 18 seed queries plus 5 redo queries across 9 subtopics.
- Weight split (jev noul, model clef): 61 high (>= 0.5) / 74 low (< 0.5) of 135 unique results.
- Every factual claim in the docs carries its source URL and the jev weight that backed it. Claims backed below 0.5 are labeled weak in text.
- Jev requests: 29 total (1 preflight probe, 1 outline validation with 9 score questions, 22 weighting batches, 5 redo weighting batches + 1 retry), 23,250 input tokens, 0 output tokens.
- Redos: 3 (subtopics 01, 04, 07 re-dug with different queries after thin or off-topic first passes; all logged in the per-doc dig records).
- Skipped docs: none. All 9 outline subtopics dug strong enough to author honestly.

## Provenance

- Preflight 2026-10-05: searXNG 187 results healthy; /api/decide (clef) 200, probe answer noul 0.9821.
- Search: self-hosted searXNG via the n8n searxng-proxy webhook.
- Decision model: clef on https://steady-orbit.systems-a.workers.dev/api/decide, score metric for the outline, noul metric for weighting.
- Full decision records, dig records, and the request log live under `research-db/` (schema in `research-db/db.ts`).
