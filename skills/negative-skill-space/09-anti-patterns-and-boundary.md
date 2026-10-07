# Anti-patterns and boundary discipline

Scope: the anti-pattern the ground source names (NSS executing an edit directly), the boundary case for trigger-only requests, and the guideline that every use stays inside the frontmatter description's scope.

Primary source of record: yubi-OS/yubiOS skills/negative-skill-space/SKILL.md (cited below as "source doc"). This is an internal-record subtopic, no dig: every claim here is a reading of the source doc's own sections.

## The anti-pattern: NSS executing an edit directly

The source doc's atom-bound pipeline section names one anti-pattern: NSS executing an edit directly (source doc). The detection rule is mechanical: if you see an RSI edit whose Hypothesis / Edit / Result does not cite an atom Δ, it is an NSS-only edit and it bypassed the only-positive-Δ guarantee. The prescribed correction is to replace it with an atom-bound edit per single-action-curve-rsi's NSS-Coupled Entry Point (source doc).

Why this is an anti-pattern and not just a style preference: the atom's geodesic-only criterion on the S^2 parameter manifold is the only Δ source in the pipeline (source doc). An edit proposed and applied by NSS has no Δ citation because NSS does not compute Δ; it therefore cannot be shown to have improved the corpus. The audit trail (Hypothesis / Edit / Result with an atom Δ) is what separates an improvement from a change.

Three adjacent negatives from the same section reinforce it (source doc):

1. NSS does not execute edits; all edit actions go through the atom.
2. NSS does not compute Δ.
3. NSS does not verify closure; the parent's Stage 5 sparse-cell-count delta is computed from atom Δs.

A violation of any of the three usually shows up as the same artifact: an edit record without an atom Δ citation.

## The boundary case: trigger-only requests

The source doc's Examples section carries one boundary case: when the request only names a trigger without the artifact it acts on, route to the owning surface instead of improvising here (source doc). This is a scope discipline for the sweep's own invocation: a request like "run the sweep" without a target file is under-specified, and the correct behavior is routing, not invention.

The rule generalizes to the whole skill family: each axis skill names its target artifact class, and a dispatch that names no artifact should be rejected or rerouted to the surface that owns the decision, rather than answered with a guess.

## The guideline: stay inside the frontmatter scope

The source doc's Guidelines section has one rule: every use stays inside the frontmatter description's scope; anything beyond it is a different skill's job (source doc). For this skill the frontmatter description is the 12-axis qualitative sweep for gap-mapping any skill before recursive-self-improvement cycles, positioned as the upstream gap-proposer in the curve-rsi dispatch chain.

Concretely, inside-scope uses are: sweeping a target SKILL.md across the 12 axes, classifying the resulting gaps as Extend / Pair / Accept, and forwarding the constraint set downstream. Outside-scope uses, which belong to other skills, include: executing the fix (the atom's job), computing improvement deltas (the atom's job), verifying closure (the parent Stage 5's job), and deciding that a narrow scope is wrong rather than intentional (the parent's non-atomic resolution).

## How the three rules compose

The three rules form one principle at three granularities. The anti-pattern forbids the skill from acting outside its competence at the level of edits. The boundary case forbids it from acting outside its competence at the level of requests: no target, no sweep, route instead. The guideline forbids it at the level of the whole skill: the frontmatter description is the contract, and everything past it is another skill's job.

For an operator the practical checklist is short. Before accepting an RSI edit attributed to this skill: check that the record cites an atom Δ; if it does not, treat the edit as an NSS-only violation and redo it atom-bound. Before dispatching the sweep: check that a target artifact is named; if only a trigger is named, route to the owning surface. Before extending the skill's use: check the frontmatter description; anything beyond it belongs elsewhere.

## Source

- Ground spine: yubi-OS/yubiOS skills/negative-skill-space/SKILL.md, sections "Role in the Atom-Bound Pipeline" (anti-pattern), "Examples" (boundary case), "Guidelines" (scope rule) (4662 B, fetched 2026-10-07 with User-Agent omni-agent/1.0).
- Internal-record subtopic, no dig.
