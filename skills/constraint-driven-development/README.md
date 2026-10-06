# constraint-driven-development

A knowledge corpus explicating the `constraint-driven-development` skill from yubi-OS/yubiOS (`skills/constraint-driven-development/SKILL.md`, fetched 2026-10-06, 22707 bytes). The skill establishes a project's quality bar as a written contract in `CONSTRAINTS.md` and watches every diff for a weakened bar. The corpus deepens what the source doc says; it does not replace it.

## Docs

| NN | Doc | Scope |
|----|-----|-------|
| 01 | [01-overview-why-constraints.md](01-overview-why-constraints.md) | Why a written quality bar: prose checks do not survive the session, the agent-volume problem, and the spec/TDD/constraint trio |
| 02 | [02-when-to-use-boundaries.md](02-when-to-use-boundaries.md) | When to apply the skill, when not to, and the non-interactive floor-only fallback (internal-record subtopic, no dig) |
| 03 | [03-detect-then-interview.md](03-detect-then-interview.md) | Detect before you ask and the four-question interview where every question carries a default |
| 04 | [04-constraints-md-format.md](04-constraints-md-format.md) | The CONSTRAINTS.md artifact: floor, enforced-with-numbers table, measured-not-enforced table, exceptions |
| 05 | [05-tooling-dimensions.md](05-tooling-dimensions.md) | The de facto tool per dimension, five gotchas, and the check:fast / check:task / check:full mapping |
| 06 | [06-lifecycle-placement.md](06-lifecycle-placement.md) | BUILD / VERIFY / REVIEW / SHIP budgets, scope to the diff, cost decides placement |
| 07 | [07-diff-watch-guard.md](07-diff-watch-guard.md) | The five cheapest-road-to-green diff moves, suppression comments, the floor-guard reference, and check circularity ranking |
| 08 | [08-ratchets-defaults-escalation.md](08-ratchets-defaults-escalation.md) | Ratchets when no number exists, the sane-defaults table, and the three-level escalation path |
| 09 | [09-anti-patterns-verification.md](09-anti-patterns-verification.md) | Rationalizations, red flags, the verification checklist, and skill boundaries (internal-record subtopic, no dig) |

## Research summary

- Results collected: 168 archive entries (84 from attempt 1, 84 from the attempt-2 redo), every one weighted by the jev noul decision model.
- Weight split: 2 at weight >= 0.5, 166 below 0.5. The dig corpus for this topic is dominated by blog and aggregator pages; the two authoritative hits are the Biome `noSkippedTests` rule documentation (0.56) and the Stryker "Ignore mutations" documentation (0.49). Claims below that line are labeled weakly backed in the doc bodies; the primary spine of every doc is the source SKILL.md itself.
- jev: 15 requests, 17192 input tokens, 3416 output tokens (outline validation 2 requests, noul weighting 13 requests, batches of 12 via DefAPI direct).
- Redos: 1 campaign-wide dig redo. Attempt-1 digs encoded spaces as %20, so searXNG matched only the first token of each query and returned dictionary and noise results; the same 14 queries were re-issued with + encoding and logged in each dig record's redo_log.
- Skipped docs: none. All 9 subtopics authored. Subtopics 02 and 09 are internal-record subtopics with no dig by design; they cite the source doc only.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); DefAPI /api/v1/decisions (jev-1.13) 200 on all 15 calls.
