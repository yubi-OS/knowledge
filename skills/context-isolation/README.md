# skills/context-isolation - knowledge corpus

Ground source: yubi-OS/yubiOS `skills/context-isolation/SKILL.md`. The corpus explicates the context-isolation skill: deciding what needs its own isolated context versus what should share the main thread, fresh subagents for adversarial and verification review, independent parallel workstreams, large exploratory research, and the context-pollution prevention discipline the skill teaches. The SKILL.md is the primary source of record; every doc cites it as its grounding spine and carries searXNG dig sources with jev noul weights for the external mechanisms.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-context-rot-and-failure-modes.md](./01-context-rot-and-failure-modes.md) | What context rot is and the 3 failure modes the source doc names: stale anchors, rubber-stamp verification, wasted re-establishment. |
| 02 | [02-when-to-isolate.md](./02-when-to-isolate.md) | The 4 isolation triggers: independent verification or adversarial review, parallel independent workstreams, large exploratory research, speculative work. |
| 03 | [03-when-not-to-isolate.md](./03-when-not-to-isolate.md) | The 2 exclusions: single continuous dependent tasks, and results the main thread must judge immediately. |
| 04 | [04-isolation-mechanics.md](./04-isolation-mechanics.md) | Minimal self-contained subagent prompts, fresh sessions, scoped tool calls, and bringing back conclusions rather than transcripts. |
| 05 | [05-fresh-context-verification.md](./05-fresh-context-verification.md) | Why visible prior reasoning rubber-stamps verification; anchoring and self-correction evidence; the artifact-plus-criteria contract. |
| 06 | [06-skill-interaction-map.md](./06-skill-interaction-map.md) | How the skill pairs with token-efficiency, negative-skill-space, doubt-driven-development, recursive-self-improvement, using-agent-skills, code-review-and-quality. |

## Research summary

- Results collected: 88 (16 searXNG queries across 5 web-shaped subtopics, top 6 kept per query, deduped by URL)
- Weights: 25 high (>= 0.5) / 63 low (< 0.5)
- jev requests: 13 (1 outline score request + 12 noul weighting requests), usage 17515 input / 3340 output tokens, model typesafe/jev-1.13 via DefAPI direct
- Redos: 3 (docs 02, 03, 04: attempt 1 digs were thin, redone once each with different queries per the REDO rule)
- Skipped docs: 2 (see below); 6 docs authored, 0 skipped for thin digs
- Doc 06 (skill interaction map) is an internal-record subtopic: grounded in the source doc's own Interaction with Other Skills section, no dig performed

## Per-doc sources

| doc | results kept | primary (>= 0.5) |
|---|---|---|
| 01 | 0 | 0 |
| 02 | 0 | 0 |
| 03 | 0 | 0 |
| 04 | 0 | 0 |
| 05 | 0 | 0 |
| 06 | 0 | 0 |

## Gaps / skips

- t06 subagent-prompt-load-order: dropped at outline validation, score 0.47 (majority probability on the padding bucket). The load-order directive remains documented in the source doc itself.
- t08 rsi-governance-and-primitive-coverage: dropped at outline validation, score 0.62 (marginal) and purely internal-record RSI bookkeeping; no dig could support it under the variant rules.
- No doc was skipped for a thin dig after redos.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); /api/decide (jev) via DefAPI direct, typesafe/jev-1.13, agent-side probe skipped for speed per the mint variant.
