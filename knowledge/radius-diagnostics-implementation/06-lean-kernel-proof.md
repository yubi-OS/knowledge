# 06: Kernel obligations: the Lean radius bounds

Scope: the proof obligations behind a radius instrument: RadiusBounds.lean compiled on core Lean 4.33.0, the 18 declarations covering complementarity, antitonicity, count bounds, perturbation bands and integer clipped bounds, the printed-axiom checker over radius-scope.json, and CI-gated proof verification.

## Why a radius instrument carries a proof kernel

A diagnostic that counts isolations and reports transition intervals makes mathematical claims: counts are consistent across complementary tests, counts change monotonically with radius, clipped integrals are bounded. If those claims back the reported intervals, they deserve machine-checked proof rather than prose. The kernel obligations are that layer of proof.

## Lean 4 as the proof substrate

The motivating implementation compiles its bounds on core Lean 4.33.0. Lean 4 is an interactive theorem prover and functional programming language; its architecture, type system and metaprogramming layer are surveyed in depth in the recent literature (source: https://arxiv.org/pdf/2501.18639 , jev weight 0.92). The canonical tutorial text pins the version convention explicitly, assuming Lean 4.33.0 in its current edition (source: https://leanprover.github.io/theorem_proving_in_lean4/ , jev weight 0.93), and documents how mathematical assertions and proofs are written in the language (source: https://lean-lang.org/theorem_proving_in_lean4/Propositions-and-Proofs/ , jev weight 0.79). Proof theory, the field the prover mechanizes, analyzes proofs as mathematical objects in their own right (source: https://plato.stanford.edu/entries/proof-theory , jev weight 0.82).

The significance of "core Lean 4.33.0" is dependency discipline: the kernel compiles against the prover itself, not against a shifting library surface, so the proof's validity is pinned to a specific compiler version.

## The 18 declarations

The motivating implementation's RadiusBounds.lean carries 18 declarations grouped into six families (project record: https://github.com/yubi-OS/yubiOS/pull/233 ):

1. Strict-edge and isolated complementarity: the strict edge test d<r and the isolated classification are complementary, so no item is counted in both sides and none is missed.
2. Equality at a threshold: the case where a clearance equals the radius exactly is pinned, which is the tie case doc 01 discusses.
3. Radius antitonicity: the isolation count is antitone (non-increasing) in the radius. Raising the threshold can only remove items from the isolated set, never add them.
4. Count bounds: the count is bounded below by 0 and above by the item population N.
5. Conditional perturbation bands: given caller-supplied displacement or error bounds, the count's possible drift under bounded coordinate perturbation is bounded. These are conditional results: they hold only under the stated bounds, matching the diagnostic's refusal to guess bounds (doc 05).
6. Integer clipped-length and area bounds: bounds for the clipped integral quantities of doc 02, phrased over integers so they survive exact reasoning.

The general shape, a proof-status document tracking verified properties like monotonicity and bounded amounts with per-property verification records, is an established discipline in formal-verification projects (source: https://github.com/scashsol/Solster/blob/master/FORMAL_VERIFICATION_STATUS.md , jev weight 0.72).

## What the kernel does not claim

The boundary between proved and not-proved is explicit in the motivating record:

1. Continuous clipped integrals over reals remain a runtime or modeling obligation; the kernel proves integer-phrased bounds, not the floating-point computation itself.
2. Float64 chord distances are runtime facts; the kernel does not verify the IEEE 754 computation (doc 04).
3. Genuine displacement and error bounds, nearest-neighbour construction, and scientific admission decisions remain obligations outside the kernel.
4. No GL, vortex or phase theorem is claimed. The kernel proves properties of the radius instrument, not physics.

This boundary discipline matters because an over-claimed proof is worse than no proof: it converts a diagnostic into a false certificate.

## The printed-axiom checker and permitted assumptions

A Lean development can state axioms, assumptions taken without proof. A kernel that quietly relies on a strong axiom (for example, an axiom about floating-point correctness) would lend its theorems a strength they lack. The motivating implementation therefore runs a printed-axiom checker against a separate radius-scope.json: the checker prints the axioms the kernel actually depends on and compares them against a permitted list, and permitted kernel assumptions were retained while anything outside the list would fail the check (project record: https://github.com/yubi-OS/yubiOS/pull/233 ).

This is the standard trust-in-axioms discipline: state what is assumed, minimize it, and make the current assumption set a checked artifact rather than folklore.

## CI gating

The proof-only branch commit 715b92346b446f634cd43d57687329fe8c848add passed CI run 34797739861 in all three jobs, and after merge the integrated branch CI run 34799688203 and merge CI run 34799911896 passed all jobs (project record: https://github.com/yubi-OS/yubiOS/pull/233 ). The point of CI-gating proofs is that a proof that no longer compiles is not a proof; gating compilation of RadiusBounds.lean on core Lean 4.33.0 makes kernel drift detectable at every push rather than at the next human audit.

## Summary

1. Radius instruments that report counts, monotonicity and clipped integrals deserve machine-checked statements of exactly those properties.
2. RadiusBounds.lean on core Lean 4.33.0 provides 18 declarations across complementarity, threshold equality, antitonicity, count bounds, conditional perturbation bands, and integer clipped bounds.
3. The kernel deliberately does not claim float computation, continuous integrals, or physical theorems; those stay runtime obligations.
4. A printed-axiom checker over radius-scope.json keeps the assumption set explicit and checked, and CI runs gate the kernel's compilation on every push.

Project record: the motivating implementation's kernel obligations and CI receipts are recorded at https://github.com/yubi-OS/yubiOS/pull/233 .
