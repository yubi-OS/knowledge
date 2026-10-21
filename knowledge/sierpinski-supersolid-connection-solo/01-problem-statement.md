# 01. Problem Statement

**Scope:** Problem Statement: detailed analysis grounded in yubi-OS/yubiOS refs/sierpinski-supersolid-connection-solo-2026-10-06.md.

## The question

The ground source (yubi-OS/yubiOS refs/sierpinski-supersolid-connection-solo-2026-10-06.md, 2026-10-06, ideate-solo with no dialogue, scope class medium, 5 variations generated) asks: how might we connect the edge-standard-v1 box-counting fractal-dimension instrument, calibrated against the Sierpinski triangle's theoretical D = log3/log2 (about 1.585), to recent research on supersolids, in a way that produces a **measured, falsifiable result rather than an analogy**?

The last clause carries the weight. "Sierpinski" and "supersolid" share a visual vocabulary (repeated droplets, triangular arrangements, structure across scales), and it would be easy to write a suggestive essay. The problem statement forbids that outcome in advance: the deliverable must be a number with a gate.

## The two halves being connected

**The Sierpinski half is a known answer.** The Sierpinski gasket is a self-similar set whose dimension is exactly log 3 / log 2. The mathematical literature treats this set as thoroughly understood: work on its centred Hausdorff measure, with s = log3/log2, shows the measure is computable [On the Centred Hausdorff Measure of the Sierpinski Gasket](https://arxiv.org/abs/2301.08298) (clef weight: 0.7950); studies of "fat" Sierpinski gaskets work out how overlapping copies change the dimension [PDF Dimension of Fat Sierpinski Gaskets - University of Bristol](https://people.maths.bris.ac.uk/~matmj/overlapgasket.pdf) (clef weight: 0.8451); and generalizations to infinite-dimensional ambient spaces exist [On the Dimension of the Sierpinski Gasket in - Springer](https://link.springer.com/chapter/10.1007/978-3-030-61803-2_5) (clef weight: 0.6405). The Sierpinski triangle Wikipedia entry gives the elementary construction [Sierpiński triangle - Wikipedia](https://en.wikipedia.org/wiki/Sierpi%C5%84ski_triangle) (weak backing, clef weight < 0.5; clef weight: 0.1368). That stability is exactly why edge-standard-v1 uses the gasket as its known-answer anchor: if the instrument cannot read 1.585 on a gasket, it is broken.

**The supersolid half is an active frontier.** Supersolids combine superfluid order with crystalline density modulation. A Springer mini-review summarizes the concepts behind dilute self-bound quantum droplets, both binary and dipolar [Droplets and supersolids in ultra-cold atomic quantum gases](https://link.springer.com/article/10.1140/epjs/s11734-023-00991-6) (clef weight: 0.7461). A 2024 arXiv review of supersolidity in ultra-cold dipolar gases discusses, for elongated linear supersolids, the expected gapless modes [Supersolidity in ultra-cold dipolar gases - arXiv.org](https://arxiv.org/pdf/2405.09537) (clef weight: 0.7993). A theory paper posted to arXiv in October 2026 characterizes supersolid phase transitions in trapped dipolar gases, motivated by a recent experiment [Characterizing supersolid phase transitions in trapped quantum gases ...](https://arxiv.org/html/2610.28621v1) (clef weight: 0.7781). Even the idea of a "supersolid droplet crystal" has a pre-dipolar history: a 2010 PRL predicted one for Rydberg atoms in the dipole-blockade regime [Supersolid Droplet Crystal in a Dipole-Blockaded Gas](https://link.aps.org/doi/10.1103/PhysRevLett.105.135301) (clef weight: 0.8048).

The off-topic hits (a Google Docs login page [Google Tài liệu: Đăng nhập](https://docs.google.com/document/u/0/?hl=vi) (weak backing, clef weight < 0.5; clef weight: 0.0246) and an Amazon RV vent fan listing [Amazon.com: Rv Replacement Vent Fan](https://www.amazon.com/rv-replacement-vent-fan/s?k=rv+replacement+vent+fan) (weak backing, clef weight < 0.5; clef weight: 0.0264)) weight near zero and contribute nothing.

## Why "analogy" is the failure mode

An analogy would say: dipolar droplets form triangular arrays, the Sierpinski triangle is triangular, therefore D might mean something for supersolids. The problem statement rejects this because it produces no test. The stress-test in the source names the strongest version of the worry directly: box-counting D on a finite droplet array is scale-limited. A finite N-droplet lattice reads D toward 0 above the array scale and D toward 2 inside droplets, so a single D number might carry no phase information without the crossover scale, and the community's structure factor S(k) already answers the ordering question. D could simply be a worse version of S(k).

A well-posed problem has to survive that critique. It does so by turning the connection into a measurement whose negative outcome is also informative: if D does not separate phase classes, that is "a publishable instrument-negative in the fractalrabbit ledger."

## Constraints the problem inherits

- **The instrument is pinned.** The box-counting window is 4 to 64 px over 8 scales, with ink normalized to about 6% coverage and an r-squared gate. Retuning is a major version bump and is out of scope.
- **Validation discipline already exists.** The `knowledge/fractalrabbit-falsification-harness/` corpus supplies controlled synthetic generators and falsification gates.
- **The corpus already contains a caution.** `knowledge/landau-radius-research/` records that transport evidence "does not directly establish simultaneous coherent superflow and density ordering."

## The problem, restated precisely

Can a pinned, Sierpinski-calibrated box-counting pipeline, applied first to synthetic droplet morphologies of known class and then to phase-labeled published supersolid imagery, separate the morphology classes, with the Sierpinski generator hitting its theoretical band? Every word of that restatement maps to a testable step.

## Evidence quality note

7 of 10 dig results clear 0.5, all journal, preprint, or academic sources. Every yubiOS-specific claim above comes from the ground source.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | Droplets and supersolids in ultra-cold atomic quantum gases | https://link.springer.com/article/10.1140/epjs/s11734-023-00991-6 | 0.7461 | authoritative (>= 0.5) |
| 2 | Characterizing supersolid phase transitions in trapped quantum gases ... | https://arxiv.org/html/2610.28621v1 | 0.7781 | authoritative (>= 0.5) |
| 3 | Google Tài liệu: Đăng nhập | https://docs.google.com/document/u/0/?hl=vi | 0.0246 | weak (< 0.5) |
| 4 | Supersolidity in ultra-cold dipolar gases - arXiv.org | https://arxiv.org/pdf/2405.09537 | 0.7993 | authoritative (>= 0.5) |
| 5 | Supersolid Droplet Crystal in a Dipole-Blockaded Gas | https://link.aps.org/doi/10.1103/PhysRevLett.105.135301 | 0.8048 | authoritative (>= 0.5) |
| 6 | On the Dimension of the Sierpinski Gasket in - Springer | https://link.springer.com/chapter/10.1007/978-3-030-61803-2_5 | 0.6405 | authoritative (>= 0.5) |
| 7 | PDF Dimension of Fat Sierpinski Gaskets - University of Bristol | https://people.maths.bris.ac.uk/~matmj/overlapgasket.pdf | 0.8451 | authoritative (>= 0.5) |
| 8 | On the Centred Hausdorff Measure of the Sierpinski Gasket | https://arxiv.org/abs/2301.08298 | 0.7950 | authoritative (>= 0.5) |
| 9 | Sierpiński triangle - Wikipedia | https://en.wikipedia.org/wiki/Sierpi%C5%84ski_triangle | 0.1368 | weak (< 0.5) |
| 10 | Amazon.com: Rv Replacement Vent Fan | https://www.amazon.com/rv-replacement-vent-fan/s?k=rv+replacement+vent+fan | 0.0264 | weak (< 0.5) |
