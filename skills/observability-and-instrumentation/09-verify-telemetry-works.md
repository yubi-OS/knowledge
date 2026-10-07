# 09 Verify the Telemetry Itself

Scope: instrumentation is code and can be wrong; before calling the work done, trigger the paths and inspect the actual output, then fire each alert once.

## The principle

The ground source (yubi-OS/yubiOS skills/observability-and-instrumentation/SKILL.md): "Instrumentation is code; it can be wrong. Before calling the work done, trigger the paths and look at the actual output" (source doc). Martin Fowler's domain-oriented observability article makes the same argument for treating observability code like production code: instrumentation should be written, reviewed, and exercised with the same care as the logic it observes, because untested telemetry is unverified code that only fails to matter at the moment it matters most (https://martinfowler.com/articles/domain-oriented-observability.html, weight 0.76).

ServiceNow's observability guidance states the staging requirement directly: ensure observability configurations are thoroughly tested and validated in staging environments before deployment to production (https://www.servicenow.com/products/it-operations-management/what-is-observability.html, weight 0.31, weak).

## The four checks

The source doc's verification procedure (source doc):

1. Force an error in staging, then find it in the logs by requestId, and confirm fields are structured (not [object Object]). This tests docs 03 and 04 together: structured output and a correlation ID that actually reaches the error path.
2. Send test traffic, then confirm metric series appear with the expected labels and sane values. This tests the RED/USE wiring from doc 06, including the bounded label sets.
3. Follow one request across services in the tracing UI and confirm there are no broken spans. This tests context propagation across every async boundary (doc 07).
4. Fire each new alert once by lowering the threshold temporarily, then confirm it reaches the right channel and the runbook link works. This tests doc 08 end to end, including the human path.

Each check inspects output, not source. The distinction is deliberate: the failure modes (interpolated strings, missing series, broken spans, dead notification channel) are all runtime-visible only.

## The alert fire drill

The alert check deserves emphasis because alert delivery is the least-tested path in most pipelines. A practitioner guide on paging-pipeline fire drills argues for a monthly synthetic-alert test precisely because expired tokens, silently-disabled background refresh, and renumbered channels only show up when an alert is actually fired (https://www.bigiron.cc/guides/fire-drill-your-paging-pipeline-the-monthly-test, weight 0.28, weak). The source doc's one-time test-fire at ship time is the minimum; at weight 0.28, the monthly cadence is weak-backed practitioner advice, noted as drift the source doc does not cover rather than a requirement.

## The checklist as gate

The source doc's verification section ends with a 9-item checklist (source doc): on-call questions written and mapped; all log output structured with stable event names and a correlation ID; entry-point field on multi-writer sinks; no secrets or unredacted PII in any line (spot-checked); RED metrics for every new endpoint and dependency with bounded labels; latency as queryable histogram percentiles; one request followable end to end without broken spans; every alert symptom-based, runbook-linked, and test-fired; and an induced staging failure located via telemetry alone, without reading the source.

The last item is the strongest: it verifies the whole stack by its purpose. If a staged failure can be diagnosed from telemetry alone, the instrumentation answers the on-call questions written in doc 01; if it cannot, the gap is in the telemetry, not the engineer. The checklist is explicitly described in the source doc as "the at-a-glance checklist" including "the pre-launch instrumentation gate" (source doc).

## Practical summary

Trigger, then look. Four runtime checks: error by requestId with structured fields, metric series with expected labels, one traceable request across services, one fired alert with a working runbook link. Close with the induced-failure test: if telemetry alone cannot diagnose it, the feature is not done.
