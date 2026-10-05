# the Lean contract-layer replacement

Scope: what the section 15 Lean port actually proves for envharness (composition laws, the Blocked no-op theorem, the band test), and why kernel-checked status changes the claim's nature.

## What kernel-checked means here

A Lean proof is checked by a small trusted kernel, not by a reviewer's reading. Mathlib, the user-maintained library for the Lean theorem prover, contains both programming infrastructure and mathematics, plus tactics that let users develop proofs at a high level [1]. The Lean reference manual's validation section is explicit that validating a proof means checking it against the kernel, with additional steps available to rule out misleading proofs such as sorry-bearing or axiom-bearing statements [2]. Completed kernel-checked proof projects demonstrate the pattern at full scale: the egrs75-lean repository, for example, contains a complete kernel-checked Lean 4 / Mathlib proof of a number-theoretic claim, including the step another paper deferred verbatim [3]. This is the standard the audit holds the envharness port to.

## The three theorem families

The audit's section 15 (harness algebra, shipped with the audit) contains three families relevant to the contract layer:

1. **Composition laws.** `hcomp_id_left` and `hcomp_id_right` (for both the action and observation components, suffixed `_A` and `_O`) prove that the identity harness is neutral on both sides of composition. `hcomp_assoc_A/O` proves associativity. Together these are exactly the algebra needed to make "harnesses stack arbitrarily" true in the mathematical sense: any bracketing of a stack, and any omission of no-op layers, yields the same behavior.
2. **The Blocked invariant.** `blocked_is_noop` proves that a Blocked action leaves the environment unchanged for every transition function, and `passthrough_step` proves the pass-through case. The source code guarantees this for one hand-written branch of `harnesses/rules.py`; the theorem covers the universal quantifier. This is the audit's clearest example of a proof being strictly stronger than the code guarantee it formalizes.
3. **The band test.** `dz_band_iff` proves the DifficultyZone band-membership iff for the exact arithmetic form. The float score formula `max(0, 1 - |sr - c| / h)` stays deliberately measurement-side: the theorem proves the band algebra over exact values, and the float realization is a measurement concern, not a contract.

The underlying algebraic vocabulary (identity, associativity) is textbook monoid theory [4] (weight 0.287, weak backing on the background claim; the primary claims above rest on the audit and the Lean sources). Work on learning-infused formal reasoning highlights the complementary roles: semantic guidance from learned components with symbolic matching ensuring formal soundness [5] (weight 0.580), which parallels the audit's split of proof (section 15) from measurement (verify_claims.py).

## Why "YES, proved" is a different verdict than "tested"

The audit's component table marks these rows "YES, proved", and the distinction from a test suite is quantitative coverage: a test samples inputs, a theorem quantifies over all of them. For the Blocked invariant the difference is not academic. rules.py guarantees the no-op by constructing one code path; the theorem holds for every transition function, which is the difference between "our code does this" and "any stack built from these pieces does this". Ethereum's smart-contract documentation makes the same point for a higher-stakes domain: formal verification ensures the implementation adheres to a specification for the entire input space, rather than sampling bugs [6] (weight 0.899).

## What was deliberately left out

The section 15 port does not model `harnesses/setup.py` replay determinism or the checkpoint round-trip (both partial rows, covered in the follow-ups doc), and it does not touch code loading or bridges. The float formula inside `dz_band_iff`'s statement is exported to the measurement side on purpose: proofs on one side, seeded executable measurements on the other, the same boundary the program already enforces between CurvedCorpus.lean and verify_claims.py.

## Verdict

Tier 1 is complete per the audit: every algebraic law the README and docstrings assert is now a kernel-checked theorem. If envharness wanted its "harnesses stack arbitrarily" claim to be more than prose, the audit's answer is: this is what that looks like.

## Sources

1. https://github.com/leanprover-community/mathlib4 (weight 0.938)
2. https://lean-lang.org/doc/reference/latest/ValidatingProofs/ (weight 0.926)
3. https://github.com/lyfar/egrs75-lean (weight 0.752)
4. https://en.wikipedia.org/wiki/Monoid (weight 0.287, weak backing, labeled)
5. https://arxiv.org/pdf/2602.02881v1 (weight 0.580)
6. https://ethereum.org/developers/docs/smart-contracts/formal-verification (weight 0.899)

The theorem names, their contents, and the verdicts derive from the source audit of google-research/envharness at HEAD (2026-08-21) and its shipped section 15; repository identity confirmed at https://github.com/google-research/envharness (weight 0.848, collected in the 01 dig). An emergentmind topic page (0.102), a mirror repository (0.174), and a query-miss drug page (0.019) from the dig were not used.
