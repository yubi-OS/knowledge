# 04 Correlation IDs and Entry-Point Attribution

Scope: a request ID generated (or accepted) at the system boundary and attached to every log line, span, and outbound call, plus an explicit entry-point field stamped where the run starts and propagated the same way.

## The mandatory correlation ID

The ground source (yubi-OS/yubiOS skills/observability-and-instrumentation/SKILL.md) is absolute: "Correlation IDs are mandatory. Generate (or accept) a request ID at the system boundary and attach it to every log line, span, and outbound call. Without it, you cannot reconstruct a single request from interleaved logs" (source doc). Its Express example accepts an incoming x-request-id header or mints crypto.randomUUID(), binds it to a per-request child logger, and echoes it back on the response (source doc). The red-flag list calls a log stream without correlation IDs what it is: "each log line is an orphan" (source doc).

Microsoft's engineering fundamentals playbook recommends the same mechanics: assign each external request a correlation ID that binds the message to a transaction, assign it as early as possible, and propagate it to all downstream services (https://microsoft.github.io/code-with-engineering-playbook/observability/correlation-id/, weight 0.58). The agreement between the source doc and a large org's playbook is the strongest external backing this subtopic collected.

## Propagation mechanics

The ID has to cross every async boundary or the trace dies at the gap (source doc, tracing section; source doc, entry-point section). Externally, the W3C Trace Context standard is the wire format for carrying trace context across HTTP, gRPC, and message queues so distributed traces stay connected end to end (https://beefed.ai/en/w3c-trace-context-propagation, weight 0.34, weak). OneUptime's trace-context design note adds that HTTP headers, gRPC metadata, and message headers all need context propagation, and recommends leaning on the OpenTelemetry SDK's battle-tested propagators rather than hand-rolling (https://oneuptime.com/blog/post/2026-01-30-trace-context-design/view, weight 0.25, weak). A practitioner guide on structured JSON logs lists the standard field set: trace_id, span_id, request_id for correlation, with W3C traceparent as the HTTP carrier and X-Request-Id as fallback (https://kevinmarcondes.online/en/structured-json-logs-request-correlation, weight 0.35, weak).

## The entry-point field: correlation is not attribution

This is the section where the source doc goes beyond standard correlation-ID advice. A correlation ID identifies a run; it does not say which code path started it (source doc). When the same job can be reached by a scheduler, a replay endpoint, and a manual CLI run, all three produce interchangeable lines in one sink, and attributing a line falls back to elimination: cross-reading the scheduler's history, the process table, a deploy log. That argument "holds only as long as those external records happen to still exist" (source doc).

The fix is to stamp the entry point where the run starts, next to the correlation ID, and propagate both the same way (source doc):

```typescript
export const runLog = (entryPoint: 'scheduler' | 'replay_endpoint' | 'cli', runId: string) =>
  logger.child({ entryPoint, requestId: runId });
```

Three field-level rules from the source doc:

1. Name it entryPoint, not source, because ECS reserves source.* for network fields (source doc).
2. Both fields cross the same boundaries as the correlation ID: queue metadata, HTTP headers. Otherwise a worker re-derives the entry point and guesses (source doc).
3. "A field that merely correlates with an entry point is a hint, not an attribution: anything that can invoke the job can reproduce it" (source doc).

The verification checklist encodes this: "Every log sink written by more than one entry point carries an entry-point field, set where the run starts and propagated with the correlation ID rather than inferred downstream" (source doc).

## Practical summary

One ID per transaction, assigned at the boundary, on every line, span, and outbound call. One entry-point field per run, stamped at the start, propagated beside the ID. W3C traceparent on the wire where available. Anything inferred downstream is a hint, and hints are how multi-entry-point jobs become archaeology.
