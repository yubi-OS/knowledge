# 04: Pilot Metrics and Instrumentation
Scope: Instrumenting a pilot so end-of-phase numbers are defensible: per-metric instruments (timestamp logs, boot logs, timed drills, support logs) and source data versus estimates.

## The rule: every metric needs an instrument

The days-61-90 plan requires each metric to have a concrete instrument, not just a name, so day-90 numbers are defensible (session source doc, internal). Generic pilot guidance agrees on the prerequisite structure: define how you will measure the pilot's success, record baseline data before starting, and write a data collection plan specifying manual or automated capture (learnleansigma.com/wp-content/uploads/2024/10/Pilot-Plan-Check-Sheet-LearnLeanSigma.pdf, w=0.25, weak backing). Methodology guidance on pilot testing likewise treats data collection during the pilot as a distinct designed activity (ericae.net/collecting-data-during-pilot-testing/, w=0.19, weak backing).

## The six instruments

Deployment hours: wall-clock time from pilot kickoff to first node fully provisioned and enrolled, tracked per node and in aggregate. Instrument: a manual timestamp log kept during execution (session source doc, internal). Manual logging is the honest baseline for a first pilot; automated instrumentation of a system under test risks changing the system.

Operator training: hours spent, number of operators trained, and a post-training competency check, can the operator unlock or recover a node unaided. Instrument: training session log plus a pass or fail checklist (session source doc, internal). The competency check converts training hours from an input metric into an outcome metric.

Update and rollback success: number of upgrade and rollback attempts, success rate, and time to recover on failure. Instrument: bootc logs from pilot nodes (session source doc, internal). This is the one automated instrument in the set, justified because the logs already exist as a product artifact.

Evidence preparation: time spent assembling the evidence bundle for the customer readout. Instrument: a time log kept during readout drafting (session source doc, internal). Measuring the seller's own evidence cost matters because it is a recurring cost of every future customer.

Recovery time: time to recover from a lost or broken YubiKey using the systemd-homed and FIDO2 recovery path validated in days 31-60. Instrument: a timed recovery drill, at least one per pilot (session source doc, internal). A drill is an instrumented rehearsal; it produces a number with known provenance rather than an after-the-fact reconstruction.

Support load: number of support tickets or questions raised by the pilot operator, categorized by root cause. Instrument: the support channel log (session source doc, internal). Categorization by root cause is what makes the metric decision-relevant: a support load concentrated in one subsystem points at narrowing the offer (doc 07), while a load spread across everything points at product immaturity.

## Baselines: capture before day one

You cannot measure improvement without a baseline, and most pilots skip or defer it; for time-based metrics, capture baseline data with a simple self-reporting log for one to two weeks before the pilot starts (resources.rework.com/guides/ai-team-readiness/running-ai-pilot-programs, w=0.43, weak backing). For a first pilot with no incumbent system, the baseline is the ROI worksheet projection from days 0-30 collateral rather than a pre-pilot measurement (session source doc, internal); the readout then compares measured against projected.

A metric architecture from the AI-pilot literature transfers directly: one primary metric the pilot aims to move, two supporting metrics that explain it, and one guardrail metric that must not get worse (howtoai.com/ai-pilot-baseline-metrics/, w=0.25, weak backing). In the days-61-90 set, deployment hours and update/rollback success are the primary metrics; operator training and recovery time explain them; support load is the guardrail.

## Source data versus estimates

The exit criterion is explicit: all six measurement metrics captured with source data, not estimates (session source doc, internal). An estimate has no instrument and no provenance; a sourced number names the log, drill, or checklist that produced it. Secondary metrics and directional signals get specific targets set in advance (abmatic.ai/blog/abm-pilot-program-playbook-2026, w=0.24, weak backing), so the day-90 comparison is against pre-registered thresholds rather than post-hoc rationalization.

## Evidence standard for this doc

The six-instrument specification comes from the internal source doc. External corroboration (baseline capture, data collection plans, metric architecture) carries weak backing, jev weight below 0.5. The highest-weighted result in this doc's dig, a Wiley methods text on collecting and analyzing qualitative data (onlinelibrary.wiley.com/doi/book/10.1002/9781444347340, w=0.50), corroborates the general principle that collection method must be designed before data gathering starts.
