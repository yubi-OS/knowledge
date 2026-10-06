# 05: The Part I gap map (A through F)

Scope: source doc finding F7: the six Part I gaps, each with its named test design and internal data targets.

Grounding spine: [source doc](file://yubi-OS/yubiOS playbooks/lensing-question-space.md), 2026-08-13, section F7.

Internal-record subtopic, no dig: every gap below names a test against internal result files, so the entire content is sourced from the source doc. Nothing external is claimed.

## The six gaps

1. Gap A, which refractive index: candidates are sqrt(det Fisher), 1/SD0 of the statistic, and |phi_theta'|; the test is which one predicts the measured power surface on the standard-candle grid, using data already in results/signal_recovery.json (source doc).
2. Gap B, Snell invariant at basis interfaces: test whether n_D sin theta_D is conserved across the ladder, with n_D taken from the per-D nulls; pure re-analysis of ladder_VD.json (source doc).
3. Gap C, intent space must pass the membership condition: define I as the minimal embedding preserving all family verdicts; its null is the same embedding trained on curveball draws (source doc).
4. Gap D, power the lens: optimize phi_theta to concentrate a target family while the null image stays diffuse; the objective is null-standardized, never raw fit; the anti-caustic constraint is design rank plus condition number (source doc).
5. Gap E, caustic classification: perturb each degenerate basis by one column to distinguish fold from structural collapse (source doc).
6. Gap F, Wasserstein channel (speculative): Benamou-Brenier geodesics between corpus and null row-distributions; admit only behind its own null (source doc).

## Reading

The gap map is the operational half of Part I: each finding in docs 01 through 04 converts into one of these tests, and each test names its data file. The doc's own design rule repeats throughout: every new coordinate must be admitted behind a non-degenerate null before it enters the map.
