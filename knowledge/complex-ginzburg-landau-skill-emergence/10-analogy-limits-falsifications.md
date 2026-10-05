# 10 - Honest limits of the analogy and the falsification record

**Scope:** Honest limits of the analogy: vector-valued versus complex order parameter, zero-dimensional corpus versus mean-field dimensionality, crossover versus true transition, vortex glass versus Abrikosov lattice, and the recorded falsifications.

Source doc: `refs_corpus/complex-ginzburg-landau-skill-emergence.md` (yubi-OS/yubiOS refs/). Weights in parentheses are jev noul scores from the research DB. Statements marked "record" come from the source doc's internal record.

## The seven caveats, restated

The source doc carries seven standing caveats, all still operative (source doc §5):

1. PC variance is not free energy. PC1+PC2 is an observable state diagnostic, not a thermodynamic potential (see doc 07).
2. Corpus size is not literal temperature. The mapping is T_eff(N) decreasing as N increases, the opposite of literal temperature (see doc 06).
3. The 9-primitive coverage vector is vector-valued, not a scalar complex ψ. The mapping is structural, not component-wise.
4. Generic CGLE dynamics need not minimize a potential; the saturation at V_2 ≈ 0.77 is consistent with both potential and non-potential dynamics (see doc 04).
5. The zero-coverage rows are not a vortex lattice. They are disordered defects.
6. Mean-field GL is exact only in 4+ dimensions; the corpus is 0-dimensional, so fluctuation corrections are large and the analogy is qualitative.
7. The +0.4664 climb could be a smooth crossover rather than a sharp transition; the §4 diagnostics are needed to distinguish.

Point 7 also has an external warrant: apparent emergent-ability transitions in LLMs can be artifacts of the metric chosen for measurement, and the same underlying behavior can look smooth under a continuous metric (w=0.934, https://arxiv.org/pdf/2304.15004; w=0.920, https://arxiv.org/html/2503.05788v2).

## Vortex glass, not Abrikosov lattice

The cycle-22 record shows 18 zero-coverage rows scattered across memory files, not arranged periodically. The record calls them disordered defects, more like a vortex glass than an Abrikosov lattice (record, source doc §3.7). The physics distinction is real and well studied: disorder in type-II superconductors stabilizes a vortex-glass state characterized by strong pinning and the absence of positional order, in contrast to the ordered Abrikosov lattice (w=0.615, https://arxiv.org/abs/2605.23838). Experiments and simulations observe order-disorder transitions between glassy phases in vortex systems, including a first-order glass-to-glass transition from a quasi-crystalline Bragg glass to a short-range-positionally-disordered state (w=0.967, https://www.nature.com/articles/s42005-019-0243-4). Pinning is most effective right at the vortex-glass transition temperature, and a single columnar defect can dominate large samples (w=0.897, https://link.aps.org/doi/10.1103/PhysRevB.71.014511; w=0.716, https://arxiv.org/html/cond-mat/0409520v2).

The stricter point stands above all of this: to claim a vortex-like object at all, one must demonstrate a well-defined phase coordinate, near-zero amplitude at the core, nonzero winding, persistence under perturbation, and localization (source doc §3.6). The corpus has demonstrated none of these. The errata confirm the retired Hodge/vortex interpretation and the dimensionally invalid quantized-flow claim remain retired (source doc errata E3).

## What remains falsified

Erratum E3 fixes the boundary: the mathematical corrections in E1 (the equal-coefficient Lyapunov exception) and E2 (the 2/9 bound) do not reopen any empirical claim. Specifically:

- Predictions P2, P4, and P5 remain falsified under their own recorded protocols in the corpus's falsification record.
- The retired Hodge/vortex interpretation remains retired.
- The dimensionally invalid quantized-flow claim remains retired.
- Correcting the b = c mathematics removes an incorrect reason offered for part of the phase-transition model; it does not restore the model (source doc errata E3).

Nothing in the errata transports evidence of Ginzburg-Landau dynamics to the corpus. The corpus has no autonomous field evolution and no independently measured amplitude or phase, so the analogy remains structural (source doc errata E3).

## The discipline of analogy

Using physics language for non-physical systems is legitimate when it is disciplined: the mapping should be at the level of structure (order parameter, control variable, fluctuations, defects), each analogue should be operationally measurable, and predictions should be falsifiable under recorded protocols (source doc §1, §4). Methodology surveys in physics note both the power and the pitfalls of importing frameworks across domains, and the need for systematic frameworks when combining methods from different fields (w=0.825, https://www.frontiersin.org/journals/physics/articles/10.3389/fphy.2024.1322162/full). Physicists themselves remain actively divided about how far physics-style reasoning applies to AI systems, with ongoing and sometimes fiery debate about what the frameworks explain (w=0.749, https://www.aps.org/apsnews/2026/04/how-physicists-feeling-ai). Computational work clarifying concepts through mechanized techniques is a separate discipline from metaphor transfer; the former tests, the latter merely names (w=0.628, weak backing for this specific application, https://plato.stanford.edu/entries/computational-philosophy).

## The negative-preservation check

A 2026-09-18 wayfinder check confirmed the corpus's recorded negatives are load-bearing content that later rounds must not erase: the GL reference doc remained intact at 25899 bytes, negative keywords still resolved across the corpus, and no new physics term had been asserted by any round-8 record. The check exists precisely because correction passes tend to sand off the falsifications along with the errors (record, source doc closing section).

## The final verdict shape

If the diagnostics in doc 09 all fire near a common N_c, the GL framing becomes a load-bearing causal model for skill emergence. If they do not, the framing remains a useful vocabulary, nothing more. Either outcome is publishable in the record; only the first licenses the word "transition" without a hedge (source doc §7).
