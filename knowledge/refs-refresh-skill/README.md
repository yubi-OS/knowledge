# refs-refresh-skill: the docs corpus refresh sweep, decomposed

Knowledge corpus minted 2026-10-05 from yubi-OS/yubiOS `refs/refs-refresh-skill-2026-09-29.md`: the refs refresh sweep skill, its conceptualization and its validated end-to-end run. The source process enumerates a documentation corpus, ranks it for staleness with a decision model blended with document age, digs replacement evidence through a self-hosted searXNG metasearch proxy, weights every result with the same decision model, persists a typed research database, and lands refreshes as cited pull requests via subagent fan-out.

## Docs

| NN | file | scope |
|---|---|---|
| 01 | [01-staleness-signals.md](01-staleness-signals.md) | Enumerating the corpus and blending document age with topic-movement triage into a refresh priority rank |
| 02 | [02-decision-model-triage.md](02-decision-model-triage.md) | Routing corpus triage through a typesafe decision model and reading its honest calibration as a finding |
| 03 | [03-searxng-digs.md](03-searxng-digs.md) | Running refresh digs through a self-hosted searXNG metasearch proxy and handling engine suspension under parallel load |
| 04 | [04-result-weighting.md](04-result-weighting.md) | Weighting every search result with a decision model so primary sources separate from aggregators before entry to the research db |
| 05 | [05-research-db.md](05-research-db.md) | Persisting a typed research db so every claim carries provenance and survives crashes and platform wipes |
| 06 | [06-subagent-fanout.md](06-subagent-fanout.md) | One subagent per top-ranked doc, one draft PR each, honest no-change verdicts, and the merge path that works |
| 07 | [07-git-data-api-push.md](07-git-data-api-push.md) | Driving the GitHub push chain (blob, tree, commit, ref, draft PR) in one shell call against platform quirks |
| 08 | [08-rate-limit-ops.md](08-rate-limit-ops.md) | Operational hardening: User-Agent against Cloudflare 1010, shared decision-model caps with backoff, ephemeral sandbox filesystems |

## Research summary

- Results collected: 156 across 24 searXNG queries (18 initial + 6 redo queries).
- Weight split (jev noul): 50 results at weight >= 0.5 (primary/authoritative backing), 106 below 0.5 (weak backing, labeled as such in the docs).
- Jev requests: 34 logged successful /api/decide requests (1 outline validation, 33 weighting batches of 5), total usage 24907 input tokens, 0 output tokens. One additional successful weighting request was lost to a mid-append script crash and is recorded as a reconstruction entry in jev-log.json.
- Dig redos: 3 subtopics redone with different queries (01, 08, 09), 2 redo waves total.
- Docs kept/skipped: 8 authored / 1 skipped.

## Skipped docs and why

- 09-validation-cadence: skipped. After the initial dig and 2 redos with different queries, the only sources above 0.5 were weakly relevant to the subtopic (NLnet 0.58, an Azure pipeline sample 0.59, a Merriam-Webster definition 0.62). Per the REDO RULE the doc was skipped rather than padded.

## Preflight

2026-10-05: searXNG healthy, 156 results across 24 queries; /api/decide (clef) 200.

## Verification

VERIFIED: files 23, research-db 13 parse, weights 156/156
