# 05 Terminal states, the audit log, and cost accounting

Scope: the 6 terminal states, the append-only events log as system of record, and how task cost accumulates.

## 6 terminal states, all distinct

Every task closes in exactly one of 6 terminal states: succeeded, blocked, rejected, expired, failed, cancelled (source doc). The source doc stresses that the states are distinct and that blocked is not success (source doc). The distinction is operational, not cosmetic: a caller that treats blocked as a soft success would mask policy violations in its own metrics, which is exactly the failure the source doc warns against.

The close endpoint takes {outcome, reason} and closes with one of the 6 states; cancel closes cancelled (source doc). The automations layer adds a specific sub-case: a run that exhausts its stage budget closes terminal:failed with stage_budget_exhausted, honestly (source doc, Automations caveat).

## The audit log is append-only

Every stage of the flow appends an event. Nothing is ever silently rewritten (source doc, When to use). The events array lives in the task detail (GET /tasks/<id>), and the source doc instructs callers to log task ids in their own records while treating the audit log as the system of record (source doc, Acting on results).

The design stance matches the event-sourcing principle that an append-only log is the authoritative record and downstream state is derived from it: rewriting history is not an operation the system offers (https://whychose.com/blog/event-sourcing-decision-record, weight 0.08, weak). Enforcement guidance for immutable audit trails makes the same argument from the compliance side: append-only trails survive review because there is no mutation path to audit (https://www.designgurus.io/answers/detail/how-do-you-enforce-immutability-and-append-only-audit-trails, weight 0.07, weak).

## What the states mean for callers

Mapping the states to caller behavior, per the source doc:

1. succeeded: all actions verified. The only good ending, reached through verify then continue (doc 03).
2. blocked: the gate refused. Final unless policy changes; the reasons array names the failing check (doc 02).
3. rejected: caller-supplied actions that fail validation, for example a malformed resend.send body, close rejected with 422 INVALID_ACTION (source doc, Gated repo commits).
4. expired: approvals expire; expiry is a first-class close.
5. failed: retries exhausted, stage budget exhausted, or an unclear reconcile escalated to review.
6. cancelled: an explicit cancel.

Workflow-management literature describes the same shape: a workflow is a set of steps with defined states and transitions, and the terminal states are where accountability attaches (https://www.ibm.com/think/topics/workflow, weight 0.15, weak; https://en.wikipedia.org/wiki/Workflow, weight 0.15, weak). State-machine API designs keep terminal states explicit and enumerated for the same reason (https://hideyukimori.github.io/NENE2/howto/state-machine-workflow, weight 0.09, weak).

## Cost accounting

The task carries cost_usd, which accumulates jev decision spend plus per-call tool costs from the policy (source doc). The console shows costs (source doc, Setup). Two consequences:

1. Cost is per task and visible, so an automation's spend is auditable at the granularity of a single run.
2. Tool costs come from the policy, so the price of calling a provider is a policy fact the operator sets, not a caller estimate.

When the gate blocks for spend or limits, the guideline says to promote a learning (a human step) rather than raising limits silently (source doc, Guidelines item 4). The cost number is therefore also an input to policy evolution.

## Polling and visibility

The intended waiting surface is the approval queue: poll GET /tasks?state=awaiting_approval or watch the console (source doc). The console exposes tasks, pending approvals, pause control, costs, and learnings after a single key entry stored in sessionStorage (source doc, Setup).

## Sources

- Source doc: skills/jev-orchestrator/SKILL.md in yubi-OS/yubiOS (sections: When to use; Acting on results; Automations; Guidelines; Setup).
- https://whychose.com/blog/event-sourcing-decision-record (weight 0.08, weak)
- https://www.designgurus.io/answers/detail/how-do-you-enforce-immutability-and-append-only-audit-trails (weight 0.07, weak)
- https://www.ibm.com/think/topics/workflow (weight 0.15, weak)
- https://en.wikipedia.org/wiki/Workflow (weight 0.15, weak)
- https://hideyukimori.github.io/NENE2/howto/state-machine-workflow (weight 0.09, weak)
