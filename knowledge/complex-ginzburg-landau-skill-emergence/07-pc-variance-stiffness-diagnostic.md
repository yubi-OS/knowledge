# 07 - PC1+PC2 as a stiffness-like diagnostic, not a free energy

**Scope:** Why PC1+PC2 is an observable stiffness-like diagnostic and NOT a free energy, and what an empirical effective potential F_eff with a measured Hessian would look like instead.

Source doc: `refs_corpus/complex-ginzburg-landau-skill-emergence.md` (yubi-OS/yubiOS refs/). Weights in parentheses are jev noul scores from the research DB.

## What PC1+PC2 actually measures

PCA is a linear dimensionality reduction technique: the data are transformed onto new coordinates whose directions are the principal components (w=0.142, weak backing for the definition, https://en.wikipedia.org/wiki/Principal_component_analysis). The goal of dimensionality reduction is a lower-dimensional representation that preserves the essential characteristics of the data (w=0.639, https://web.stanford.edu/class/datasci112/lectures/pca.pdf). In the corpus framework the quantity is V_2(N) = (λ₁ + λ₂) / Σλᵢ, the cumulative variance explained by the top two principal components of the 9-primitive coverage matrix. This is an observable state diagnostic measuring low-dimensional organization (source doc §3.3).

Nothing in this definition is a thermodynamic potential. PCA explains variance; it neither assigns probabilities to configurations nor defines an energy that the system minimizes. The Stanford course materials define the first two principal components operationally, as the directions maximizing retained variance, and biplot-style interpretations of component loadings; none of this involves a state function (w=0.892, https://web.stanford.edu/class/stats202//notes/Unsupervised/PCA.html; w=0.753, https://jakevdp.github.io/PythonDataScienceHandbook/05.09-principal-component-analysis.html).

## The common temptation, and why it is wrong

A recurring temptation is to identify PC1+PC2 with the free energy F. The source doc states plainly: this is wrong (source doc §3.3, caveat 1). Calling PC1+PC2 "free energy" without constructing an empirical F_eff(x; N) = −T_eff(N) log P_N(x) is misleading (source doc §5, caveat 1). The distinction is not cosmetic. A free energy is a functional whose gradients drive dynamics and whose curvature defines stiffness. A variance ratio is a scalar summary of a snapshot distribution. Conflating them smuggles in dynamical claims the data do not support.

## What the true stiffness-like object would be

If one wants a genuine free-energy analogue, define an effective probability distribution P_N(x) ∝ exp(−F_eff(x; N) / T_eff(N)) from the corpus-measured state distribution. The local Hessian K(N) = ∇²F_eff at the dominant basin is then a real stiffness object: it measures how sharply the basin confines states (source doc §3.3). PC1+PC2 can be one observable used to estimate the location and curvature of the basin, but it is not itself the free energy (source doc §3.3).

This connects to established practice in deep learning, where the loss landscape's Hessian is the standard curvature object. The Hessian governs convergence smoothness, and its structure changes measurably as sample size increases (w=0.765, https://arxiv.org/html/2409.11995v1; w=0.753, https://link.springer.com/article/10.1134/S1064562424601987). Curvature-aware analysis explains training instability: successful model and hyperparameter choices let the early optimization trajectory navigate out of regions of high curvature into flatter regions that tolerate higher learning rates (w=0.875, https://research.google/pubs/a-loss-curvature-perspective-on-training-instability-in-deep-learning/). The analogy is direct: if the corpus framework wants a stiffness number with GL meaning, it needs the curvature of an empirical effective potential, not the variance ratio it currently reports.

## The full diagnostic table

The source doc separates the quantities cleanly:

| Concept | Definition |
|---|---|
| M(N) = |m(N)| | Order parameter magnitude |
| A(N) | Anisotropy of primitive coverage |
| R(N) | Cross-context reproducibility |
| V_2(N) = (λ₁ + λ₂)/Σλᵢ | PC1+PC2, variance concentration |
| dV_2/d log N | Emergence-response slope |
| Var[V_2(N)] across seeds | Fluctuation diagnostic |
| Hessian of empirical effective potential | True stiffness-like object |

(source doc §3.3)

## Practical consequences for cycle 24

Three consequences follow. First, any reported PC1+PC2 number should be discussed as an organization statistic, never as an energy. Second, the empirical gate for the GL framing requires constructing F_eff from the corpus-measured state distribution before stiffness claims can be made (source doc §7). Third, once F_eff exists, its Hessian can be compared against V_2: if the variance ratio and the basin curvature track each other across N, then V_2 earns its role as a cheap proxy diagnostic with a stated calibration; if they diverge, the variance ratio is measuring something else entirely. The cycle-16 endpoint measurement of V_2 = 0.7657 stands in the record as an organization statistic with no thermodynamic interpretation attached (source doc §3.5, §5).
