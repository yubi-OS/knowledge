# 01 - Fibonacci and Vogel sphere sampling: provenance of the golden-angle scheme

Scope: where the Fibonacci (golden-angle) sphere sampling in rsi-phi-skill comes from, why it is closed-form in the index i, and the mathematical literature that justifies it.

## The Vogel model and the golden angle

The direct ancestor of the sampling scheme is Vogel's 1979 paper, "A better way to construct the sunflower head," published in Mathematical Biosciences. The paper derives the sunflower seed pattern from two simple principles: most uniform angular distribution of seeds, which produces the Fibonacci angle, and most uniform area distribution of seeds, which produces the Fermat spiral radius law [1]. Wolfram MathWorld documents the resulting Vogel spiral as a fixed divergence angle applied per seed, with the customary choice being the golden angle, producing the interlacing spiral patterns used to model phyllotaxis in sunflower heads; the radii satisfy the equation of Fermat's spiral [2].

The concrete parameterization that the yubiOS skills inherit is: seed i sits at angle i times the golden angle delta and radius c times sqrt(i) [3]. That phrasing comes from an interactive phyllotaxis simulator, which carries weak backing (weight 0.2886), but it is corroborated at high weight by the MathWorld entry [2] and by the primary paper itself [1]. A second weak-weight source places wild sunflower heads at 500 to 3000 seeds arranged at the golden angle, with parastichy arm counts that are almost always consecutive Fibonacci numbers [4]. The angle converges on about 137.5 degrees [5], weight 0.2969 (weak backing).

## From sunflower head to sphere

The skill needs points on the sphere, not on a disk, so the relevant step is the Fibonacci sphere mapping: place point i at

phi_i = 2 pi i / phi_golden,
cos theta_i = 1 - (2i + 1) / N,

with phi_golden = (1 + sqrt(5)) / 2. This is closed-form in the index i: no iteration, no relaxation, no numerical optimization. The equal-area property of the latitude band rule is what makes the distribution uniform on the sphere surface.

The academic lineage for uniform sphere point sets is Saff and Kuijlaars, "Distributing many points on a sphere," Mathematical Intelligencer 1997. The paper's motivation is explicitly computational: quadrature formulas rely on appropriately chosen sampled data points in order to approximate area integrals by taking averages, and the distribution of N points impacts applications in computation and electrostatics, including quadrature and molecular structure [6] (weight 0.7608), [7] (weight 0.7102), [8] (weight 0.6489). Their survey frames the problem as one that has attracted mathematicians, biologists, and chemists alike [7].

A widely cited practitioner treatment, "Evenly distributing points on a sphere," treats the golden-angle spiral as one of the standard answers and weighs it against competing constructions [9], weight 0.7364. A computer-graphics treatment, "Spherical fibonacci mapping" in ACM Transactions on Graphics, notes that early Fibonacci point sets lacked an efficient nearest-neighbor mapping from points on the unit sphere to their closest spherical Fibonacci point set neighbors, which limited practical adoption until an inverse mapping was introduced [10], weight 0.8772. That limitation matters for corpus work only in the lookup direction, and the yubiOS skills never need neighbor queries: they only need the forward map from index i to (theta_i, phi_i), which is the cheap direction.

One honest caveat: the Fibonacci sphere is not the optimal equal-distance distribution. A practitioner source states plainly that it is one solution to the equal distribution of points on a sphere, not the best solution, but a quick and efficient one [11], weight 0.4171 (weak backing). The skill's choice is justified by speed and closed-form determinism, not by optimality of the packing.

## Why i = t works

The design choice that makes the sampling load-bearing for the RSI loop is that the Fibonacci index IS the parameter: t = i / N, so every corpus item's position on the sphere is a pure function of its ordinal index. Deep-research dispatches cycle the Fibonacci index, which gives refs-style corpora an azimuthal ordering; the same holds for the skill registry [12], weight 0.4717 (weak backing, but it is the skill's own statement of intent, sourced from the SKILL.md in the yubi-OS/yubiOS repo). Because the forward map is closed-form, recomputing positions after every edit costs nothing, which is what makes the per-cycle re-map step of the loop affordable.

## Sources

1. Vogel, H., "A better way to construct the sunflower head," Mathematical Biosciences, 1979. https://www.sciencedirect.com/science/article/pii/0025556479900804 (weight 0.8659)
2. Vogel Spiral, Wolfram MathWorld. https://mathworld.wolfram.com/VogelSpiral.html (weight 0.8982)
3. Phyllotaxis simulator. https://www.mysimulator.uk/generative-art/phyllotaxis/ (weight 0.2886, weak)
4. Phyllotaxis: golden angle and Fibonacci spirals. https://homo-deus.com/lab/art-mathematics/phyllotaxis/ (weight 0.3211, weak)
5. Fibonacci and the golden angle. https://theoriesofanything.com/athenaeum/fibonacci-and-the-golden-angle.html (weight 0.2969, weak)
6. Saff and Kuijlaars, Springer PDF. https://link.springer.com/content/pdf/10.1007/bf03024331.pdf (weight 0.7608)
7. Saff and Kuijlaars, Vanderbilt mirror. http://www.math.vanderbilt.edu/saffeb/texts/161.pdf (weight 0.7102)
8. Saff and Kuijlaars, Springer article page. https://link.springer.com/article/10.1007/BF03024331 (weight 0.6489)
9. Evenly distributing points on a sphere. http://extremelearning.com.au/evenly-distributing-points-on-a-sphere/ (weight 0.7364)
10. Spherical fibonacci mapping, ACM TOG. https://dl.acm.org/doi/10.1145/2816795.2818131 (weight 0.8772)
11. Fibonacci Sphere, designcoding. https://www.designcoding.net/fibonacci-sphere/ (weight 0.4171, weak)
12. rsi-phi-skill SKILL.md, yubi-OS/yubiOS. https://github.com/yubi-OS/yubiOS/blob/main/skills/rsi-phi-skill/SKILL.md (weight 0.4717, weak)
