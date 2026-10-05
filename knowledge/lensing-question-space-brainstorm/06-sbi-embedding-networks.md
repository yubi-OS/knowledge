# 06 - Simulation-Based Inference and Embedding Networks: The Learned Intent Space

**Scope.** The direct prior art for the intent-space stage: simulation-based inference (SBI) with neural posterior estimation (NPE) and embedding networks, the established pattern for a learned compression of high-dimensional observations into sufficient summary statistics.

## The SBI pattern

Simulation-based inference replaces likelihood-based estimation with a simulation-defined model and a learned mapping from observations to posteriors. A practical guide to the field covers the method landscape, including amortized NPE: train once against simulated pairs, then place any new observation in seconds [https://arxiv.org/html/2508.12939v1, jev weight 0.76]. The normalizing-flow machinery that powers most modern NPE is documented in JMLR's survey of normalizing flows for probabilistic modeling and inference [https://jmlr.org/papers/volume22/19-1028/19-1028.pdf, jev weight 0.87], and the physics community's consolidation of the pattern ("Unifying simulation and inference with normalizing flows," Physical Review D 111:076004) shows the same amortization structure applied to physics data [https://journals.aps.org/prd/pdf/10.1103/PhysRevD.111.076004, jev weight 0.79].

## The embedding network is the compression stage

In NPE pipelines, an embedding network maps raw high-dimensional observations (images, fields, spectra) into a learned summary statistic that the posterior network consumes. The astronomic-astro package nbi implements exactly this split for telescope data: an embedding network trained jointly with the posterior estimator [https://ml4astro.github.io/icml2023/assets/71.pdf, jev weight 0.80; https://neurips.cc/virtual/2023/79276, jev weight 0.73].

The brainstorm's move is to name the corpus analog: question space (the raw triple) is the raw observation; intent space is the embedding; latent space (the 0-to-N-dimensional dial) is the parameter space the posterior lives on. In lensing cosmology this decomposition is not a proposal but the standard architecture [https://arxiv.org/html/2609.07833, jev weight 0.78], where neural posterior estimation is applied to tomographic weak lensing mass mapping.

## Why this matters for the corpus chain

Three properties transfer directly:

1. Amortization. The NPE pattern is train once, evaluate everywhere. Applied to the corpus: a single embedding trained on the reference set would place any new corpus in the learned intent space in seconds, which is the operational goal of the lensing chain [https://arxiv.org/html/2508.12939v1, jev weight 0.76].
2. Sufficient compression. The embedding is trained so that the standardized verdicts are recoverable from the embedding; classical sufficiency and the information bottleneck frame what "recoverable" means. The Fisher-Rao result (doc 05) predicts the geometry such a sufficient compression must carry.
3. Null-trainability. Gap C's proposal in the source document is an NPE-shaped test: train the same embedding on curveball draws and check whether it recovers the same verdicts. The SBI literature's standard validation loops (simulation-based calibration) supply the pattern for such a check [https://arxiv.org/html/2508.12939v1, jev weight 0.76].

## Honesty constraint

No dig result establishes an SBI-style embedding for corpus audit statistics specifically; the bridge is architectural, from lensing SBI to the corpus chain. The source document marks intent space as undefined in the papers and inadmissible until Gap C runs. A tangential result in the dig (Silkscreen, direct galaxy-distance measurements) [https://arxiv.org/html/2407.04091, jev weight 0.88] is recorded but not load-bearing for this document's claims.
