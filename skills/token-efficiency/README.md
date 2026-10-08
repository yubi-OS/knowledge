# token-efficiency - Knowledge Corpus

Knowledge corpus explicating the yubiOS skill `token-efficiency` (ground source: `yubi-OS/yubiOS skills/token-efficiency/SKILL.md`). Topic: minimizing tokens spent per unit of useful signal - grep/glob before reading whole files, targeted line ranges, batched independent tool calls, no re-reading content already in context, and matching model tier to task size.

## Docs

1. `01-search-before-read.md` - Search before you read: grep and glob to locate the right file and line before any full-file read.
2. `02-targeted-reads.md` - Read narrow: targeted offset and limit line ranges instead of whole-file reads on large files.
3. `03-batched-tool-calls.md` - Batch independent tool calls in one block, with the dependency test that decides which calls batch.
4. `04-context-reuse-no-restatement.md` - Context reuse and no restatement: never re-fetch or echo content already in context; reuse provider prompt caching.
5. `05-script-offloading-bulk-transforms.md` - Offload bulk transforms to scripts and summarize large blobs instead of pasting raw output.
6. `06-tier-matching.md` - Match tool and model tier to task size: cheap models for lookups and menial subtasks, strong tiers only when needed.
7. `07-load-order-protocol.md` - Load-order protocol: read the domain skill before external API calls to avoid schema-shape retry loops.
8. `08-verification-and-failure-modes.md` - Verification checklist (8 items) and failure modes (6 red flags) plus the skill's own RSI improvement history.

## Research summary

- Results collected: 751 raw searXNG results across 16 queries (2 per subtopic), 96 kept (top 6 per query), 95 after global URL dedup.
- Weighting: every result weighted with the noul metric (clef, typesafe/jev-1.13) via DefAPI direct. Three weighting passes were run; final weights come from pass 3 (authoritative AND on-topic). Passes 1 and 2 are retained in `research-db/archive.json` with redo_of links.
- Weight split (pass 3, final): 13 high (>= 0.5) / 82 low (< 0.5) of 95. Weak-backing citations are labeled weak in the doc text.
- Jev requests: 25 (1 outline score validation + 24 noul weighting), usage in 34411 / out 5350 tokens.
- Redos: 0 dig redos; 2 weighting redos (pass 1 instructions deviated from the canonical noul template and skewed all low; pass 2 used the canonical template but promoted off-topic authoritative pages; pass 3 fixed both with a relevance-aware template). Doc 07's dig produced no source above 0.16; its claims rest on the source doc with weak dig backing, stated in the doc.
- Skipped docs: none. All 8 subtopic digs returned enough material to author honestly.

## Preflight

2026-10-06: searXNG campaign preflight healthy (orchestrator); decide healthy (orchestrator); agent-side probes skipped per skills-variant speed rule; first live agent-side decide call returned HTTP 200.
