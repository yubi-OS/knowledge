# code-simplification Knowledge Corpus

Minted 2026-10-06 from the ground source `yubi-OS/yubiOS skills/code-simplification/SKILL.md` (the code-simplification skill: simplifying code for clarity, refactoring without changing behavior, identifying unnecessary complexity, and the code-quality discipline the skill teaches). The SKILL.md is the primary source of record; each doc below explicates and deepens one of its sections.

## Docs

| NN | doc | scope |
|----|-----|-------|
| 01 | [01-overview-and-trigger-scopes.md](01-overview-and-trigger-scopes.md) | The skill's goal (clarity over fewer lines, the new-team-member test), when to use it, and when not to use it. |
| 02 | [02-five-principles.md](02-five-principles.md) | The Five Principles: preserve behavior exactly, follow project conventions, prefer clarity over cleverness, maintain balance, scope to what changed. |
| 03 | [03-simplification-process.md](03-simplification-process.md) | The 4-step process: understand before touching (Chesterton's Fence), identify opportunities, apply incrementally, verify; the Rule of 500. |
| 04 | [04-complexity-pattern-catalog.md](04-complexity-pattern-catalog.md) | Step 2's concrete pattern catalog: structural complexity, naming and readability, redundancy. |
| 05 | [05-language-specific-guidance.md](05-language-specific-guidance.md) | Language-specific simplification for TypeScript/JavaScript, Python, and React. |
| 06 | [06-rationalizations-and-red-flags.md](06-rationalizations-and-red-flags.md) | The 7 common rationalizations and the 7 red flags. |
| 07 | [07-verification-checklist.md](07-verification-checklist.md) | The 9-gate post-pass verification checklist. |

## Research summary

- Results collected: 168 (84 on attempt 1, 84 on the redo pass), all weighted, none unweighted.
- Weight split: 61 results with weight >= 0.5 (authoritative backing), 107 with weight < 0.5 (weak backing, labeled as such in the docs).
- jev requests: 15 (1 outline score validation with 8 questions, 7 noul weighting batches of 12 on attempt 1, 7 noul batches on the redo). Usage: 16619 input tokens, 3204 output tokens. All weighting went through DefAPI direct (https://api.defapi.org/api/v1/decisions, model typesafe/jev-1.13); the worker relay was not needed.
- Redo counts: 7 docs each had 1 dig redo (attempt 2 with different queries, logged in each digs/ record). The attempt-1 dig pass was diluted by dictionary and aggregator hits; the redo pass surfaced the load-bearing sources (martinfowler.com, refactoring.guru, fs.blog, hilton.org.uk).
- Skipped docs: 1. `08 primitive-coverage-notes` was dropped at outline validation with score 0.04 (rounds to 0, padding); it is also an internal-record subtopic requiring no dig. 7 of 8 subtopics authored.

## Outline validation (jev score metric)

| NN | slug | score | verdict |
|----|------|-------|---------|
| 01 | overview-and-trigger-scopes | 1.96 | kept (load-bearing) |
| 02 | five-principles | 1.98 | kept (load-bearing) |
| 03 | simplification-process | 1.95 | kept (load-bearing) |
| 04 | complexity-pattern-catalog | 1.94 | kept (load-bearing) |
| 05 | language-specific-guidance | 1.67 | kept (load-bearing) |
| 06 | rationalizations-and-red-flags | 0.57 | kept (marginal, dig came back strong) |
| 07 | verification-checklist | 1.33 | kept (marginal, dig came back strong) |
| 08 | primitive-coverage-notes | 0.04 | dropped (padding) |

## Research-db

`research-db/` holds `preflight.json`, `outline.json`, `archive.json` (168 weighted entries), `jev-log.json` (15 requests), `db.ts` (typed schema), and `digs/` with one record per authored doc.

Preflight 2026-10-06: searXNG 85 results healthy (campaign preflight run orchestrator-side); decide (clef) 200 via DefAPI direct.
