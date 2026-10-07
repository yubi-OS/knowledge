# falsification-corpus

Knowledge corpus explicating the yubiOS skill `falsification-corpus`. Ground source: `yubi-OS/yubiOS skills/falsification-corpus/SKILL.md` (fetched 2026-10-06, 12917 B). The SKILL.md is the primary source of record; every doc cites it as the grounding spine, plus searXNG digs weighted by the jev-1.13 decision model.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [known-answer-doctrine.md](01-known-answer-doctrine.md) | What a known-answer corpus is, the doctrine that the instrument never validates itself, use and no-use boundaries, and the provenance from the 2026-10-06 supersolid run. |
| 02 | [preregistration.md](02-preregistration.md) | Pre-registration discipline: pinned parameters, predicted bands, pass/fail gates, and the dated amendments log, all committed before any measurement. |
| 03 | [generator-design.md](03-generator-design.md) | Generator design rules: scale-band pinning, uniform elements far below the finest spacing, pre-render ink-coverage arithmetic, and empirical element survival checks. |
| 04 | [advisor-review.md](04-advisor-review.md) | Independent advisor review of generator and gate design before build, and the logging of falsifiable advisor predictions including their failures. |
| 05 | [real-data-protocol.md](05-real-data-protocol.md) | Real-data pass protocol: dimensionality check first, matched-extent confound controls named in advance, and honest single-trial noise reporting. |
| 06 | [anti-patterns-artifacts.md](06-anti-patterns-artifacts.md) | The 8 anti-patterns (each one cost a fix or a review) and the version-stamped corpus artifact set. |

## Research summary

- Results collected: 70 (12 searXNG queries across 6 subtopics, top 6 per query, deduped by URL)
- Weight split: 30 high (>= 0.5) / 40 low (< 0.5); weak-backing claims are labeled in the docs
- jev requests: 6 (1 outline validation via score metric, 5 noul weighting batches of 14, DefAPI direct at api.defapi.org/api/v1/decisions)
- jev usage: 7335 input tokens / 1419 output tokens
- Redo counts: 0 (all 12 queries returned on first attempt)
- Skipped docs: 0; every kept subtopic was authored
- Dropped subtopics (outline validation, score rounded to 0): 3 of 9, gate-design-lattice (0.21), l-convergence (0.39), live-route-parity (0.40)

## Preflight

Preflight 2026-10-06: searXNG healthy (campaign preflight run orchestrator-side); /api/decisions (typesafe/jev-1.13) 200 via DefAPI direct, steady-orbit /api/decide held as fallback and unused.
