# Promotion lifecycle: from FUTURE to implemented, and the watch list

Scope: The status progression FUTURE, planned, designed, implemented, and watch-listing for items that cannot yet name their gates.

## The lifecycle the gates define

The promotion gates document (yubiOS refs, roadmap-promotion-gates, 2026-07-17) defines a status vocabulary with teeth. A FUTURE item needs its 8 gate fields answered before it moves into ADR, SPEC, CI, or implementation. For CI and docs items, the intermediate states are "planned" and "designed"; "implemented" requires recovery evidence. Items that cannot name an owner, board or deployment target, evidence target, and recovery plan stay watch listed.

Three properties distinguish this lifecycle from a generic pipeline:

1. Status movement is evidence driven, not calendar driven. "Designed" means the design exists; "implemented" means the recovery evidence exists.
2. The watch list is a stable, respected state. An item may sit there indefinitely without being dropped, and its exit condition is explicit: name the 4 fields.
3. Promotion is partial by design. An item can be promoted for one artifact class (CI metadata) while another (real board payloads) stays gated.

## Definition of Ready: the closest published analogue

Agile practice has a gate with the same shape and the same position in the workflow. The definition of ready (DoR) is a set of criteria that ensures backlog items are actionable, clear, and feasible before work begins, and it is applied before development begins to determine whether work should enter a sprint (https://www.atlassian.com/agile/project-management/definition-of-ready, jev weight 0.53, authoritative). A team level explainer frames it as the criteria a backlog item must meet before development can begin, ensuring clarity and reducing rework (https://agile3.com/knowledge/agile-planning-estimation/definition-of-ready, jev weight 0.36, weak backing), and other guides describe it as the team's quality gate for the backlog (https://agiletoolhub.com/guides/definition-of-ready-best-practices, jev weight 0.13, weak backing).

The gates document is a DoR for roadmap promotion, specialized for a hardware plus CI project: instead of "acceptance criteria written", the criteria are owner, trust boundary, evidence target, recovery, pins, retention, artifact class, and CI/hardware boundary.

## Stage gates: the phase review analogue

Longer cycle engineering uses the same structure at project scale. The stage gate process divides projects into phases separated by decision checkpoints called gates, where stakeholders review progress and decide whether to continue, pause, or stop (https://asana.com/resources/stage-gate-process, jev weight 0.35, weak backing). The phase gate concept is described as stage limited commitment or creeping commitment: at the end of each phase, work is reviewed at a gate to see whether the project is ready to move to the next phase (https://www.smartsheet.com/phase-gate-process, jev weight 0.33, weak backing). A software specific adaptation places gates at discovery and business case so the requirements phase inherits a decision instead of a hunch, with teams landing in hybrid models that iterate inside each stage and gate between them (https://www.intellectsoft.net/blog/stage-gate-process/, jev weight 0.17, weak backing).

SAP's Activate methodology applies quality gates at 4 project phases with criteria and evaluation points for assessment, enhancing transparency and accountability (https://community.sap.com/t5/technology-blog-posts-by-members/quality-gates-with-activate-methodology-and-rise-with-alm/ba-p/14092914, jev weight 0.48, weak backing).

## Watch listing maps to "pause" outcomes, not rejection

A notable property of the stage gate literature is that gate outcomes include pause, not just go or no go. The gates document's watch list is the same idea applied to roadmap items: an item with real value but no named owner, target, evidence, and recovery does not die, and does not get implemented; it waits, with its unmet conditions enumerated (yubiOS refs, roadmap-promotion-gates, 2026-07-17: "Post-launch hardware ideas: stay watch-listed until they name an owner, board/deployment target, evidence target, and recovery plan").

## Status integrity: the lifecycle's real teeth

The subtle load-bearing piece in the source doc is the constraint on status vocabulary: a CI or docs TODO item "may be marked 'planned' or 'designed' only; it should not move to 'implemented' without the recovery evidence" (yubiOS refs, roadmap-promotion-gates, 2026-07-17). This addresses the classic lifecycle failure: status inflation, where an item is marked done because the work felt finished, while the claim that makes it done (the recovery path) was never demonstrated. Lifecycle states here are claims about evidence, and the gate discipline keeps the status labels honest by tying each transition to a specific artifact.

## Authoring guidance

When moving an item through this lifecycle, record at each transition which gate field changed from missing to answered. That log turns the lifecycle into an audit trail: any future reader can see when the item earned each status, and what evidence it presented to get there.
