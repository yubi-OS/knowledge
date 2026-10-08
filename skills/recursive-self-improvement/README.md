# skills/recursive-self-improvement - Knowledge Corpus

Knowledge corpus explicating the yubiOS skill `recursive-self-improvement` (ground source: `yubi-OS/yubiOS skills/recursive-self-improvement/SKILL.md`). The corpus explicates and deepens that skill; the SKILL.md itself is the primary source of record and is not copied here.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-loop-protocol.md](01-loop-protocol.md) | The bounded 5-step cycle protocol: gap-map, hypothesis, edit, re-map, fixpoint-or-continue; the 3-cycle soft-preference cap and user-override protocol |
| 02 | [02-edit-taxonomy.md](02-edit-taxonomy.md) | The edit taxonomy (close a gap, fix drift, sharpen, reposition) and the single-intent-per-cycle rule |
| 03 | [03-modes-self-bias.md](03-modes-self-bias.md) | Improvement mode vs self-mode, self-author bias, the fresh-context subagent mandate, doubt-driven-development as supplement never substitute |
| 04 | [04-output-changelog.md](04-output-changelog.md) | The 3 per-cycle output artifacts and the changelog audit-trail format |
| 06 | [06-antipatterns-redflags.md](06-antipatterns-redflags.md) | The 14 anti-patterns and 13 red flags, grouped by what they protect |
| 07 | [07-frontmatter-validation.md](07-frontmatter-validation.md) | Frontmatter integrity: js-yaml parse validation, the 4 checks, hashline-anchored editing |
| 08 | [08-skill-interactions.md](08-skill-interactions.md) | The skill graph: upstream, orthogonal, downstream, and the Composition Rule |
| 09 | [09-primitive-coverage.md](09-primitive-coverage.md) | The 13-point Verification checklist and the 10-primitive coverage declarations |

## Research summary

- Results collected: 60 (10 searXNG queries across 5 web-shaped subtopics, top 6 per query, deduplicated by URL)
- Results weighted: 60 (high 7 / low 53). Weights of 0.5 or more count as authoritative backing; below 0.5 the doc text labels the backing weak.
- jev requests: 12 logged (1 failed malformed-body POST, 1 outline validation, 5 weighting pass 1, 5 weighting redo pass); usage 15191 input / 2579 output tokens
- Redos: 1 weighting redo. The first weighting pass used corpus-scoped instructions that misread general reference sources as off-topic (all 60 weights below 0.5, max 0.43); it was redone with per-subtopic instructions. Dig redos: 0.
- Skipped docs: 05-stochastic-extensions (outline score 0.06, dropped at score 0 per the validation rule). Its content remains documented in the source doc.
- Gaps: none. All 8 kept subtopics were authored.

## Outline validation

jev score metric via DefAPI direct (`typesafe/jev-1.13`). Kept: 01, 02, 03, 04 (1.83), 06, 07 (0.82, marginal; the dig came back strong with 3 sources of weight 0.5 or more, so kept), 08, 09. Dropped: 05 (score 0.06).

## Subtopics without digs

04-output-changelog, 08-skill-interactions, and 09-primitive-coverage are internal-record subtopics (the artifacts, edges, and coverage declarations are recorded in the source doc itself); they cite the source doc and carry no dig, per the skills-variant spec.

## Preflight

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator-side); DefAPI decide campaign preflight healthy (orchestrator-side). Agent-side probe skipped for speed per the skills-variant speed optimizations; weighting ran against `https://api.defapi.org/api/v1/decisions` (DefAPI direct).

## Research database

Under `research-db/`: `preflight.json`, `outline.json`, `archive.json` (120 entries: 60 superseded first-pass weightings plus 60 final redo-pass weightings, every entry carrying a non-null weight), `jev-log.json` (12 entries), `digs/<NN>-<slug>.json` (8 files), and `db.ts` (schema-v2 interfaces).
