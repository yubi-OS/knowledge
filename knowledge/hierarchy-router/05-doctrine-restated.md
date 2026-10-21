# 05. Doctrine, Restated

**Scope:** Doctrine, restated: detailed analysis grounded in yubi-OS/yubiOS refs/hierarchy-router-2026-10-06.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/hierarchy-router-2026-10-06.md, no external web dig

## The doctrine in the record

The build record restates its governing doctrine in three sentences:

1. The detector proposes the route; the fail-closed gate disposes.
2. Measurements are data, never authorization.
3. Route decisions are run rows (kind `router`) plus append-only task events, idempotent per artifact sha256.

Each sentence constrains a different part of the system.

## Sentence 1: propose versus dispose

The detector (edge-standard D for images, clef score for multimodal) produces a band, and the band maps to a lane. That is a **proposal**. The gate, governed by the active policy, decides whether the proposal becomes an action.

The live verification (doc 02) shows the separation in practice:

- A measured text probe under v6 was blocked: the detector ran, the gate refused.
- A provisional-band probe under v7 was held at `needs_approval`: the detector proposed, the gate deferred to a human.
- A text probe under v7 with no matching band was blocked.
- A gasket under v7 was allowed: the detector proposed and the gate agreed.

The detector never dispatches by itself. Even a perfect measurement cannot bypass the gate.

## Sentence 2: data, never authorization

This is the same rule the spectral SPEC states for the hierarchy oracle: verdicts are data, never authorization; the oracle proposes nothing by itself. Across the wave, every measuring instrument (edge-standard, spectral-standard, the oracle, the router's detector) is denied the ability to authorize.

Why this matters operationally:

- Measurements can be wrong (degenerate inputs, version drift). If a measurement were authorization, a measurement bug would be an authorization bug.
- Policy can change without changing measurement code. The v7 to v8 promote changed what the multimodal band was allowed to do without touching the scorer.
- Approvals bind to policy versions. When v7 was promoted, 1 v6-bound approval expired; when v8 was promoted, 26 v7-bound approvals expired. Authorization lives in the policy layer, so it moves with policy.

## Sentence 3: run rows and append-only events

- **Run rows (kind `router`)**: every route decision is stored as a run row. The multimodal sweep addendum notes that after calibration probes were cancelled, "the router run rows (kind `router`) are the durable measurement record."
- **Append-only task events**: task history is never rewritten. When the dispatch-leg bug was fixed (doc 06), the seed task was not edited into success; it was re-verified against its stored response and moved forward with new events.
- **Idempotent per artifact sha256**: the same artifact produces the same route decision record, which, combined with deterministic D, makes routing reproducible.

## The doctrine applied to the follow-ups

| Situation | Doctrine at work |
|---|---|
| dispatch ended `unknown` | reconcile-before-repeat: no auto-retry, no false terminal |
| multimodal band uncalibrated | proposal held at needs_approval until policy v8 |
| calibration probes created tasks | tasks cancelled; run rows kept as the record |
| verify misread a success | fix in verifier; evidence row records `route_verify.basis` |

## Relation to fail-closed design

Fail-closed means the default outcome of any uncertainty is no action:

- no band configured: blocked;
- no band matches: blocked (`no_matching_band`);
- unknown action type: rejected (`unknown_tool`);
- provisional band: held (`needs_approval`);
- verification undecidable: `unknown`, not success.

The last item is why the dispatch-leg bug produced an `unknown` state instead of a false success. The system erred toward not claiming completion.

## Reading the doctrine as a checklist for new lanes

1. Does the new lane's detector only propose?
2. Is its band defined in policy, with a calibration status?
3. Does an uncalibrated band default to `needs_approval`?
4. Are its decisions stored as run rows, idempotent per sha256?
5. Does its verification have a decidable basis, or will it fall to `unknown`?
