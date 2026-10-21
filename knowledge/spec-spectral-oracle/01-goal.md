# 01. Goal: The Two-Axis Hierarchy Oracle and Inherited Calibration

**Scope:** Goal: detailed analysis grounded in yubi-OS/yubiOS refs/SPEC-spectral-oracle-2026-10-06.md.

Ground source: `yubi-OS/yubiOS refs/SPEC-spectral-oracle-2026-10-06.md`. Dig context: `dig_context_01.json` (10 clef-weighted searXNG results).

## The goal in one sentence

The SPEC (dated 2026-10-06, status: build spec for the parallel-build-lanes round) states the goal as: extend the validated hierarchy detector with its spectral sibling, compose the **two-axis hierarchy oracle** (geometric D plus spectral d_s, gated by the Einstein relation), and make the calibration **inherited**.

Three moves are packed into that sentence. Each is unpacked below.

## Move 1: a spectral sibling for a validated detector

The "validated hierarchy detector" is edge-standard-v1, which measures a box-counting D on standardized 1-px contour maps. The SPEC adds a second, independent instrument that reads hierarchy from dynamics or spectra rather than from geometry: `spectral-standard-v1`. It measures the walk dimension d_w and the spectral dimension d_s.

The three exponents are distinct, well-studied quantities on fractals. A Bielefeld paper by Grigor'yan and coauthors determines the walk dimension of the Sierpinski gasket without using diffusion, via non-local Dirichlet forms: [PDF Determination of the Walk Dimension of the Sierpinski Gasket Without ...](https://www.math.uni-bielefeld.de/~grigor/sg.pdf) (clef weight: 0.6081). An arXiv paper discusses quantitative estimates of the local spectral dimension of the two-dimensional Sierpinski gasket with respect to the Kusuoka measure: [Estimates of the local spectral dimension of the Sierpinski gasket](https://arxiv.org/html/2211.02827v2) (clef weight: 0.3479) (weak backing, clef weight < 0.5). A ResearchGate survey uses the gasket as the model case to introduce Hausdorff, spectral, and walk dimension: [(PDF) Einstein Relation on Fractal Objects - ResearchGate](https://www.researchgate.net/publication/266542245_Einstein_Relation_on_Fractal_Objects) (clef weight: 0.2977) (weak backing, clef weight < 0.5).

## Move 2: the Einstein relation as a gate

The oracle does not just report two numbers; it cross-checks them. The SPEC's Einstein gate returns verdict `consistent` iff |d_s - 2*D/d_w| <= 0.10 with all three inputs measured at r2 >= 0.98. The underlying identity, d_s = 2*d_f/d_w, ties the geometric dimension (which D estimates) to the walk and spectral dimensions.

The external literature frames this identity in general metric measure spaces. A ResearchGate figure page reproduces an abstract that reviews the Einstein relation connecting Hausdorff, local walk, and spectral dimensions in that abstract setting: [a: Cantor set b: Sierpinski carpet / Download Scientific Diagram](https://www.researchgate.net/figure/a-Cantor-set-b-Sierpinski-carpet_fig3_266542245) (clef weight: 0.0833) (weak backing, clef weight < 0.5). The related survey above ([(PDF) Einstein Relation on Fractal Objects - ResearchGate](https://www.researchgate.net/publication/266542245_Einstein_Relation_on_Fractal_Objects) (clef weight: 0.2977) (weak backing, clef weight < 0.5)) introduces the same three notions on the gasket.

The value of the gate is that two independent measurements, one geometric and one dynamical, must agree through a physics identity. A pipeline artifact that inflates D (as trial-1 did in the edge-map work) would not automatically inflate d_w and d_s in the compensating way, so the gate catches inconsistency rather than trusting either axis alone.

## Move 3: inherited calibration

The SPEC makes the calibration inherited: the gold family is the Sierpinski gasket, with exact closed forms for all three exponents:

| Exponent | Closed form | Value |
|---|---|---|
| d_f | ln3/ln2 | about 1.585 |
| d_w | ln5/ln2 | about 2.32193 |
| d_s | 2*ln3/ln5 | about 1.36507 |

Check: 2 * 1.585 / 2.32193 is about 1.365, matching d_s, so the gold family satisfies the Einstein relation exactly.

"Inherited" means the instrument is calibrated against known-answer structure rather than against random-feature sampling. The gasket's Laplacian spectrum is solved exactly in the literature. Fukushima and Shima's Potential Analysis paper presents a complete description of the eigenvalues of the Laplacian on the finite Sierpinski gasket and demonstrates highly oscillatory behaviour: [On a spectral analysis for the Sierpinski gasket / Potential Analysis](https://link.springer.com/article/10.1007/BF00249784) (clef weight: 0.7692), with the Springer PDF of the same paper at [PDF On a Spectral Analysis for the Sierpinski Gasket - Springer](https://link.springer.com/content/pdf/10.1007/BF00249784.pdf) (clef weight: 0.7382). Hua Qiu's arXiv paper gives a complete description of the eigenvalues of the Laplacian on a domain in the gasket whose boundary is a line segment: [Exact spectrum of the Laplacian on a domain in the Sierpinski gasket](https://arxiv.org/pdf/1206.1381v1) (clef weight: 0.8075). These three are the highest-weighted results in the dig and back the claim that exact gold values exist.

The Encyclopedia of Mathematics entry describes the gasket and its companion carpet as standard objects: [Sierpiński gasket](https://encyclopediaofmath.org/wiki/Sierpiński_gasket) (clef weight: 0.3733) (weak backing, clef weight < 0.5). A scite citation report on Fukushima-Shima carries low weight and is context only: [On a spectral analysis for the Sierpinski gasket - scite](https://scite.ai/reports/on-a-spectral-analysis-for-eYAYQp) (clef weight: 0.0521) (weak backing, clef weight < 0.5).

## Why this goal, not a better random distribution

The upstream ideation one-pager (cited by the SPEC as a source, clef MVP choice V1_plus_V6 at p 0.686) quotes the operator's frame: the usual approach is a better and better random distribution, but the ordering here is inherited. The goal operationalizes that: certify any new feature extractor by whether it passes the Einstein consistency check on a family whose exponents are known exactly.

## Off-topic result

One result was a genealogy forum post [Re: "Jacques" Presnall informa - Genealogy.com](https://www.genealogy.com/forum/surnames/topics/presnall/51/) (clef weight: 0.0313) (weak backing, clef weight < 0.5); it backs nothing.

## Takeaway

The goal is a consistency instrument. It reads D from geometry, d_w and d_s from walks or spectra, and accepts a hierarchy reading only when the three agree through d_s = 2D/d_w within 0.10, all at r2 >= 0.98, calibrated on a family whose answers are exact.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | Estimates of the local spectral dimension of the Sierpinski gasket | https://arxiv.org/html/2211.02827v2 | 0.3479 | weak backing, clef weight < 0.5 |
| 2 | PDF Determination of the Walk Dimension of the Sierpinski Gasket Without ... | https://www.math.uni-bielefeld.de/~grigor/sg.pdf | 0.6081 | authoritative (>= 0.5) |
| 3 | (PDF) Einstein Relation on Fractal Objects - ResearchGate | https://www.researchgate.net/publication/266542245_Einstein_Relation_on_Fractal_Objects | 0.2977 | weak backing, clef weight < 0.5 |
| 4 | Re: "Jacques" Presnall informa - Genealogy.com | https://www.genealogy.com/forum/surnames/topics/presnall/51/ | 0.0313 | weak backing, clef weight < 0.5 |
| 5 | a: Cantor set b: Sierpinski carpet / Download Scientific Diagram | https://www.researchgate.net/figure/a-Cantor-set-b-Sierpinski-carpet_fig3_266542245 | 0.0833 | weak backing, clef weight < 0.5 |
| 6 | On a spectral analysis for the Sierpinski gasket / Potential Analysis | https://link.springer.com/article/10.1007/BF00249784 | 0.7692 | authoritative (>= 0.5) |
| 7 | PDF On a Spectral Analysis for the Sierpinski Gasket - Springer | https://link.springer.com/content/pdf/10.1007/BF00249784.pdf | 0.7382 | authoritative (>= 0.5) |
| 8 | Exact spectrum of the Laplacian on a domain in the Sierpinski gasket | https://arxiv.org/pdf/1206.1381v1 | 0.8075 | authoritative (>= 0.5) |
| 9 | On a spectral analysis for the Sierpinski gasket - scite | https://scite.ai/reports/on-a-spectral-analysis-for-eYAYQp | 0.0521 | weak backing, clef weight < 0.5 |
| 10 | Sierpiński gasket | https://encyclopediaofmath.org/wiki/Sierpiński_gasket | 0.3733 | weak backing, clef weight < 0.5 |
