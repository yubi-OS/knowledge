# 01. Verdict: both endpoints pass their pre-registered falsification gates

**Scope:** Verdict: BOTH ENDPOINTS PASS THEIR PRE-REGISTERED FALSIFICATION GATES: detailed analysis grounded in yubi-OS/yubiOS refs/visco-falsification-2026-10-06.md.

Ground source: `yubi-OS/yubiOS refs/visco-falsification-2026-10-06.md`. Dig queries: `Prony series viscoelastic relaxation exponential sum fitting`; `hysteresis loop energy dissipation cyclic loading`.

## The headline result

The round record's verdict is unambiguous: both visco endpoints under test pass every pre-registered falsification gate. For `POST /api/jev/corpus/visco/snapback` (build-order item 5), 852 of 852 per-case records pass and all six gates (G1 to G6) pass. For `GET /api/jev/corpus/visco/hysteresis` (item 6), all four gates pass: H0 frozen repo fixtures, H1 live parity, H2 contract, and H3 analytic fixtures. The round ran on 2026-10-07 (UTC) against the live steady-orbit worker through the "Steady Orbit jev operator" bearer connection, using the worker executor because the sandbox is blocked by Cloudflare error 1010 on workers.dev. Nothing was pushed to any repo; the record exists for orchestrator review.

## What the two instruments measure

Both endpoints borrow vocabulary from viscoelasticity, the physics of materials that both store and dissipate energy under load. That framing explains why the gates look the way they do.

**Hysteresis as dissipated area.** In mechanics, the area enclosed by a stress-strain loop under cyclic loading is the energy dissipated per cycle. A classic study of low-carbon steel examined how loading history shapes "the shape and area of stabilized hysteresis loops obtained under cyclic loading" [Hysteresis energy of cyclic loading - ScienceDirect](https://www.sciencedirect.com/science/article/pii/0025541684902398) (clef weight: 0.6317), and later work validated cyclic strain-energy dissipation with digital image correlation against extensometry [Hysteresis-loop representation for strain energy calculation and ...](https://www.researchgate.net/publication/239407932_Hysteresis-loop_representation_for_strain_energy_calculation_and_fatigue_assessment) (clef weight: 0.4075) (weak backing, clef weight < 0.5). A Scribd copy of the steel paper [Hysteresis Energy in Cyclic Loading | PDF | Fatigue (Material ... - Scribd](https://www.scribd.com/document/699736619/Hysteresis-energy-of-cyclic-loading) (clef weight: 0.0405) (weak backing, clef weight < 0.5), the Wikipedia hysteresis article [Hysteresis - Wikipedia](https://en.wikipedia.org/wiki/Hysteresis) (clef weight: 0.0998) (weak backing, clef weight < 0.5), and a Bouc-Wen model page describing the most widely used hysteretic model in structural engineering [Bouc-Wen model of hysteresis](https://handwiki.org/wiki/Physics:Bouc-Wen_model_of_hysteresis) (clef weight: 0.1408) (weak backing, clef weight < 0.5) round out the concept. The jev hysteresis route applies the same idea to prediction ledgers: per-row area is `|predicted_delta - realized_delta|`, summed over each supersedes chain, so every miss between what a round predicted and what it realized counts as dissipated "energy". The 102.86 round-3 total is that sum for the recorded series.

**Relaxation and Prony series.** The visco family also includes a relaxation estimator built on a sum of exponentials. In finite-element practice, Prony series are the standard representation: Ansys documents Prony relative moduli and relaxation times as material inputs [4.8. Viscoelasticity - Ansys](https://ansyshelp.ansys.com/public/////////Views/Secured/corp/v242/en/ans_mat/evis.html) (clef weight: 0.5399), a Springer paper presents an optimal discrete-time Prony fitting method because the series is "easy" to implement in FE codes [Optimal discrete-time Prony series fitting method for viscoelastic ...](https://link.springer.com/article/10.1007/s11043-018-9394-z) (clef weight: 0.5875), and a 2024 study compares experimental frequency- and temperature-dependent elastomer data against Prony models [(PDF) Experimental and Theoretical Analysis of Frequency- and ...](https://www.researchgate.net/publication/385585226_Experimental_and_Theoretical_Analysis_of_Frequency-_and_Temperature-Dependent_Characteristics_in_Viscoelastic_Materials_Using_Prony_Series) (clef weight: 0.5684). NovaSolver describes the Prony series as a discretization of the generalized Maxwell model [Prony Series Viscoelastic Model | NovaSolver](https://novasolver.jp/en/structural/nonlinear-material/viscoelastic-prony.html) (clef weight: 0.2620) (weak backing, clef weight < 0.5), and an open-source Python fitter optimizes Prony parameters from storage and loss modulus data [Prony Series Fit for Viscoelastic Data - GitHub](https://github.com/mkhadijeh26/Viscoelasticity-) (clef weight: 0.1671) (weak backing, clef weight < 0.5). The Prony route was not under test in this round; it is the next visco item in the build order.

**Snapback as sign inversion.** Snapback does not have a mechanics analog in the dig; it is the jev term for a realized delta that runs opposite to the predicted direction. The route returns `inversion_runs`, `run_lengths`, a verdict, and a `gate_input.action` that tells the orchestrator whether to continue or halt the round.

## Evidence behind the verdict

| Instrument | Gates | Result | Headline anchor |
|---|---|---|---|
| Snapback | G1 to G6 | 852/852 cases, 6/6 gates PASS | Recorded round-3 series reproduced live: runs `[[4],[6,7],[10]]`, lengths `[1,2,1]`, verdict `snapback`, `halt_round` |
| Hysteresis | H0 to H3 | 4/4 gates PASS | 102.86 round-3 total reproduced by the local reference from the frozen fixture |

The snapback headline matters because it closes a loop with history: the live route reproduced, exactly, the recorded end-to-end result in `refs/visco-instruments-2026-10-02.md`, using the true series from `tools/visco-instruments/fixtures/visco-fixtures.json`.

## Why the verdict is trustworthy

Three properties of the round make the PASS meaningful rather than cosmetic. Gates were written before any corpus ran and none moved after results. The two mid-run corrections were harness bugs, logged as dated amendments, with their discarded data explicitly excluded from every gate. And the hysteresis reference was itself falsified once (gate H0 caught a wrong pairing rule) before being corrected, which shows the gates could fail. A harness that has never failed anything proves little; this one did its job on its own reference first.

## Sources Considered

All 10 Clef-weighted searXNG results from `dig_context_01.json`. Weight >= 0.5 is authoritative backing; < 0.5 is weak backing.

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | Prony Series Fit for Viscoelastic Data - GitHub | https://github.com/mkhadijeh26/Viscoelasticity- | 0.1671 | weak backing (< 0.5) |
| 2 | 4.8. Viscoelasticity - Ansys | https://ansyshelp.ansys.com/public/////////Views/Secured/corp/v242/en/ans_mat/evis.html | 0.5399 | authoritative (>= 0.5) |
| 3 | Prony Series Viscoelastic Model / NovaSolver | https://novasolver.jp/en/structural/nonlinear-material/viscoelastic-prony.html | 0.2620 | weak backing (< 0.5) |
| 4 | (PDF) Experimental and Theoretical Analysis of Frequency- and ... | https://www.researchgate.net/publication/385585226_Experimental_and_Theoretical_Analysis_of_Frequency-_and_Temperature-Dependent_Characteristics_in_Viscoelastic_Materials_Using_Prony_Series | 0.5684 | authoritative (>= 0.5) |
| 5 | Optimal discrete-time Prony series fitting method for viscoelastic ... | https://link.springer.com/article/10.1007/s11043-018-9394-z | 0.5875 | authoritative (>= 0.5) |
| 6 | Hysteresis energy of cyclic loading - ScienceDirect | https://www.sciencedirect.com/science/article/pii/0025541684902398 | 0.6317 | authoritative (>= 0.5) |
| 7 | Hysteresis Energy in Cyclic Loading / PDF / Fatigue (Material ... - Scribd | https://www.scribd.com/document/699736619/Hysteresis-energy-of-cyclic-loading | 0.0405 | weak backing (< 0.5) |
| 8 | Hysteresis - Wikipedia | https://en.wikipedia.org/wiki/Hysteresis | 0.0998 | weak backing (< 0.5) |
| 9 | Hysteresis-loop representation for strain energy calculation and ... | https://www.researchgate.net/publication/239407932_Hysteresis-loop_representation_for_strain_energy_calculation_and_fatigue_assessment | 0.4075 | weak backing (< 0.5) |
| 10 | Bouc-Wen model of hysteresis | https://handwiki.org/wiki/Physics:Bouc-Wen_model_of_hysteresis | 0.1408 | weak backing (< 0.5) |
