# ideate-solo Knowledge Corpus

Minted 2026-10-06 from the yubiOS ground source `yubi-OS/yubiOS skills/ideate-solo/SKILL.md` (16,085 bytes fetched). The corpus explicates the skill: the autonomous variant of idea-refine that generates 5 to 8 variations across 5 lenses, scores them on 4 heuristics, and converges without a human in the loop.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [01-philosophy-and-when-to-use.md](01-philosophy-and-when-to-use.md) | Why solo ideation exists (no live human), when to use it and when NOT to (idea-refine, interview-me, idea-kill) |
| 02 | [02-process-pipeline.md](02-process-pipeline.md) | The 7-step process: load idea, scope class, generate, score, stress-test, converge, one-pager |
| 03 | [03-five-lenses.md](03-five-lenses.md) | The five autonomous lenses: inversion, constraint removal, audience shift, combination, simplification |
| 04 | [04-scoring-heuristics.md](04-scoring-heuristics.md) | Painkiller vs vitamin, switching cost, defensibility, testability; 1 to 5 scale, 4 to 20 sum, drop below 8 |
| 05 | [05-stress-test-and-convergence.md](05-stress-test-and-convergence.md) | Steelmanned critique, second-order effects, un-testable bet; testability tiebreak; idea-kill handoff |
| 06 | [06-one-pager-output.md](06-one-pager-output.md) | The one-pager template, `[SOLO]` provenance markers, `docs/ideas/-solo-` naming, generation log |
| 07 | [07-anti-patterns-and-red-flags.md](07-anti-patterns-and-red-flags.md) | The 7 anti-patterns, red flags, verification checklist, and the named biases behind them |
| 08 | [08-skill-composition-and-constraints.md](08-skill-composition-and-constraints.md) | Composition graph (interview-me, prior-art-search, idea-kill, idea-refine, spec-driven-development) and the 4 loading constraints |

## Research summary

- Results collected: 94 (16 searXNG queries, 2 per kept subtopic, top 6 per query, deduplicated by URL)
- Weight split: 4 high (jev weight >= 0.5) / 90 low (< 0.5)
- jev requests: 8 (1 outline validation + 7 weighting batches), usage 13,424 input / 1,859 output tokens, via DefAPI direct (typesafe/jev-1.13)
- Redos: 0. All 16 queries succeeded on the first attempt; all 94 results weighted on the first pass; no decide failures.
- Dropped subtopics: 09-corpus-audit-primitive-coverage (score 0.33 at outline validation, "padding: drop"). It is an internal-record subtopic (curve-guided-rsi cycle 4 to 7 primitive-coverage boilerplate); no dig was run for it per the internal-record rule.
- Skipped docs: none. All 8 kept subtopics dug and authored.

## Method notes

- Weighting used DefAPI direct (`https://api.defapi.org/api/v1/decisions`, model `typesafe/jev-1.13`), batches of 14, paced >= 0.5s. The worker relay was not needed (zero failures).
- The dig set skews toward aggregator-grade sources (most weights < 0.5). Docs label weak-backing claims inline per the authoring rules; source-doc claims are attributed to the SKILL.md as the grounding spine.
- Subtopic 09 was recorded as an internal-record subtopic, no dig, before validation dropped it on score.

Preflight 2026-10-06: searXNG healthy (campaign preflight run orchestrator-side); DefAPI typesafe/jev-1.13 weighting 200, zero 429s across 7 batches.
