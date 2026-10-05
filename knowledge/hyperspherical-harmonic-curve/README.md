# Hyperspherical Harmonic Curve

A knowledge corpus on the Hyperspherical Harmonic Curve: the sphere-geometry variant of curve-guided corpus auditing that replaces the flat 2-D Fourier Stage-1 fit with hyperspherical harmonics on S^N plus a learned Moebius reparameterization, the design decisions behind it, and its matched-parameter fitness test. Minted from yubi-OS/yubiOS refs/hyperspherical-harmonic-curve-2026-08-05.

## Docs

| NN | File | Scope |
|---|---|---|
| 01 | 01-laplace-beltrami-eigenbasis.md | The canonical hyperspherical harmonic basis: Laplace-Beltrami eigenfunctions, orthonormality, and why a canonical basis shrinks parameter count. |
| 02 | 02-mobius-reparameterization.md | The learned Moebius map in PSL(2,C): 6 real parameters, cross-ratio preservation as the falsifiable invariant, mechanism-layer novelty. |
| 03 | 03-curve-guided-rsi-pipeline.md | The incumbent pipeline: 9-D binary primitive coverage, the flat Fourier Stage-1 fit, and the 5-stage loop the variant swaps into. |
| 04 | 04-matched-parameter-ablation.md | Stage-5 verification: S2/L=3 versus flat k=2 and k=4 on one holdout split; the only metric that can return negative. |
| 05 | 05-equal-area-partition-sparse-cells.md | Stage-2 sparse-cell detection: equal-area 441-cell partition, chordal radius about 0.095, and the 0.05 grid hazard. |
| 06 | 06-spherical-harmonics-software-pitfalls.md | Implementation: sph_harm deprecation and sph_harm_y convention pinning, lie_learn and e3nn coverage gaps, pre-fit validation. |
| 07 | 07-n2-n3-gates.md | Manifold dimension choice: the N=2 default, the 90-item and PC3 >= 0.08 gates for N=3, and degrees-of-freedom floors. |
| 08 | 08-variant-scoring-ideation.md | The ideation record: 4 scored interpretations, the runner-up Blaschke path, and the 10 advisor revisions. |
| 09 | 09-falsifiable-vs-informative-metrics.md | Falsifiable versus provable-but-uninformative metrics: chi, H^k, holonomy, the vacuous epsilon_spec identity, and silent degradation. |

## Research summary

- Results collected: 108 (9 subtopics, 2 searXNG queries each, top 6 kept per query)
- Weight split: 43 primary (noul >= 0.5) / 65 weak (noul < 0.5) of 108
- Weak-backing discipline: every claim in the docs carries its source URL and weight; claims with weight below 0.5 are labeled as weakly backed in the text
- Internal design-record facts (parameter counts, gate thresholds, cell counts) are attributed to the yubiOS design record explicitly; they are project-internal provenance, not web-sourced claims
- Jev requests: 24 total (1 preflight probe, 1 outline validation, 22 noul weighting batches); usage 19302 input tokens / 0 output tokens
- Redos: 0 dig redos; 0 decide retries
- Skipped docs: none
- Gaps: none

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
