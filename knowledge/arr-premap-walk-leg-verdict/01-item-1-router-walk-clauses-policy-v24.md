# 01-item-1-router-walk-clauses-policy-v24

**Scope.** Item 1: router walk clauses, policy v24: detailed analysis grounded in yubi-OS/yubiOS refs/arr-premap-walk-leg-verdict-2026-10-17.md.

> Ground source: yubi-OS/yubiOS refs/arr-premap-walk-leg-verdict-2026-10-17.md. External dig queries: finite-size scaling random walk on fractal graph pre-asymptotic; ablation study feature removal decision rule.

## What item 1 set out to do

The ground source (yubi-OS/yubiOS refs/arr-premap-walk-leg-verdict-2026-10-17.md) describes item 1 as router walk-clause calibration. The router had two rules that read the walk dimension d_w: a regime rule (D3) and a direction rule (D1), plus a hierarchy-spectral band gated in part on `spectral.d_w`. Item 1 tested whether those rules separate hierarchical gasket arrangements from non-hierarchical ones, under frozen rules registered before measurement.

## Validation before measurement

Before any new measurement, the router's mask path reproduced the five live values (d_w and D on the gold renders) to 4e-7. This step is what lets the subsequent failures be attributed to the rules rather than to the measurement path.

## The artifact set

26 artifacts were measured: gasket positives at canvas L 320, 352 and 384; uniform random, hexagonal and jittered-gasket negatives over 10 seeds; and tri and depth-5 references.

## The two frozen rules failed

- **D3 (regime) failed.** The depth-6 gasket positives have D from 1.559 to 1.601, so none fall in the hierarchy-spectral range [1, 1.45). The band was defined in a D range that the very positives it was meant to catch never enter.
- **D1 (direction) failed.** The smallest positive d_w is 2.044 (L 384). The largest negative is 4.645 (uniform random, seed 8). The margin is -2.60: the classes overlap rather than separate in the direction the rule assumed.

## What policy v23 actually did

Under policy v23, all ten uniform-random seeds selected hierarchy-spectral. Their median d_w was 2.93, against 2.04 to 2.36 for the gasket. The one hexagonal variant also selected it. The jittered gasket was blocked by the 300-droplet floor (267 to 284 traced components). In other words, the band designed to flag hierarchy was firing on random arrangements.

## Why finite size is the natural suspect

The ideate-solo record had already noted that the gasket's theoretical walk dimension is ln5 / ln2 = 2.3219 while measured values sit near 2.77, a finite-size effect. The finite-size literature for random walks on fractals is the obvious context. A paper in J. Phys. A simulates walks on finite construction stages of regular fractal lattices and shows the mean-square displacement obeys a finite-size scaling hypothesis, per [Finite-size scaling for random walks on fractals - IOPscience](https://iopscience.iop.org/article/10.1088/0305-4470/28/22/006/meta) (clef weight: 0.1831) (weak backing, clef weight < 0.5). A chapter on random walks on fractals models diffusion on Sierpinski carpets with walks on pre-carpets, per [(PDF) Random Walks on Fractals](https://www.researchgate.net/publication/227018005_Random_Walks_on_Fractals) (clef weight: 0.1685) (weak backing, clef weight < 0.5), and an arXiv paper studies self-avoiding walks on fractal complex networks, per [PDF Scaling Concepts in Graph Theory: Self-Avoiding Walk on Fractal Complex ...](https://arxiv.org/pdf/1402.0953v1.pdf) (clef weight: 0.0617) (weak backing, clef weight < 0.5). All three carry weak backing, and none studies Delaunay graphs of droplet centres. They support only the general point that walk exponents measured on finite fractal stages need not equal the asymptotic value, which is consistent with the record's finding that d_w readings at these sizes do not order the classes as theory would suggest.

## The decision as an ablation

The decision has the shape of an ablation study: remove a feature and check what the rule set does without it. Model-agnostic feature importance through ablation is described in [Model-agnostic feature importance through ablation - Samuel ...](https://www.samueltaylor.org/articles/feature-importance-for-any-model.html) (clef weight: 0.0827) (weak backing, clef weight < 0.5), a feature-removal ablation in a calibration setting appears in [Ablation Study on Features in Learning-Based Joint Calibration of Cable ...](https://ieeexplore.ieee.org/document/11062618) (clef weight: 0.0375) (weak backing, clef weight < 0.5), and a practitioner's guide to ablation is at [Dissecting Intelligence: The Practitioner's Guide to Ablation in ...](https://blog.stackademic.com/dissecting-intelligence-the-practitioners-guide-to-ablation-in-machine-learning-627c872545dc) (clef weight: 0.0479) (weak backing, clef weight < 0.5). All weak backing. The record's ablation is explicit about the alternative it rejected. Delete the hierarchy-spectral band. Remove the `spectral.d_w` clause from hierarchy-confirmed, which changes only its label, because its target is lane-draft in both versions. Keeping the band without its walk clause would have widened it to every arrangement with 300 or more droplets and D in [1, 1.45), so that variant was rejected. Removing a clause from a rule is not automatically conservative: here it would have broadened a band, so the band itself had to go.

## Promotion and effect

Policy v24 was promoted through the audited learnings flow: proposal l_2ae0e5c2bded4b8f, actor jenny, zero approvals expired. Live checks: health reports policy_version 24, the router selftest passes all 24 checks, and the band table no longer contains hierarchy-spectral.

Effect: eleven uniform-random negatives move from hierarchy-spectral (lane-draft) to ordered-image (lane-classify). No gasket positive moves. The six gold calibration artifacts keep their bands. Eleven matches the earlier count: ten uniform-random seeds plus the one hexagonal variant.

## Off-topic results

[Nature](https://www.nature.com/articles/s41586-026-10996-5/metrics) (clef weight: 0.0503) (weak backing, clef weight < 0.5) returned no content, [Size effect on structural strength - Wikipedia](https://en.wikipedia.org/wiki/Size_effect_on_structural_strength) (clef weight: 0.0877) (weak backing, clef weight < 0.5) concerns structural strength, and [Cardiac ablation - Mayo Clinic](https://www.mayoclinic.org/tests-procedures/cardiac-ablation/about/pac-20384993) (clef weight: 0.0230) (weak backing, clef weight < 0.5) and [Circumcision](https://en.wikipedia.org/wiki/Circumcision) (clef weight: 0.0200) (weak backing, clef weight < 0.5) are medical pages matched on "ablation" and "removal". None carries a claim.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | PDF Scaling Concepts in Graph Theory: Self-Avoiding Walk on Fractal Complex ... | https://arxiv.org/pdf/1402.0953v1.pdf | 0.0617 | weak (< 0.5) |
| 2 | Nature | https://www.nature.com/articles/s41586-026-10996-5/metrics | 0.0503 | weak (< 0.5) |
| 3 | (PDF) Random Walks on Fractals | https://www.researchgate.net/publication/227018005_Random_Walks_on_Fractals | 0.1685 | weak (< 0.5) |
| 4 | Finite-size scaling for random walks on fractals - IOPscience | https://iopscience.iop.org/article/10.1088/0305-4470/28/22/006/meta | 0.1831 | weak (< 0.5) |
| 5 | Size effect on structural strength - Wikipedia | https://en.wikipedia.org/wiki/Size_effect_on_structural_strength | 0.0877 | weak (< 0.5) |
| 6 | Model-agnostic feature importance through ablation - Samuel ... | https://www.samueltaylor.org/articles/feature-importance-for-any-model.html | 0.0827 | weak (< 0.5) |
| 7 | Ablation Study on Features in Learning-Based Joint Calibration of Cable ... | https://ieeexplore.ieee.org/document/11062618 | 0.0375 | weak (< 0.5) |
| 8 | Dissecting Intelligence: The Practitioner's Guide to Ablation in ... | https://blog.stackademic.com/dissecting-intelligence-the-practitioners-guide-to-ablation-in-machine-learning-627c872545dc | 0.0479 | weak (< 0.5) |
| 9 | Cardiac ablation - Mayo Clinic | https://www.mayoclinic.org/tests-procedures/cardiac-ablation/about/pac-20384993 | 0.0230 | weak (< 0.5) |
| 10 | Circumcision | https://en.wikipedia.org/wiki/Circumcision | 0.0200 | weak (< 0.5) |
