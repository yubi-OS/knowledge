# Spherical defocus G1: the heat semigroup on the question space

Corpus minted from yubi-OS/yubiOS refs/spherical-defocus-g1-2026-08-13.md. The G1 experiment verifies the heat-kernel defocus law for corpora embedded on the sphere, shows where it breaks on a real atomic corpus, and turns the break into a corpus audit instrument.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-heat-semigroup-identity.md](01-heat-semigroup-identity.md) | Real spherical harmonics as Laplace-Beltrami eigenfunctions, the semigroup identity E[Y_lm(B_t^x)] = e^{-l(l+1)t} Y_lm(x), and why defocus is closed-form on a quasi-uniform design. |
| 02 | [02-monte-carlo-verification.md](02-monte-carlo-verification.md) | Leg 1: Euler-Maruyama tangent steps on a 2048-point Fibonacci lattice, 48 replicates, pooled per-degree regression; measured/predicted ratios in [1.000, 1.028]. |
| 03 | [03-corpus-embedding-pipeline.md](03-corpus-embedding-pipeline.md) | Z-score to PCA top-2 to RMS rescale to inverse stereographic lift, then ridge fit on 16 real harmonics at lambda = 10^-3; per-degree Parseval energies at t=0. |
| 04 | [04-atomic-corpus-failure.md](04-atomic-corpus-failure.md) | Leg 2 on the real 2286x9 corpus: energy collapses at t=0.005, decay is non-monotone in degree, a floor persists; 176 distinct rows of 512 make the cloud a set of point masses. |
| 05 | [05-atomicity-diagnostic.md](05-atomicity-diagnostic.md) | The instrument the failure yields: A_l(t) = e^{-2l(l+1)t} - E_l(t)/E_l(0); A_1(0.005) = 0.59 quantifies the corpus's atomicity in one scalar. |
| 06 | [06-null-design-admission.md](06-null-design-admission.md) | The identity needs no null (it is a theorem); the atomicity diagnostic does, and its specified null is a curveball draw with matched marginals where A_null approximately equals A_real. |
| 08 | [08-generative-diffusion-sphere.md](08-generative-diffusion-sphere.md) | Riemannian score-based diffusion on the sphere requires the heat kernel; the G1 gate says any generative model on an atomic corpus must smooth atoms first (vMF bandwidth as pre-diffusion). |

Subtopic 07 (unlocked-program) was dropped at outline validation with score 0.45; numbering keeps the validated outline order.

## Research summary

- Results collected: 84 (14 searXNG queries, 2 per kept subtopic, top 6 kept per query).
- Weight split: 39 results at weight >= 0.5 (authoritative backing), 45 below 0.5 (weak backing, labeled as such in the docs).
- Jev: 18 requests to /api/decide (1 preflight probe, 1 outline score validation over 8 subtopics, 16 noul weighting batches of 5), model clef, usage 14113 input tokens / 0 output tokens.
- Redos: 0 dig redos; 2 transient 429s on /api/decide recovered by the standard 30-second retry without changing any decision.
- Skipped docs: none. All 7 kept subtopics had digs strong enough to author honestly.
- Preflight 2026-10-05: searXNG 74 results healthy; /api/decide (clef) 200.

The research-db directory stores the full evidence chain: preflight.json, outline.json (with the complete jev validation record), archive.json (all 84 results with per-result noul decisions), per-doc digs/*.json, jev-log.json (one entry per jev HTTP request), and db.ts (the type map).
