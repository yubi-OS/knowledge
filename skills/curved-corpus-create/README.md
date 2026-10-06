# skills/curved-corpus-create

Knowledge corpus explicating the yubiOS skill `curved-corpus-create` (ground source: [yubi-OS/yubiOS skills/curved-corpus-create/SKILL.md](https://github.com/yubi-OS/yubiOS/blob/main/skills/curved-corpus-create/SKILL.md), 18960 B fetched 2026-10-06). The skill generates binary corpora with prescribed curved structure (planted real spherical-harmonic signal on a Fibonacci golden-angle S^2 lattice), matched null corpora (curveball, column-permutation, iid), a lens-format calibration pack, and IS-THIS-X placement.

## Corpus index

| NN | doc | scope |
|---|---|---|
| 01 | [01-standard-candle-mission.md](01-standard-candle-mission.md) | The generative inverse of the RSI curve regime; the standard-candle factory and its four jobs |
| 02 | [02-when-to-use-and-interfaces.md](02-when-to-use-and-interfaces.md) | Use and non-use conditions, the five subcommands, input contract, hard constraints |
| 03 | [03-fibonacci-lattice.md](03-fibonacci-lattice.md) | The frozen Fibonacci golden-angle lattice, the real SH basis at L = 3, the corrected Y_3^3 constant |
| 04 | [04-planted-generation.md](04-planted-generation.md) | The 5-step generate algorithm, Bernoulli-logistic sampling, the params generative truth |
| 05 | [05-measure-statistics.md](05-measure-statistics.md) | Everything measure reports, the frozen fit pipeline, dV2z, Marchenko-Pastur relaxation |
| 06 | [06-null-ensembles.md](06-null-ensembles.md) | The three matched nulls, curveball as primary decision null, N and d matching |
| 07 | [07-calibration-power.md](07-calibration-power.md) | Lens-format calibration, power and FPR, the detection threshold, pre-registration |
| 08 | [08-lens-format-patches.md](08-lens-format-patches.md) | The v1.1.0 lens output contract, the lens subcommand, place, the PR #202 story |
| 09 | [09-guidelines-antipatterns.md](09-guidelines-antipatterns.md) | The 11 guidelines, the anti-pattern list, the red-flags table |
| 10 | [10-composition-verification.md](10-composition-verification.md) | Composition with the curve family, the selftest contract, changelog and lineage |

## Research summary

- Results collected: 72 (5 web-shaped subtopics, 2 searXNG queries each, top 6 kept per query).
- Weight split: 3 high (>= 0.5) / 69 low (< 0.5). The dominant primary sources are the curveball algorithm paper (https://www.nature.com/articles/ncomms5114, weight 0.85) and the Stan binary-distributions reference (https://mc-stan.org/docs/functions-reference/binary_distributions.html, weight 0.58). Most statistical-vocabulary digs returned weak (< 0.5) sources and are labeled as weak backing in the docs.
- Docs: 10 authored, 0 skipped. Docs 01, 08, 09, 10 are internal-record subtopics (no dig, grounded in the source doc); docs 02 through 07 carry dig citations.
- jev requests: 7 (1 outline score request, 6 noul weighting batches of 14), usage in 9485 / out 1546 tokens.
- Redos: 0 (no dig redo needed; no decide-request failures).
- Gaps/skips: none. Doc 02's statistical vocabulary grounding is weak-weighted and labeled inline.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); decide via https://api.defapi.org/api/v1/decisions (typesafe/jev-1.13), agent-side probe skipped for speed per mint-brief optimization 3.
