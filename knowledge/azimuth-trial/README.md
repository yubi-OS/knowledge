# azimuth-trial: the azimuth channel in corpus-audit geometry

Knowledge corpus minted from `yubi-OS/yubiOS refs/azimuth-trial-2026-09-19.md`. Topic: why the azimuth channel failed as a diagnostic (what killed it) and the one surviving path for azimuthal structure in spherical-harmonic corpus fits.

## Corpus docs

- **01-rayleigh-gauge-free.md**: The gauge-free Rayleigh Z_m harmonic family: rotation invariance, refit empirical nulls, and why the instrument itself survived the trial.
- **02-index-assignment-confound.md**: Index-assigned azimuth (Fibonacci golden-angle lattice) versus data-derived azimuth, and why the papers' ordering-permutation burial does not transfer.
- **03-atomicity-duplicate-patterns.md**: Duplicate binary patterns as heavy point masses: 44.5 percent collision at d=9, the manufactured m=1 exclusion, and its structural retraction.
- **04-circular-variance-pitfall.md**: Circular variance as 1 minus R-bar: the same confounded first-moment quantity that failed as m=1, and its permanent exclusion.
- **05-chart-dependence-mobius.md**: Chart dependence of angular measurement: the identity chart's measured blindness versus the powered PSL(2,C) lens result.
- **06-powered-lens-selection-null.md**: Selection nulls and post-selection inference for a fitted six-parameter chart, with guard rejections and declared stopping rules.
- **07-krawtchouk-spectrum.md**: The exact Krawtchouk decomposition of a {0,1}^9 corpus over the Hamming association scheme: the chart-free path.
- **08-eigengap-stability.md**: Relative eigengaps by placement variant: ordinary binary chart, nearly unstable continuous refit plane, and the eigengap guard precondition.
- **09-low-power-nondetection.md**: Why the continuous non-exclusions are low-power non-detections, not null results, and how the record reports them.

## Per-doc sources

| doc | results kept | primary (>= 0.5) |
|---|---|---|
| 01 | 01-rayleigh-gauge-free.md | 12 | 8 |
| 02 | 02-index-assignment-confound.md | 12 | 5 |
| 03 | 03-atomicity-duplicate-patterns.md | 12 | 8 |
| 04 | 04-circular-variance-pitfall.md | 12 | 5 |
| 05 | 05-chart-dependence-mobius.md | 12 | 7 |
| 06 | 06-powered-lens-selection-null.md | 12 | 6 |
| 07 | 07-krawtchouk-spectrum.md | 12 | 6 |
| 08 | 08-eigengap-stability.md | 12 | 9 |
| 09 | 09-low-power-nondetection.md | 12 | 8 |

## Research summary

- Results collected: 108 (searXNG, top 6 per query, 2 queries per subtopic, 9 subtopics, 18 queries total)
- Weight split (jev noul probability): 62 primary (>= 0.5) / 46 weak (< 0.5) of 108
- jev requests: 25 total (1 preflight probe + 2 outline validation issues + 22 weighting batches), usage 20110 input / 0 output tokens
- Redos: 0 (no thin digs; no decision-model failures)
- Skipped docs: none (all 9 subtopics authored)
- Metric mapping: score for outline validation, noul for source weighting, via clef on /api/decide

Preflight 2026-10-05: searXNG healthy (probe ok; all 18 dig queries returned results, 31 to 65 raw each); /api/decide (clef) 200.

## Notes

- The internal trial numbers quoted in the docs (Z_m tables, eigengaps, tails, guard statistics) come from the source record `refs/azimuth-trial-2026-09-19.md` and its errata of 2026-09-26; the web sources collected here ground the general methodology (Rayleigh tests, permutation nulls, circular statistics, post-selection inference, Krawtchouk/Hamming algebra, PCA stability, power analysis).
- Claims backed at weight < 0.5 are labeled weak in the doc text.
- No em dashes; numbers as digits; plain UTF-8 JSON in research-db.
- The outline validation request was issued twice after an operational filesystem error lost the first response; both requests are logged in jev-log.json and the captured response is recorded in outline.json (identical scores).
