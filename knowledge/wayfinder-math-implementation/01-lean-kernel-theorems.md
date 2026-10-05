# 01 Lean kernel theorems

Scope: the eleven kernel-checked theorems in `papers/data/lean/WayfinderBounds.lean` on Lean 4.33.0, what they certify as exact integer statements, and the explicit non-certifications.

## The trusted kernel

A Lean 4 proof is checked by a small trusted core called the kernel, an implementation of Lean's logic in software that re-derives every proof term it is handed (source: https://ammkrn.github.io/type_checking_in_lean4/whats_a_kernel.html, jev weight 0.63). Axioms are postulated constants, and the kernel accepts a declaration only when its type and term check against the existing environment (source: https://lean-lang.org/doc/reference/latest/Axioms/, jev weight 0.83). This matters for a production instrument: once the kernel accepts a theorem, its truth no longer depends on the tactics that produced it, only on the kernel and whatever axioms the theorem actually uses (source: https://lean-lang.org/theorem_proving_in_lean4/, jev weight 0.93, which targets Lean 4.33.0 exactly).

## The eleven statements

`papers/data/lean/WayfinderBounds.lean` now carries eleven checked theorems on core Lean 4.33.0 (source doc: papers/data/lean/WayfinderBounds.lean, primary project artifact):

1. `stable_on`
2. `stable_off`
3. `crossing_on_iff`
4. `crossing_off_iff`
5. `old_vertex_after_add`
6. `after_old_count`
7. `add_isolation_delta`
8. `chg_hit_eval`
9. `change_neighbour_ledger`
10. `change_isolation_delta`
11. `change_neutral`

They divide into three families. The `stable_*` and `crossing_*` group characterizes when a placement stays put and when a crossing occurs, stated as biconditionals in the crossing cases. The `old_vertex_after_add`, `after_old_count` and `add_isolation_delta` group pins down what an ADD operation does to the existing vertex set, the count computed before the addition, and the exact isolation delta of one ADD. The `chg_*` group does the same for one CHANGE: `chg_hit_eval` evaluates the hit condition, `change_neighbour_ledger` names the neighbour ledger, `change_isolation_delta` gives the exact delta, and `change_neutral` states when the change leaves isolation untouched.

The proof commit `c25ac928689b322ebcf98e399d5f2f21e8710021` passed [Lean CI run 34567362278](https://github.com/yubi-OS/yubiOS/actions/runs/34567362278), including the original measurement and recorded-negative gates (source doc: CI run record, primary project artifact).

## What is certified, and what is not

These are exact integer and count statements about the combinatorics of the placement: degrees, neighbourhoods, isolation counts. They are not floating point claims. The source material is explicit that three things remain separate runtime obligations: floating point error bounds, adjacency construction, and source-to-row correspondence (source doc: verification boundary section, primary project artifact).

The reason this separation matters is standard numerical practice. Round-off error arises from the difference between real numbers and their finite precision representations, and rigorous tools exist to bound it but must be applied deliberately (source: https://shemesh.larc.nasa.gov/fm/papers/FM2024-draft.pdf, jev weight 0.83). A kernel theorem about integer deltas says nothing about whether the computed deltas in floating point match the exact ones without such a bound.

None of the theorems certifies semantic edit quality or forecasting accuracy. A proof can show that the isolation delta of a change is computed exactly and still say nothing about whether the change is a good edit. That division of labor is the central design decision of the whole integration: mathematics guarantees the bookkeeping, and only separate evaluation can speak to quality (source doc: kernel-checked statements section, primary project artifact).

## Why integer statements first

Choosing integer and count statements as the certified layer is deliberate. Exact statements survive the gap between mathematical model and running code far better than continuous ones, because there is no representation error to argue about: a degree is 3 or it is not. External checkers exist that re-verify Lean's kernel itself, which shows the trust base is small and inspectable rather than a whole toolchain (source: https://github.com/digama0/lean4lean, jev weight 0.80; see also https://arxiv.org/pdf/2403.14064, jev weight 0.87).

The practical consequence for the wayfinder instrument is a fixed division: the Lean file owns the exact statements, the runtime owns the floating point, the hashing and the storage, and every boundary between the two is tested rather than assumed. The next document describes the gate that keeps those runtime obligations visible instead of quietly relabeling them as proved.
