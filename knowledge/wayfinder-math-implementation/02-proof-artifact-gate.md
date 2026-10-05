# 02 Proof artifact gate

Scope: the scope manifest mapping theorem statements to runtime predicates, the checker that parses the kernel's printed axiom sets, and how CI gates the proof commit.

## Why a gate is needed

A merged Lean file proves nothing by its presence. What proves something is the kernel accepting the theorem in an environment whose axioms are known and acceptable. Lean's `#print axioms` command prints the set of axioms used by a theorem and the theorems it depends on, which is the mechanism projects use to audit what a statement really rests on (source: https://lean-lang.org/doc/reference/latest/ValidatingProofs/, jev weight 0.90). If a proof silently depends on an unintended axiom, or on a placeholder, the statement is weaker than it looks.

The canonical failure is `sorry`. A Lean proof finished with `sorry` typechecks but depends on the `sorryAx` axiom, so removing the `sorry` keyword alone does not make the development complete (source: https://zenn.dev/matsuteru/articles/lean4-sorry-axiom-dependencies?locale=en, jev weight 0.15, weak backing). Discipline guides for Lean codebases therefore pair a `sorry` ban with axiom auditing and CI gating on the printed axiom set (source: https://www.proofspath.com/sorry-free-discipline-and-axiom-auditing, jev weight 0.41, weak backing).

## The yubiOS checker

The wayfinder integration adds a separate scope manifest that maps each theorem statement to the runtime predicate it is supposed to back (source doc: kernel-checked statements section, primary project artifact). This closes the gap between "there is a theorem with this name" and "this runtime check is actually the thing the theorem proves". A manifest entry is a claim of correspondence; without it, a renamed or restated theorem could keep a stale runtime predicate looking certified.

The checker itself parses the kernel's printed axiom sets and applies three rejections: missing declarations, unknown axioms, and proof placeholders. It is also explicit about a subtle parsing hazard: it does not confuse comment text with theorem dependencies, so a comment mentioning `sorry` cannot trip the gate and a commented-out axiom cannot be counted as a real dependency (source doc: checker description, primary project artifact).

Three rejection classes, and what each defends against:

| Rejection | What it defends against |
|---|---|
| Missing declarations | A runtime predicate points at a theorem that no longer exists |
| Unknown axioms | A proof grew a dependency the gate never approved |
| Proof placeholders | A `sorry`-class placeholder slipped into a shipped statement |

## CI enforcement

The proof commit `c25ac928689b322ebcf98e399d5f2f21e8710021` passed [Lean CI run 34567362278](https://github.com/yubi-OS/yubiOS/actions/runs/34567362278), including the original measurement and recorded-negative gates (source doc: CI record, primary project artifact). Gating on CI rather than on a local run matters because a build pipeline is the only place where every contributor's change is checked under the same environment. Evidence-driven CI protocols make exactly this move: every accepted change carries machine-checkable evidence rather than a human assertion (source: https://arxiv.org/html/2605.21089v1, jev weight 0.74).

## What the gate does not do

The gate is deliberately narrow. It certifies that the eleven theorems exist, are kernel-checked, and depend only on approved axioms, and that the scope manifest points each one at a real runtime predicate. It does not certify that the runtime predicates are correct implementations, that floating point paths are bounded, or that a change is good. Artifact checks are not proofs of behavior: a related project states the point bluntly as "artifact does not equal proof" (source: https://github.com/unit27research/artifact-manifest, jev weight 0.62).

This narrowness is the point. The gate turns one specific question into a hard, machine-checkable answer, and leaves every other question to the test suites, the runtime diagnostics and the adversarial review described in document 08. When an instrument claims proved mathematics, the claim should be exactly as wide as what the kernel accepted, and no wider.
