# Lean CI integration plan for wayfinder bounds

Scope: the scoped Lean 4 and CI integration plan for the wayfinder bounds, the printed-axiom and scope-manifest discipline it adopts, and the boundary that keeps the external Navier-Stokes PDE library out of the production dependency chain.

## The plan, concretely

The integration plan keeps the existing core Lean 4.33.0 lane and adds a new proof file `papers/data/lean/WayfinderBounds.lean` covering strict-threshold and finite ADD-count obligations. The CHANGE ledger identities are added only when their graph-correspondence assumptions are explicit. Arithmetic lemmas are not renamed after Navier-Stokes (internal research record; current core Lean at the pinned commit, https://github.com/yubi-OS/yubiOS/blob/67274066531ae5288bfc640a2030e5a20508b57e/papers/data/lean/CurvedCorpus.lean, and the lean-check workflow, https://github.com/yubi-OS/yubiOS/blob/67274066531ae5288bfc640a2030e5a20508b57e/.github/workflows/lean-check.yml).

The supplied `WayfinderBounds.lean` draft is not yet kernel-checked: Lean was unavailable locally, so the expected CI command is `lean papers/data/lean/WayfinderBounds.lean` on the existing pinned toolchain. Until that command passes, the draft has exactly the status of any unverified claim.

## Scope manifests and printed axioms

The plan adds a scope manifest linking each formal theorem to its exact runtime predicate, its allowed assumptions, its floating-point checks, and its scientific nonclaims, plus printed-axiom checks on every theorem. This follows the formalization and comparator discipline observed in the audited external repository without importing its PDE library.

The grounding for the axiom check is direct: the Lean reference manual documents `#print axioms` as the tool that reveals which axioms a theorem depends on, so an unstated dependency is always detectable (Lean 4 reference manual, Axioms chapter, https://lean-lang.org/doc/reference/latest/Axioms/, weight 0.91). Mathlib's own positioning as the shared, reviewed foundation for formal mathematics is what makes pinning to it defensible rather than ad hoc (https://lean-lang.org/use-cases/mathlib/, weight 0.92; mathlib4 repository, https://github.com/leanprover-community/mathlib4, weight 0.62). Active formalization research continues to publish through the cs.LO stream, so scope discipline in proof files is a living practice, not a one-time setup (https://arxiv.org/list/cs.LO/new, weight 0.58). Weaker secondary sources describe axiom audits in deployed theorem-proving pipelines but carry less weight here (https://deepwiki.com/openai/cdc-lean/6.1-audited-theorems-and-critical-checkpoints, weak, weight 0.39; https://deepwiki.com/openai/cdc-lean/6-axiom-audit-and-formal-verification-record, weak, weight 0.33; a dependency-checking issue thread, https://github.com/certik/math_notes/issues/29, weak, weight 0.14).

## Preserving the negative gates

The plan preserves `CurvedCorpus.lean` and all recorded-negative numerical gates. The small proof file and the replay and exhaustive tests are added as extra CI steps; thresholds are never lowered and negative results are never replaced to obtain green CI. This is the cheapest possible guard against a formal verification lane quietly becoming theater.

## What stays out

Building the external Navier-Stokes project requires a separate Lean 4.34/mathlib workflow. That is an independently scoped mathematical audit, not a prerequisite for the map fixes. The production dependency chain gains only the bounds file, the diagnostic helpers, and the tests.

## CI step list

1. Keep the existing Lean 4.33.0 lane unchanged.
2. Add `WayfinderBounds.lean` and the kernel-check command for it.
3. Add the scope manifest with printed-axiom checks.
4. Add the replay and exhaustive graph tests as separate steps.
5. Keep all existing thresholds and negative gates intact.

## Sources considered

| source | weight |
|---|---|
| https://github.com/yubi-OS/yubiOS/blob/67274066531ae5288bfc640a2030e5a20508b57e/papers/data/lean/CurvedCorpus.lean (internal research record) | record |
| https://lean-lang.org/use-cases/mathlib/ | 0.92 |
| https://lean-lang.org/doc/reference/latest/Axioms/ | 0.91 |
| https://github.com/leanprover-community/mathlib4 | 0.62 |
| https://arxiv.org/list/cs.LO/new | 0.58 |
| https://deepwiki.com/openai/cdc-lean/6.1-audited-theorems-and-critical-checkpoints | 0.39 (weak) |
| https://deepwiki.com/openai/cdc-lean/6-axiom-audit-and-formal-verification-record | 0.33 (weak) |
| https://github.com/yamafaktory/formal | 0.25 (weak) |
| https://deepwiki.com/leanprover-community/mathlib4 | 0.19 (weak) |
| https://dev.to/iroha1203/taming-a-40-minute-lean-ci-three-rounds-three-wrong-suspicions | 0.16 (weak) |
| https://github.com/certik/math_notes/issues/29 | 0.14 (weak) |
| https://en.m.wikipedia.org/wiki/Lean_(drug) | 0.02 (weak, off-topic) |
