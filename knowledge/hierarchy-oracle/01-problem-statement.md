# 01. Problem Statement: From Image Detector to Feature-Space Hierarchy Oracle

**Scope:** Problem statement: detailed analysis grounded in yubi-OS/yubiOS refs/hierarchy-oracle-2026-10-06.md.

Ground source: `yubi-OS/yubiOS refs/hierarchy-oracle-2026-10-06.md`. Dig context: `dig_context_01.json` (10 clef-weighted searXNG results).

## The question

The one-pager (dated 2026-10-06, method: 3 parallel research lanes plus ideate-solo over 6 variations, every decision weighted by /api/decide with clef under policy v6) asks: what else can the validated hierarchy and fill detector, edge-standard-v1, become on the road to a **feature-space hierarchy oracle**?

The ground source defines the target: an instrument that reads **inherited hierarchical ordering in ANY feature space**, not just images.

## The operator's frame

The doc quotes the operator directly: "the usual approach is a better and better random distribution but the ordering here is inherited." This sentence carries the design philosophy. Most calibration strategies try to approximate a target by sampling more and better random features. The oracle instead calibrates against structure whose ordering is known exactly, because it was built by a deterministic recursion. Hierarchy is not estimated from a cloud of samples; it is checked against an object whose hierarchy is given.

## Why images are the starting point, not the limit

edge-standard-v1 measures a box-counting D on standardized contour maps. That is a geometric read, and it only applies where there is geometry: an image, a mask, a rendering. To reach "any feature space", the instrument needs a read that applies to anything that can be expressed as a graph or an ordered series. That is the role the spectral and diffusion exponents play.

## Diffusion as the feature-space-agnostic signal

The physics that makes this possible is anomalous diffusion. The Wikipedia overview defines anomalous diffusion as a diffusion process with a non-linear relationship between mean squared displacement and time: [Anomalous diffusion - Wikipedia](https://en.wikipedia.org/wiki/Anomalous_diffusion) (clef weight: 0.5679). A PMC paper presents a fractal model of anomalous diffusion and notes that MSD increases with time but not linearly, unlike ordinary diffusion: [Fractal model of anomalous diffusion - PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC4628625/) (clef weight: 0.5458). Those two results carry authoritative weight and back the core physical premise.

The premise generalizes beyond lattices. An arXiv paper shows anomalous diffusion can arise on random graphs when steps of a walk are not statistically independent: [Anomalous Diffusion on Random Graphs - arXiv.org](https://arxiv.org/html/cond-mat/0212506v1) (clef weight: 0.3590) (weak backing, clef weight < 0.5). A handwiki mirror repeats the standard definition: [Anomalous diffusion](https://handwiki.org/wiki/Physics:Anomalous_diffusion) (clef weight: 0.0738) (weak backing, clef weight < 0.5). Because a random walk needs only a graph, any feature space that can be turned into a graph (an ink mask, an embedding neighborhood graph, a corpus link graph) admits the same measurement.

## Spectra as the second route

The other feature-space-agnostic route is the Laplacian spectrum. The ground source leans on the Sierpinski gasket because its spectrum is known exactly. External results in this dig are context for that claim, all at weak weight: Hua Qiu's paper on the exact spectrum of the Laplacian on a gasket domain [PDF Exact spectrum of the Laplacian on a domain in the Sierpinski gasket](https://arxiv.org/pdf/1206.1381.pdf) (clef weight: 0.1945) (weak backing, clef weight < 0.5); an AMS paper on exact spectral asymptotics on the gasket, which works with graph-Laplacian eigenvalues of restrictions of eigenfunctions [PDF Exact spectral asymptotics on the Sierpinski gasket](https://www.ams.org/journals/proc/2012-140-05/S0002-9939-2011-11309-1/S0002-9939-2011-11309-1.pdf) (clef weight: 0.2849) (weak backing, clef weight < 0.5); a Rochester honors paper on eigenvalue multiplicities of the gasket adjacency matrix [PDF On Spectral Properties of Sierpinski Gasket](https://www.sas.rochester.edu/mth//undergraduate/honorspaperspdfs/sangwu_lee_2024.pdf) (clef weight: 0.1985) (weak backing, clef weight < 0.5); and an arXiv paper on a weighted Laplacian equation on the gasket [Multiplicity Results for the Nonlinear Weighted Laplacian Equation on...](https://arxiv.org/html/2606.12678) (clef weight: 0.2147) (weak backing, clef weight < 0.5).

## Restating the problem precisely

Putting the ground source and the external physics together, the problem is:

1. Take any artifact that can be represented as a graph or an ordered 1D series.
2. Read its hierarchical ordering with an instrument that does not depend on the artifact being an image.
3. Calibrate that instrument on an object whose ordering is inherited and exactly known, rather than on random samples.
4. Keep the existing geometric reading (D) as a second, independent axis where geometry exists.

## Seeds the operator supplied

The companion solo log names the seeds behind the question: diagonal-diffusion efficiency and the 6-fold, phonon plus photon connections, and true lensing with the powered lens and aberration correction. The one-pager's grounding section (doc 02) answers each seed with a measurement or a literature result.

## Off-topic results

Two results backed nothing: a campground website [DEVILS RIVER CAMPGROUND](https://campdevilsriver.com/) (clef weight: 0.0310) (weak backing, clef weight < 0.5) and a biography page [Michael Klare - Wikipedia](https://en.wikipedia.org/wiki/Michael_Klare) (clef weight: 0.0863) (weak backing, clef weight < 0.5).

## Takeaway

The problem is not "build a better image classifier". It is "build a hierarchy reader that works on any graph-shaped or series-shaped feature space, calibrated by inheritance from exact structure". Anomalous diffusion and exact gasket spectra are the two physical handles that make that possible.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | Anomalous diffusion - Wikipedia | https://en.wikipedia.org/wiki/Anomalous_diffusion | 0.5679 | authoritative (>= 0.5) |
| 2 | Fractal model of anomalous diffusion - PMC | https://pmc.ncbi.nlm.nih.gov/articles/PMC4628625/ | 0.5458 | authoritative (>= 0.5) |
| 3 | Anomalous Diffusion on Random Graphs - arXiv.org | https://arxiv.org/html/cond-mat/0212506v1 | 0.3590 | weak backing, clef weight < 0.5 |
| 4 | Anomalous diffusion | https://handwiki.org/wiki/Physics:Anomalous_diffusion | 0.0738 | weak backing, clef weight < 0.5 |
| 5 | DEVILS RIVER CAMPGROUND | https://campdevilsriver.com/ | 0.0310 | weak backing, clef weight < 0.5 |
| 6 | PDF Exact spectrum of the Laplacian on a domain in the Sierpinski gasket | https://arxiv.org/pdf/1206.1381.pdf | 0.1945 | weak backing, clef weight < 0.5 |
| 7 | PDF Exact spectral asymptotics on the Sierpinski gasket | https://www.ams.org/journals/proc/2012-140-05/S0002-9939-2011-11309-1/S0002-9939-2011-11309-1.pdf | 0.2849 | weak backing, clef weight < 0.5 |
| 8 | Michael Klare - Wikipedia | https://en.wikipedia.org/wiki/Michael_Klare | 0.0863 | weak backing, clef weight < 0.5 |
| 9 | PDF On Spectral Properties of Sierpinski Gasket | https://www.sas.rochester.edu/mth//undergraduate/honorspaperspdfs/sangwu_lee_2024.pdf | 0.1985 | weak backing, clef weight < 0.5 |
| 10 | Multiplicity Results for the Nonlinear Weighted Laplacian Equation on... | https://arxiv.org/html/2606.12678 | 0.2147 | weak backing, clef weight < 0.5 |
