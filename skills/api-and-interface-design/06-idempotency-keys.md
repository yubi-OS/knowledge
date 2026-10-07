# 06 Honouring an Idempotency Key

Scope: the skill's longest principle, and the one where it says the money is lost: accepting an `Idempotency-Key` is the contract, honouring it is the implementation, and a carelessly honoured key is worse than none.

## The contract and the implementation

The source doc opens: accepting an `Idempotency-Key` is the contract. Honouring it is the implementation, and it is where the money is lost. A key the server accepts but handles carelessly is worse than no key at all, because the client now believes retrying is safe (source doc). This is the rationalization table's point repeated: "accepting the Idempotency-Key header is enough" is false; the header is the contract, storing the key against the result is the implementation (source doc).

The reference implementation in production is Stripe's: the resulting status code and body of the first request made for a given idempotency key is saved, regardless of whether it succeeded or failed, and subsequent requests with the same key return that saved result (https://docs.stripe.com/api/idempotent_requests, jev weight 0.97, high). Stripe's engineering write-up on designing idempotency into APIs describes the same mechanism from the design side (https://stripe.com/blog/idempotency, weight 0.86, high). Google Cloud's idempotency guide frames the property: applying an operation multiple times has the same final effect as applying it once (https://cloud.google.com/discover/idempotency, weight 0.86, high).

## Derive the key from the intent, not the attempt

The key must be stable across retries of one intent and different across distinct intents (source doc). The source doc shows 3 broken derivations and 2 correct ones:

- `crypto.randomUUID()`: new key per attempt, so every retry is a new charge (source doc).
- `${userId}:${amount}`: two legitimate $50 charges collapse into one (source doc).
- `${orderId}:${Date.now()}`: a timestamp is randomUUID() wearing a hat (source doc).
- `req.headers['idempotency-key']`: the client generates once and reuses on retry (source doc).
- `charge:v1:${orderId}`: derived from an immutable identifier (source doc).

And the placement rule: the key comes from the client or the initiating event, never from the layer doing the retrying (source doc).

## Claim atomically

A check followed by an act is a race. The source doc shows the TOCTOU failure: two concurrent retries both read "not seen", both charge (source doc):

```typescript
// ✗ race: check-then-act
if (!(await db.exists(key))) {
  await chargeCard(amount);
  await db.insert(key);
}
```

The fix is to let the database's unique constraint pick the winner (source doc):

```typescript
try {
  await db.insert({ key, state: 'in_progress', requestHash });
} catch (e) {
  if (isUniqueViolation(e)) return replayOrReject(key);
  throw;
}
const result = await chargeCard(amount);
await db.update({ key, state: 'succeeded', response: result });
```

The source doc is categorical: the unique constraint IS the mechanism. A store that cannot enforce uniqueness in one operation cannot back this (source doc). The red flag list repeats it in SQL clothing: a `SELECT` for an idempotency key followed by an `INSERT` is a race, not a guard (source doc). The check-then-act race family is well documented in the security literature (https://windshock.github.io/en/post/2026-08-25-race-condition-toctou-mitigation/, jev weight 0.16, weak; label as weak backing for the general TOCTOU framing).

## Guard the payload

Same key with a different body is a client bug, and it must fail loudly rather than serve the first response to a second request (source doc):

```typescript
if (existing.requestHash !== hash(req.body)) {
  return res.status(422).json({ error: 'idempotency key reused with a different payload' });
}
```

Without this guard, a reused key silently replays the first response, which is exactly the careless honouring the doc warns about (source doc).

## In-flight duplicates

The first request is still running when the second arrives, the common case under retry storms. The source doc tabulates 3 deliberate strategies (source doc):

| Strategy | Response | Use when |
|---|---|---|
| Reject | 409 Conflict | Client can retry later; simplest and safest |
| Wait | Block for the result, bounded | Caller needs it synchronously |
| Return pending | 202 + status URL | Long-running effects |

And the rule: never let the second caller through because the first "seems stuck". A stalled attempt whose fate is unknown is exactly when duplicating costs most (source doc).

## Three outcomes and retention

Two closing rules complete the implementation (both from the source doc):

1. Every call has 3 outcomes, not 2: success, failure, and unknown. A timeout tells you nothing about whether the effect applied. Record the intent before calling out, so a crash between the call and the response leaves evidence something must resolve later, rather than a silently retried charge.
2. Set retention from the longest retry chain, not from disk cost. Keys must outlive every path that can re-deliver the same intent, including a dead-letter queue replayed a week later and any provider dispute window. A 24-hour key TTL behind a 7-day DLQ is a duplicate waiting to happen. The red flag list encodes it: a key retention window shorter than the longest path that can re-deliver the request (source doc).

The broader background property is idempotence itself: an operation repeated one or more times yields the same result (https://www.freecodecamp.org/news/idempotence-explained, jev weight 0.28, weak; the mathematical property at https://en.wikipedia.org/wiki/Idempotence, 0.40/0.46, weak). The queue-delivery caveat is the source doc's own: no queue guarantees exactly-once across a consumer crash, because the broker's ack and your side effect are not in one transaction; design for at-least-once with idempotent processing (source doc).

## Verification

The checklist binds all of it (source doc): state-changing endpoints either honour an idempotency key or are documented as unsafe to retry; the key is claimed in one atomic operation guarded by a unique constraint; a reused key with a different payload fails loudly; the in-flight-duplicate response is a deliberate choice (409, wait, or 202); key retention outlives the longest retry path including dead-letter replay.
