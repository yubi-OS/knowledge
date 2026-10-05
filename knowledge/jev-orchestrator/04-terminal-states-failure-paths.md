# 04 - Terminal states and failure paths

Scope: terminal states and failure paths: a closed terminal enum, retry-within-limits, reconciliation, honest close, and reporting partial completion truthfully.

## A closed terminal enum

Every controller task ends in exactly one value from a small, closed set. In the deployed Jev controller the terminal outcome is a six-value enum, persisted as `state='terminal'` plus a `terminal_outcome` field (source: system of record). Closedness is the point: if callers can invent their own outcome strings, downstream consumers cannot distinguish a success from an in-flight task, an ambiguous result becomes a data model problem, and dashboards rot. Workflow state machine practice treats the set of terminal states as a contract of the machine, not a label space (source: https://www.cloudopsnow.in/state-machine/, weight 0.46, weak backing).

Autonomy, in the strict sense, means acting without human intervention to reach goals (source: https://www.merriam-webster.com/dictionary/autonomous, weight 0.81). A controller grants autonomy only over bounded tasks, so the terminal enum is where the boundary of that grant is expressed: the task ran, it ended, and here is the truth about how.

## Retry within limits, then stop

Retries are not free. The gate carries explicit limits (in the deployed starter: 2 retries per action, 10 actions per task), so retrying is a gate-visible activity that stops when the limit hits rather than a background loop that hides cost (source: system of record). AWS's durable execution guidance formalizes the same idea: idempotency keys plus bounded retry policies are what make a retried action safe and cost-bounded, because without an idempotency contract every retry is a fresh side effect waiting to double-apply (source: https://docs.aws.amazon.com/durable-execution/patterns/best-practices/idempotency/, weight 0.95). In the Jev dispatch shape, each action dispatches under a stable id (`jev-<task>-<n>`), which is exactly the idempotency key the provider side can key on (source: system of record).

The failure taxonomy research on autonomous agents documents the empirical stakes: agents fail most often not at reasoning but at execution-level issues such as invalid actions and environment errors, and systems that lack bounded, explicit failure handling compound those errors across steps (source: https://arxiv.org/html/2508.13143v1, weight 0.85). A closed enum plus bounded retries is the structural answer: every failure either resolves into a retry within budget or into a named terminal state, never into silent drift.

## Reconciliation and the honest close

Some failures are ambiguous: the dispatch may or may not have taken effect. The failure path for that class is reconciliation, a separate operation that determines ground truth from the provider, rather than blind retry that could duplicate an effect (source: system of record; same principle documented for queue-backed workflows in https://www.antoinebuteau.com/automation-series-5-state-idempotency-retries-and-queues/, weight 0.48, weak backing).

The other half of the contract is honesty about partial completion. The first live task in the deployed controller closed as `terminal:failed` even though one of its two actions had succeeded, with an explicit reason: one action verified successfully, the other hit GitHub's anonymous rate limit (source: system of record). The controller did not average the two into a soft success. Task-level honesty matters because consumers of the terminal state make decisions from it; a task that reports success while half its effects are unverified is worse than one that reports failure cleanly.

## Design guidance for adopters

Four rules. First, define the terminal enum before the first task runs and keep it closed; add values deliberately, in a migration, never per task. Second, bound every retry and record each attempt as an event, so the retry history is evidence rather than folklore. Third, separate "the provider did not answer" from "the effect did not happen" and route the former to reconciliation. Fourth, never let a partially verified task close as fully successful; if the enum has no partial value, closing failed with an honest reason string is the correct report, and the per-action outcomes live in the action records where they are individually checkable.
