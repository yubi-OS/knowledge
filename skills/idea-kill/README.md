# idea-kill knowledge corpus

Knowledge corpus for the yubiOS skill **idea-kill** ("Produces a structured 'should this idea die?' verdict. Honest review that returns one of KILL, PAUSE, REVISE, or SHIP with explicit reasoning."), minted from `yubi-OS/yubiOS skills/idea-kill/SKILL.md` (16420 B, fetched 2026-10-06).

Ground source: `yubi-OS/yubiOS skills/idea-kill/SKILL.md` (primary source of record; every doc cites it as "source doc" for its grounding spine).

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-philosophy-failure-modes.md](01-philosophy-failure-modes.md) | Why most ideas should die; the polite-yes and sunk-cost failure modes; the verdict as the deliverable |
| 02 | [02-when-to-use-and-exclusions.md](02-when-to-use-and-exclusions.md) | Entry points (raw idea, one-pager, spec, plan), exclusions, and the premortem and kill-criteria traditions |
| 03 | [03-the-eight-step-process.md](03-the-eight-step-process.md) | The full pipeline: load the idea, name the bet, steelman, second-order effects, un-testable bet, verdict, reasons, resurrection triggers |
| 04 | [04-verdict-semantics.md](04-verdict-semantics.md) | KILL, PAUSE, REVISE, SHIP semantics and the reversibility and stage-gate concepts behind them |
| 05 | [05-untestable-bets-cheap-validation.md](05-untestable-bets-cheap-validation.md) | Testability as a kill signal; falsifiability and the riskiest-assumption experiment practice |
| 06 | [06-output-and-resurrection-triggers.md](06-output-and-resurrection-triggers.md) | The kill verdict document format, its match to decision records, and resurrection triggers as inverted kill criteria |
| 07 | [07-anti-patterns-red-flags.md](07-anti-patterns-red-flags.md) | Hedging, polite-yes verdicts, vibes in reasons, verdict-shopping; motivated reasoning and groupthink; the red-flag checklist |
| 08 | [08-skill-ecosystem.md](08-skill-ecosystem.md) | Upstream (idea-refine, ideate-solo), complementary (prior-art-search), downstream (spec-driven-development), alternative (negative-skill-space), orthogonal (doubt-driven-development), loading constraints |

## Research summary

- Results collected: 80 (7 web-shaped subtopics, 2 searXNG queries each, top 6 kept per query, deduplicated by URL; subtopic 08 is an internal-record subtopic, no dig)
- Weight split: 29 high (weight >= 0.5) / 51 low (weight < 0.5)
- jev requests: 8 (1 outline validation with 8 score questions, 7 noul weighting batches of 8 to 12 results), via DefAPI direct `POST https://api.defapi.org/api/v1/decisions`, model `typesafe/jev-1.13`; usage 8970 input tokens / 1592 output tokens
- Redos: 0 digs, 0 jev requests
- Skipped docs: none. 8 of 8 subtopics kept (all scored 2 on outline validation)

## Outline validation

One jev score request over all 8 subtopics (criteria lowest-first: padding / marginal / load-bearing). Scores: 01 1.89, 02 1.90, 03 1.75, 04 1.71, 05 1.87, 06 1.85, 07 1.83, 08 1.66. All kept, none dropped. Full answers in `research-db/outline.json`.

## Notes

- Subtopic 08 (skill ecosystem) is an internal-record subtopic: it documents the source doc's own pipeline relations, so it cites the source doc and carries no dig.
- Weak-backing claims (weight < 0.5) are labeled "weak backing" inline in the docs; no claim ships without a source URL and a weight.
- Subtopic 05's lean-startup dig survived weighting thinly (best weight 0.41); the affected claims are labeled weak rather than padded.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); DefAPI `typesafe/jev-1.13` 200 (agent-side probe skipped per speed optimization 3).
