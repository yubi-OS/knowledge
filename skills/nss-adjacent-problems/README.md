# nss-adjacent-problems knowledge corpus

Knowledge corpus explicating the yubiOS skill `nss-adjacent-problems` (source doc: `yubi-OS/yubiOS skills/nss-adjacent-problems/SKILL.md`, fetched 2026-10-07, 16940 bytes). The skill is the sixth axis of the 12-axis negative-skill-space sweep: it scores a file's coverage of related problems, alternative solutions, problem-family taxonomy, and prior-art cross-references.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [01-axis-scope-and-use.md](01-axis-scope-and-use.md) | What the axis scores, trigger phrases, when-to-use / when-not-to-use boundaries. |
| 02 | [02-coverage-rubric.md](02-coverage-rubric.md) | The 0-5 coverage levels, Absent through Exemplary, and what each level requires. |
| 03 | [03-scoring-dimensions.md](03-scoring-dimensions.md) | The ten 0-2 dimensions, the 20-point maximum, and the label bands. |
| 04 | [04-relation-taxonomy.md](04-relation-taxonomy.md) | The fixed seven-relation taxonomy and its Springer typology derivation. |
| 05 | [05-key-distinctions.md](05-key-distinctions.md) | The six distinctions that keep the relationship map from conflating itself. |
| 06 | [06-prior-art-practice.md](06-prior-art-practice.md) | MPEP 904 analogous-art search, citation with context, prior-art-search composition. |
| 07 | [07-lens-format.md](07-lens-format.md) | The cycle-13 lens-format patch: fields, verification contract, degenerate red flags. |
| 08 | [08-secondary-research.md](08-secondary-research.md) | Snowballing, systematic mapping, scoping review: the methods behind the prior-art channel. |
| 10 | [10-composition-and-antipatterns.md](10-composition-and-antipatterns.md) | Composition map, anti-patterns, red-flag table, and the RSI closing loop. |

## Research summary

- Results collected: 108 (72 from attempt 1, 36 from redo attempt 2)
- Weight split: high (>= 0.5) 4 / low (< 0.5) 104
- Jev requests: 9, usage 10918 input / 2124 output tokens (typesafe/jev-1.13 via DefAPI direct)
- Redos: 3 (one per web-shaped subtopic 01, 02, 08; attempt-1 results were noise-dominated)
- Skipped docs: 09-cross-reference-conventions, dropped by outline validation (score 0.42, P(drop)=0.65); its dig record is retained with outcome skipped
- Gaps: the RFC 2119 / RFC 8174 and Google cross-reference-style conventions are covered only insofar as the source doc itself references them (doc 05, distinction 5); the dedicated subtopic was dropped and no dig-backed doc covers it

Preflight 2026-10-06: searXNG dig healthy (campaign preflight, orchestrator); DefAPI direct /api/v1/decisions (typesafe/jev-1.13) 200.
