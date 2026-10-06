# 08. Continuous telemetry as audit evidence and the monitoring feedback loop

Scope: how the stack's continuous telemetry serves as the audit artifact (P6) and closes the monitoring feedback loop, plus what external detection-engineering and continuous-compliance sources say about the same shape. Grounded in the source doc plus digs; most external backing here is weak and is labeled as such.

Ground source: `yubi-OS/yubiOS skills/continuous-runtime-detection-falco/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/continuous-runtime-detection-falco/SKILL.md). Dug external sources carry their jev noul weight; weight below 0.5 means weak backing and is labeled.

## The P6 anchor: telemetry is the audit artifact

The source doc's frontmatter says the stack "provides the audit artifact for primitive P4 and anchors P3 (declarative policy) and P6 (audit/evidence)", and its coverage section states the mechanism plainly: "the continuous telemetry is the audit artifact" (source doc). The claim is structural: because Falco, Tetragon, the OTel Collector, and Prometheus all run continuously off declarative artifacts, the event stream they produce is itself the record that detection existed and operated. The `audit-evidence-packaging` skill is named as the consumer that "uses continuous telemetry as audit evidence" (source doc).

## The feedback loop

The source doc's stack line ends with "all closing the monitoring feedback loop" (source doc). Read against the four frameworks, the loop is: Falco and Tetragon emit events at the syscall and hook-point level (doc 02, doc 03), the OTel Collector carries them (doc 04), Prometheus evaluates rules over the resulting series and fires alerts to an external service (https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/, jev weight 0.83), and the response to those alerts changes the declarative artifacts, which changes what the next events produce. The loop closes because every stage is a file that can be edited in response to what the previous stage observed.

## What detection engineering says about the same shape

The dig's strongest external corroboration comes from the detection-engineering literature. Fibratus defines detection engineering "as a pipeline: telemetry acquisition, state modeling, invariant validation and response", covering "How to write, test and ship detection r[ules]" (https://fibratus.io/detection-engineering, jev weight 0.55, the only dig source in this subtopic at or above 0.5). The yubiOS stack maps onto that pipeline stage for stage: telemetry acquisition is the OTel Collector (doc 04), the rules and policies are the invariant artifacts (doc 02, doc 03), and response is the Prometheus alerting path (doc 05).

A weakly-backed source frames detection engineering as "the systematic process of designing, building, and tuning the logic used to identify threats by mapping attacker behaviors to" telemetry (https://www.splunk.com/en_us/blog/learn/detection-engineering.html, jev weight 0.39, weak). Another weak source states the loop discipline: threat hunting is "only valuable when it results in s[ustained]" improvement such as durable detection rules or telemetry improvements (https://origin-www.paloaltonetworks.com/cyberpedia/threat-hunting, jev weight 0.3, weak). Both are consistent with the source doc's loop claim but carry weak backing here.

## What continuous-compliance sources say

The first dig for this subtopic returned only dictionary definitions and off-topic hits; it was redone with different queries (attempt 2, logged in the dig record). The redo's continuous-compliance results are all weakly backed but topically on point:

- "Continuous compliance monitoring is an automated process that continuously checks your systems, controls, and configurations against compliance stand[ards]" (https://akitra.com/blog/continuous-compliance-monitoring-evidence-collection/, jev weight 0.18, weak).
- Continuous monitoring "automates evidence collection and constantly verifies that security control[s]" hold (https://www.cybersierra.co/blog/security-continuous-monitoring-tools, jev weight 0.08, weak).

These sources are consistent with the source doc's P6 framing, automated checking plus evidence collection, but at weights this low they corroborate shape, not fact. The FISMA-framed source (https://www.telos.com/blog/2026/04/14/continuous-monitoring-in-highly-regulated-industries-best-practices/, jev weight 0.19, weak, from the original dig) adds that agencies are "expected to sustain ongoing authorization by presenting current, defensible evidence of control effectiveness"; weak backing again.

## Where the strong evidence actually lives

The honest reading of this subtopic: the P6 claim and the feedback-loop claim are grounded in the source doc, and the strongest external corroboration is Fibratus's detection-engineering pipeline at jev weight 0.55. Everything from the continuous-compliance corner is weak (0.08 to 0.19). The corpus therefore rests the audit-evidence argument on the source doc plus the declarative-chain argument in docs 02 through 05, and records the weak external sources as shape corroboration only.

## Practical consequence for yubiOS

Two consequences follow from the weighted record:

1. Any evidence bundle built by `audit-evidence-packaging` should be able to point at the telemetry stream as its detection-artifact source, which means the stream must be stable and its producing artifacts versioned. That is a property of the four declarative files, not of the stream itself (source doc, P3 anchor).
2. A gap in the loop (a detector that fires but whose events never reach the Collector, or a recording rule that never evaluates) breaks the P6 claim, not just alerting. The review obligation from doc 07, "any change should be reviewed for impact on C/A coverage" (source doc), is the guard for this.
