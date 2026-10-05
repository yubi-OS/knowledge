# 05 - The chain: question space, null space, intent space, latent space

**Scope.** The formalized chain behind the map: Q (the is-this-x triple), N0 (the matched-null vacuum), I (the sufficient-statistic quotient with Fisher-Rao geometry), and the latent dimension dial from Zhang effective dimension to Johnson-Lindenstrauss floors.

## The four stations

The source findings doc formalizes the chain as follows. Question space Q is the is-this-x triple (Phi, M, V): corpora are rays traveling through it and families are its sources. Null space N0 is the matched-null ensemble, the vacuum metric, the origin of the map. Intent space I is the sufficient-statistic quotient: the smallest space that preserves every family verdict. Latent space runs from 0 to N dimensions and is dialed by lambda.

Two stations of this chain have direct dig backing.

## Intent space: Fisher-Rao geometry

The uniqueness claim: by Cencov's theorem, the intent space's invariant geometry is Fisher-Rao, uniquely up to a positive constant. A 2026 arXiv paper states the backing result directly: information geometry provides a unique intrinsic geometry on spaces of probability distributions, and the Fisher-Rao metric is, up to scale, the only Riemannian metric invariant under sufficient reparameterization (weight 0.5441, https://arxiv.org/html/2601.17330). An NYU seminar note states Cencov's theorem in exactly that form: the invariance properties determine the Fisher metric uniquely up to multiplication by a positive constant (weight 0.274, weak, https://cims.nyu.edu/~gromov/Fall%202026/cencov_theorem_expanded.pdf). A research paper on the Lp-Fisher-Rao metric connects the Cencov alpha-connections to geodesic equations on the space of densities (weight 0.7155, https://www.researchgate.net/publication/378129262_The_Lp-Fisher-Rao_metric_and_Amari-Cencov_alpha_-Connections). A formal-ML reference frames the same point: equipping the space of probability distributions with the Fisher information reveals that statistical inference is fundamentally geometric (weight 0.2441, weak, https://www.formalml.com/topics/information-geometry/). A notes page argues the structural significance: the theorem gives a structural reason that Fisher geometry appears in statistics, not an algebraic accident (weight 0.1795, weak, https://lihanqing1997.github.io/notes/information-geometry/cencov-theorem/).

## The constructive version: NPE from lensing cosmology

The framework's constructive claim is that NPE-style embedding networks from lensing cosmology, learned summary statistics between raw observation and physical parameters, are the direct prior art for building the intent space. The dig confirms the pattern is live:

- Neural posterior estimation of the line-of-sight and subhalo structure in strong lenses trains a network to predict dark matter substructure parameters from lens images, evaluated on 1000 held-out lenses (weight 0.8969, https://arxiv.org/html/2511.17732v1).
- A Fermilab poster presents comprehensive neural posterior estimation for galaxy-galaxy strong lensing (weight 0.7695, https://lss.fnal.gov/archive/2025/poster/fermilab-poster-25-0227-csaid.pdf).
- A working codebase trains a ResNet-based classifier on roughly 2 million simulated DES lenses for cosmology inference via neural ratio estimation (weight 0.654, https://github.com/deepskies/CosmoLensNRE).
- A 2026 arXiv paper studies strong lensing cosmology with population-level calibrated neural ratio estimation (weight 0.4043, weak, https://arxiv.org/abs/2608.23534).
- An encyclopedia entry defines NPE as simulation-based inference with deep generative models, typically normalizing flows, learning the posterior directly (weight 0.2198, weak, https://lodestone.wiki/Statistics/neural-posterior-estimation).

The mapping: the embedding network between raw observation and physical parameters is the constructive form of the sufficient-statistic quotient, and the framework's gap C (the intent space must pass the membership condition, with its null being the same embedding trained on curveball draws) is the admissibility test these pipelines do not yet run.

## The latent dial

The source findings doc assigns the latent station two anchors: Zhang's effective dimension D_lambda = tr((T + lambda I)^(-1) T), a continuous dial from 0 (lambda to infinity) to numerical rank (lambda to 0), turning the discrete basis ladder into a dispersion relation where dimension plays wavelength; and the Johnson-Lindenstrauss lemma (k = O(epsilon^(-2) log n)), which floors how many dimensions a corpus needs. Neither anchor surfaced in the dig; both are recorded here as source-doc attributions pending a dedicated dig in a later round.

## Sources considered

| result | weight | used |
|---|---|---|
| NPE subhalo line-of-sight (arXiv 2511.17732) | 0.8969 | yes |
| Lp-Fisher-Rao and Amari-Cencov connections | 0.7155 | yes |
| CosmoLensNRE codebase | 0.654 | yes |
| Fisher-Rao uniqueness (arXiv 2601.17330) | 0.5441 | yes |
| Fermilab NPE strong lensing poster | 0.7695 | yes |
| NRE population-level calibration (arXiv 2608.23534) | 0.4043 | weak, cited as related work |
| Cencov theorem seminar note (NYU) | 0.274 | weak, cited as statement |
| formalML information geometry | 0.2441 | weak, cited as context |
| lodestone NPE entry | 0.2198 | weak, cited as definition |
| Cencov theorem notes page | 0.1795 | weak, cited as context |
| Chase.com (off topic) | 0.0335 | no |
| Neural DSP (off topic) | 0.0704 | no |
