# 05. Prometheus recording rules and alerting

Scope: Prometheus as the skill's alerting layer: recording rules and alerting rules, how rule files are structured and evaluated, and why the rules file is the fourth declarative artifact in the stack.

Ground source: `yubi-OS/yubiOS skills/continuous-runtime-detection-falco/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/continuous-runtime-detection-falco/SKILL.md). Dug external sources carry their jev noul weight; weight below 0.5 means weak backing and is labeled.

## Prometheus in the stack

The source doc's one-line stack is "Falco syscall detection + Tetragon eBPF enforcement + OTel Collector telemetry + Prometheus alerting, all closing the monitoring feedback loop" (source doc). The closing phrase is the point: Prometheus is where detection becomes a standing, evaluated condition rather than a fire-and-forget notification. The source doc also includes "Prometheus recording rules" in the list of artifacts that are all declarative, anchoring P3 (source doc).

## Two kinds of rules, evaluated on a schedule

Prometheus's own documentation: "Prometheus supports two types of rules which may be configured and then evaluated at regular intervals: recording rules and alerting rules. To include rules in Prometheus, create a file containing the necessary rule statements" (https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/, jev weight 0.94; same page re-dug at 0.92; the same text appears in the repository copy at https://github.com/prometheus/prometheus/blob/main/docs/configuration/recording_rules.md, jev weight 0.91). Rules load from files specified in prometheus.yml (https://omarghader.github.io/prometheus-recording-rules-reduce-load-speed-queries/, jev weight 0.13, weak).

- Recording rules precompute expressions into new time series. A weakly-backed source describes them as allowing you to "precompute frequently used or computationally expensive expressions and save their results as new time series" (https://www.compilenrun.com/docs/observability/prometheus/prometheus-best-practices/recording-rules-best-practices/, jev weight 0.12, weak).
- Alerting rules "allow you to define alert conditions based on Prometheus expression language expressions and to send notifications about firing alerts to an external service" (https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/, jev weight 0.83).

The rules file syntax block covers both: the documentation page shows the syntax for recording rules and for alerting rules side by side in one rule-group structure (https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/, jev weight 0.94).

## Naming discipline

The official practices guide: "A consistent naming scheme for recording rules makes it easier to interpret the meaning of a rule at a glance. It also avoids mistakes by making incorrect or meaningless" results harder to hide (https://prometheus.io/docs/practices/rules/, jev weight 0.91). For yubiOS this is the maintenance contract for the detection-derived series: the metrics the stack derives from Falco and Tetragon events (doc 02, doc 03) should be named so an assessor can tell what a series means without reading the pipeline (doc 04).

## What Prometheus is

Prometheus is "an open-source monitoring system with a dimensional data model, flexible query language, efficient time series database and modern alerting approach" (https://prometheus.io/, jev weight 0.88; re-dug at 0.81). The overview adds history and scope: "Prometheus is an open-source systems monitoring and alerting toolkit originally built at SoundCloud. Since its inception in 2012, many companies and orga[nizations]" have adopted it (https://prometheus.io/docs/introduction/overview/, jev weight 0.56). The Wikipedia hit from the dig (jev weight 0.25, weak) is about the myth, not the tool, and is not used.

## Why recording rules are the declarative join

The stack's shape (source doc) is: Falco and Tetragon emit events, the OTel Collector carries them (doc 04), and Prometheus turns them into alert state. Recording rules are the join point: a series derived from the telemetry stream is itself defined by a rule expression, which means the whole alert path, from raw event to firing alert, is declared in files rather than coded. The source doc's P3 claim covers this: "Prometheus recording rules are all declarative" (source doc).

The weak-source performance argument for recording rules, reducing query load by precomputation (https://omarghader.github.io/prometheus-recording-rules-reduce-load-speed-queries/, jev weight 0.13, weak), is plausible but not needed by the source doc; the source doc's reason for recording rules is structural, not performance.

## What the yubiOS rules evaluate

The source doc does not enumerate the yubiOS recording or alerting rules by name; it defines the stack and the closure mechanism (source doc). What this corpus can state with backing:

- Alert conditions are PromQL expressions evaluated at regular intervals against the telemetry the Collector exports (https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/, jev weight 0.83; https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/, jev weight 0.94).
- The two yubiOS detection closures live in Falco rules (doc 02, source doc), so the Prometheus layer's role for those cells is standing alert state over the alert stream Falco emits, plus any series the C/A keyword mapping tracks (doc 07).
- Firing alerts go "to an external service" via the alerting rules mechanism (https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/, jev weight 0.83), which is where the feedback loop closes.

Anything more specific about yubiOS's actual rule names, thresholds, or external service is not in the source doc and not in any weighted dig result, so it is not stated here.
