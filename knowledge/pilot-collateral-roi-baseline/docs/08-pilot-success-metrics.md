# 08. Pilot success criteria and measurable metrics

**Scope:** jointly defined, measurable pilot success criteria for security infrastructure: enrollment counts, SLA response times, and audit evidence production time.

## Design the pilot for control verification, not sentiment

A security-tool pilot should test whether the approved workflows stay inside the intended controls, not merely whether users like the tool; the first cohort should represent the eventual rollout but stay small enough to support (weight 0.60, authoritative backing: handbook.harmonic.security, https://handbook.harmonic.security/handbook/7.-rollout-and-operations/7.2-pilot-design-and-success-metrics). This is the strongest-weighted source in this corpus, and it supplies the pilot-metrics doctrine in one line: security pilots are evidence generators for control behavior.

## Joint definition and the conversion link

Pilot-to-paid conversion practice locates success criteria definition before the pilot runs: agreeing measurable success criteria, a named economic buyer, and a procurement path before the pilot starts is what separates converting pilots from stalled ones (weight 0.37, weak backing: stackmatix.com, https://www.stackmatix.com/blog/enterprise-pilot-to-paid-contract). Key Services adds stakeholder mapping and pricing transitions to the same pre-pilot agreement set (weight 0.24, weak backing: key.services, https://key.services/insights/enterprise-pilot-to-paid-conversion). Post-pilot failure analyses reinforce why: the pilot-to-production gap is organizational and operational, spanning data quality, latency and scale, monitoring and observability, governance and compliance, organizational ownership, and user trust (weight 0.35, weak backing: heyclarity.dev, https://heyclarity.dev/blog/from-pilot-to-production-6-gaps-that-kill-enterprise-ai/).

## The three measurable metric families

For a hardware-root-of-trust pilot, three metric families convert the doctrine into numbers:

1. Enrollment metrics (count and failure modes). "N devices enrolled with zero unintended lockouts" is the canonical structure: N is blank until the partner commits, and the zero-lockout condition is the control-behavior claim the pilot tests. Source: pilot enrollment logs.
2. SLA response metrics. SLA response time measures the duration from when an end user submits a request or reports an issue until the support team formally acknowledges it and begins taking action, focusing on initial acknowledgment speed rather than complete resolution (weight 0.23, weak backing: freshworks.com, https://www.freshworks.com/itsm/sla/response-time/). SLA compliance measurement requires both response time and resolution time, each with its own target and failure mode (weight 0.17, weak backing: serval.com, https://www.serval.com/blog/sla-time-explained). A service level agreement is a contract between a service provider and a customer that outlines the terms and expectations of provided service (weight 0.48, weak backing: ibm.com, https://www.ibm.com/think/topics/service-level-agreement). The "M of N incidents" structure in the SOW template follows directly: response-time targets are acknowledged-per-incident counts, and the pilot logs supply M and N.
3. Evidence-production metrics. Time to produce a compliance artifact (a design decision record, an attestation reference) is measured in the pilot against the customer's baseline for producing equivalent evidence from their current approach. Source: timing taken during the pilot, against the customer-provided baseline from discovery.

## Definitional precision in the SOW

Two definitional traps are worth closing in the template itself. First, response time is not resolution time: a template that says "SLA response time met in M of N incidents" should state which of the two it means, because they are different metrics with different targets (serval.com above). Second, acknowledgment speed versus resolution speed are separately measurable, and the SLA line should name its clocks explicitly.

Third, success criteria values are set jointly with the partner; the pilot document carries the structure and the blanks, and the joint definition step is a named milestone, not an implied one.

## Metrics as the pilot's output, not its decoration

The pilot produces three artifacts that outlive itself: enrollment logs (device counts, lockout events, time-to-enroll), SLA logs (acknowledgment and resolution times per incident), and evidence-production timings. Each maps one-to-one onto a worksheet line item in the ROI baseline doc. A pilot whose success criteria were defined jointly is, at its end, the source of the with-pilot column, and the customer's own baseline fills the other column. That is the whole evidence chain: criteria agreed before the pilot, logs during, worksheet after.
