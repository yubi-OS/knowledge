# skills/continuous-runtime-detection-falco

Knowledge corpus explicating the yubiOS skill `continuous-runtime-detection-falco`: detecting runtime security events using Falco rules, Tetragon TracingPolicy, OTel Collector, and Prometheus recording rules (declarative continuous/adaptive telemetry for yubiOS).

Ground source: `yubi-OS/yubiOS skills/continuous-runtime-detection-falco/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/continuous-runtime-detection-falco/SKILL.md), 4404 bytes fetched 2026-10-06. The corpus explicates and deepens the skill; it does not replace it. Claims from the source doc are attributed as "source doc"; claims from digs carry their URL and jev weight, and weights below 0.5 are labeled weak.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-skill-scope-and-primitive-mapping.md](01-skill-scope-and-primitive-mapping.md) | Skill scope, P4/P3/P6 primitive mapping, downstream consumers (internal record, no dig) |
| 02 | [02-falco-syscall-detection.md](02-falco-syscall-detection.md) | Falco syscall detection: drivers, rule/macros/lists structure, the 2 yubiOS closure rules |
| 03 | [03-tetragon-ebpf-enforcement.md](03-tetragon-ebpf-enforcement.md) | Tetragon TracingPolicy as declarative eBPF policy; enforcement vs detection |
| 04 | [04-otel-collector-telemetry.md](04-otel-collector-telemetry.md) | OTel Collector config as the declarative telemetry carrier |
| 05 | [05-prometheus-recording-rules-alerting.md](05-prometheus-recording-rules-alerting.md) | Prometheus recording and alerting rules as the declarative alerting layer |
| 06 | [06-ca-residual-closure.md](06-ca-residual-closure.md) | The 2 C/A residual cells and the verifier-instrumentation closure (internal record, no dig) |
| 07 | [07-ca-keyword-binding-cells.md](07-ca-keyword-binding-cells.md) | C/A keyword mapping, 7 keywords x 4 frameworks = 28 binding cells (internal record, no dig) |
| 08 | [08-audit-evidence-feedback-loop.md](08-audit-evidence-feedback-loop.md) | Continuous telemetry as audit evidence (P6) and the monitoring feedback loop |
| 09 | [09-skill-origin-and-lifecycle.md](09-skill-origin-and-lifecycle.md) | Changelog trail (cycle 9 corpus enrichment, PR #179), touchpoints, boundary routing (internal record, no dig) |

## Research summary

- Results collected: 72 entries in research-db/archive.json (60 from the first dig pass, 12 from the subtopic-08 redo). Kept top 6 per query.
- Weight split (jev noul, weight >= 0.5 counts as high): 27 high / 45 low of 72.
- jev requests: 8 (1 outline validation, 1 outline validation redo, 5 noul weighting batches of 12, 1 redo weighting batch of 12), usage 10260 input / 1583 output tokens. All via DefAPI direct (https://api.defapi.org/api/v1/decisions), zero 429s.
- Outline validation: first pass scored 4 subtopics as padding under ungrounded instructions; 1 redo with grounded instructions re-anchored every subtopic to the skill description, all 9 kept (scores 1.42 to 1.97 on the redo; see research-db/outline.json).
- Redos: 1 dig redo (subtopic 08, both queries replaced after the first pass returned dictionary definitions and off-topic hits) plus the outline redo above.
- Skipped docs: none.
- Internal-record subtopics (01, 06, 07, 09) skipped searXNG entirely and are grounded in the source doc only, as the brief directs.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); decide model typesafe/jev-1.13 via DefAPI direct (agent-side probe skipped for speed per campaign protocol).
