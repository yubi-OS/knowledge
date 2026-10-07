# 02 Choosing Between Logs, Metrics, and Traces

Scope: choosing the right signal per question using each signal's cost profile, so the same question is not answered three times in three expensive formats.

## The source-doc signal table

The ground source (yubi-OS/yubiOS skills/observability-and-instrumentation/SKILL.md) gives a 3-row decision table (source doc):

| Signal | Answers | Cost profile | Example |
|---|---|---|---|
| Structured log | "What happened in this specific case?" | Per-event; grows with traffic | payment_failed with provider error code |
| Metric | "How often / how fast, in aggregate?" | Fixed per series; cheap to query | p99 latency of provider calls |
| Trace | "Where did time go across services?" | Per-request; usually sampled | One slow checkout, broken down by hop |

Its rule of thumb: "metrics tell you that something is wrong, traces tell you where, logs tell you why" (source doc). The cost profiles are the part most teams skip. A log line is paid for on every event, so its storage grows with traffic. A metric series costs a fixed amount per series, so it is cheap to query but explodes if the label set is unbounded (see doc 06). A trace is paid per request and is therefore usually sampled.

## The three-pillars framing, with a dated correction

The industry framing behind the table is the "three pillars of observability". IBM describes metrics, logs, and traces as the three telemetry pillars that make systems easier to visualize and understand (https://www.ibm.com/think/insights/observability-pillars, weight 0.62). Elastic's guide covers the same three signals and how they combine for decision-making (https://www.elastic.co/blog/3-pillars-of-observability, weight 0.60).

Where the dig world has moved past the source doc: Elastic argues metrics, logs, and traces are "not enough on their own" and adds continuous profiling as a fourth signal that answers the "why" questions with granular visibility into unknown-unknowns (https://www.elastic.co/blog/observability-profiling-metrics-logs-traces, weight 0.63). Logz.io makes the same point about continuous profiling in the OpenTelemetry stack (https://logz.io/blog/continuous-profiling-new-observability-signal-in-opentelemetry/, weight 0.27, weak). The source doc does not mention profiling; this is drift, noted here as a dated correction rather than a contradiction. The source doc's selection logic (which signal answers which question, at what cost) still holds; profiling extends the menu, it does not replace the rule of thumb.

Wikipedia's observability article (https://en.wikipedia.org/wiki/Observability, weight 0.39, weak) supplies the control-theory origin of the term: how well internal states can be inferred from external outputs. Cited as weak background only.

## How to apply it

For each on-call question written down in doc 01, pick exactly one primary signal:

1. A question about one specific case ("when payment X failed, why?") maps to a structured log event with machine-readable fields (source doc).
2. A question about aggregate behavior ("how often do payments fail?") maps to a metric, ideally a histogram so percentiles are queryable (source doc).
3. A question about time and hops ("where did the 4 seconds go?") maps to a trace, which is why even 2 services justify tracing, since cross-service latency questions are ones logs cannot answer (source doc, rationalizations table).

The mapping also protects budget: because metrics are the cheapest per question, aggregate questions belong in metrics even when a log line would be easier to write, and the log line is reserved for the case-level detail the metric cannot carry (source doc, cost table).

## Practical summary

Pick the signal from the question, not from habit. Metrics for that, traces for where, logs for why. Log cost grows with traffic, metric cost grows with series count, trace cost grows with request volume and is capped by sampling. Expect the signal menu to keep growing (profiling is the current addition) but let the question-first rule stay fixed.
