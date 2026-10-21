# 01. Problem Statement

**Scope:** Problem Statement: detailed analysis grounded in yubi-OS/yubiOS refs/supersolid-program-next-steps-solo-2026-10-06.md.

## The question

The ground source (yubi-OS/yubiOS refs/supersolid-program-next-steps-solo-2026-10-06.md, 2026-10-06, ideate-solo with no dialogue, scope class medium, 6 variations) asks: how might we consolidate what the supersolid/Sierpinski program built in the last 24 hours (the falsification corpus, the real-data pass, and the instrument findings) so that the next session inherits a **hardened, documented instrument** instead of session-scoped artifacts?

This is a durability problem, not a science problem. The science was done in one day; the risk is that it evaporates.

## Why session-scoped artifacts are a real risk

The program's outputs were produced in a session workspace. The source invokes the "external-copies rule": anything that exists only in session storage is at risk and counts as data-loss debt. The "Do nothing, measure next session" variation in the generation log scored a total of 12 and was explicitly rejected because it "fails the external-copies rule."

The concern is sharper for a falsification program than for ordinary work. The value of a falsification corpus is that someone else can re-run it and get the same numbers. A generator that lives only in a session directory cannot be re-run by anyone.

## The reproducibility frame

The wider literature on reproducibility describes the same pressure at a field level. The Stanford Encyclopedia of Philosophy entry on reproducibility of scientific results notes that the terms "reproducibility crisis" and "replication crisis" gained currency over the last decade [Reproducibility of Scientific Results](https://plato.stanford.edu/entries/scientific-reproducibility) (weak backing, clef weight < 0.5; clef weight: 0.2137). A QNFO essay on falsifiability in physics argues that the fix is methodological, including pre-registration and independent consilience across measurement traditions with distinct error budgets [The Falsifiability Crisis in Contemporary Physics...: QNFO Papers](https://papers.qnfo.org/papers/falsifiability-crisis) (weak backing, clef weight < 0.5; clef weight: 0.2616). A medRxiv preprint reports a pre-registered, four-phase falsification study across independent clinical datasets [Falsification Testing of Sepsis Prediction Models: Evaluating ...](https://www.medrxiv.org/content/10.64898/2026.03.17.26348414v2) (weak backing, clef weight < 0.5; clef weight: 0.1680), and a Springer chapter proposes usage- and risk-aware falsification testing for cyber-physical systems [Usage-and Risk-Aware Falsification Testing for Cyber-Physical ...](https://link.springer.com/chapter/10.1007/978-3-031-42626-1_9) (weak backing, clef weight < 0.5; clef weight: 0.3171). These are context only, all weighted below 0.5, but they share the source's premise: a result whose procedure is not preserved cannot be falsified later.

## The spatial-statistics frame

The program's falsification corpus includes droplet placement by random sequential adsorption and shuffle generators, so this subtopic's dig reached into point-process literature. Random sequential adsorption places particles one at a time and rejects overlaps until jamming [Random sequential adsorption - Wikipedia](https://en.wikipedia.org/wiki/Random_sequential_adsorption) (weak backing, clef weight < 0.5; clef weight: 0.2063) [Random Sequential Adsorption: Jamming & Rényi Parking](https://www.iris.joshua-becker.com/lab/random-sequential-adsorption-rsa/) (weak backing, clef weight < 0.5; clef weight: 0.2154); a ScienceDirect review compiles saturated packing fractions for 2D and 3D objects [Random sequential adsorption: An efficient tool for investigating the ...](https://www.sciencedirect.com/science/article/pii/S000186862200094X) (weak backing, clef weight < 0.5; clef weight: 0.2926); and a 2026 arXiv preprint studies how fractal-like objects affect RSA jamming states [Jamming states in random sequential adsorption of diffusion-limited ...](https://arxiv.org/html/2608.23905v1) (weak backing, clef weight < 0.5; clef weight: 0.2187). Pair-correlation methods for classifying spatial point patterns appear in Springer work on local pair correlation [Classification of Events Using Local Pair Correlation ... - Springer](https://link.springer.com/article/10.1007/s13253-021-00455-1) (weak backing, clef weight < 0.5; clef weight: 0.1079) [PDF Classification of Events Using Local Pair Correlation ... - Springer](https://link.springer.com/content/pdf/10.1007/s13253-021-00455-1.pdf) (weak backing, clef weight < 0.5; clef weight: 0.1347) and in a lecture on spatial correlations [PDF Point Processes 2: Spatial Correlations - noonanm.github.io](https://noonanm.github.io/DATA589/Lectures/03_Point_Processes_2_Correlations.pdf) (weak backing, clef weight < 0.5; clef weight: 0.1025). A discussion paper on modern spatial point-process statistics [(PDF) Discussion of ‘Modern Statistics for Spatial Point Processes’](https://www.academia.edu/176459743/Discussion_of_Modern_Statistics_for_Spatial_Point_Processes_) (weak backing, clef weight < 0.5; clef weight: 0.0755) rounds out the set. RANDOM.ORG [RANDOM.ORG - True Random Number Service](https://www.random.org/) (weak backing, clef weight < 0.5; clef weight: 0.0717) and a dictionary entry [SPATIAL Definition & Meaning - Merriam-Webster](https://www.merriam-webster.com/dictionary/spatial) (weak backing, clef weight < 0.5; clef weight: 0.0259) are off-topic.

The relevance: these are the tools the program's generators lean on. Preserving the generators preserves the program's control conditions.

## What "hardened" means here

The source defines hardening by three outcomes:

1. **Documented methodology.** A reusable skill capturing how the corpus was designed.
2. **Repo-resident harness.** The generators, amendments, and results in the repo, with a selftest.
3. **CI guarding.** The harness wired into lean-check so regressions surface automatically.

## The tension the problem must resolve

The source names it directly in the generation log. The "v3 matched-extent control now" variation (Inversion lens) scored 15, high, because it is the next scientifically decisive measurement. But it "leaves the artifacts at risk one more session." The problem therefore has an ordering question at its core: document first, or measure first?

## The problem, restated

Within one session, move every load-bearing artifact of the supersolid program out of session storage into durable, CI-verified locations, and record the methodology so it can be reused on other instruments, without running new measurements.

## Evidence quality note

All 20 dig results for this corpus scored below 0.5 (highest 0.3171). None is cited as authority for a yubiOS claim.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | Random sequential adsorption - Wikipedia | https://en.wikipedia.org/wiki/Random_sequential_adsorption | 0.2063 | weak (< 0.5) |
| 2 | RANDOM.ORG - True Random Number Service | https://www.random.org/ | 0.0717 | weak (< 0.5) |
| 3 | Random sequential adsorption: An efficient tool for investigating the ... | https://www.sciencedirect.com/science/article/pii/S000186862200094X | 0.2926 | weak (< 0.5) |
| 4 | Random Sequential Adsorption: Jamming & Rényi Parking | https://www.iris.joshua-becker.com/lab/random-sequential-adsorption-rsa/ | 0.2154 | weak (< 0.5) |
| 5 | Jamming states in random sequential adsorption of diffusion-limited ... | https://arxiv.org/html/2608.23905v1 | 0.2187 | weak (< 0.5) |
| 6 | PDF Point Processes 2: Spatial Correlations - noonanm.github.io | https://noonanm.github.io/DATA589/Lectures/03_Point_Processes_2_Correlations.pdf | 0.1025 | weak (< 0.5) |
| 7 | Classification of Events Using Local Pair Correlation ... - Springer | https://link.springer.com/article/10.1007/s13253-021-00455-1 | 0.1079 | weak (< 0.5) |
| 8 | PDF Classification of Events Using Local Pair Correlation ... - Springer | https://link.springer.com/content/pdf/10.1007/s13253-021-00455-1.pdf | 0.1347 | weak (< 0.5) |
| 9 | SPATIAL Definition & Meaning - Merriam-Webster | https://www.merriam-webster.com/dictionary/spatial | 0.0259 | weak (< 0.5) |
| 10 | (PDF) Discussion of ‘Modern Statistics for Spatial Point Processes’ | https://www.academia.edu/176459743/Discussion_of_Modern_Statistics_for_Spatial_Point_Processes_ | 0.0755 | weak (< 0.5) |
