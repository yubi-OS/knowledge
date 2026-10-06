# y33-fibonacci-sphere-paper-revised-passage

Knowledge corpus minted 2026-10-05 from yubi-OS/yubiOS `refs/y33-fibonacci-sphere-paper-revised-passage-2026-08-07.md`.

## Topic

Revising a paper's hyperspherical-harmonic section with a table-based revised passage: how the Fibonacci-sphere edit integrates into the `learned-latent-curves` writeup. The edit inserts a Fibonacci-sphere sampling scheme plus a Y_3^3 angular probe right after the Riemann-sphere sentence; the operational rule is "use Fibonacci for sampling, use Y_3^3 for the angular probe".

## Docs

| NN | slug | scope |
|---|---|---|
| 01 | paper-structure-insertion-point | Why S^2 is the parameter manifold and why the hyperspherical-harmonic section hosts the sampling edit |
| 02 | fibonacci-sphere-sampling | The node scheme z_i = 1-(2i+1)/N, phi_i = 2 pi i / golden ratio, theta_i = arccos(z_i) and its pole-avoidance properties |
| 03 | y33-angular-probe | Y_3^3 proportional to sin^3 theta e^{i3 phi}, the sectoral family, and the angular-probe role |
| 04 | revised-passage-edit-anatomy | The 3-row original/fix/rule table, the LaTeX block, and the drop-in placement |
| 05 | sampling-probe-complementarity | Fibonacci nodes own the where, Y_3^3 owns the what; different primitives at different levels of the diagnostic stack |
| 06 | low-discrepancy-discrepancy-theory | Discrepancy definitions, the Fibonacci lattice's standing vs strict Niederreiter QMC, and the weakly backed O(1/N^2) exponent |
| 07 | ablation-validation-plan | Uniform lat-long vs Fibonacci at matched N = 64 on 3 metrics with pass/fail/inconclusive criteria |
| 08 | companion-method-equation-block | The standalone methods-section equation artifact and the division of labor with the prose patch |

Subtopic 09 (rsi-primitive-lineage) was dropped at outline validation with score 0.33 (padding).

## Research summary

- Results collected: 96 (searXNG, 2 queries per kept subtopic, top 6 per query)
- Weight split: 50 high (>= 0.5) / 46 low (< 0.5), 0 unweighted
- Jev requests: 22 (1 preflight probe, 1 outline score validation with 9 questions, 20 noul weighting batches of 5), usage 17321 input / 0 output tokens
- Redos: 0 (all digs came back strong on first attempt)
- Skipped docs: 0 after outline validation (subtopic 09 was dropped pre-dig, not a dig thinness skip)

## Preflight

2026-10-05: searXNG 77 results healthy; /api/decide (clef) 200

## Research-db files

- `preflight.json`, `outline.json`, `archive.json`, `jev-log.json`, `db.ts`
- `digs/01-paper-structure-insertion-point.json` through `digs/08-companion-method-equation-block.json`

## Known weak spots

- The O(1/N^2) area-discrepancy exponent for the Fibonacci sphere (doc 06) originates in the source artifact and did not return an authoritative match in the dig; it is labeled weakly backed in the doc text.
- The revised passage's verbatim LaTeX, the paper-specific insertion-point sentence, and the ablation metrics are artifact-internal claims (yubi-OS/yubiOS refs), not dig-weighted; docs cite them as artifact-internal explicitly.
