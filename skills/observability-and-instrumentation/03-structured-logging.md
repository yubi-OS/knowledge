# 03 Structured Logging

Scope: log events, not prose: every log line is a JSON object with a stable event name and machine-readable fields, with log levels used consistently.

## Events, not prose

The ground source (yubi-OS/yubiOS skills/observability-and-instrumentation/SKILL.md) draws the line with a TypeScript pair (source doc):

```typescript
// BAD: string interpolation - unqueryable, inconsistent
logger.info(`Payment ${id} failed for user ${userId} after ${n} retries`);

// GOOD: stable event name + structured fields
logger.warn({
  event: 'payment_failed',
  paymentId: id,
  provider: 'stripe',
  errorCode: err.code,
  attempt: n,
}, 'payment failed');
```

The bad version cannot be filtered, correlated, or alerted on, because every line is a unique sentence (source doc, rationalizations table). The source doc's counter-rule: "Three queryable events beat three hundred prose lines." Uptrace's structured logging guide agrees at the mechanism level: structured logging means each log entry is written as a predictable format (JSON key-value pairs) so it can be queried by field instead of parsed as text (https://uptrace.dev/glossary/structured-logging, weight 0.56).

The console.log rationalization is called out by name: "Unstructured output can't be filtered, correlated, or alerted on. The structured logger costs five extra minutes once" (source doc).

## Log levels with on-call meaning

The source doc assigns each level an on-call action, which is what makes levels operational rather than decorative (source doc):

| Level | Meaning | On-call action |
|---|---|---|
| error | Invariant broken; someone may need to act | Investigate |
| warn | Degraded but handled (retry succeeded, fallback used) | Watch for trends |
| info | Significant business event (order placed, job finished) | None |
| debug | Diagnostic detail | Off in production by default |

Better Stack's log-levels guide covers the same 4 levels and their conventional semantics (https://betterstack.com/community/guides/logging/log-levels-explained/, weight 0.30, weak); its agreement matters less than its existence, since the level table above is a source-doc policy choice with the on-call action column added.

## The field discipline

Two rules from the source doc govern the fields themselves:

1. Stable event names. The event field is a small closed vocabulary (payment_failed, order_placed, job_finished), not free text. Stable names are what make dashboards and alerts buildable on top of logs.
2. Machine-readable fields. Anything a query would need to filter on (paymentId, provider, errorCode, attempt) is its own field, never embedded in the message string.

Red flags the source doc attaches to this section (source doc): log lines built by string interpolation instead of structured fields, and debug-level noise shipped to production. The verification checklist requires "All log output is structured (JSON), with stable event names and a correlation ID on every line" (source doc); the correlation ID itself is covered in doc 04.

## What structured logging buys at incident time

The chain is: structured fields mean filterable queries, filterable queries mean the on-call engineer can go from "payments are failing" to "payments failing with errorCode card_declined after attempt 3 on provider stripe" in one query instead of reading prose (source doc; https://uptrace.dev/glossary/structured-logging, weight 0.56). This is also the precondition for doc 09's verification step: you cannot confirm fields are structured by looking at output unless the output is actually structured objects rather than interpolated strings.

## Practical summary

Every line: JSON object, stable event name, fields for everything a query would filter on, level chosen by its on-call action. No string interpolation. Debug off in production. The 5 minutes the structured logger costs once is cheaper than the first incident spent archaeology-ing prose.

## Levels are a contract, not a preference

The on-call action column in the table above is what turns levels from style into contract (source doc). Because error means "someone may need to act", an error line commits the team to either acting or explicitly downgrading the level; because info carries no action, info is where business events accumulate without paging anyone. Teams that skip this mapping end up with error streams nobody reads, which the source doc's alerting section treats as the same disease as noisy paging: signal that has stopped meaning anything (source doc). Choosing the level is therefore a decision about human attention, and it should be made when the line is written, not during the incident.
