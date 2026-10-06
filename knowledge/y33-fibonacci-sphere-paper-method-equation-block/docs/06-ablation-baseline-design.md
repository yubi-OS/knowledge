# Ablation and Baseline Design for the Equation Block

Scope: the four-arm ablation suite the source block recommends (latitude-longitude grid, Fibonacci without modulation, Fibonacci with Y_3^3 modulation, flat [0,1]^2 baseline) and the matched-parameter comparison philosophy behind it.

## What an ablation study is for

In machine learning research, ablation studies are typically performed to provide insights into the individual contribution of different building blocks and components of a system, as well as to justify that certain design choices are necessary (weight 0.67, https://dl.acm.org/doi/10.1145/3721146.3721957; the same paper's open PDF records the identical motivation, weight 0.59, https://euromlsys.eu/pdf/euromlsys25-33.pdf). The general definition is removal of a component of an AI system to determine that component's contribution by analyzing the resulting performance (weight 0.14, https://en.wikipedia.org/wiki/Ablation_(artificial_intelligence)). Weak backing note: the Wikipedia framing scores below 0.5 and is corroboration only.

The equation block inherits this discipline directly: its design already isolates exactly two contributions, the sampling scheme and the harmonic modulation, so the ablation arms fall out of the construction rather than being retrofitted.

## The four arms

1. Uniform latitude-longitude grid. The classical baseline sampling. It exists to answer whether Fibonacci sampling matters at all. The two schemes are not mathematically equivalent: lat-long clusters at the poles while Fibonacci spreads points evenly, as shown by the direct lattice comparison (weight 0.92, https://arxiv.org/pdf/0912.4540). The source artifact's constraint list makes this explicit: the lat-long grid must never be a silent drop-in replacement for Fibonacci sampling; the comparison is the ablation's point.
2. Fibonacci sphere without modulation, alpha = 0. The embedding reduces to the plain unit-sphere projection u_i. This arm isolates the sampling contribution from the harmonic contribution and answers the source block's own question: is the harmonic modulation actually doing anything, or is the gain all from Fibonacci sampling?
3. Fibonacci sphere with Y_3^3 modulation. The full block. The difference between arms 2 and 3 is exactly one scalar, alpha, which is the minimal possible delta between ablation arms.
4. Flat [0,1]^2 baseline. The paper's original parameterization, retained so the sphere variants are compared against the pre-existing method under matched conditions.

## Matched-parameter discipline

The design philosophy the source block names, matched-parameter comparison, is standard practice: ablation results are interpretable only when arms differ by the component under test and agree in everything else. The block is built so that this holds by construction: arms 2 and 3 share identical (theta_i, phi_i) node sets because the sampling is deterministic, share the identical f_theta projection, and differ only in alpha. Recent work on automating ablation design evaluates study designs on importance, faithfulness, and soundness, and finds significant gaps between leading models and human experts on exactly these criteria (weight 0.40, https://aclanthology.org/2025.acl-long.611/). Weak backing note: below 0.5; the takeaway, that ablation design quality is itself measurable, is context rather than evidence.

Because the node set is deterministic, repeated runs of any arm sample identical points. That removes sampling noise as a confounder across arms, a property random sampling schemes do not provide.

## What each arm should report

The source block recommends a cost table across N in {100, 1000, 10000, 100000} for the flat baseline, the sphere without modulation, and the sphere with modulation. Total cost is O(N d), dominated by the f_theta evaluation, with O(N) sampling and O(N) harmonic evaluation. Beyond cost, each arm should report the same downstream metrics the paper already uses, so the four arms are directly comparable in the existing tables.

## Spherical-context precedent

For the spherical arms, precedent exists in the spherical representation-learning literature: a spherical transfer-learning framework employs a VGG-style spherical convolutional encoder aligned with standard U-Net architectures used for cortical surface segmentation, with the adaptations made to maximize representation transferability (weight 0.63, https://arxiv.org/html/2609.12627v1). The pattern of evaluating a spherical encoder against established baselines on shared downstream tasks is the same shape as the block's ablation suite. A related spherical representation-learning paper over Doppler radiance fields preserves directional organization and enables long-range interactions over the sphere (weight 0.45, https://arxiv.org/html/2608.08381). Weak backing note: below 0.5, context only.

## Constraints inherited by the equation block

1. All four arms must share the f_theta, the dataset, the loss, and the metric suite; the only permitted deltas are the sampling scheme and alpha.
2. The lat-long arm is a named comparison, never a silent substitution: swapping the sampler without renaming the arm invalidates the ablation.
3. alpha = 0 must be exactly the projection, not approximately; any residual side effect of the modulation path at alpha = 0 contaminates arm 2.
4. The flat [0,1]^2 baseline is retained even after the sphere variants work, because the paper's contribution claim is relative to it.
