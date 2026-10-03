# 06. Lean 4 / mathlib formalization path for linear viscoelasticity

**Scope:** what Mathlib actually contains today for formalizing the linear-viscoelasticity superposition machinery (convolution integral, relaxation modulus in the convolution algebra, ODE-to-algebra passage, Prony series, Duhamel forms), what is missing, and the 4 definition/theorem candidates that would close the gap. All mathlib claims below were verified directly against the mathlib4 repository API and generated docs on 2026-10-03; anything not checkable is marked UNVERIFIED.

## What mathlib has (verified)

| Component | Status | Evidence | jev weight |
|---|---|---|---|
| Convolution integral | PRESENT | `Mathlib/Analysis/Convolution.lean` (Floris van Doorn, 2022). 73 declarations scanned: `ConvolutionExistsAt`, `ConvolutionExists`, `noncomputable def convolution`, `convolution_def`, `convolution_mul`, `convolution_smul`, `convolution_symm`, `convolution_flip`, `support_convolution_subset`, L2/Lp existence (`ConvolutionExists.of_memLp_memLp`, `enorm_convolution_le`), continuity with parameters (`continuousOn_convolution_right_with_param`, `HasCompactSupport.continuous_convolution_right`). | 0.94 (file), 0.95 (docs) |
| ODE existence + uniqueness | PRESENT | `Mathlib/Analysis/ODE/` contains `Basic.lean`, `DiscreteGronwall.lean`, `ExistUnique.lean`, `Gronwall.lean`, `PicardLindelof.lean`, `Transform.lean`. `ExistUnique.lean` has the `ODE_solution_unique` family; `PicardLindelof.lean` has `exists_eq_forall_mem_Icc_eq_picard` (Picard-Lindelöf). | 0.94 (docs), 0.92 (dir) |
| Matrix exponential (for linear constant-coefficient ODEs) | PRESENT | `Mathlib/Analysis/Normed/Algebra/MatrixExponential.lean` exists (GitHub code search hit for `Matrix.exp`, verified 2026-10-03). | UNVERIFIED declaration detail; file existence verified |
| Exponential function | PRESENT | `Mathlib/Analysis/SpecialFunctions/Exp.lean` plus the `Real.exp` / `Complex.exp` API used throughout. | 0.95 |
| Mellin transform | PRESENT (wrong tool) | `Mathlib/Analysis/MellinTransform.lean` declares `MellinConvergent`, `mellin`, `mellinInv`, `mellin_comp_rpow`, and `MellinInversion.lean` gives inversion. Built for number theory (vertical-strip integrals), not for one-sided time-domain transforms. | 0.94 (docs), 0.94 (file) |

## What is missing (verified absences)

| Component | Status | Evidence | jev weight |
|---|---|---|---|
| Laplace transform | ABSENT | No `Mathlib/MeasureTheory/Function/LaplaceTransform.lean` (HTTP 404). GitHub code search for `LaplaceTransform` in mathlib4: 0 results. Search for `laplace`: only incidental comment mentions (`Analysis/Calculus/AbsolutelyMonotone.lean`, `Analysis/Distribution/DerivNotation.lean`, 2 matrix files, docs metadata). | 0.48 (the search-absence row itself scored low confidence; absence claim is directly verified) |
| Volterra convolution theory (convolution identity, inverse, Titchmarsh) | ABSENT | Code search `volterra`: 0 results. `titchmarsh`: only `docs/1000.yaml` (theorem-list metadata, no Lean code). The 73 declarations of `Convolution.lean` contain no convolution identity, no associativity, no Young inequality, no inverse. | 0.94 (method: file scan) |
| Duhamel principle (named) | ABSENT | Code search `duhamel`: only `docs/undergrad.yaml` metadata mention, no declaration. | 0.94 |
| Prony series | ABSENT | Code search `prony`: 0 results. | 0.94 |

## Formalization plan

**1. Superposition as a mathlib convolution.** Define the Boltzmann superposition operator as a convolution over the half-line: sigma(t) = E(0)*eps(t) + integral of E'(tau)*eps(t-tau) d tau on [0,t], built on `noncomputable def convolution` with an interval (`Set.Iic`) measure. Theorem candidate T1: `ConvolutionExistsAt` for eps continuous and E' locally integrable, via the `BddAbove.convolutionExistsAt` / `of_norm` routes already in `Convolution.lean`. This is the cheapest candidate: it needs only gluing, no new analysis.

**2. Convolution inverse relation.** The pairing integral Erel(t-xi) Ccrp(xi) d xi = t (relaxation modulus and creep compliance as convolution inverses on the causal cone) is NOT formalizable from existing mathlib. A Volterra inverse theorem (E * D = 1 implies mutual invertibility under continuity plus a growth hypothesis) would be the new content; Titchmarsh's theorem, the standard uniqueness tool, is absent from mathlib. Theorem candidate T2: for the restricted exponential family (candidate 4), prove the inverse relation directly by computing interval integrals of exponentials, bypassing general Volterra theory. Honest size estimate: a general Volterra-inverse development is a multi-month mathlib contribution; the exponential-family special case is weeks.

**3. ODE-to-algebra passage without Laplace.** The classical route (constitutive ODE k*eps' = sigma' + sigma/tau becoming multiplication by 1/(1+s*tau) in the Laplace domain) cannot be mirrored in Lean today because the Laplace transform does not exist in mathlib. The viable substitute is time-domain: solve the constitutive ODE with `MatrixExponential` and pin uniqueness with `ODE_solution_unique` / `exists_eq_forall_mem_Icc_eq_picard`. Theorem candidate T3: the ODE solution operator equals the exponential-kernel convolution operator of candidate 1 for each Maxwell/SLS element, so the "algebraic" manipulation is recovered as convolution algebra (which mathlib does support: `convolution_mul`, `convolution_symm`) rather than transform algebra.

**4. Prony series.** Erel(t) = ke + sum kj exp(-t/tau_j) is immediately definable with `Real.exp` and finite sums. Theorem candidate T4: the exponential family is closed under the half-line convolution (convolution of two exponential sums is an exponential sum with shifted rates), proved by elementary interval-integral identities, plus identifiability: distinct Prony parameter sets give distinct moduli (this is where a Titchmarsh substitute would be needed for the general case).

## Sources considered

| # | Source | Type | jev noul |
|---|---|---|---|
| 0 | https://github.com/leanprover-community/mathlib4 (repo meta: 4216 stars, pushed 2026-10-03) | primary | 0.96 |
| 1 | https://leanprover-community.github.io/mathlib4_docs/Mathlib/Analysis/Convolution.html | primary docs | 0.95 |
| 2 | https://github.com/leanprover-community/mathlib4/blob/master/Mathlib/Analysis/Convolution.lean | primary code | 0.94 |
| 3 | https://leanprover-community.github.io/mathlib4_docs/Mathlib/Analysis/ODE/PicardLindelof.html | primary docs | 0.94 |
| 4 | https://github.com/leanprover-community/mathlib4/tree/master/Mathlib/Analysis/ODE | primary code | 0.92 |
| 5 | https://leanprover-community.github.io/mathlib4_docs/Mathlib/Analysis/MellinTransform.html | primary docs | 0.94 |
| 6 | https://github.com/leanprover-community/mathlib4/blob/master/Mathlib/Analysis/MellinTransform.lean | primary code | 0.94 |
| 7 | https://leanprover-community.github.io/mathlib4_docs/Mathlib/Analysis/SpecialFunctions/Exp.html | primary docs | 0.95 |
| 8 | https://github.com/search?q=repo%3Aleanprover-community%2Fmathlib4+LaplaceTransform&type=code (0 results, absence evidence) | verification probe | 0.48 |

jev weighting: 1 successful batched call, task_id `ta49eff4-cc82-46df-bb3b-07e56db6723f`, cost $0.00013104, model typesafe/jev-1.13-20260917. Note: the searXNG dig layer was down during this run (HTTP 500 on both queries, 6 attempts with 30s backoff), so no web-aggregator sources were considered; every claim above rests on direct primary-source verification, which is the stronger evidence path for this doc anyway.
