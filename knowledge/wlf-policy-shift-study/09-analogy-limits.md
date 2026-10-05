# 09 Limits of the analogy

Scope: the limits of the viscoelastic analogy: what the temperature metaphor hides, when physical analogies mislead software design, and the honest no-numbers reporting discipline.

## Analogies transfer structure, not guarantees

The WLF reading of policy evolution is an analogy, and analogies have a documented failure mode: they transfer structural similarity while silently dropping the conditions under which the structure holds. The philosophy literature on computationalism makes the point at full scale. The question "could a machine think" is precisely a question about whether a structural mapping preserves the properties that matter, and the debate has lasted because mapping alone does not settle it (weight 0.83, https://plato.stanford.edu/entries/computational-mind).

The same issue appears concretely in machine learning transfer studies. Models trained with fairness constraints in one domain do not automatically make fair predictions in new or unexpected cases; researchers developed ways to measure whether fairness properties transfer across domains at all (weight 0.80, https://arxiv.org/abs/1906.09688). Cross-domain transfer in large models is an active engineering topic with known challenges such as bias (weight 0.61, https://www.intechopen.com/chapters/1209560). The transferable lesson: a property established in the source domain must be re-verified in the target domain, not assumed by the analogy.

## What the temperature metaphor hides

The mapping in this corpus maps policy version to temperature, response curves to moduli, and invariant gate structure to the material. Three things the metaphor hides:

1. Policy versions are discrete and chosen; temperature is continuous and physical. Discreteness limits how many a_T(v) points the study can ever have, and each point costs a real policy change with real users. Geological modeling offers the cautionary tale: entire fields have needed critical reappraisal of their foundational models after decades of accumulation, such as the reappraisal of dolomitization models (weight 0.55, https://www.lyellcollection.org/doi/abs/10.1144/SP313.11).
2. The gate can observe itself. A physical material cannot change its response because it learned it was being measured; the corpus can, because a validator addition like v4 to v5 changes the outcome vocabulary itself. Isomorphic processes in organizations show how structures converge by imitation rather than by shared mechanism (weight 0.67, https://www.sciencedirect.com/science/article/pii/S1877705818300328), and the gate's versions can converge toward whatever the data rewards for the same non-mechanical reason.
3. The analogy imports a physics of time-temperature equivalence (weight 0.54, https://www.simplypsychology.org/information-processing.html is the weak-adjacent reminder that such mappings are ubiquitous, from information processing theory mapping minds to computers). The corpus must earn the equivalence with the superposition test, not inherit it.

## The no-numbers discipline

The source study's most valuable sentence is its conclusion: the study is method-complete, data-blocked, and no numbers are claimed. That discipline is the correct response to an analogy whose data does not yet exist, and it generalizes. When a model is executable but its inputs are absent, stating the method, naming the instrument that will produce the inputs, and refusing to extrapolate is stronger than publishing a plausible number.

The cost of violating this is concrete. A corpus that claims policy-level effects from a single policy window of data is doing what the calibration doc warns about: asserting an effect without a measurement that can clear the predefined anchor of 102.86 dBc-units (weight 0.83, https://www.sciencedirect.com/science/article/pii/S0952818023003173). Weak-backed popular treatments of physical limits in computing make the same rhetorical move in reverse, importing thermodynamic law into software claims (weak backing, weight 0.41, https://harvardsciencereview.org/2026/02/26/the-physical-limits-of-ai-intelligence-the-collision-course-with-the-law-of-thermodynamics-part-i/); the corpus should not import WLF constants with any more confidence than that, until its own data supports it.

## Bottom line

The WLF analogy is a hypothesis generator with a built-in falsification test, not a theory. It generates the shift-factor hypothesis, the joint-superposition test, and the stamping instrument. It does not generate results, because the data for results does not exist and cannot be manufactured by analogy. The honest end state is the one the source doc reached: the measurement defined, the instrument proposed, and no numbers claimed.
