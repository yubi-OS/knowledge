# 07. Idempotency and Reversibility of Atomic Actions

**Scope:** Idempotency and reversibility of atomic actions: idempotency keys, compensating actions, and recovery when the outcome of an action is unknown.

## The three-failure reality

Any action that crosses a network boundary has three ways to fail, and only some of them are clean. Stripe's engineering writeup on idempotency enumerates them: "1. The initial connection could fail as the client tries to connect to a server. 2. The call could fail midway while the server is fulfilling the operation, leaving the work in limbo. 3. The call could succeed, but the connection break before the server can tell" the client (https://stripe.com/blog/idempotency, weight 0.65). The first failure is safe to retry. The second and third are the dangerous ones: the work may or may not have happened, and the caller cannot tell which.

This ambiguity window is the core problem for any auditable action. If an improvement cycle's write step is interrupted, a naive retry can duplicate the change while a naive abort can leave the record absent, and either outcome corrupts the audit trail. The atomic action of doc 01 needs a story for the middle case, and that story is idempotency.

## Idempotency keys

The API-level answer is the idempotency key. Stripe's API reference states the contract: "The API supports idempotency for safely retrying requests without accidentally performing the same operation twice. When creating or updating an object, use an idempotency key" (https://docs.stripe.com/api/idempotent_requests, weight 0.65). The caller generates a unique key per logical operation and attaches it to every retry of that operation; the server records which key completed and replays the original result instead of re-executing. With this mechanism, the ambiguous middle collapses: whether the first attempt completed or not, the retry is safe and deterministic.

The general principle is older than the API pattern: idempotence is the property that applying an operation more than once has the same effect as applying it once (https://en.wikipedia.org/wiki/Idempotence, weak backing, weight 0.20). Distributed-systems practice treats it as the survival trait of any retried operation: "retries are inevitable. Idempotency is how you survive them" (https://cloudrps.com/blog/idempotency-distributed-systems-production/, weak backing, weight 0.30).

For change artifacts the equivalent is content addressing, described in doc 02: because a Merkle leaf's identity is derived from its content, writing the same artifact twice yields the same address and no duplication. An improvement-cycle commit keyed by the hash of its own bundle is idempotent by construction rather than by protocol.

## Reversibility: the compensating action

Not every action can be made idempotent, and some must be undone rather than retried. The saga pattern handles this: "if a local transaction fails because it violates a business rule then the saga executes a series of compensating transactions that undo the changes that were made by the preceding local transactions" (https://microservices.io/patterns/data/saga.html, weak backing, weight 0.44). Temporal's guide frames the goal: compensating actions are "a distributed systems design pattern for simulating atomic execution of operations distributed across multiple databases. If one of the distributed operations fails, their effects are undone via a compensating action" (https://temporal.io/blog/compensating-actions-part-of-a-complete-breakfast-with-sagas, weak backing, weight 0.28).

The Microsoft Azure Architecture Center adds the design warning most implementations miss: "implement a compensating transaction that undoes the effects of completed steps in the original operation. You might think that you can simply restore the system to its original state, but this approach can overwrite changes from other concurrent application instances" (https://learn.microsoft.com/en-us/azure/architecture/patterns/compensating-transaction, weak backing, weight 0.41). A correct reversal must undo only the action's own effects, which requires the action to record what it touched.

## Application to the improvement cycle

An improvement cycle's action, an edit to a skill, a doc, a parameter, needs both mechanisms:

1. Idempotency by content. Each cycle's artifact bundle is addressed by its Merkle root. Re-delivering the same cycle is a no-op because the root already exists; the audit log grows by exactly one entry per distinct change.
2. Reversal by compensating commit. When verification rejects an action, the rollback is itself an atomic action with its own artifact: a revert commit whose bundle references the root it reverses. The history keeps the failed attempt as evidence rather than erasing it, which is what distinguishes an auditable process from a tidy one.

The ordering discipline from the saga literature applies directly: compensations must run in reverse order of completion (https://microservices.io/patterns/data/saga.html, weak backing), and in a one-action-per-cycle regime that ordering is trivial because there is never more than one pending action to unwind.

## Weak source boundaries

Only the two Stripe sources (0.65 each) meet the authority threshold in this dig. The saga and compensating-transaction material is clustered at 0.20 to 0.44, from vendor docs and tutorials, and is labeled weak. The composite design claim, that an improvement action should be content-addressed for idempotency and reversed by a logged compensating action rather than deleted, is this framework's synthesis of those patterns and is not directly attributable to any single cited source.
