# 04. OTel Collector declarative telemetry pipeline

Scope: the OpenTelemetry Collector as the skill's telemetry carrier: what a Collector configuration is, the four classes of pipeline components, and why the config file is the declarative artifact anchoring P3 for the telemetry half of the stack.

Ground source: `yubi-OS/yubiOS skills/continuous-runtime-detection-falco/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/continuous-runtime-detection-falco/SKILL.md). Dug external sources carry their jev noul weight; weight below 0.5 means weak backing and is labeled.

## The Collector's role in the stack

The source doc names the OTel Collector as the third framework: "Falco syscall detection + Tetragon eBPF enforcement + OTel Collector telemetry + Prometheus alerting, all closing the monitoring feedback loop" (source doc). Its declarative property is stated explicitly: "OTel Collector config" is one of the four artifacts the source doc lists as all-declarative, anchoring the P3 declarative-policy primitive (source doc). The Collector is the pipe between the detectors and the alerting layer: Falco and Tetragon emit events, the Collector receives, processes, and exports them, and Prometheus evaluates recording rules over what arrives.

## What the Collector is

The official overview: "The OpenTelemetry Collector offers a vendor-agnostic implementation of how to receive, process and export telemetry data. It removes the need to run, operate, and maintain multiple agents/collectors" (https://opentelemetry.io/docs/collector/, jev weight 0.92). The project repository repeats the vendor-agnostic framing and adds that it removes "the need to run, operate and maintain multiple agents/collectors in order to" get data out of applications (https://github.com/open-telemetry/opentelemetry-collector, jev weight 0.91). OpenTelemetry as a whole is "an open source observability framework for cloud native software" providing "a single set of APIs, libraries, agents" (https://opentelemetry.io/, jev weight 0.90).

For yubiOS the operational meaning is single-pipeline: the detection events from Falco, the policy events from Tetragon, and any metric emissions land in one Collector config rather than one exporter per tool.

## Configuration structure: four classes of pipeline components

The official configuration documentation is the load-bearing source: "The structure of any Collector configuration file consists of four classes of pipeline components that access telemetry data: Receivers Processors Exporters Connectors" (https://opentelemetry.io/docs/collector/configuration/, jev weight 0.94, and the same page scored 0.93 when re-dug under the pipeline query). Receivers accept data in, processors transform or filter it, exporters send it out, and connectors join pipelines. After each pipeline component class the config declares the pipelines that wire the components together.

That structure is exactly what makes the config declarative in the P3 sense the source doc claims (source doc): a detection pipeline is described as named components plus wiring, in one YAML file, reviewable as a diff. Adding a detection source is adding a receiver entry and a pipeline edge, not writing a forwarding daemon.

## Operational shape and weak-source corroboration

The Collector is characterized as "a high-performance, scalable, and reliable data collection pipeline for observability data" (https://uptrace.dev/opentelemetry/collector.html, jev weight 0.29, weak). A weakly-backed tutorial source (jev weight 0.18, openobserve.ai) describes the practical failure modes of Collector config: "a processor defined but never added to a pipeline, an indentation slip that silently drops an exporter, a receiver listeni[ng]" on the wrong thing, noting that "Most OpenTelemetry Collector problems aren't code problems, they're YAML problems". Hold these as weak, but they make a point relevant to the skill's declarative claim: the declarative property is only as good as the config's validation, so a config change to the telemetry pipeline should be treated with the same review discipline as a Falco rule change (doc 02) or a TracingPolicy change (doc 03).

## What flows through the pipeline

The source doc defines the telemetry's purpose, not its schema: the continuous telemetry "provides the audit artifact for primitive P4" and anchors P6 (audit/evidence) because "the continuous telemetry is the audit artifact" (source doc). So the pipeline's content requirements come from two consumers:

- Prometheus (doc 05) needs metric series it can evaluate recording rules over; alert conditions are "Prometheus expression language expressions" (https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/, jev weight 0.83).
- The `audit-evidence-packaging` skill consumes "continuous telemetry as audit evidence" (source doc), so the pipeline should preserve the fields that make an event auditable, not just alertable.

Neither the source doc nor the high-weight dig sources specify the yubiOS receivers, processors, or exporters by name; this corpus does not invent them. The documented, weighted facts are the four component classes, the vendor-agnostic pipeline model, and the YAML config as the declarative artifact.

## Why a separate doc for the pipe

The four frameworks are only a stack because something carries events between them with no logic of its own. The Collector is that something, and its config is the fourth declarative artifact. Without it, each detector would need its own forwarding path and the P3 claim would rest on three artifacts instead of four.
