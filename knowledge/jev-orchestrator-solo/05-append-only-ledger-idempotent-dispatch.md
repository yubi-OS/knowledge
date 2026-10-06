# The append-only ledger and idempotent dispatch

Scope: the append-only outcomes-ledger pattern the jev orchestrator design borrows: audit rows, digest-stable IDs, explicit verdicts, no implicit state, plus idempotency keys for action dispatch.

## What was borrowed and from where

The framing log states the borrow directly: "Conventions are borrowed from the worker's existing append-only /api/outcomes ledger (the point-map pattern already on this worker): append-only audit rows, digest-stable IDs, explicit verdicts, no implicit state." Variation V5 (Sigma 17) is the variation that formalized this: extend the outcomes ledger, treating jev as a verdict type on the existing append-only pattern. In the V1+V5 hybrid, V5 contributes exactly this conventions layer.

The D1 schema in the MVP scope carries the pattern into storage: tasks, actions, events (append-only audit), approvals, learnings.

## Append-only audit rows

An append-only event store is the standard shape for audit infrastructure: immutable append-only storage, with tamper-evidence typically achieved through hash chaining of consecutive records (https://www.techinterview.org/post/3233465643/system-design-audit-log/, jev weight 0.25, weak backing). Audit-log design guides converge on the same primitives: append-only event storage, immutable records, and compliance-ready activity trails, with querying built on top rather than mutation in place (https://sysdesign.wiki/guides/audit-logging/, jev weight 0.33, weak backing; similar framing at https://letsbuildsolutions.com/blog/system-design/designing-an-audit-log-system-immutable-events-efficient-querying-and-compliance-at-scale/, jev weight 0.29, weak backing). The event-sourcing tradition makes the why explicit: immutable events preserve the reasoning behind every change and eliminate ambiguous in-place rewrites (https://github.com/kb4ai/event-sourcing-append-log-immutable-architecture-pub-kb, jev weight 0.19, weak backing).

The framing log's "no implicit state" is the negative-space version of the same rule: state transitions are written as rows, not inferred. That is what makes the jev task lifecycle (gate decision, dispatch, verify, continue, terminal) reconstructible from the events table alone.

## Digest-stable IDs and explicit verdicts

Digest-stable IDs mean a row's identity is derived from its content, so re-emitting the same record yields the same ID and a tampered record yields a different one. Explicit verdicts mean every terminal record says what happened: executed, rejected, failed, reconciled. This is the vocabulary that lets a downstream auditor answer "what did the orchestrator do and why" without reading code. The audit-log literature treats judgment-plus-record (decide, then write the decision as an event) as the core loop of such systems (https://sysdesign.wiki/guides/audit-logging/, jev weight 0.33, weak backing).

## Idempotency keys for dispatch

The execution side of the design (scoped outbound-HTTP allowlist, stable action IDs, idempotency keys) exists because retries in distributed systems are unavoidable and duplicates are the failure mode. The established result: exactly-once delivery of messages is not possible, but exactly-once processing is achievable by adding a unique key that the receiving side deduplicates on (https://www.morling.dev/blog/on-idempotency-keys/, jev weight 0.72, authoritative backing). The idempotency-key pattern makes at-least-once delivery behave like exactly-once, which is how payment APIs and streaming systems implement it in practice (https://hld.handbook.academy/curriculum/distributed-systems-theory/idempotency-exactly-once/, jev weight 0.24, weak backing).

For the orchestrator this maps cleanly onto gated actions: a gate-approved action carries a stable ID; a retry after a network failure replays the same ID; the receiving service (or the orchestrator's own ledger) recognizes the ID and does not execute twice. Google's API-reliability guidance describes the same mechanism: idempotency keys plus safe retries prevent duplicate data in APIs (https://cloud.google.com/discover/idempotency, jev weight 0.72, authoritative backing). Survey treatments cover the supporting machinery: database upserts, deduplication stores, and two-phase reservation patterns (https://neelmishra.github.io/blog/hld/distributed-systems/idempotency.html, jev weight 0.75, authoritative backing; https://amanksingh.com/blog/idempotency-and-exactly-once, jev weight 0.56, authoritative backing; deeper patterns including failure scenarios at https://aloknecessary.in/blogs/idempotency-distributed-systems/, jev weight 0.25, weak backing).

## Why the ledger and the gate belong together

The two halves of the conventions layer serve different failure questions. The gate answers "may this action run at all" before dispatch; the ledger answers "what actually happened" after it. An append-only ledger without a gate records unauthorized actions faithfully; a gate without a ledger makes approvals unauditable. The hybrid keeps both: policy version recorded at gate time, dispatch keyed, verdicts appended, nothing updated in place.

One consequence worth noting for implementers: because the events table is append-only, the verify/reconcile logic cannot "fix" a bad row. Corrections are new rows referencing the old ones. That is a cost the framing log accepts implicitly by choosing the ledger conventions, and it is the property that makes the dashboard's terminal states trustworthy.
