# 10 Rationalizations, Red Flags, and the Pre-Launch Gate

Scope: the source skill's own anti-pattern catalog, the rationalizations that precede bad instrumentation, and the review signals that catch it. Internal-record subtopic, no dig; every claim in this doc is from the source document.

## Source

This doc summarizes yubi-OS/yubiOS skills/observability-and-instrumentation/SKILL.md sections "Common Rationalizations" and "Red Flags" and its Verification checklist. No external dig was run for this subtopic; the content is the skill's own record and is attributed to the source doc throughout.

## The 7 rationalizations and their answers

| Rationalization | Source-doc answer |
|---|---|
| "I'll add logging after it works" | "After" becomes "after the first incident", the most expensive moment to discover you are blind. Instrument as you build. |
| "More logs = more observability" | Unstructured noise makes incidents slower, not faster. Three queryable events beat 300 prose lines. |
| "console.log is fine for now" | Unstructured output cannot be filtered, correlated, or alerted on. The structured logger costs 5 extra minutes once. |
| "We can just look at the dashboards when something breaks" | Dashboards built without defined questions show everything except the answer. Start from on-call questions. |
| "Alert on everything important, we'll tune later" | A noisy pager trains people to ignore it. The tuning never happens; the missed real page does. |
| "User ID as a metric label makes debugging easier" | It also makes your metrics backend fall over. High-cardinality lookups belong in logs and traces. |
| "Tracing is overkill for our two services" | 2 services already means cross-service latency questions logs cannot answer. Auto-instrumentation makes the cost trivial. |

Each rationalization is answered elsewhere in this corpus: instrument as you build (doc 01), queryable events (doc 03), question-first dashboards (doc 01), alert noise (doc 08), cardinality (doc 06), tracing economics (doc 07).

## The 10 red flags

The source doc's review checklist for any PR or system (source doc):

1. A feature PR with retries, queues, or external calls and zero new telemetry.
2. Log lines built by string interpolation instead of structured fields.
3. No correlation/request ID; each log line is an orphan.
4. One log stream fed by a scheduler, a webhook, and manual runs, with no field naming which one produced the line.
5. Metrics labeled with user IDs, raw URLs, or error message text (cardinality bomb).
6. Latency tracked as an average with no percentiles.
7. Alerts that fire daily and get acknowledged without action.
8. Alerts on causes (CPU, memory) paging humans while user-facing error rate is unmonitored.
9. Secrets, tokens, or full request bodies appearing in logs.
10. "It works on my machine" as the only evidence a production feature is healthy.

The mapping to the corpus: flags 1 through 4 are logging discipline (docs 03 and 04), flags 5 and 6 are metrics discipline (doc 06), flags 7 and 8 are alerting discipline (doc 08), flag 9 is the secrets rule (doc 05), and flag 10 is the evidence standard that doc 09 enforces.

## The pre-launch gate

The source doc's verification checklist is the positive form of the red-flag list, and it is described as "the at-a-glance checklist", including "the pre-launch instrumentation gate" (source doc). In short form:

1. On-call questions written down, each signal mapped to one.
2. All log output structured JSON with stable event names and a correlation ID on every line.
3. Entry-point field on every multi-writer sink, set at run start and propagated with the correlation ID.
4. No secrets, tokens, or unredacted PII in any log line (spot-checked on actual output).
5. RED metrics on every new endpoint and external dependency, with bounded label sets.
6. Latency as a histogram with queryable p95/p99.
7. One request followable end to end without broken spans.
8. Every new alert symptom-based, runbook-linked, and test-fired once.
9. An induced staging failure located via telemetry alone, without reading the source.

## How to use this doc

Treat red flags 1 through 10 as PR-review questions and the 9 checklist items as the ship gate. The rationalizations table is for design review: when one of the 7 sentences appears in a discussion, the source doc's answer is the standing reply. None of the items are new inventions here; they are the skill's own record, restated for wayfinding.
