# 07 Constraints and invariants

Scope: the 7 hard rules of rsi-phi-skill, why each exists, and which external conventions they pin.

## The seven rules

The source doc (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/rsi-phi-skill/SKILL.md) lists 7 constraints, marked as silent-substitution-forbidden:

1. MUST use phi_golden = (1 + sqrt(5))/2 for canonical Fibonacci indexing. Do not substitute pi (the Vogel's spiral variant) or (1 + sqrt(5))/2 times pi (the Saff-Kuijlaars variant) without explicit renaming.
2. MUST use Condon-Shortley normalization K = sqrt(245/(64 pi)) for Y_3^3. Do not drop the phase; this is the standard dlmf.nist.gov convention.
3. MUST NOT swap Y_3^3 for another Y_l^m without re-deriving the closed-form real part. The sin^3 theta cos(3 phi) factorization is (l=3, m=3)-specific.
4. MUST NOT apply the Fibonacci sphere to non-orientable surfaces or manifolds with non-trivial topology; S2 is hard-coded in the projection Pi(z) = z / ||z||.
5. MUST test BOTH (l=128, m=256) and (l=256, m=128) orderings in the cycle's parameterization step. The gate is the higher PC1+PC2 of the two; the sparse-cell signal picks which order loses less information.
6. MUST use i = t (the Fibonacci index IS the parameter), not a separate lookup table; the closed forms make i -> (theta, phi) an O(1) operation.
7. NEVER use the latitude-longitude grid as a drop-in replacement for Fibonacci sampling in this skill; the cycle's gate specifically measures the Fibonacci-versus-lat-long discrepancy.

All 7 are source-doc claims.

## External grounding per rule

Rule 1 exists because the sphere-sampling literature genuinely uses competing constants. MathWorld's Vogel-spiral page writes the golden angle as alpha = pi (3 - sqrt(5)) for the sunflower-head model (https://mathworld.wolfram.com/VogelSpiral.html, weak, w=0.46), and Wikipedia's golden-angle article describes its role in phyllotaxis, separating florets on a sunflower (https://en.wikipedia.org/wiki/Golden_angle, weak, w=0.37). Same angle, different notation: the constraint forces the skill to name which one it means.

Rule 2 exists because the Condon-Shortley phase is a live convention split. The phase is the factor (-1)^m that some definitions include (https://mathworld.wolfram.com/Condon-ShortleyPhase.html, weak, w=0.31). SciPy's sph_harm includes the Condon-Shortley phase because it is part of lpmv (https://docs.scipy.org/doc/scipy-1.2.1/reference/generated/scipy.special.sph_harm.html, high, w=0.64), while pyshtools excludes it by default in its 4-pi-normalized real harmonics (https://shtools.github.io/SHTOOLS/real-spherical-harmonics.html, high, w=0.55). Associated Legendre polynomials, from which the phase enters, carry the same convention forks (https://handwiki.org/wiki/Physics:Associated_Legendre_polynomials, weak, w=0.28).

Rules 3 through 7 are internal invariants with no external source to cite: they pin the skill's own math (source doc). The dig found no literature that restates them, which is expected; they are engineering commitments, not established results.

## Why silent substitution is the failure mode

The phrase silent substitution is forbidden (source doc) points at the concrete failure: a downstream implementation swaps a constant or a grid and the pipeline still runs, but the coverage vectors change silently, the sparse-cell signal shifts, and the fixpoint verdict becomes wrong without any error. The two high-weight library sources above are the empirical proof that substitution happens innocently: the two most popular spherical-harmonic libraries disagree on the phase by default, so a port that trusts library defaults will violate rule 2 without noticing.

## Practical checklist

For anyone running a cycle (source doc, reformatted):

- Confirm phi_golden = (1 + sqrt(5))/2, not a spiral-form variant.
- Pin the SH convention before any numeric work; verify against SciPy or SHTOOLS defaults.
- Keep (l=3, m=3) unless the closed form is re-derived.
- Reject non-orientable corpora at intake.
- Run both (l=128, m=256) and (l=256, m=128) and report which passed.
- Index by i directly; no lookup tables.
- Never swap in a lat-long grid.
