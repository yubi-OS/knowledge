# 03 The task lifecycle: create, approve, dispatch, verify, continue

Scope: the caller-visible flow from task creation to terminal state, with the failure paths and pause control.

## Creating a task

A task is created with POST to /api/jev/tasks. The source doc's reference request carries: source, title, idempotency_key, and a payload with an actions array. Each action names a tool, method, url, and an expected object with predicates such as status_range (200 to 299) and json_path (source doc). Caller-supplied actions are the v1 shape; prompt-intake proposals (doc 06) take the same shape downstream.

The response echoes the task, actions, and gate_outcome. If the idempotency_key was seen before, the response carries duplicate:true and returns the existing task instead of double-firing (source doc). Dedupe is per (tenant, key), which is why the guidelines say to always send an idempotency_key for scheduled or retryable callers (source doc). The idempotency-key pattern is standard API design practice for exactly this purpose: making a retried request safe by keying it to a caller-supplied identifier (https://en.wikipedia.org/wiki/Idempotence, weight 0.21, weak; https://mandate.so/blog/idempotency-key, weight 0.11, weak; https://boundedcontext.com/idempotency-key/, weight 0.14, weak).

## Reading it back

GET /api/jev/tasks/<task_id> returns the actions, gate reasons, and events (source doc). The events array is the audit trail that doc 05 covers; callers should log task ids in their own records and treat the audit log as the system of record (source doc, Acting on results).

## Approval

If gate_outcome is needs_approval, the caller (or the operator) approves. The console at /jev/ shows a pending queue with expiry countdowns (source doc). Via API: GET /api/jev/approvals lists the queue; POST /api/jev/approvals/<ap_id>/approve with actor and note approves (source doc). The approval is re-checked against the current policy version before it counts (source doc), and in the production rounds the approve endpoint was observed to auto-execute: it re-gates, executes the bound action, verifies, and continues in one request, with autoexecuted in the response (source doc, Gated repo commits section). No separate execute call is needed after an approve.

The approval-queue shape matches the broader human-in-the-loop pattern literature: a queue of pending decisions with expiry, rather than inline blocking waits (https://eucalipse.com/articles/ai-agent-approval-queue-human-in-the-loop, weight 0.14, weak; https://dev.to/spuriqai/human-in-the-loop-by-design-where-approval-fits, weight 0.07, weak).

## Dispatch

POST /api/jev/tasks/<id>/execute dispatches the task. It re-checks pause at dispatch time and skips rather than firing if paused (source doc). This is the second pause check; the gate also blocks while pause is active (doc 02).

## Verify and continue

POST /api/jev/tasks/<id>/verify with action_id runs the verification for one action and returns a verdict: verified_success, confirmed_failure, or unknown (source doc). POST /api/jev/tasks/<id>/continue advances the task: next is either more_work (the remaining actions are re-decided and re-gated) or terminal (succeeded once all actions are verified) (source doc).

The verify endpoint requires body.action_id. Without it the handler resolves action to null and returns 500 (source doc, Hierarchy Router caller caveats). This is a hard caller contract.

## Failure paths, all explicit

The source doc enumerates the paths:

1. confirmed_failure: POST /tasks/:id/retry with action_id. Retries only happen within limits; exhausted limits escalate to human review (source doc).
2. unknown: POST /tasks/:id/reconcile with action_id and evidence carrying observed: happened, did_not_happen, or unclear. Resolved continues; unclear goes to review. Never re-dispatch on unknown (source doc).
3. close {outcome, reason}: closes the task with one of the 6 terminal states. cancel closes cancelled (source doc).

## Pause and resume

POST /api/jev/pause with paused and scope blocks new and queued dispatch. It never undoes completed effects (source doc). Pause is therefore a control for in-flight risk, not a rollback mechanism.

## Polling discipline

The source doc says to poll GET /tasks?state=awaiting_approval or watch the console instead of spinning on execute (source doc, Acting on results). The approval queue with expiry countdowns is the intended waiting surface.

## Sources

- Source doc: skills/jev-orchestrator/SKILL.md in yubi-OS/yubiOS (sections: The flow; Acting on results; Guidelines; Errors; Gated repo commits; Hierarchy Router).
- https://en.wikipedia.org/wiki/Idempotence (weight 0.21, weak)
- https://mandate.so/blog/idempotency-key (weight 0.11, weak)
- https://boundedcontext.com/idempotency-key/ (weight 0.14, weak)
- https://eucalipse.com/articles/ai-agent-approval-queue-human-in-the-loop (weight 0.14, weak)
- https://dev.to/spuriqai/human-in-the-loop-by-design-where-approval-fits (weight 0.07, weak)
