# Cron scheduling with compare-and-set idempotency

Scope: the worker cron fires every 5 minutes and runs the scheduler tick; interval automations fire with a compare-and-set on `last_fired_at`; tasks carry per-interval idempotency keys; the design accepts a lost tick and refuses a double-fire.

## The platform primitive

The schedule is a Cloudflare Cron Trigger: `*/5 * * * *` in the Worker's trigger metadata. Cron Triggers map a cron expression to a Worker's `scheduled()` handler (https://developers.cloudflare.com/workers/configuration/cron-triggers/, weight 0.83). A single Worker can carry multiple cron expressions, and each invocation of `scheduled()` can distinguish which expression fired via `controller.cron` (https://developers.cloudflare.com/workers/runtime-apis/handlers/scheduled/, weight 0.81). Cloudflare announced Cron Triggers precisely for periodic jobs like maintenance and API collection (https://blog.cloudflare.com/introducing-cron-triggers-for-cloudflare-workers/, weight 0.96).

## Why a 5 minute tick rather than per-automation crons

The scheduler is a single dense tick: every 5 minutes the `runSchedulerTick` handler runs and checks which interval automations are due. Automations declare their interval in metadata (`triggers`), not as platform cron entries. The advantages: adding an automation never touches Worker configuration (which matters because cron trigger changes take up to 15 minutes to propagate, per the platform docs at weight 0.83), and the whole scheduling state lives in D1 next to the registry, so it is queryable and transactional.

## Compare-and-set on last_fired_at

Firing an interval automation is a compare-and-set: the scheduler updates `last_fired_at` only if it still holds the expected value. If the tick runs twice concurrently (or an overlapping invocation catches up), only one update wins, and only the winner creates tasks. This is the standard distributed-scheduler problem, and the design follows the same resolution Google's SRE book documents for its cron service: when reliability requirements differ per job, favor skipping launches rather than risking double launches (https://sre.google/sre-book/distributed-periodic-scheduling/, weight 0.92). The SRE text grounds the asymmetry concretely: a garbage-collection job can run twice safely, but a job that sends an email newsletter to a wide distribution must not launch more than once (same source, weight 0.92).

## Per-interval idempotency keys

Created tasks carry idempotency keys derived from the automation and its interval window, so even if the CAS layer were ever bypassed, the database deduplicates the task creation. This is the second belt in the exactly-once setup: CAS prevents the race, the key prevents the duplicate. Distributed scheduler design literature treats exactly-once dispatch as the union of a decision layer (who fires) and a dedup layer (who records), splitting them deliberately (https://pushkarkumar-dev.github.io/system-design/distributed-job-scheduler/, weight 0.65, weak-to-moderate backing; and https://hld.handbook.academy/curriculum/case-studies/job-scheduler/, weight 0.57, weak backing; both cited as the general pattern, not the implementation).

## Lost tick vs double-fire

The tradeoff is explicit: a lost tick is fine, a double-fire is not. A lost tick delays an interval automation by one tick cycle (at most 5 minutes of delay); a double-fire could send duplicate outreach or repeat an action whose effects are not idempotent. Because the automations being scheduled include gated sends (email), the double-fire side is where real damage lives. The compare-and-set plus idempotency keys align the failure budget accordingly.

## What moved off n8n

n8n's scheduler was the other half of the pipeline that stayed behind (n8n keeps only the searXNG proxy webhook). Interval scheduling on the worker means the firing decision, the CAS guard, and the task creation are one code path with one database, instead of a scheduler in one system handing off work to an executor in another.
