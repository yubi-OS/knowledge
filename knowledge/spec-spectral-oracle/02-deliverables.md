# 02. Deliverables: Four Artifacts for the Parallel-Build-Lanes Round

**Scope:** Deliverables: detailed analysis grounded in yubi-OS/yubiOS refs/SPEC-spectral-oracle-2026-10-06.md.

Ground source: `yubi-OS/yubiOS refs/SPEC-spectral-oracle-2026-10-06.md`. Dig context: `dig_context_02.json` (10 clef-weighted searXNG results).

## The four deliverables

The SPEC lists exactly four artifacts for the round:

1. **Python source of record** `tools/spectral-standard/spectral_standard.py`: stdlib only, deterministic, no env access. The SPEC calls this a house rule that mirrors `edge_standard.py`.
2. **JS worker port** `jev-spectral-math.js`, plus a route-wiring spec for `jev-corpus-routes.js`, with fixture parity against the Python source.
3. **Falsification harness** `tools/spectral-standard/falsification/` with pre-registered bands plus a selftest, CI-guarded, mirroring the `gen_v2.py --selftest` pattern.
4. **Oracle composition contract**: the route shape (doc 05), with deployment via steady-orbit-deploy after the lanes and an advisor pass.

## Deliverable 1: why stdlib, deterministic, no env

These three properties make the Python file a reference implementation rather than a script. Stdlib-only removes dependency drift. Determinism (seeded walks, see doc 03) means the same input always yields the same exponents. No env access means no hidden configuration can change a measurement. Together they let the file serve as the arbiter in parity disputes (doc 06).

## Deliverable 2: the series-mode lineage

Series mode fits an integrated counting exponent, log N(omega <= x) against log x, on any ordered 1D series such as Laplacian eigenvalues or PSD bins. This is a direct descendant of eigenvalue-counting asymptotics on domains with fractal boundary, the Weyl-Berry problem.

The dig supports that lineage at mixed weights. Lapidus's paper on fractal drums and inverse spectral problems ties Berry's extension of Weyl's conjecture to fractals with Kac's question "Can one hear the shape of a drum?": [Fractal Drum, Inverse Spectral Problems for Elliptic ...](https://math.ucr.edu/~lapidus/papers/papers/Fractal%20Drum,%20Inverse%20Spectral%20Problems%20for%20Elliptic%20Operators%20etc.pdf) (clef weight: 0.3336) (weak backing, clef weight < 0.5). An Exeter page summarizes how Lapidus reformulated the Weyl-Berry conjecture: [the Weyl-Berry conjecture](https://empslocal.ex.ac.uk/people/staff/mrwatkin/zeta/weyl-berryconjecture.htm) (clef weight: 0.4139) (weak backing, clef weight < 0.5). The Dartmouth paper by Lapidus and Pomerance connects the one-dimensional Weyl-Berry conjecture to the Riemann zeta function: [PDF The Riemann Zeta-function and The One-dimensional Weyl-berry Conjecture ...](https://math.dartmouth.edu/~carlp/fractal.pdf) (clef weight: 0.6640). A ScienceDirect study investigates vibrational characteristics of drums with fractal perimeters and the validity of the Weyl-Berry-Lapidus conjecture: [Fractal drums and the Weyl-Berry-Lapidus conjecture](https://www.sciencedirect.com/science/article/pii/0921452695007431) (clef weight: 0.6179). A mirror copy of Lapidus 1991 is listed with very low weight and is not relied on: [PDF Fractal Drum, Inverse Spectral Problems for Elliptic Operators and A ...](https://sci-hub.red/storage/moscow/3819/3169c71428a6d415cd13fd3ad090af3d/lapidus1991.pdf) (clef weight: 0.0973) (weak backing, clef weight < 0.5).

The SPEC's series mode does not claim to test Weyl-Berry. It borrows the counting-function shape and pins the fit window (ranks r in [N/8, N/2]) to keep edge effects out.

## Deliverable 3: harness built from the falsification-corpus discipline

The harness carries the 8-row gold table (doc 04), a permutation null that must collapse, and a selftest that returns all-pass or failing. CI-guarding it means a code change that breaks a gold band fails the build. The SPEC's test requirements add a minimum of 20 Python selftest checks covering the gold table, the permutation null, determinism, and empty-input failures.

## Deliverable 4: composition, not just measurement

The oracle route runs edge-standard internally, runs a spectral walk on the traced mask, and returns both feature sets plus the Einstein verdict. Deployment is explicitly sequenced after the lanes finish and an advisor reconciles them.

## What is explicitly not a deliverable

The SPEC's out-of-scope list: powered-lens actuation (V3), router pair-bands (V4), intake surface (V5), a console card, and any `admitted` flip. The oracle is a consistency instrument, not a taste axis. These follow-ons are gated on the MVP measuring clean.

The powered lens (V3) has strong external grounding even though it is deferred. Ozaktas and Mendlovic define fractional Fourier transforms of order alpha so the ordinary Fourier transform is the alpha = 1 case: [PDF Fractional Fourier transforms and their optical implementation: I](https://kilyos.ee.bilkent.edu.tr/~haldun/publications/ozaktas044.pdf) (clef weight: 0.6766). Part II derives the linear transform kernel and discusses propagation in graded-index media: [Fractional Fourier transforms and their optical implementation. II](https://opg.optica.org/josaa/abstract.cfm?uri=josaa-10-12-2522) (clef weight: 0.6743). A Fractional Fourier optics paper poses the transform as a tool for analyzing optical systems made of thin lenses and free space: [Fractional Fourier optics - Optica Publishing Group](https://opg.optica.org/josaa/abstract.cfm?uri=josaa-12-4-743) (clef weight: 0.6384). An arXiv paper reports the transform arising naturally in strongly nonlocal nonlinear media: [(0803.1523v5) Self-Induced Fractional Fourier Transform and Revi…](https://arxiv.org/abs/0803.1523v5) (clef weight: 0.5178). A handwiki article on the fractional wavelet transform is low weight and peripheral: [Fractional wavelet transform](https://handwiki.org/wiki/Fractional_wavelet_transform) (clef weight: 0.0586) (weak backing, clef weight < 0.5). The SPEC defers this work because actuation builds on a measuring oracle; it does not dispute the optics.

## Dependency order

1. `spectral_standard.py` (reference).
2. Harness bands logged before any measurement.
3. `jev-spectral-math.js` with fixture parity.
4. Route wiring and deploy.
5. Live-route verification.

## Takeaway

Four artifacts, one direction of authority: Python defines, the harness constrains, JS reproduces, and the route composes. Everything that would act on a measurement (lens, router bands, intake, admission) is held back until the oracle measures clean.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | Fractal Drum, Inverse Spectral Problems for Elliptic ... | https://math.ucr.edu/~lapidus/papers/papers/Fractal%20Drum,%20Inverse%20Spectral%20Problems%20for%20Elliptic%20Operators%20etc.pdf | 0.3336 | weak backing, clef weight < 0.5 |
| 2 | the Weyl-Berry conjecture | https://empslocal.ex.ac.uk/people/staff/mrwatkin/zeta/weyl-berryconjecture.htm | 0.4139 | weak backing, clef weight < 0.5 |
| 3 | PDF The Riemann Zeta-function and The One-dimensional Weyl-berry Conjecture ... | https://math.dartmouth.edu/~carlp/fractal.pdf | 0.6640 | authoritative (>= 0.5) |
| 4 | PDF Fractal Drum, Inverse Spectral Problems for Elliptic Operators and A ... | https://sci-hub.red/storage/moscow/3819/3169c71428a6d415cd13fd3ad090af3d/lapidus1991.pdf | 0.0973 | weak backing, clef weight < 0.5 |
| 5 | Fractal drums and the Weyl-Berry-Lapidus conjecture | https://www.sciencedirect.com/science/article/pii/0921452695007431 | 0.6179 | authoritative (>= 0.5) |
| 6 | Fractional Fourier transforms and their optical implementation. II | https://opg.optica.org/josaa/abstract.cfm?uri=josaa-10-12-2522 | 0.6743 | authoritative (>= 0.5) |
| 7 | PDF Fractional Fourier transforms and their optical implementation: I | https://kilyos.ee.bilkent.edu.tr/~haldun/publications/ozaktas044.pdf | 0.6766 | authoritative (>= 0.5) |
| 8 | Fractional Fourier optics - Optica Publishing Group | https://opg.optica.org/josaa/abstract.cfm?uri=josaa-12-4-743 | 0.6384 | authoritative (>= 0.5) |
| 9 | Fractional wavelet transform | https://handwiki.org/wiki/Fractional_wavelet_transform | 0.0586 | weak backing, clef weight < 0.5 |
| 10 | [0803.1523v5] Self-Induced Fractional Fourier Transform and Revi… | https://arxiv.org/abs/0803.1523v5 | 0.5178 | authoritative (>= 0.5) |
