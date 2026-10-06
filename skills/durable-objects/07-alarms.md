# 07 - Alarms

Scope: the alarm subsystem: one alarm per Durable Object, setAlarm semantics, the alarm() handler, retry behavior, cancellation, and the batching and scheduling patterns the skill points at.

## The one-alarm rule

Critical rule 7 in the source doc: one alarm per DO. setAlarm() replaces any existing alarm (source doc: yubi-OS/yubiOS skills/durable-objects/SKILL.md). Cloudflare's Alarms reference states the same constraint: each Durable Object is able to schedule a single alarm at a time by calling setAlarm() (https://developers.cloudflare.com/durable-objects/api/alarms/, jev weight 0.95, page dated April 21, 2026). There is no alarm queue inside an object; if you need a second scheduled event, you reschedule or model it in stored state.

## Scheduling, handling, canceling

The source doc's Alarms section gives the 3 operations (source doc):

```typescript
// Schedule (replaces existing)
await this.ctx.storage.setAlarm(Date.now() + 60_000);

// Handler
async alarm(): Promise<void> {
  // Process scheduled work
  // Optionally reschedule: await this.ctx.storage.setAlarm(...)
}

// Cancel
await this.ctx.storage.deleteAlarm();
```

Note where the methods live: setAlarm and deleteAlarm are storage operations, called on this.ctx.storage, and the handler is the alarm() method on the class. Cloudflare's alarms documentation confirms that alarms are modified using the Storage API and that alarm operations follow the same rules as other storage operations (https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/durable-objects/api/alarms.mdx, jev weight 0.88). The same source describes the mechanism: alarms allow you to schedule the Durable Object to be woken up at a time in the future, and when the scheduled time comes the alarm() handler method is called (same source, jev weight 0.88).

## Retry semantics

Cloudflare's Alarms reference documents the durability guarantee: alarms have guaranteed at-least-once execution and are retried automatically when the alarm() handler throws. Retries are performed using exponential backoff starting at a 2 second delay from the first failure, with up to 6 retries allowed (https://developers.cloudflare.com/durable-objects/api/alarms/, jev weight 0.95). Design consequence: the handler must be idempotent, because at-least-once means it can run again after a partial failure.

## When alarms fire

A scheduled alarm wakes the object even when no requests are in flight; that is what makes per-entity scheduled work (subscription renewals, game timeouts, per the source doc's use-for table) possible without a separate scheduler. Cloudflare's alarms announcement frames the capability as calling a function at a defined point in the future, unlocking deeper use cases like reliable queuing (https://blog.cloudflare.com/durable-objects-alarms/, jev weight 0.82).

## The batching pattern

The documented alarms example is the pattern the skill's use-case table points at for batching: an alarm() handler that allows batching of requests to a single Durable Object, where when a request is received and no alarm is set, the object sets an alarm for 10 seconds in the future (https://developers.cloudflare.com/durable-objects/examples/alarms-api/, jev weight 0.95, dated April 21, 2026). Requests accumulate in storage; the alarm fires once; the handler processes the accumulated batch. This pairs with the one-alarm rule: the alarm is a coalescing point, and the "is an alarm already set" check is what keeps later requests from replacing an earlier schedule.

A fuller worked example is Cloudflare's scheduling-system build, which uses Durable Objects for storage of HTTP requests and Alarms to schedule them, on top of Wrangler and Workers (https://blog.cloudflare.com/building-scheduling-system-with-workers-and-durable-objects/, jev weight 0.79).

## Rescheduling and cancellation

The source doc's handler comment marks the standard continuation pattern: optionally reschedule inside alarm() with another setAlarm call (source doc). Recurring schedules are therefore self-perpetuating: each firing decides its own next time. deleteAlarm cancels a pending alarm (source doc).

## Interaction with other rules

Two source-doc rules bind alarms to the rest of the corpus:

1. Persist-first (rule 6): if the alarm handler updates state, write to storage before updating in-memory state, and treat the handler's at-least-once execution as reason to make those writes idempotent (source doc; https://developers.cloudflare.com/durable-objects/api/alarms/, jev weight 0.95).
2. Storage rules for alarm operations: because alarm operations follow the same rules as other storage operations, the atomicity discipline from doc 04 applies to alarm bookkeeping too (https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/durable-objects/api/alarms.mdx, jev weight 0.88).

## Review checklist

1. Exactly one pending alarm per object at any time; new setAlarm calls are intentional replacements, not accidental overwrites (source doc rule 7).
2. alarm() handler is idempotent under at-least-once retry with exponential backoff from 2 seconds, up to 6 retries (https://developers.cloudflare.com/durable-objects/api/alarms/, jev weight 0.95).
3. Rescheduling happens inside the handler when the schedule is recurring (source doc).
4. Alarm state read from storage, not from in-memory fields (source doc rule 6).

## Summary

One alarm per object, set through the storage API, fired as the alarm() method at the scheduled time, retried at least once with exponential backoff from 2 seconds and up to 6 retries on throw. The documented patterns are batching (set a short future alarm, drain on fire) and per-entity scheduled work with self-rescheduling handlers. Cancel with deleteAlarm.
