# 02 Fibonacci sphere sampling with i = t

Scope: Vogel's golden-angle Fibonacci sphere sampling, the closed-form mapping from corpus index to sphere point, and why the Fibonacci index IS the parameter.

## The closed-form block

The source doc (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/rsi-phi-skill/SKILL.md) gives, for N corpus items indexed by i = 0, 1, ..., N-1:

- phi_i = 2 pi i / phi_golden
- cos theta_i = 1 - (2i+1)/N
- phi_golden = (1 + sqrt(5))/2

Both theta_i and phi_i are closed-form in i. There is no lookup table: the corpus item at position i IS the parameter point on the sphere. This collapses the index-to-point mapping to O(1) (source doc). The Fibonacci index plays a dual role as corpus index and latent parameter, and the flat parameter t = i/N survives unchanged (source doc).

## Why golden-angle sampling

Vogel's spiral model uses the golden angle to place points; MathWorld records that the customary choice alpha = pi (3 - sqrt(5)) produces the interlacing spiral patterns used to model phyllotaxis in sunflower heads (https://mathworld.wolfram.com/VogelSpiral.html, weak, w=0.46). The golden angle is about 137.508 degrees, and popular accounts credit it with the most uniform distribution of points in a spiral because it is the most irrational rotation, so no two seeds line up radially (https://homo-deus.com/lab/art-mathematics/phyllotaxis/, weak, w=0.14; https://www.fibonnaci.com/blog/why-phyllotaxis-uses-the-golden-angle-not-a-nicer-number/, weak, w=0.13). Treat the uniformity superlative as weak backing: the quantitative claim the skill relies on is the equal-area property of the Fibonacci lattice, which a ResearchGate paper on measuring areas on a sphere via Fibonacci and other lattices supports with a point-counting method (https://www.researchgate.net/publication/45891871_Measurement_of_Areas_on_a_Sphere_Using_Fibonacci_and_Cube_Lattices, weak, w=0.33). Stack Overflow's long-standing thread on evenly distributing N points on a sphere lists the Fibonacci sphere as the practical answer (https://stackoverflow.com/questions/9600801/evenly-distributing-n-points-on-a-sphere, weak, w=0.12).

## The i = t design move

The distinguishing move is stated in the source doc's two design points (source doc): because phi_i and cos theta_i are closed-form in i, the Fibonacci index i collapses i -> (theta, phi) into O(1). Compare this with the parent skill, where t is an abstract parameter on a flat [0,1]^2 manifold and the corpus ordering must be mapped onto it. Here the ordering is the sampling: item 0 sits at the north pole neighborhood (cos theta_0 = 1 - 1/N), item N-1 near the south pole, and the azimuthal coordinate winds by the golden angle each step (source doc).

## Consequences the skill depends on

1. Saturation by construction: Fibonacci sampling never puts a point exactly on a zero of cos(m phi), so every per-item basis vector is non-zero and the raw primitive coverage saturates at 384/384 for every item (source doc). That is why the interesting quantity is the coverage delta, not the coverage mask (source doc, see doc 04).
2. No grid substitution allowed: constraint 7 of the source doc forbids using a latitude-longitude grid as a drop-in replacement, because the cycle's gate specifically measures the Fibonacci-versus-lat-long discrepancy (source doc).
3. No constant substitution allowed: constraint 1 requires phi_golden = (1 + sqrt(5))/2; the pi variant (Vogel's spiral form) and the Saff-Kuijlaars variant may not be swapped in without explicit renaming (source doc). MathWorld's Vogel-spiral page shows why the confusion is easy: the spiral literature writes the same golden angle as alpha = pi (3 - sqrt(5)) (https://mathworld.wolfram.com/VogelSpiral.html, weak, w=0.46).

## Where the parameterization comes from

The skill is built on two in-repo refs papers, y33-fibonacci-sphere-paper-method-equation-block-2026-08-07.md (the 3-equation LaTeX block mapping the paper's latent curve c(t) onto S2 via Fibonacci sampling and Y_3^3 modulation) and y33-fibonacci-sphere-paper-revised-passage-2026-08-07.md (the table-based revised passage patch) (source doc, internal-record subtopic, no dig needed for the in-repo provenance).
