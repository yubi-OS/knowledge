# 06 - Alarms: One Timer per Object

Scope: the alarm API surface (setAlarm, alarm handler, deleteAlarm), the one-alarm-per-object rule, retry semantics, and the scheduling patterns the skill and its dig sources teach.

## The API surface

The source doc's Alarms section is short and absolute (yubi-OS/yubiOS skills/durable-objects/SKILL.md, source doc):

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

Critical rule 7 states the core constraint: "One alarm per DO - setAlarm() replaces any existing alarm" (source doc). The Alarms API reference confirms both halves: "Each Durable Object is able to schedule a single alarm at a time by calling setAlarm(). Alarms have guaranteed at-least-once execution and are retried automatically when the alarm() handler throws. Retries are performed using exponential backoff" (https://developers.cloudflare.com/durable-objects/api/alarms/, jev weight 0.95).

Two properties follow that reviews should check:

1. At-least-once execution means the alarm handler must be idempotent. A retried alarm reprocesses work that may have partially completed before the throw.
2. setAlarm is a replace, not a queue. Scheduling a second timer silently discards the first; multi-timer designs must encode their own queue in SQLite (doc 04) and use the single alarm as the drain trigger.

## The mechanics

The alarms.mdx source adds the execution detail: "When the alarm's scheduled time comes, the alarm() handler method will be called. Alarms are modified using the Storage API, and alarm operations follow the same constraints as the rest of the Storage API" (https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/durable-objects/api/alarms.mdx, weight 0.88). The launch blog adds `getAlarm()` for reading the currently scheduled time, set via `state.storage.setAlarm()` (https://blog.cloudflare.com/durable-objects-alarms/, weight 0.83).

The canonical pattern from the docs example is alarm-as-batcher: "When a request is received and no alarm is set, it sets an alarm for 10 seconds in the future. The alarm() handler processes all requests received" (https://developers.cloudflare.com/durable-objects/examples/alarms-api/, weight 0.95). That is the idiomatic resolution of the one-alarm limit: requests append to storage, the first one arms the timer, the handler drains the batch and clears it. A scheduling-system post builds a fuller version of the same idea on Workers plus DOs (https://blog.cloudflare.com/building-scheduling-system-with-workers-and-durable-objects/, weight 0.80).

## Self-rescheduling and idempotence

For recurring work, the docs-adjacent guidance (weight 0.16, weak backing, labeled weak) is to "use the single alarm per object for the next due task and make the handler idempotent and self-rescheduling" (https://flaviocopes.com/courses/cloudflare/schedule-per-object-work-with-alarms/). The strong versions of this live in the first-party sources already cited: at-least-once execution plus exponential backoff (0.95) forces idempotence, and the optional reschedule line in the source doc's handler comment is the self-rescheduling pattern.

One operational caution from a low-weight field-notes page (weight 0.10, weak backing): an alarm handler has substantial wall time and "runs concurrently with other requests to the object; do not assume it holds a lock" (https://www.hesham.us/cloudflare-field-manual/cloudflare-durable-object-alarms-are-per-object-timers). The first-party docs do not state a lock either way; the safe review position is that alarm handlers must not assume exclusivity and must use the same persist-first, atomic-write discipline as request handlers (doc 04).

## Review checklist for alarms

1. Every setAlarm call site is checked for the replace semantics: arming a timer for feature B must not cancel a pending timer for feature A (source doc rule 7; alarms reference weight 0.95).
2. The alarm handler is idempotent and clears or advances state before rescheduling, so retries after a throw do not double-apply work (alarms reference weight 0.95).
3. Recurring schedules reschedule inside the handler (source doc handler comment) rather than relying on callers to re-arm.
4. Batched-work designs store the queue in SQLite and use the alarm as the drain trigger (alarms-api example weight 0.95).
5. deleteAlarm is used to cancel, and cancellation paths handle "no alarm set" gracefully (source doc).
6. Alarm times come from storage-consistent state, not from memory-only variables that eviction would lose (source doc anti-pattern: storing critical state only in memory).
