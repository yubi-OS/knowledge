# Conventions, Variants, and Hard Constraints

Scope: the convention choices the equation block fixes, the golden-angle variants that must not be silently substituted, the Condon-Shortley phase, and the non-substitution rules the source artifact imposes on downstream users.

## The golden angle and its variants

The block's azimuthal constant is the golden ratio phi = (1+sqrt(5))/2, entering as phi_i = 2 pi i / phi. The golden angle itself is 2 pi / phi^2 = pi (3 - sqrt(5)) radians, the per-point azimuthal increment of Vogel's spiral; MathWorld records that this customary choice produces the interlacing spiral patterns used to model phyllotaxis in sunflower heads (weight 0.86, https://mathworld.wolfram.com/VogelSpiral.html).

Two named variants exist and are not interchangeable with the canonical choice:

1. The Vogel planar variant replaces the golden ratio with pi in the azimuthal step. It produces a different, still spiral, point pattern.
2. The Saff-Kuijlaars variant uses psi = (1+sqrt(5))/2 * pi. The source block excludes both: substituting either without renaming changes the point distribution and breaks the node-level synchronization with the companion prose-revision artifact, which carries the identical constant.

The source artifact's constraint list elevates this from style to rule: the golden ratio phi = (1+sqrt(5))/2 must be used for canonical Fibonacci indexing, and no variant substitution without explicit renaming.

Why the golden angle specifically is the right default has independent scientific backing from phyllotaxis research. A Royal Society study proposes a unified rule of phyllotaxis explaining both spiral and non-spiral arrangements and engages the optimality of the golden angle under growth-dependent divergence angles (weight 0.94, https://royalsocietypublishing.org/rsif/article/16/151/20180850/87024/The-unified-rule-of-phyllotaxis-explaining-both). A Nature Scientific Reports study formulates the preponderance of the golden angle in spiral phyllotaxis as an optimality problem and explains it biophysically (weight 0.94, https://www.nature.com/articles/srep15358.pdf). A 2026 botanical modeling paper derives the emergence of the golden angle from a developmental model of flower heads (weight 0.77, https://algorithmicbotany.org/papers/GoldenAngle2026.pdf). The classical observation base goes back to Bonnet's 1754 record that spiral phyllotaxis is frequently expressed in both clockwise and counter-clockwise golden ratio series (weight 0.75, https://en.wikipedia.org/wiki/Phyllotaxis). None of this botany proves a sphere-sampling theorem, but it grounds why the golden angle, not a nearby irrational, is the canonical default with a deep optimality literature behind it.

## The Condon-Shortley phase and normalization

The block fixes K = sqrt(245/(64 pi)) under the Condon-Shortley convention. The phase itself is the factor (-1)^m appearing in some definitions of the spherical harmonics, compensating for its absence in the associated Legendre polynomial definition (weight 0.40, https://mathworld.wolfram.com/Condon-ShortleyPhase.html). Weak backing note: below 0.5, treat as definitional context. A mirror of the MathWorld entry states the same and notes that the harmonics are sometimes separated into real and imaginary parts, which is the step the block performs when it takes Re{Y_3^3} (weight 0.59, https://www.phenix.bnl.gov/WWW/publish/seto/quantum/sphericalharmics.pdf).

The convention is genuinely optional, which is exactly why it must be stated. SHTOOLS exposes the phase as a parameter, appending (-1)^m only when the caller selects it (weight 0.79, https://shtools.github.io/SHTOOLS/pyspharm_lm.html). The FHI-aims manual states that in quantum chemistry applications a Condon-Shortley phase can be added to the real spherical harmonics based on the developers' choice (weight 0.48, https://fhi-aims.org/uploads/manual/A10/index.html). Weak backing note: below 0.5. The rule the block draws is: K is convention-bound; if the consuming paper defines harmonics differently, K is the single substitution point, and the substitution must be named.

## Coordinate convention

The block uses the physics reading throughout: theta is the polar angle, phi the azimuth, and the harmonic arguments are (theta, phi). Standard references document that the meanings of theta and phi are swapped in some communities compared to the physics convention (weight 0.82, https://en.wikipedia.org/wiki/Spherical_coordinate_system). The paper should declare the convention once, because a silent swap flips the roles of the factors in Re{Y_3^3} = K sin^3(theta) cos(3 phi) and silently changes the polar behavior of the ripple.

## The non-substitution rules

The source artifact states five hard constraints, reproduced here as the block's contract with downstream readers:

1. MUST use phi = (1+sqrt(5))/2 for canonical Fibonacci indexing; no pi or psi variant without explicit renaming.
2. MUST use the Condon-Shortley normalization K = sqrt(245/(64 pi)) for Y_3^3; the phase must not be dropped silently.
3. MUST NOT swap Y_3^3 for another Y_l^m without re-deriving the closed-form real part; the sin^3(theta) cos(3 phi) factorization is Y_3^3-specific.
4. MUST NOT apply the block to non-orientable surfaces or manifolds with non-trivial topology; S^2 is hard-coded in the radial projection z / ||z||.
5. NEVER use the latitude-longitude grid as a silent drop-in replacement for Fibonacci sampling; the comparison between them is the ablation's content, not an equivalence.

Each rule exists because the artifact is a research note, not a canonical spec: the source doc marks its claims as PENDING until cross-checked, warns that Duck.ai-derived paraphrases need primary-source re-anchoring before being lifted into external materials, and flags roughly 3-week staleness risk for canonical docs. The rules keep the equations stable while that verification debt is outstanding.

## What a downstream implementer owes the block

An implementer adopting the block should, in order: state the coordinate convention; state the harmonic convention and K; pin the golden ratio by name; keep the ablation arms labeled per the sampling-vs-modulation split; and mirror any constant change into the companion prose-revision artifact before either artifact is lifted into the paper, since the two share the same node indexing and normalization by explicit sync obligation.
