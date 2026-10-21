# 03. Recommended Direction

**Scope:** Recommended Direction: detailed analysis grounded in yubi-OS/yubiOS refs/hierarchy-router-solo-2026-10-06.md.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/hierarchy-router-solo-2026-10-06.md, no external web dig

## The recommendation in one sentence

The source recommends **measurement-gated routing**: artifacts entering the system get measured by the appropriate instrument; the measured feature is classified into policy-declared bands; the band selects a route (model lane, automation, or corpus lane); and the routing action is proposed as a jev task action that passes the SAME deterministic fail-closed gate as everything else.

## The pipeline, stage by stage

1. **Intake.** An artifact arrives. Its class (image or text document) determines which instrument measures it.
2. **Measure.** Images go through edge-standard-v1, producing D and the rest of the feature vector. Text documents go through the scorer.
3. **Classify.** The primary feature is looked up against band boundaries declared in `jev-policy.json`. The boundaries are promoted via the audited flow and are never hardcoded in router code.
4. **Propose.** The band names a target lane. The router emits a routing proposal as a jev task action. It does not dispatch.
5. **Gate.** The fail-closed gate evaluates the proposal exactly as it would any action and returns one of three verdicts: allowed, needs_approval, or blocked.
6. **Dispatch and verify.** Only on allow does work move to the target lane, followed by independent verification and run rows.

## The invariant

The source states the core principle as an invariant: **the detector decides (proposes) the route; the policy engine disposes.** Three consequences follow directly.

- A routing proposal has no special standing. It is subject to the same spend limits, rate limits, approval bindings, and terminal-state semantics as any other action.
- Route decisions are run rows. The audit trail does not distinguish between "the router moved this" and "an automation moved this"; both are gated actions with records.
- The router never awards itself authority. If a band edge is wrong, the worst case is a wrong proposal that the gate still evaluates, not an unauthorized dispatch.

## The calibration precondition

No band routes live traffic until it passes falsification-corpus calibration. The source names the three components of that calibration:

- **Pre-registered band edges.** Edges are written down before measurement, so a band cannot be tuned after the fact to make a corpus pass.
- **A jitter test.** Small perturbations of an artifact must not flip its band except at genuine edges; this is the operational form of the band-stability assumption.
- **A 21-point sweep on synthetic gold artifacts.** The falsification generators produce artifacts whose class is known by construction, so the sweep measures whether bands separate the intended workloads.

## Why this beats the alternatives in the generation log

The source's generation log scores 6 variations on 4 axes (P, S, D, T). The finalist "One atomic routed loop (MVP of the regime)" scored 17 (4/5/3/5), and the full "Measurement-gated routing regime" scored 15 (4/4/3/4). The constraint-removal variant, "Measurement predicates in the policy gate," scored the highest defensibility (5) but only 2 on S and a total of 14, because it rewrites the gate contract itself. The inversion variant (route by measured output morphology) scored 13, the triage mesh (all instruments, one routing table) 12, and the public intake triage for the Steady Orbit site 12.

The recommended direction wins because it keeps the gate contract unchanged and adds only one surface.

## The strongest critique and its answer

The stress-test names the strongest objection: routing on a single scalar D throws away information the full feature vector carries. The answer is structural. The MVP routes on the policy-declared band of the primary feature, and the run rows record the FULL measurement vector. Band definitions can therefore be refined later from recorded data without re-measuring anything.

## Second-order effect

Once routing is measurement-gated, every future instrument (the source names the scorer and visco) can become a route authority by adding bands to policy. The regime generalizes without new gate logic. The source records no un-testable bet: the MVP loop is testable end-to-end using synthetic artifacts from the falsification corpus itself.
