# 03. The Winner: V1_plus_V6 (clef p 0.686)

**Scope:** The winner (clef choice: V1_plus_V6, p 0.686; next best V1 alone 0.202): detailed analysis grounded in yubi-OS/yubiOS refs/hierarchy-oracle-2026-10-06.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/hierarchy-oracle-2026-10-06.md, no external web dig

## The decision

The one-pager records the MVP choice made with a clef `choice` question: **V1_plus_V6 at p 0.686**. The next best option, V1 alone, scored 0.202. The margin (0.686 versus 0.202) is wide; the winning option took more than three times the probability of the runner-up.

## What V1_plus_V6 is

The doc names it **the two-axis hierarchy oracle with inherited-ordering certification**. It has three components.

### Component 1: spectral-standard-v1 (the new instrument)

- Input: any ordered series. The doc lists a spectrum, a PSD, or the Laplacian eigenvalues of a graph built on the artifact's ink mask.
- Measurement: fit the counting exponent N(omega) proportional to omega^alpha over a pinned window.
- The window is described as the 1D analogue of the 4..64 px pin used by box counting.
- The fit is permutation-null gated: shuffle the series and the exponent must not survive.

The permutation gate is the instrument's honesty check. A counting exponent that is unchanged when the order is destroyed is measuring sample size, not structure.

### Component 2: the oracle verdict

- Inputs: D_geo from edge-standard, d_s from spectral-standard.
- Gate: the Einstein-relation consistency check |d_s - 2*D/d_w| <= band.
- Secondary signature: the log-periodic wiggle.

The doc's own description: two independent measurements of the same inherited ordering, cross-checked by a physics identity. The geometric axis and the spectral axis are computed by different code paths from different mathematical quantities; agreement through d_s = 2D/d_w is evidence neither is an artifact.

### Component 3: inherited, not sampled (the V6 contribution)

- The gold family is the Sierpinski gasket, with exact closed forms for D, d_w, and d_s.
- Calibration comes from known-answer structure, not from random-feature sampling.
- Any new feature extractor is certified by passing the consistency check on the gold family.

The last point turns the oracle into a certification harness. A new extractor (for example, a graph builder for text embeddings) does not need its own ad-hoc validation; it must reproduce the gasket's exponents and pass the Einstein gate.

## Why the combination beat V1 alone

V1 is the two-axis measurement. V6 is the generalizing principle that calibration must be inherited. V1 without V6 would still produce two numbers and a gate, but would leave open how a new feature space is validated. V6 without V1 is a principle with no instrument. The companion solo log's clef readings make the same point: V6 scored highest on "advance" (0.8819) and V1 highest on "testable" among the oracle options (0.9549), and the solo log describes V6 as the generalizing principle and V1 as the winner component.

## Probabilities in context

| Option | MVP choice p |
|---|---|
| V1_plus_V6 | 0.686 |
| V1 alone | 0.202 |

The one-pager gives only these two values; the full distribution across all variants is in the solo companion (V2 0.0884, V3 0.0072, V4 0.0130, V5 0.0031 per the solo log).

## What the winner commits the build to

1. A new stdlib instrument for spectral and walk exponents.
2. An oracle that combines it with edge-standard D through the Einstein relation.
3. A gold family with exact answers, used both to calibrate and to certify extractors.
4. A secondary, non-fitted log-periodic check.

These commitments became the SPEC's goal and instrument contract (spectral-standard-v1 + hierarchy-oracle-v1), where the band was pinned at 0.10 and the r2 gate at 0.98.

## What the winner does not claim

The one-pager presents V1_plus_V6 as an MVP choice, not as a proof that the oracle will work. Its open questions (doc 06) remain unresolved at decision time, and its not-doing list (doc 05) defers every component that would act on a verdict.
