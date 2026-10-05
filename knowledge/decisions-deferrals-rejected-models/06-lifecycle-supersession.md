# Decision record lifecycle: status, supersession, and re-check triggers

Scope: how decision records move through statuses (proposed, accepted, deprecated, superseded, rejected), how supersession links keep a register coherent as decisions change, and which events should trigger a re-check of a compiled decision log.

## The status vocabulary

Standard ADR statuses are stable across templates: proposed, accepted, deprecated, superseded, and rejected (https://joshrotenberg.com/adrs/commands/status.html, jev weight 0.28, weak backing). The Nygard template’s own guidance lists the same set, asking what the status is: such as proposed, accepted, rejected, deprecated, superseded, etc. (https://github.com/architecture-decision-record/architecture-decision-record/blob/main/locales/en/templates/decision-record-template-by-michael-nygard/index.md, jev weight 0.90). The status field is what turns a pile of documents into a queryable register: only accepted rows are operative law.

## Durable records with an explicit lifecycle

A documented pattern for ADR lifecycle management treats records as durable historical artifacts: preserve the original decision and its context, revisit it when evidence or assumptions change, record the new decision separately when the architecture changes materially, and make the relationships among current, deprecated, and superseded records explicit (https://github.com/AsiBackbone/Learning/blob/main/docs/aspnetcore/architecture-decision-record-lifecycle-review-deprecation-and-supersession.md, jev weight 0.12, weak backing; published mirror at https://asibackbone.github.io/Learning/aspnetcore/architecture-decision-record-lifecycle-review-deprecation-and-supersession.html, jev weight 0.27, weak backing). The pattern’s key move is recording the new decision separately rather than editing the old record in place: the old record stays as history, and the relationship between old and new is the navigation path.

## Supersede versus deprecate versus leave alone

The lifecycle has three exits for a record that is no longer operative: supersede it with a new record, deprecate it when the context dissolved rather than being replaced, or leave it alone if it is still current (https://whychose.com/blog/adr-lifecycle-supersede-deprecate, jev weight 0.44, weak backing). The choice encodes different facts: supersession says a better decision replaced this one; deprecation says the question stopped mattering. AWS-prescriptive process guidance for immutable records and review periods is summarized in the same lifecycle taxonomy (https://deepwiki.com/architecture-decision-record/architecture-decision-record/2.1-adr-lifecycle-and-status-states, jev weight 0.44, weak backing).

## Supersession links as a checkable invariant

The strongest mechanical finding in this dig: a governance-oriented ADR process makes supersession symmetric and CI-validated. When a PR modifies two ADRs forming a supersession chain, the CI script validates the symmetry, the old ADR carries status superseded plus a lifecycle superseded-by field pointing at the new one, and any other multi-ADR PR is rejected (https://github.com/ivanstambuk/adr-governance/blob/main/docs/adr-process.md, jev weight 0.74). This turns the lifecycle from prose into an enforced invariant: a register cannot drift into half-superseded state where one side of the link is missing, because the CI gate rejects the asymmetry.

Fowler’s definition reinforces the immutability premise: an ADR is a short document that captures and explains a single decision, kept to a couple of pages (https://martinfowler.com/bliki/ArchitectureDecisionRecord.html, jev weight 0.94). Short, immutable records plus explicit links is the architecture that makes lifecycle transitions cheap and visible.

## Enforcement at the gate

Lifecycle enforcement can extend to the code path: a GitHub Action named ADR Guard fails a pull request when watched code paths change without an architecture decision record being added or updated, with waivers made explicit as an ADR-Exempt line with a reason that passes the gate and is written into the job summary (https://github.com/architecture-decision-record/architecture-decision-record, jev weight 0.75). The lesson generalizes: lifecycle states are only as reliable as the enforcement that keeps them updated.

## Re-check triggers for compiled decision logs

A compiled decision log (one document assembling rows sourced from other documents) carries an extra lifecycle hazard: it can silently drift from its sources. The re-check triggers that matter:

1. Any source document merging. A log compiled from open PRs represents a snapshot of unmerged state and should be re-checked once sources actually merge to main.
2. A deferred row’s unblocking evidence arriving, since that row must become either adopted or rejected.
3. A new decision that could contradict an existing row, which re-runs the contradiction check.
4. Any supersession, since the superseded row’s status must be flipped and the link written, symmetrically, per the CI-validated pattern above.

## Source quality note

Strong anchors: the canonical ADR template, Martin Fowler’s bliki, and the CI-validated adr-governance process. The lifecycle blogs and deepwiki pages are moderate-weight practitioner synthesis, labeled weak where under 0.5.
