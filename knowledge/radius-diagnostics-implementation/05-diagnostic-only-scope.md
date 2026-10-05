# 05: Diagnostic-only scope: what the instrument refuses to do

Scope: the deliberate limits of a radius diagnostic: no new field, no ranking, no keep/delete rule, no forecast claim; intervals relative to computed distances only; fail-closed handling of missing or invalid bounds; and rejection of radius or grid overrides.

## Diagnostics versus decisions

The single most important design line in a radius instrument is the line between observing and deciding. A diagnostic reports what the corpus looks like at and around a threshold; it does not act on the corpus. The motivating implementation draws this line explicitly: no new physical field, no ranking score, no automatic keep/delete rule, and no claimed forecasting improvement is introduced; the operative radius stays 0.095 and the core stays byte-identical (project record: https://github.com/yubi-OS/yubiOS/pull/233 ).

The distinction is not cosmetic. Measurement science treats monitoring and diagnostics as their own discipline with its own verification and validation obligations, separate from the production function being monitored (source: https://www.nist.gov/programs-projects/monitoring-diagnostics-and-prognostics-manufacturing-operations , jev weight 0.62). Instrument-grade diagnostic design likewise separates the diagnostic pathway from the primary function so that the diagnostic cannot perturb it (source: https://www.mdpi.com/2227-9717/9/6/975 , jev weight 0.76; source: https://www.mdpi.com/2227-9717/11/2/403 , jev weight 0.70). A radius count that could silently influence ranking would be a scoring feature wearing a diagnostic costume; the discipline here is refusing that costume.

## Intervals relative to computed distances

The transition intervals of doc 03 are intervals relative to computed distances. This is a three-way disclaimer, and each arm matters:

1. They are not statistical confidence intervals. No distribution is assumed, no sample is being generalized from, and no probability statement is licensed.
2. They are not exact-arithmetic proofs. The counts are Float64 quantities; doc 04 handles the boundary semantics of that representation, but the representation itself is finite precision.
3. They are not claims about the underlying continuous geometry. The continuous quantities (true distances between ideal coordinates) are one step further away, behind the coordinate representation.

## Caller assumptions: displacement and error bounds

What the computed distances actually bound depends on the caller. If the caller supplies coordinate displacement bounds and distance-error bounds, the diagnostic can reason conditionally about how far the true geometry could be from the computed geometry. If the caller supplies nothing, the diagnostic does not guess. Missing bounds produce an explicit unavailable or undetermined state; the validity labels remain false. In the motivating implementation, validated and certified stay false unless the caller's assumptions license them (project record: https://github.com/yubi-OS/yubiOS/pull/233 ).

This is the fail-closed pattern applied to an epistemic input: absence of a required bound is treated as a refusal to claim, not as permission to proceed. Fail-closed design has clear precedent in validation gate design: missing or malformed required policy state fails closed rather than being defaulted (source: https://github.com/forge-sdlc/forge/issues/263 , jev weight 0.75). The same principle appears in architecture decision records for model-assisted systems: a model layer is advisory, not a security boundary, and correctness stays bounded by the deterministic layer (source: https://github.com/getzerotrace/zerotrace/blob/main/docs/ADR/0002-fail-closed-and-llm-bounds.md , jev weight 0.79). The radius diagnostic follows the same shape: the deterministic counts are the floor; anything stronger requires explicit caller-provided bounds.

## Failing before model work

Invalid requests are rejected before any expensive work. The motivating implementation rejects:

1. Invalid inputs (negative or zero distance-error bounds where they are supplied, malformed payloads).
2. Attempts to set a different operative radius or a different grid. The instrument is fixed by design; a caller who wants a different instrument must build and validate a different one, not retune this one at runtime.
3. Requests whose assumptions overflow the diagnostic's budget.

The fail-before-model-work ordering has a cost argument and an honesty argument. The cost argument is that rejected requests should not consume model or compute budget. The honesty argument is stronger: work performed under an invalid assumption is not neutral, it produces outputs that look legitimate and are not. Failing first means no such output exists. The fail-closed gate pattern above makes the same argument for validation gates (source: https://github.com/forge-sdlc/forge/issues/263 , jev weight 0.75).

## Why not let the diagnostic decide anything

Three temptations exist and are declined:

1. Best-radius selection. The UI deliberately ships no radius slider and no best-radius picker (doc 08). Picking a radius is a policy decision about the instrument, and embedding it in the diagnostic would convert observation into tuning.
2. Automatic keep/delete. An isolation count suggests an action (delete isolated items, keep connected ones). Wiring that suggestion to an action would make corpus behaviour depend on a diagnostic, with no separate review step.
3. Forecast claims. A profile of past and current states is not a prediction. The motivating implementation states this flatly: no claimed forecasting improvement, and candidate-text smoke tests are explicitly mechanical, not forecast-quality benchmarks (project record: https://github.com/yubi-OS/yubiOS/pull/233 ).

The general pattern behind all three refusals is the advisory-versus-authoritative split: diagnostics inform humans and tests; they do not carry authority over the system's state (source: https://github.com/getzerotrace/zerotrace/blob/main/docs/ADR/0002-fail-closed-and-llm-bounds.md , jev weight 0.79).

## Summary

1. A radius diagnostic is an observation instrument: no new field, no ranking, no keep/delete rule, no forecast claim.
2. Intervals are relative to computed Float64 distances; they are neither confidence intervals nor exact-arithmetic proofs.
3. Missing displacement or error bounds yield an explicit unavailable or undetermined state with validated and certified false; the diagnostic never guesses bounds.
4. Invalid inputs, wrong budgets, and radius or grid overrides are rejected before any model work, failing closed rather than producing illegitimate-looking output.

Project record: the motivating implementation enforces all of the above, including 422 rejections for radius overrides and missing bounds, per https://github.com/yubi-OS/yubiOS/pull/233 .
