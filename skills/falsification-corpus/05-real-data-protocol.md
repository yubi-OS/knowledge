# 05: Real-data pass protocol

**Scope:** Real-data pass protocol: dimensionality check first, confound controls named in advance with matched-extent controls as part of the corpus, and honest single-trial noise reporting.

Grounding spine: the source doc `yubi-OS/yubiOS skills/falsification-corpus/SKILL.md`, plus searXNG digs weighted by jev noul.

## The transition the protocol guards

Everything before this step runs on synthetic classes where you hold the answers. The real-data pass is where the instrument meets data whose answers nobody holds, and the source doc gives 3 rules that keep that transition honest.

## Rule 1: dimensionality check FIRST

Before promising a 2D morphology read from any dataset, verify the data is actually 2D. The source doc measured the failure: a waveguide polariton platform's "images" are 1D profiles, and strips read D 1.237-1.498 with no threshold signature. The instrument would have produced numbers for every panel while measuring nothing the claim needed.

The digs support the general principle that data dimensionality is a property you must establish, not assume: a systematic review of dimensionality reduction for remote sensing data analysis exists as a field because knowing the effective dimensionality of your data governs what analyses are valid on it (jev weight 0.34, weak backing, https://arxiv.org/html/2510.18935v1). Cambridge's definition of verifying, to check or prove that something is correct or true (jev weight 0.79, https://dictionary.cambridge.org/dictionary/english/verifying), is the verb this rule turns on: the check comes before the promise.

## Rule 2: name confound controls in advance

Real data has extents, densities, and orderings your synthetic corpus decoupled on purpose. The source doc's measured case: the corpus predicted tri vs shuffle reads near-degenerate, the measured difference was 0.23, but the patches also differed 236px vs 384px in extent. With extent free to vary, the measured difference is unattributable: it could be the ordering manipulation or just the window size. The fix: matched-extent controls are part of the corpus, not an afterthought.

The dig literature on matching backs the design logic. A causal-inference review of matched case-control designs notes that while matching is intended to eliminate confounding, its main potential benefit is a gain in efficiency, and that analysis methods must be chosen with the matching structure in mind (jev weight 0.72, https://pmc.ncbi.nlm.nih.gov/articles/PMC2827892/). The confound itself is defined as anything that mixes effects and confuses their attribution: Merriam-Webster defines confound as to fail to distinguish or to mix up (jev weight 0.84, https://www.merriam-webster.com/dictionary/confound; Cambridge Dictionary, weight 0.79, https://dictionary.cambridge.org/dictionary/english/confound). The falsification corpus's rule is stronger than post-hoc statistical correction: build the control class before the run, so the confound never has a chance to act.

The related guideline, guideline 7 in the source doc: a near-degeneracy prediction without matched-extent controls is unfalsifiable. Add the control or withdraw the prediction.

## Rule 3: report single-trial noise honestly

The source doc's third rule is a reporting discipline: one real panel is one sample. A D value measured on a single panel carries no replicate information, and any claim built on it must be stated as such. The corpus's synthetic classes can be regenerated with new seeds to estimate noise; a real panel cannot. Nothing in the protocol permits averaging over panels you did not measure.

## Sequence discipline

The 3 rules are ordered. Dimensionality comes first because a structurally 1D dataset invalidates the morphology question entirely; confound controls are named in advance because a post-hoc control is not a control; and noise reporting is last because it qualifies the numbers the first 2 rules allowed to exist. Skipping the order inverts the logic: you can end up reporting confident numbers on unmeasurable data.

## What the protocol is not

The real-data pass is not the corpus. The corpus (synthetic classes, gates, parity) exists so that when the instrument reaches real data, its failure modes on real data can be attributed to the data rather than the instrument. The source doc's framing holds throughout: every failure on the synthetic corpus is the instrument's fault; on real data, after the corpus pass, a surprising result can finally be evidence about the world.
