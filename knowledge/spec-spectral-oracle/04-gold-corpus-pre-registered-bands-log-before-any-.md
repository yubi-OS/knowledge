# 04. Gold Corpus: Pre-Registered Bands, Logged Before Any Measurement

**Scope:** Gold corpus (pre-registered bands: log BEFORE any measurement, per falsification-corpus skill): detailed analysis grounded in yubi-OS/yubiOS refs/SPEC-spectral-oracle-2026-10-06.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/SPEC-spectral-oracle-2026-10-06.md, no external web dig

## The discipline

The SPEC requires the gold bands to be logged **before any measurement**, per the falsification-corpus skill. Pre-registration prevents the most common failure in instrument building: running the instrument, seeing the number, and drawing the band around it.

## The 8-row gold table

| # | Gold | Quantity | Predicted band |
|---|---|---|---|
| 1 | Gasket graph level 3 (27 vertices) + level 4 (81 vertices), Laplacian eigenvalues computed exactly (Jacobi, fraction or float64 with residual check) | d_s (counting) | 1.365 +/- 0.07, i.e. [1.295, 1.435] |
| 2 | Gasket graph, walk mode | d_w | ln5/ln2 = 2.32193 +/- 0.10 |
| 3 | Gasket graph, walk mode | MSD exponent alpha = 2/d_w | 0.861 +/- 0.04 |
| 4 | 1D chain (path graph) | d_s | 1.0 +/- 0.10 |
| 5 | 2D 4-connected lattice patch | d_s | 2.0 +/- 0.15 |
| 6 | Eigenvalue series PERMUTED (null) | counting exponent | must collapse |
| 7 | Falsification renders (tri, gasket render, jitter) via oracle path | d_s (walk) | gasket render in [1.295, 1.435]; tri and jitter both about 2.0 |
| 8 | Log-periodic modulation on exact gasket eigenvalues | wiggle presence | residual alternation across successive octave bands must be present |

## Row-by-row reading

**Rows 1 to 3: the gasket closed forms.** These test the instrument against exact theory. Row 1 uses exact eigenvalues (Jacobi with residual check) so any failure is the counting fit's fault, not the eigen-solver's. Rows 2 and 3 test walk mode on the same graph; they are linked by alpha = 2/d_w, so a pass on one and fail on the other would point to an implementation bug.

**Rows 4 and 5: the trivial anchors.** A path graph has d_s = 1 and a 2D lattice has d_s = 2. If the instrument cannot recover integers on regular structures, nothing it says about fractals can be trusted. The 2D band (+/- 0.15) is wider than the 1D band (+/- 0.10), acknowledging finite-patch boundary effects.

**Row 6: the permutation null.** Shuffle the eigenvalue series and refit. The SPEC's pass rule: |alpha_perm - alpha_sorted| >= 0.5 **or** fit r2 < 0.98. If the exponent survives permutation, the window is reading sample size rather than spectral structure, and the SPEC calls that a harness failure. This is the single most important row for honesty: it proves the counting exponent depends on order.

**Row 7: the order-blindness reproduction.** Renders of a triangle, a gasket, and a jittered field go through the full oracle path. The gasket render must land in the gasket band. Tri and jitter should both read about 2.0. The SPEC is explicit that this is predicted: D's known order-blindness must reproduce in d_s, so "jitter about equal to lattice" is the predicted null, not a bug. The row guards against a tempting misread, where an implementer "fixes" the instrument so jitter reads differently and in doing so breaks its physics.

**Row 8: the secondary gate.** Exact gasket spectra carry log-periodic modulation. The test is presence of residual alternation across octave bands. It is never a fit parameter; adding oscillation terms to the fit would let the model absorb structure it is supposed to detect.

## Band widths as design decisions

| Row | Half-width | Relative |
|---|---|---|
| 1 | 0.07 on 1.365 | about 5% |
| 2 | 0.10 on 2.322 | about 4% |
| 3 | 0.04 on 0.861 | about 5% |
| 4 | 0.10 on 1.0 | 10% |
| 5 | 0.15 on 2.0 | 7.5% |

The fractal rows are tighter in relative terms than the trivial rows. That is a deliberate stress: gold bands are where the instrument earns trust.

## Open sizing question inherited from ideation

The ideation one-pager left the exact gasket level for the eigen-solve open (level 5 = 243 vertices is Jacobi-feasible; level 6 = 729 is borderline in stdlib). The SPEC's row 1 pins levels 3 and 4 (27 and 81 vertices), the cheap, exact end of that range.

## How the table is used

The harness selftest runs every row; the route `GET /api/jev/corpus/spectral/selftest` exposes it live, returning 200 if all pass and 500 if any fail (doc 05). A deploy that cannot pass its own gold table is not a deploy.
