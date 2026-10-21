# 02. Pre-registration (written before any corpus run)

**Scope:** 1. Pre-registration (written before any corpus run): detailed analysis grounded in yubi-OS/yubiOS refs/visco-falsification-2026-10-06.md.

Ground source: `yubi-OS/yubiOS refs/visco-falsification-2026-10-06.md`. Dig queries: `non-negative least squares NNLS time-constant grid`; `run-length sign inversion detection time series`.

## The three pre-registration artifacts

The round's discipline rests on three files written before any corpus run:

| File | Contents |
|---|---|
| `preregistration.md` | Pinned input contracts, the class table with predicted verdicts, gates G1 to G6 and H0 to H3, declared limitations |
| `amendments.md` | Every change, dated, made pre-run, each with an a-priori justification |
| `probes.json` | The schema-discovery log for both endpoints, from which every pinned field was derived |

The ordering is the point. Probes come first, so pinned field names reflect what the live route actually returns rather than what a contract document says it should. The pre-registration then fixes the classes, predictions, and gates. Amendments are permitted, but only with a timestamp and a justification that does not depend on results. The record states that the discipline held: no gate moved after results.

## Pinning predictions for snapback

Snapback inputs are series of (cycle, predicted_delta, realized_delta) points, and the pre-registered prediction for each class is a verdict plus the exact inversion structure. An inversion is a point where the realized delta has the opposite sign to the predicted delta; consecutive inversions form a run. Predicting `inversion_runs` and `run_lengths` exactly (gate G2) is therefore a run-length encoding problem over a sign sequence.

That is a well-trodden pattern in time-series work. A Stack Overflow thread asks precisely how to detect positive-to-negative sign changes and report the interpolated crossover times and directions [r - How to detect sign change (eg, positive to negative) in time series ...](https://stackoverflow.com/questions/25091581/how-to-detect-sign-change-eg-positive-to-negative-in-time-series-data) (clef weight: 0.0518) (weak backing, clef weight < 0.5). More general event-detection frameworks exist: Harbinger is an R framework offering a unified interface for anomaly, change-point, motif, and discord detection [A Unified Time Series Event Detection Framework • harbinger](https://cefet-rj-dal.github.io/harbinger/) (clef weight: 0.3913) (weak backing, clef weight < 0.5), and a 2023 paper proposes a universal deep-learning approach to event detection in imbalanced, rare-event series [Event Detection in Time Series: Universal Deep Learning Approach](https://arxiv.org/pdf/2311.15654) (clef weight: 0.2990) (weak backing, clef weight < 0.5). The jev route needs none of that machinery; it applies a deterministic sign test per point. But the pre-registration borrows the discipline these sources assume: define the event precisely, then predict where it occurs. Because the corpus generator plants the signs, the expected runs are known exactly, and G2 can demand equality rather than a tolerance.

For noisy tiers, the pre-registration pins something different: an independent oracle verdict per seeded trial (G3) and an analytic false-positive rate per noise level (G4). The analytic FPRs were pinned numerically by amendment before the gates ran: 0.02138 at p=0.05, 0.08025 at p=0.10, 0.27334 at p=0.20, and 0.50359 at p=0.30, each with a tolerance of plus or minus 0.04.

## Pinning the hysteresis reference

The hysteresis side pre-registers a local reference implementation of the documented consolidation rules (CONTRACTS.md section 2), then three things that reference must reproduce: frozen repo fixtures (H0), live route output on real ledger rows (H1), and a set of analytic chain shapes (H3). The tolerance rule for the synthetic two-loop fixture is the contract's own: `1e-9 * (1 + |expected|)`.

## The adjacent estimator: NNLS on a tau grid

The visco family's Prony route, which the coverage record schedules as the next build (item 4), fits non-negative weights on a fixed grid of time constants. That is non-negative least squares: a constrained least-squares problem "where the coefficients are not allowed to become negative" [Non-negative least squares - Wikipedia](https://en.wikipedia.org/wiki/Non-negative_least_squares) (clef weight: 0.1563) (weak backing, clef weight < 0.5), mirrored on HandWiki [Non-negative least squares - HandWiki](https://handwiki.org/wiki/Non-negative_least_squares) (clef weight: 0.0746) (weak backing, clef weight < 0.5). A Sinica lecture notes that NNLS is a convex quadratic program with a unique optimum [PDF The nonnegative least squares problem - idv.sinica.edu.tw](https://idv.sinica.edu.tw/mathcomp/2021TMS/slide/Yueh-Cheng%20Kuo.pdf) (clef weight: 0.2041) (weak backing, clef weight < 0.5), scikit-learn shows that the constraint shrinks some coefficients to exactly 0 compared with OLS [Non-negative least squares - scikit-learn 1.9.1 documentation](https://scikit-learn.org/stable/auto_examples/linear_model/plot_nnls.html) (clef weight: 0.1985) (weak backing, clef weight < 0.5), and skscope documents a solver variant [1.6. Non-negative least squares - skscope documentation](https://skscope.readthedocs.io/en/latest/gallery/LinearModelAndVariants/non-negative-least-squares.html) (clef weight: 0.1390) (weak backing, clef weight < 0.5). All five are weak backing. They matter here because a future Prony harness will need the same pre-registration shape this round used: planted (tau, weight) pairs, pinned tolerances, and a declared envelope where recovery is not expected.

## What pre-registration bought

Two mid-run problems show the value. A runner seed-index misalignment would have silently measured the wrong corpus for two noisy tiers; because the generator, seeds, and per-case SHA-256 digests were pinned, the mismatch was detectable and the 400 affected calls were discarded. And the local hysteresis reference initially used a root-prediction pairing that gave 28.1 instead of the frozen 26.1; because H0 was pre-registered against frozen fixtures, the reference was proven wrong before it could certify the live route. Dig noise (a browser game [Run - Play it Online at Coolmath Games](https://www.coolmathgames.com/0-run) (clef weight: 0.0359) (weak backing, clef weight < 0.5) and a 1968 symposium statement [SHG - UFO Symposium 1968: Sagan Statement](http://www.project1947.com/shg/symposium/sagan.html) (clef weight: 0.1008) (weak backing, clef weight < 0.5)) supports no claim.

## Sources Considered

All 10 Clef-weighted searXNG results from `dig_context_02.json`. Weight >= 0.5 is authoritative backing; < 0.5 is weak backing.

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | Non-negative least squares - Wikipedia | https://en.wikipedia.org/wiki/Non-negative_least_squares | 0.1563 | weak backing (< 0.5) |
| 2 | Non-negative least squares - scikit-learn 1.9.1 documentation | https://scikit-learn.org/stable/auto_examples/linear_model/plot_nnls.html | 0.1985 | weak backing (< 0.5) |
| 3 | 1.6. Non-negative least squares - skscope documentation | https://skscope.readthedocs.io/en/latest/gallery/LinearModelAndVariants/non-negative-least-squares.html | 0.1390 | weak backing (< 0.5) |
| 4 | Non-negative least squares - HandWiki | https://handwiki.org/wiki/Non-negative_least_squares | 0.0746 | weak backing (< 0.5) |
| 5 | PDF The nonnegative least squares problem - idv.sinica.edu.tw | https://idv.sinica.edu.tw/mathcomp/2021TMS/slide/Yueh-Cheng%20Kuo.pdf | 0.2041 | weak backing (< 0.5) |
| 6 | Event Detection in Time Series: Universal Deep Learning Approach | https://arxiv.org/pdf/2311.15654 | 0.2990 | weak backing (< 0.5) |
| 7 | r - How to detect sign change (eg, positive to negative) in time series ... | https://stackoverflow.com/questions/25091581/how-to-detect-sign-change-eg-positive-to-negative-in-time-series-data | 0.0518 | weak backing (< 0.5) |
| 8 | Run - Play it Online at Coolmath Games | https://www.coolmathgames.com/0-run | 0.0359 | weak backing (< 0.5) |
| 9 | SHG - UFO Symposium 1968: Sagan Statement | http://www.project1947.com/shg/symposium/sagan.html | 0.1008 | weak backing (< 0.5) |
| 10 | A Unified Time Series Event Detection Framework • harbinger | https://cefet-rj-dal.github.io/harbinger/ | 0.3913 | weak backing (< 0.5) |
