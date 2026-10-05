# 03 - Sphere-shaped corpora: why the flat [0,1]^2 parameterization loses structure

Scope: the structural argument for fitting corpus coverage on the Riemann sphere instead of the flat unit square, and the mathematical and graphics literature that motivates the swap.

## The problem with flat

The parent skill, recursive-self-improvement, fits its corpus coverage on the flat [0,1]^2 parameter manifold. That works for version sequences and time series, where the corpus genuinely has a linear order. The rsi-phi-skill design argument is that most yubiOS corpora are not linearly ordered: refs/*.md is an azimuthal ordering, because deep-research dispatches cycle the Fibonacci index; skills/*.md is an azimuthal ordering from cycle-1 RSI on the skill registry; and the cycle-N RSIs themselves form an azimuthal cycle of recursive cycles [1], weight 0.4717 (weak backing; this is the skill's own motivating passage in its SKILL.md). On those corpora the flat parameterization discards the rotational structure: items that sit next to each other azimuthally get mapped to unrelated corners of a square.

## The Riemann sphere and stereographic projection

The target geometry is the Riemann sphere, the complex number plane wrapped around a sphere by stereographic projection, with the point at infinity corresponding to the projection pole [2], weight 0.8707. Teaching material on complex function visualization describes the Riemann sphere as a modeling instrument distinct from passive plane plots, precisely because wrapping the plane around the sphere makes the wrap-around structure explicit rather than implicit [3], weight 0.8010. For a corpus whose index cycles azimuthally, that wrap-around is the whole point: item N-1 is adjacent to item 0 on the sphere, not at opposite ends of a line segment.

The rsi-phi-skill and its family map corpus coverage vectors to the sphere through PCA top-2 followed by stereographic lift, a construction spelled out in the atomic variant of the family [4], weight 0.3345 (weak backing; the pipeline is stated in the single-action-curve-rsi SKILL.md). The 9-D binary primitive coverage feeding that map is the same family standard [4].

## Sphere-fitting literature

The statistical literature supports fitting on manifolds rather than flattening them. Manifold fitting research states that classical data analysis addressed observations in real vector spaces, while many problems of current interest concern data taking values in more complex objects such as manifolds [5], weight 0.7994. Work on manifold learning for parameter reduction shows a concrete failure of the flat picture: fitting a model to data in the absence of structural information can yield an entire curve in parameter space that fits the observations, so a data fitting algorithm based only on function evaluations can be confused by non-identifiability in the flat parameterization [6], weight 0.7951.

Practical tooling compares manifold learning methods on spherical test data: scikit-learn's comparison gallery demonstrates dimensionality reduction on the S-curve dataset across methods [7], weight 0.9033, and its severed-sphere example runs LLE, LTSA, Hessian LLE, Isomap, MDS, and spectral embedding on 1000 points sampled from a sphere [8], weight 0.6584. The takeaway for the skill design is that the sphere is a well-trodden analysis surface with mature tooling, not an exotic choice.

## The sampling side of the swap

Moving to the sphere forces an explicit sampling scheme, because unlike a square there is no trivial uniform grid. The spherical fibonacci mapping literature supplies the practical pedigree: Fibonacci point sets on the sphere are a standard construction in computer graphics, and the 2016 ACM TOG paper introduced the inverse mapping that made them practical for applications needing nearest-neighbor queries [9], weight 0.8772. A general treatment of evenly distributing points on a sphere ranks the golden-angle spiral among the standard answers [10], weight 0.7364.

Two weak-weight practitioner sources round out the picture: a Stack Overflow thread on evenly distributing N points on a sphere, where the goal is maximizing the minimum distance between points so they appear evenly distributed [11], weight 0.1169, and a designcoding tutorial calling the Fibonacci sphere quick and efficient though not optimal [12], weight 0.4171.

## What the swap buys

The design conclusion: for azimuthal corpora, fitting on S^2 with an explicit Fibonacci sampling restores adjacency that the flat [0,1]^2 manifold destroys, and the Riemann-sphere swap was already established in the family by hyperspherical-harmonic-curve [1], weight 0.4717 (weak backing). The novel contribution of rsi-phi-skill over that predecessor is making the sampling scheme itself explicit and native: Vogel's golden-angle scheme with the index as the parameter, paired with a fixed Y_3^3 angular probe [1].

## Sources

1. rsi-phi-skill SKILL.md, yubi-OS/yubiOS. https://github.com/yubi-OS/yubiOS/blob/main/skills/rsi-phi-skill/SKILL.md (weight 0.4717, weak)
2. Riemann sphere, Wikipedia. https://en.wikipedia.org/wiki/Riemann_sphere (weight 0.8707)
3. Riemann Sphere and Complex Plane Transformations, ATCM 2022. https://atcm.mathandtech.org/EP2022/invited/21955.pdf (weight 0.8010)
4. single-action-curve-rsi SKILL.md, yubi-OS/yubiOS. https://github.com/yubi-OS/yubiOS/blob/main/skills/single-action-curve-rsi/SKILL.md (weight 0.3345, weak)
5. Manifold fitting, arXiv:2304.07680. https://arxiv.org/abs/2304.07680 (weight 0.7994)
6. Manifold learning for parameter reduction, PMC. https://pmc.ncbi.nlm.nih.gov/articles/PMC6528681/ (weight 0.7951)
7. Comparison of manifold learning methods, scikit-learn. https://scikit-learn.org/stable/auto_examples/manifold/plot_compare_methods.html (weight 0.9033)
8. Manifold learning on a severed sphere, scikit-learn. https://scikit-learn.org/stable/auto_examples/manifold/plot_manifold_sphere.html (weight 0.6584)
9. Spherical fibonacci mapping, ACM Transactions on Graphics. https://dl.acm.org/doi/10.1145/2816795.2818131 (weight 0.8772)
10. Evenly distributing points on a sphere. http://extremelearning.com.au/evenly-distributing-points-on-a-sphere/ (weight 0.7364)
11. Evenly distributing n points on a sphere, Stack Overflow. https://stackoverflow.com/questions/9600801/evenly-distributing-n-points-on-a-sphere (weight 0.1169, weak)
12. Fibonacci Sphere, designcoding. https://www.designcoding.net/fibonacci-sphere/ (weight 0.4171, weak)
