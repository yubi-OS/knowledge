# skills/observability-and-instrumentation - knowledge corpus

Minted from the ground source yubi-OS/yubiOS skills/observability-and-instrumentation/SKILL.md: "Instruments code so production behavior is visible and diagnosable - logging, metrics, tracing, alerting, and evidence-that-it-works discipline for shipped features." The corpus explicates the skill; the SKILL.md remains the primary source of record.

## Docs

| NN | slug | scope |
|---|---|---|
| 01 | [01-define-working-questions.md](01-define-working-questions.md) | Write the 2 to 4 on-call questions before any signal; telemetry without a question is noise. |
| 02 | [02-signal-selection-cost-model.md](02-signal-selection-cost-model.md) | Logs vs metrics vs traces by cost profile; metrics say that, traces say where, logs say why. |
| 03 | [03-structured-logging.md](03-structured-logging.md) | Log events not prose: JSON objects, stable event names, machine-readable fields, levels with on-call meaning. |
| 04 | [04-correlation-and-entry-point.md](04-correlation-and-entry-point.md) | Correlation IDs at the boundary plus an explicit entry-point field, both propagated everywhere. |
| 05 | [05-secrets-and-pii-in-logs.md](05-secrets-and-pii-in-logs.md) | Never log secrets, tokens, passwords, or full PII; allowlist fields; pipeline-level scrubbing. |
| 06 | [06-metrics-red-use-cardinality.md](06-metrics-red-use-cardinality.md) | RED and USE, histograms with p50/p95/p99, and cardinality as the failure mode. |
| 07 | [07-distributed-tracing-otel.md](07-distributed-tracing-otel.md) | OpenTelemetry, auto-instrumentation, manual spans, propagation, head vs tail sampling. |
| 08 | [08-symptom-based-alerting.md](08-symptom-based-alerting.md) | Alert on symptoms users feel; actionable, runbook-linked, SLO-justified; two severities only. |
| 09 | [09-verify-telemetry-works.md](09-verify-telemetry-works.md) | Trigger the paths and inspect actual output: staged errors, test traffic, trace follow, alert fire drill. |
| 10 | [10-red-flags-rationalizations.md](10-red-flags-rationalizations.md) | The skill's own anti-pattern catalog and the pre-launch verification gate. Internal-record subtopic, no dig. |

## Research summary

- Results collected: 108 (2 searXNG queries per web-shaped subtopic, top 6 kept per query, deduped by URL within subtopic; 18 queries across 9 subtopics)
- Weight split: 22 high (>= 0.5) / 86 low (< 0.5) of 108
- jev requests: 10 via DefAPI direct (https://api.defapi.org/api/v1/decisions, model typesafe/jev-1.13), usage 13194 input / 2242 output tokens
- Redo counts: 0 (no dig needed a redo; no weighting request failed)
- Skipped docs: none
- Outline validation: 1 score request over 10 subtopics; none dropped; t10 (red-flags-rationalizations) validated at score 1.02 with confidence 0.01 and kept as an internal-record subtopic (no dig required by the skills-variant rule)
- Strongest external backing per subtopic: OpenTelemetry primer (0.95), IBM/Elastic pillars (0.60-0.63), Uptrace structured logging (0.56), Microsoft correlation-ID playbook (0.58), OWASP Logging Cheat Sheet (0.64-0.67) and PostHog PII scrubbing (0.91), Prometheus (0.96) and Robust Perception cardinality (0.62), OpenTelemetry docs suite (0.93-0.97), Google SRE book monitoring chapter (0.96) and practical alerting (0.91), Martin Fowler domain-oriented observability (0.76)

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator; agent digs returned 40-71 results per query); DefAPI direct (jev-1.13) 200 across all 10 requests.

## Research DB

Under research-db/: preflight.json, outline.json, archive.json (108 entries), digs/ (10 records), jev-log.json (10 requests), db.ts (schema v2 interfaces).
