# Verified identities versus floating point measurement

**Scope:** Lean theorem proving and exact arithmetic: what verified identities certify versus what floating point measurements measure. The map's certificate system splits every check into the identity class (shadowing a Lean theorem) and the measurement class (a number that may honestly fail); this doc grounds the split.

## Design context

The map's mathematical core has two halves. One half is a Lean file whose theorems prove identities over exact arithmetic: monotonicity of atom deltas, telescope sums, trade margin preservation, Metropolis detailed balance, spectral dominance. The runtime module shadows each theorem with a floating point check that must pass. The other half is measurement: null statistics, variance ratios, convergence indicators, none of which any theorem certifies. The design rule is strict separation: a red identity certificate halts the map as a code defect; a red measurement certificate is a finding. This doc grounds both halves in the published tools.

## What Lean proves

Lean 4 is a dependent type theory implementation and proof assistant whose mathematics library, mathlib, formalizes a large body of standard mathematics. "Theorem Proving in Lean 4", the canonical tutorial maintained at leanprover.github.io, documents the system's logic, its definition and theorem syntax, and its tactic-based proving style [https://leanprover.github.io/theorem_proving_in_lean4/, weight 0.92]. The mathlib4 repository, the community's library of formalized mathematics for Lean 4, hosts the theorems a numeric identity proof would draw on (monotonicity, sums, exponential identities) [https://github.com/leanprover-community/mathlib4, weight 0.46, weak backing].

A theorem in Lean is a proof checked by the kernel against exact semantics: a statement about integers, rationals, or reals as mathematical objects. When the Lean file proves that a sum of nonneg terms is nonneg, that statement is unconditionally true of the exact model. It is not a statement about any program that computes the same quantity in floating point.

The design's identity certificates mirror Lean theorem names verbatim (for example `atom_delta_nonneg`, `trade_preserves_rowSum`, `cumulative_monotone`) and pair each with a runtime float check. The pairing is honest only because the two are labeled differently: the theorem is proved, the check is run. A check that fails means the floating point implementation diverged from the exact model, which is a code defect in the implementation, not an exception to the theorem.

## What floating point measures

Goldberg's classic paper "What Every Computer Scientist Should Know About Floating-Point Arithmetic" is the standard reference on floating point semantics: IEEE 754 floating point represents real numbers approximately, every arithmetic operation carries rounding error bounded by the unit roundoff, and error compounds through algorithms in ways that depend on operation order [https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html, weight 0.92]. Berkeley's CS267 lecture on floating point arithmetic and error analysis works through the consequences: seemingly equivalent reformulations of the same mathematical expression can have wildly different numerical error, and naive algorithms (for example, naive summation of many terms) accumulate error that compensated or restructured algorithms avoid [https://people.eecs.berkeley.edu/~demmel/cs267/lecture21/lecture21.html, weight 0.78].

Wikipedia's floating-point error mitigation article surveys the standard countermeasures: compensated (Kahan) summation, ordering reductions by magnitude, interval arithmetic, and arbitrary-precision fallbacks, each buying accuracy at cost [https://en.wikipedia.org/wiki/Floating-point_error_mitigation, weight 0.73]. The generic floating-point arithmetic article covers representation and rounding basics but weighted low (0.22) in the dig [https://en.wikipedia.org/wiki/Floating-point_arithmetic, weight 0.22, weak backing].

For the map, the practical consequence is which quantities can be computed exactly in floating point and which cannot. Integer sums of bits, counts, binomial coefficients below overflow, and differences of small integers are exact in IEEE double arithmetic: they are identities re-derived, and their checks belong in the identity class. Means, PCA eigenvectors, slerp trigonometry, and variance ratios involve transcendental functions and accumulated rounding: they are measurements, and their checks belong in the measurement class. The design's certificate schema makes this split explicit with a `class` field on every certificate.

## Why the split is enforced, not decorative

The failure mode the split guards against is a numeric pipeline whose every check is green while the underlying model drifts from the proved one. The design states the reason in its own terms: a map whose every certificate is an identity would be theater, because identity certificates cannot honestly fail; and a map with only measurement certificates would have no floor, because nothing in it would be anchored to a proved fact. The two-class table is the artifact that keeps both anchored and honest: identity class must be 100 percent green or the map halts before persisting; measurement class reports red as findings.

This also answers the deployment question the design raises (whether the Worker needs identity certificates or only the browser): the design keeps both everywhere, because a red identity certificate in production is exactly the float-versus-exact signal that no theorem can prove away; it can only be detected at runtime [https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html, weight 0.92].

## What the split asserts

1. Lean theorems certify properties of an exact model, and their runtime shadows must be labeled checks, not proofs [https://leanprover.github.io/theorem_proving_in_lean4/, weight 0.92].
2. Floating point carries unavoidable rounding error with operation-order-dependent accumulation, so numeric recomputation of a proved quantity is a check that can fail [https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html, weight 0.92].
3. Quantities exact in IEEE double (integer counts, sums, binomials within range) admit identity-class checks; quantities involving eigensolvers and transcendental functions admit only measurement-class checks [https://people.eecs.berkeley.edu/~demmel/cs267/lecture21/lecture21.html, weight 0.78].

## Sources considered

| Source | Weight |
|---|---|
| Theorem Proving in Lean 4 | 0.92 |
| What Every Computer Scientist Should Know About Floating-Point Arithmetic, Goldberg (Oracle) | 0.92 |
| Floating point and error analysis, Berkeley CS267 (Demmel) | 0.78 |
| Floating-point error mitigation, Wikipedia | 0.73 |
| mathlib4 repository, GitHub | 0.46 |
| Lean 4 overview, octagono | 0.42 |
| John D. Cook Lean notes | 0.26 |
| Floating-point arithmetic, Wikipedia | 0.22 |
| Numerical stability notes, deepwiki mirror | 0.13 |
| Lean (drug), Wikipedia (off topic) | 0.02 |
| FLOATING (dictionary, off topic) | 0.90 |
