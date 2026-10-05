# 03 Signed margins and roundoff bounds

Scope: `PM.projectionMargins` signed threshold clearance, the `needs-roundoff-bound` and `undetermined` states, caller-supplied unverified bounds, and why a displayed stable state is never labeled a certified numerical proof.

## What the margins report

`PM.projectionMargins` reports signed threshold clearance and axis norms. The public result shares axis metadata once and records per-input margins, so the shared structure is sent a single time and each input carries only its own numbers (source doc: signed margins section, primary project artifact).

A signed clearance answers a sharper question than an unsigned one: not just "how far from the threshold" but "on which side, and by how much". For a placement instrument deciding whether a point sits stably on one side of a projection threshold, the sign is the decision, and the magnitude is the fragility.

## Three honest states

Without roundoff assumptions the result is `needs-roundoff-bound`. Near-threshold cases are `undetermined`. This is the design decision that separates this diagnostic from a naive confidence number. In finite precision arithmetic, round-off error arises from the difference between real numbers and their finite precision representations, and bounding it requires deliberate analysis, not an afterthought (source: https://shemesh.larc.nasa.gov/fm/papers/FM2024-draft.pdf, jev weight 0.83). Classical LAPACK documentation devotes a full supplementary chapter to extending error bounds correctly, including underflow cases, because bounds given without care are wrong rather than conservative (source: https://netlib.org/lapack/lug/node74.html, jev weight 0.77). Threshold phenomena are among the worst behaved: the overflow threshold and the smallest exponent regime change what computations mean entirely (source: https://people.eecs.berkeley.edu/~demmel/cs267/lecture21/lecture21.html, jev weight 0.81).

So the API refuses to speak when it cannot back itself:

| State | Meaning |
|---|---|
| Signed margin | Clearance computed, sign meaningful |
| `needs-roundoff-bound` | No roundoff assumption supplied, so no stability claim is issued |
| `undetermined` | Input sits too near the threshold for any decision |

## Caller-supplied bounds

Two optional inputs let a caller convert the first state into a decision: a positive `roundoff_budget` and a nonnegative `perturbation_linf`. Both are caller-supplied and unverified. The runtime accepts them, applies them, and does not certify them (source doc: signed margins section, primary project artifact).

This is the right division of trust. A roundoff budget is a claim about the arithmetic environment and the input magnitudes; the caller who knows the environment is the party who can honestly assert it. If the caller asserts a budget that is wrong, the instrument's honesty is preserved: the budget was labeled as an assumption, never as a fact. Rigorous round-off analysis tools make the same demand in stronger form: they must be applied with the actual computation in view, and their output is a bound on a stated computation, not a general blessing (source: https://shemesh.larc.nasa.gov/fm/papers/FM2024-draft.pdf, jev weight 0.83).

## Conditional display, not certified proof

A displayed stable state remains conditional and is never labeled a certified numerical proof. The label chain is explicit: the margin is a measurement, the measurement becomes a stability claim only under a supplied budget, and the stability claim stays conditional on that budget holding (source doc: signed margins section, primary project artifact).

This is a provenance discipline. Calculation tools that collapse "here is a result" into "here is a verified result" without recording which assumptions were supplied invite exactly the silent failure the wayfinder design tries to prevent (source: https://dev.to/buchinskiievg/six-provenance-classes-and-why-your-calculation-tool-needs-th, jev weight 0.16, weak backing).

The contract also interacts with the preview endpoint described in document 06: a preview returns 9 target margin axes for the candidate, and the same conditional labeling applies there. Margins are diagnostics for a human deciding whether to apply an edit; they are not the instrument authorizing the edit on the human's behalf.

## The boundary with the Lean layer

The kernel theorems in document 01 are exact statements about integer deltas. The margins live entirely on the floating point side. The two layers never blur: nothing in `WayfinderBounds.lean` certifies a margin, and no margin output claims kernel backing. When the margin says `needs-roundoff-bound`, that is the runtime telling the truth about where the exact layer ends and the numerical layer begins (source doc: kernel-checked statements section, primary project artifact).
