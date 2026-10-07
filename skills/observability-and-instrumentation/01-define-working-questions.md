# 01 Define the Questions Before You Instrument

Scope: writing down the 2 to 4 questions an on-call engineer will ask about a feature before adding any signal, because telemetry without a question is noise.

## The source-doc rule

The ground source (yubi-OS/yubiOS skills/observability-and-instrumentation/SKILL.md) states the discipline plainly: "Telemetry without a question is noise. Before adding any instrumentation, write down 2 to 4 questions an on-call engineer will ask about this feature." Its worked example is a checkout payment retry feature, with 3 questions: what fraction of payments succeed on first attempt versus after retry; when a payment fails permanently, why (provider error, timeout, or validation); and whether the payment provider is slower than usual. Every signal added afterwards must help answer one of those questions. The skill's verdict is blunt: "If you can't name the questions, you're not ready to instrument. You'll log everything and learn nothing" (source doc).

## What observability means from the outside

The OpenTelemetry observability primer (https://opentelemetry.io/docs/concepts/observability-primer/, weight 0.95) defines observability as letting you "understand a system from the outside by letting you ask questions about that system without knowing its inner workings". That definition is why the question-first order matters: the questions are the interface between the on-call engineer and the telemetry. The source doc's opening line, "Code you can't observe is code you can't operate," is the same idea in operational terms (source doc).

IBM's observability primer (https://www.ibm.com/think/topics/observability, weight 0.56) describes the mechanism: observability platforms continuously discover and collect performance telemetry by integrating with instrumentation built into application and infrastructure components. The instrumentation is deliberate, built-in work, not an accident of verbose code. IBM's companion telemetry page (https://www.ibm.com/think/topics/telemetry, weight 0.49, weak) defines telemetry as the automated collection and transmission of data from distributed sources to a central system for monitoring and analysis; at weight 0.49 it is cited here as weak backing only.

## Why questions-first survives contact with reality

Three failure modes the source doc names as rationalizations all trace back to skipped questions (source doc):

1. "More logs = more observability": unstructured noise makes incidents slower, not faster. Three queryable events beat 300 prose lines.
2. "We can just look at the dashboards when something breaks": dashboards built without defined questions show you everything except the answer. Start from on-call questions.
3. "I'll add logging after it works": "after" becomes "after the first incident", the most expensive moment to discover you are blind. Instrument as you build.

The verification checklist in the source doc makes questions first-class artifacts: the first checkbox is "The on-call questions for this feature are written down, and each signal maps to one" (source doc). A signal that maps to no question is not extra safety, it is cost with no decision attached.

## Questions and SLO boundaries

One edge case the source doc does not cover: what happens to the questions when telemetry itself is missing or the service is idle. OneUptime's guidance (https://oneuptime.com/blog/post/2026-08-29-no-traffic-or-broken-telemetry-how-missing-data-should-affect-an-slo/view, weight 0.30, weak) argues you should preserve unknown SLO state and distinguish idle traffic from collection failure, alerting on telemetry absence without fabricating good or bad events. At weight 0.30 treat that as weak backing: the practical takeaway compatible with the source doc is that "can I see the signal at all?" is itself one of the questions worth writing down for any feature whose SLO depends on telemetry arriving.

## Practical summary

Write 2 to 4 on-call questions per feature before the first instrumented line. Reject any proposed signal that does not answer one of them. Keep the questions next to the feature's checklist so the next reviewer can check the mapping, not guess at it.
