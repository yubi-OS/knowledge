# human-for-feasibility knowledge corpus

Knowledge corpus for the yubiOS skill `human-for-feasibility` (yubi-OS/yubiOS skills/human-for-feasibility/SKILL.md, the primary source of record). Topic: the ask-vs-infer discipline. Default to inference when the choice is documented anywhere (conventions, defaults, prior artifacts, prior answers, workspace memory). Only ask the user when the choice is genuinely undocumented AND the cost of being wrong exceeds the cost of interrupting.

Minted 2026-10-07 by the skills-variant corpus mint (branch mint/skills-human-for-feasibility-2026-10-06).

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-cost-of-asking.md](01-cost-of-asking.md) | The economics of the question: interruption cost, the polite-yes failure mode, why inference is the right default, and what makes inferring wrong costly. |
| 02 | [02-when-to-use-triggers.md](02-when-to-use-triggers.md) | The 4 application points, the 4 explicit triggers, the 4 do-not-use conditions, and the boundary with interview-me. |
| 03 | [03-documented-anywhere.md](03-documented-anywhere.md) | Step 1: the 6-rung evidence ladder from the user's latest message to prior sessions, plus implicit answers. |
| 04 | [04-convention-defaults.md](04-convention-defaults.md) | Step 2: the 4 convention classes (engineering, project, industry, skill ecosystem) and what makes a default sensible. |
| 05 | [05-reversibility-cost-tiers.md](05-reversibility-cost-tiers.md) | Step 3: the 4 reversibility tiers from trivially reversible to irreversible, and the verdict each earns. |
| 06 | [06-value-laden-asking.md](06-value-laden-asking.md) | Step 4 and Step 6: taste, politics, strategy ask; the ask itself carries a guess, concrete options, costs, and a default. |
| 07 | [07-inference-audit.md](07-inference-audit.md) | The required output artifact: inferred, asked, and not-surfaced sections; the review surface that replaces upfront asking. |
| 08 | [08-anti-patterns.md](08-anti-patterns.md) | The 8 anti-patterns, the 10 red flags, and the 7-point verification gate. |
| 09 | [09-skill-ecosystem-adjacency.md](09-skill-ecosystem-adjacency.md) | Composition with 8 sibling skills, plus the source doc's primitive-closure audit sections. |

## Research summary

- Source doc: yubi-OS/yubiOS skills/human-for-feasibility/SKILL.md, 18,570 B fetched 2026-10-07 with User-Agent omni-agent/1.0.
- Outline: 9 subtopics decomposed by the SKILL.md's own sections; all 9 validated score 0.73 to 1.31 on the score metric (no score-0 drops); 9 kept, 0 dropped, 0 skipped.
- Results collected: 156 (18 first-pass searXNG queries + 8 redo queries across 4 subtopics).
- Weight split: 9 high (weight >= 0.5) / 147 low (weight < 0.5), 0 unweighted. The low split reflects a corpus topic that lives mostly in agent practice rather than public primary sources; every sub-0.5 citation is labeled weak in the doc text, and the docs are grounded primarily on the source doc.
- jev: 24 requests (1 score for outline validation, 23 noul for weighting), 39,542 input tokens, 6,024 output tokens, via DefAPI direct (typesafe/jev-1.13).
- Redos: 4 (subtopics 03, 06, 08, 09 redone with different queries after first-pass digs returned mostly generic definition pages). No digs failed terminally; no doc was skipped for a thin dig.
- Gaps / skips: none.
- research-db: schema v2 under research-db/ (preflight.json, outline.json, archive.json, digs/ x9, jev-log.json, db.ts).

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); /api/decide (DefAPI direct, typesafe/jev-1.13) 200.

## Notes

- The source doc is NOT copied into the corpus; every doc cites it as the grounding spine and the digs supply external corroboration for the mechanisms it names.
- The source doc's cycle-5 to cycle-7 primitive-closure sections (segmentation, cryptographic identity, trust chain, least privilege, audit/evidence) are internal-record content; doc 09 records them without a dig.
