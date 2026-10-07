# 01 - The lifecycle state machine

Scope: the eight-stage lifecycle state machine, what each transition owes (entry criterion, exit criterion, compatibility promise, owner, ADR, evidence, review date), and how the yubiOS stage semantics align with external deprecation policies.

Grounding spine: the source doc `yubi-OS/yubiOS skills/nss-lifecycle/SKILL.md` (all stage names, the transition table, and the alignment policy are source-doc claims).

## The version-versus-lifecycle split

The core claim of the source doc is that version and lifecycle answer different questions and are orthogonal. A version number answers "which release and which compatibility increment?" A lifecycle block answers "where is this artifact in its state machine, what transition is next, what must users do, and who owns the evidence?" (source doc). The doc gives concrete ways the two separate: several lifecycle stages can coexist inside one SemVer major line, a beta API may change under a minor version while a stable API cannot, deprecation is a period rather than a point release, and a feature flag can be removed without any package-version change (source doc). A specific version like 2.4.0 tells a consumer which release they have; it does not tell them whether an API is experimental, when it will be removed, how to migrate, whether a flag can be deleted, or which SBOM describes the deployed artifact (source doc).

## The eight stages and the happy path

The stage vocabulary is fixed at eight values: experimental, beta, stable, deprecated, removed, archived, plus cancelled (never shipped) and unknown. The main line runs experimental, then beta, then stable, then deprecated, then removed, then archived; any stage before removed can divert to cancelled (source doc). The vocabulary is a yubiOS convention and the source doc says a new stage label requires a new skill, not a new label in an existing patch.

## What every transition owes

Each transition requires 5 recorded things: an entry criterion (what makes the artifact eligible for the new stage), an exit criterion (what triggers the next transition), a compatibility promise (what the artifact guarantees during this stage), an owner plus ADR plus evidence (who decides, which ADR records the decision, which tests and SBOMs prove it), and a review date for when the next transition decision is owed (source doc). A bare `stage: deprecated` with no `removal_in_version` and no ADR is a partial block per the guidelines; it must be closed with the missing fields (source doc).

## Stage semantics table

| Stage | Compatibility | Notice for transition | Removal eligibility |
|---|---|---|---|
| experimental | may break in any release | none required | immediate on cancellation |
| beta | may break in any MINOR | one release with a Deprecated marker | after one Stable cycle, with ADR |
| stable | breaks only at MAJOR | one MAJOR of Deprecated first | requires ADR plus Migration plus Codemod |
| deprecated | still operational; new uses discouraged | per notice_period, default 180 days | after notice and replacement reached stable |
| removed | not present in code | n/a (gone) | archived for reproducibility |
| archived | historical only; not maintained | n/a | n/a |

All of the above is the source-doc convention (source doc).

## Alignment with external policies

The source doc states the state machine is a yubiOS convention and should align to upstream ecosystems when interfacing externally: Kubernetes deprecation policy uses a 9-month notice, Google APIs use 180 days, and Square uses at least 12 months before retirement plus at least 6 months of maintenance after a replacement reaches GA (source doc). The dig confirms these policy homes are live and authoritative:

- Kubernetes publishes its deprecation policy at https://kubernetes.io/docs/reference/using-api/deprecation-policy/ (jev weight 0.91); the page details the deprecation policy for various facets of the system.
- Kubernetes itself is an open source system for automating deployment, scaling, and management of containerized applications, hosted by the Cloud Native Computing Foundation (https://kubernetes.io/, weight 0.72; https://kubernetes.io/docs/home/, weight 0.61).
- The source doc attributes the 180-day default to Google and the 12-months-plus-6-months-maintenance pattern to Square; those two policy pages did not surface at weight >= 0.5 in this corpus's digs, so treat the exact numbers as source-doc claims rather than independently re-verified ones.

## Verification for this doc's domain

The source doc's verification checklist for a lifecycle patch requires the stage to come from the fixed 8-value vocabulary and requires the next NSS sweep on the same file to stop re-flagging lifecycle as the top Extend gap; a patch that fails either check is a NO verdict (source doc).

## Sources

- Source doc: `yubi-OS/yubiOS skills/nss-lifecycle/SKILL.md`, sections "Extended description", "State machine (the lifecycle stages)", "Guidelines", "Constraints", "Verification".
- https://kubernetes.io/docs/reference/using-api/deprecation-policy/ (jev 0.91)
- https://kubernetes.io/ (jev 0.72)
- https://kubernetes.io/docs/home/ (jev 0.61)
