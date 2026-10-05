# 04. Inductive bias versus capacity confounds in basis benchmarks

Scope: how to disentangle inductive bias (which functions a basis can represent) from raw capacity (parameter count, effective rank) when comparing representations.

## The confound is recognized in the literature

The cleanest precedent is a paper whose stated aim is to be a controlled empirical study that measures and disentangles the benefits of overparameterization in unsupervised learning settings, considering three common latent variable models (https://proceedings.mlr.press/v119/buhai20a/buhai20a.pdf, weight 0.8280). The design pattern is the one a basis benchmark needs: hold the task fixed, vary the representation, and attribute differences to the representation rather than to parameter count.

The confound has teeth because capacity itself changes outcomes. Classic ensembles generalize better than any single component model, but recent empirical studies find that modern ensembles of overparameterized neural networks may not provide any inherent generalization advantage over single but larger neural networks (https://arxiv.org/abs/2410.16201, weight 0.8909). On the out of distribution side, model ensembles can enhance the OOD testing loss, achieving a similar effect to increasing the model capacity (https://arxiv.org/pdf/2403.17592.pdf, weight 0.7330). In other words, two different interventions, more parameters and more members, produce similar measurable effects, which is exactly why an uncontrolled comparison cannot attribute an effect to inductive bias.

Overparameterization is not merely a nuisance variable. Studies on benign overfit show that overparameterization is a necessary condition to obtain good generalization performance when overfitting noisy data (https://www.sciencedirect.com/science/article/pii/S0925231223003508, weight 0.8461). A benchmark that treats capacity as a pure confound to eliminate would miss this: sometimes the capacity is the mechanism.

## How benchmarks attempt the separation

Two published designs are instructive.

1. Scale controlled architecture comparisons. One study pre trains and finetunes over ten diverse model architectures across multiple compute regimes and scales, from 15M to 40B parameters, to understand the effect of inductive bias on scaling laws (https://openreview.net/pdf?id=GGItImF9oG5, weight 0.7038). The companion framing notes that while much work investigates the scaling properties of Transformer models, not much has been done investigating the effect of the scaling properties of different inductive biases and model architectures (https://openreview.net/pdf?id=Wrtp36cbl61, weight 0.7041). The design lesson is to compare biases at matched compute or matched parameter counts, not at one point each.
2. Multi axis classification benchmarks. A benchmark evaluating eight classification algorithms, representing different learning paradigms and inductive biases, across multiple sample sizes and random seeds, enables a systematic analysis of how model capacity, robustness, and efficiency interact (https://www.mdpi.com/2076-3417/16/10/4637, weight 0.6424). The lesson is that capacity, robustness, and efficiency are jointly measured, so the report can show which axis a win came from.

## Applying this to coordinate benchmarks

For a comparison between a spherical harmonic arm and a flat Fourier arm, the capacity quantities are the two effective ranks, and the bias quantity is which target functions each span contains. The literature above supports three operating rules.

- Attribute wins to bias only when the winning arm is not also the higher capacity arm on an in span target, or when a controlled target design gives the lower capacity arm a genuine advantage (the disentangling pattern of https://proceedings.mlr.press/v119/buhai20a/buhai20a.pdf, weight 0.8280).
- Report both arms' capacity on the same axis, because equal looking parameter counts can hide effective rank differences that behave like capacity changes (the ensemble versus larger model equivalence of https://arxiv.org/pdf/2403.17592.pdf, weight 0.7330).
- Treat generalization claims from capacity as empirical findings with their own conditions, since benign overfit makes overparameterization necessary in the noisy regime (https://www.sciencedirect.com/science/article/pii/S0925231223003508, weight 0.8461).

Weak backing section: an ensembles in GANs review scored low (https://liner.com/review/understanding-overparameterization-in-generative-adversarial-networks, weak backing, weight 0.2556), as did an inductive reasoning encyclopedia article (https://en.wikipedia.org/wiki/Inductive_reasoning, weak backing, weight 0.4720), an unrelated celebrity article (https://people.com/x-men-movies-in-order-how-to-watch-12018946, weight 0.3386), a LaMDA article (https://en.wikipedia.org/wiki/LaMDA, weight 0.3490), and a personal notes page (https://hunterheidenreich.com/notes/machine-learning/model-architectures/scaling-laws-vs-model-architectures/, weight 0.0796). No factual claim above relies on them.
