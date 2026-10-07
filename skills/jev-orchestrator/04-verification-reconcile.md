# 04 Verification, retry, and reconcile

Scope: expected predicates, the 3 verify verdicts, the retry path, and the reconcile-before-repeat rule for unknown outcomes.

## Expected predicates make verification cheap

Every action should declare an expected object. The source doc's reference action carries status_range (200 to 299) and json_path (full_name) as predicates (source doc). Guidelines item 2 is blunt: declare expected predicates on every action, because without them verification degrades to unknown and the caller loses the cheap success path (source doc).

The verify endpoint takes an action_id and returns one of 3 verdicts: verified_success, confirmed_failure, or unknown (source doc). A verified_success lets continue close the task as succeeded once all actions verify. A confirmed_failure opens the retry path. An unknown opens the reconcile path.

## The retry path

On confirmed_failure: POST /tasks/:id/retry with action_id. Retries are allowed only within limits; exhausted limits escalate to human review (source doc). This keeps the retry loop inside the same budget regime the gate enforces, so a flaky provider cannot burn spend silently.

## The reconcile path: never re-dispatch on unknown

The source doc is emphatic: unknown outcomes (timeout after a possible side effect) are never retried blindly; reconcile first (source doc, Invariants). The reconcile endpoint is POST /tasks/:id/reconcile with action_id and evidence carrying observed: happened, did_not_happen, or unclear (source doc). Resolved evidence lets the task continue. Unclear evidence goes to human review. Re-dispatching on an unknown outcome risks a duplicate side effect, which is the failure class the whole verify-and-reconcile design exists to prevent.

The distributed-systems literature calls this the ambiguous-failure problem of at-least-once delivery: a timeout does not tell you whether the side effect landed, so the safe response is to check the target state (reconcile) before any repeat (https://www.cloudcomputingpatterns.org/at_least_once_delivery/, weight 0.12, weak; https://oneuptime.com/blog/post/2026-07-21-at-least-once-duplicates, weight 0.08, weak). The idempotent consumer pattern makes the same argument from the consumer side: dedupe on a stable key so a replayed message is a no-op (https://learn.microsoft.com/en-us/azure/architecture/patterns/idempotent-consumer, weight 0.31, weak). Jev combines both: the idempotency_key dedupes task creation (doc 03), and the reconcile step dedupes effect completion. Timeout-and-retry guidance for REST callers makes the same distinction between retrying a request that is known to have failed and one whose outcome is unknown (https://networkspy.app/blog/rest-api-timeouts-retries-idempotency, weight 0.08, weak; https://restfulapi.net/idempotent-rest-apis/, weight 0.17, weak).

## The evidence shape

The evidence object in a reconcile call carries at minimum the observed field with 1 of 3 values: happened (the effect occurred), did_not_happen (it did not), or unclear (cannot tell). Only happened and did_not_happen resolve without a human. This asymmetry is deliberate: an honest unclear is cheap, a guessed happened is expensive.

## Verify semantics for builtins (router branch)

The stock status_range predicate works on plain HTTP actions. Built-in dispatches need their own verify branch: in the hierarchy router, model dispatches verify verified_success only if the captured response text is non-empty, and automation dispatches verify from the run task's terminal state. The evidence carries route_verify with basis model_text or automation_run_state (source doc, Hierarchy Router section). Without this branch, the stock predicate finds nothing decidable on a model response and would demote a successful dispatch to unknown (source doc). This is the same lesson as guidelines item 2 in builtin form: verification is only as good as the predicates and branches declared for the action type.

## Acting on verdicts

Treat gate_outcome blocked as final unless the policy changes (source doc, Acting on results). Treat confirmed_failure as retryable within limits. Treat unknown as a work item for reconcile or a human. The 3 verdicts map to exactly 3 caller behaviors, and the source doc gives no fourth behavior, which keeps the loop closed.

## Sources

- Source doc: skills/jev-orchestrator/SKILL.md in yubi-OS/yubiOS (sections: Invariants; The flow; Acting on results; Guidelines; Hierarchy Router).
- https://learn.microsoft.com/en-us/azure/architecture/patterns/idempotent-consumer (weight 0.31, weak)
- https://restfulapi.net/idempotent-rest-apis/ (weight 0.17, weak)
- https://www.cloudcomputingpatterns.org/at_least_once_delivery/ (weight 0.12, weak)
- https://oneuptime.com/blog/post/2026-07-21-at-least-once-duplicates (weight 0.08, weak)
- https://networkspy.app/blog/rest-api-timeouts-retries-idempotency (weight 0.08, weak)
