# Gaunt coefficients and angular momentum selection rules

**Scope:** the integral of a product of three spherical harmonics (the Gaunt coefficient), its expression through Wigner 3-j symbols, and the exact selection rules (triangle, parity, and m-sum) that decide when such integrals vanish.

## The Gaunt coefficient

The Gaunt coefficient is the integral over the sphere of a product of three spherical harmonics. The Wigner 3-j symbol page states the identity in both directions: "The 3-jm symbols give the integral of the products of three spherical harmonics", with the integral of Y(l1,m1) Y(l2,m2) Y(l3,m3) over solid angle equal to sqrt((2l1+1)(2l2+1)(2l3+1) / 4pi) times the product of two 3-j symbols, one with all m set to zero and one carrying the m's; "These integrals are called Gaunt coefficients" ([Wikipedia, 3-j symbol, Relation to spherical harmonics; Gaunt coefficients](https://en.wikipedia.org/wiki/3-j_symbol), jev weight 0.415). Independent recent literature confirms the definition: "Gaunt coefficients, which are integrals of products of three spherical harmonics" ([arXiv:2401.10216, The Fourier basis via Gaunt tensor products](https://arxiv.org/pdf/2401.10216), jev weight 0.450).

The same integral structure extends beyond scalar harmonics: similar relations exist for integrals of spin-weighted spherical harmonics when the sum of the weights is zero, with the answer again a product of two 3-j symbols (Wikipedia, 3-j symbol, weight 0.415).

## The Wigner 3-j symbol

The 3-j symbols are "an alternative to Clebsch-Gordan coefficients for the purpose of adding angular momenta" (Wikipedia, 3-j symbol, weight 0.415). They are also known as 3j symbols or Wigner coefficients, and arise wherever three angular momenta are coupled ([MathWorld, Wigner 3j-Symbol](https://mathworld.wolfram.com/Wigner3j-Symbol.html), jev weight 0.412). Their algebra (recursion relations, summation identities for products of two 3-j symbols) remains an active topic; recent work develops general analytical results for double sums of products of two 3-j Wigner symbols within the theory of irreducible tensor operators ([arXiv:2504.11567, On summation of 3j-Wigner symbols](https://arxiv.org/pdf/2504.11567), jev weight 0.461).

## The selection rules

The Wigner 3-j symbol is zero unless all of the following conditions are satisfied (Wikipedia, 3-j symbol, weight 0.415):

1. Each m_i lies in the set from minus j_i to plus j_i in integer steps.
2. The m-sum rule: m1 + m2 + m3 = 0.
3. The triangle rule: |j1 - j2| <= j3 <= j1 + j2.
4. The parity rule: (j1 + j2 + j3) is an integer; moreover it must be an even integer if m1 = m2 = m3 = 0.

These are exact vanishing conditions, not approximations: a Gaunt integral violating any of them is identically zero. Because the Gaunt coefficient equals a product of 3-j symbols, the same four rules decide the vanishing of every triple-product-of-harmonics integral (Wikipedia, weight 0.415; MathWorld, weight 0.412).

The symbols also carry exact symmetry properties beyond vanishing: a 3-j symbol is invariant under even permutations of its columns, and an odd permutation multiplies it by the phase (-1)^(j1+j2+j3) (Wikipedia, 3-j symbol, weight 0.415).

## Why a selection rule is a conservation law in disguise

The selection-rule structure is the angular-momentum analogue of conservation constraints in other coupling problems. The m-sum rule states conservation of the projection quantum number; the triangle rule states the possible resultants of coupling two angular momenta; the parity rule states the behavior under inversion, tightened for the all-zero-m case that corresponds to rotationally invariant couplings (Wikipedia, 3-j symbol, weight 0.415). In physical scattering and decay problems these same symbols appear as the coupling coefficients, so the vanishing conditions act as exact selection rules on physical processes: a coupling channel forbidden by the triangle, parity, or m-sum rule carries identically zero amplitude, regardless of the strengths of the interactions involved (Wikipedia, weight 0.415; MathWorld, weight 0.412).

## Structural summary

The content that transfers to any framework importing angular structure:

1. The triple-harmonic integral has a closed form in terms of 3-j symbols, so all its vanishing and magnitude structure is symbolic, not numeric (Wikipedia, weight 0.415).
2. Vanishing is decided by three exact combinatorial rules (triangle, parity, m-sum) plus the m-range condition (Wikipedia, weight 0.415).
3. The rules count: for a fixed maximum angular momentum, the majority of nominal coupling channels are forbidden, and the allowed set is exactly enumerable by the triangle and parity conditions (Wikipedia, weight 0.415; MathWorld, weight 0.412).
4. Extension to spin-weighted harmonics keeps the same 3-j product structure with a second symbol carrying the weight indices (Wikipedia, weight 0.415).
