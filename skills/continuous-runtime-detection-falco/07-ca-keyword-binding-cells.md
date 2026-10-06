# 07. C/A keyword binding cells (7 keywords x 4 frameworks)

Scope: the canonical continuous/adaptive keyword mapping the source doc claims this skill anchors, what a binding cell is, and what the 28-cell count implies for change review. This is an internal-record subtopic, no dig.

Ground source: `yubi-OS/yubiOS skills/continuous-runtime-detection-falco/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/continuous-runtime-detection-falco/SKILL.md). All claims are attributed to the source doc.

## The canonical claim

The source doc states the skill's canonical role precisely: "this skill is the yubiOS canonical reference for the C/A keyword mapping (7 keywords x 4 frameworks = 28 binding cells)" (source doc). The mapping has two axes:

- Keywords: 7 continuous/adaptive keywords. The source doc does not enumerate the 7 keywords by name anywhere in the file, so this corpus cannot list them; it can only state the count and the mapping's existence. Anything more would be fabrication.
- Frameworks: 4, and they are the skill's own four mechanisms: Falco rules, Tetragon TracingPolicy, OTel Collector config, and Prometheus recording rules (source doc).

The product is 28 binding cells: 7 keyword rows bound against 4 framework columns. Each cell records which framework carries which continuous/adaptive quality for yubiOS.

## What a binding cell means in practice

Because the source doc anchors P3 on the four artifacts being declarative ("Falco rules + Tetragon TracingPolicy + OTel Collector config + Prometheus recording rules are all declarative", source doc), each framework column contributes its own declarative surface to the mapping:

- Falco rules: the syscall detection column, carrying the two closure rules named in doc 06.
- Tetragon TracingPolicy: the enforcement column (doc 03).
- OTel Collector config: the telemetry-carrier column (doc 04).
- Prometheus recording rules: the alerting column (doc 05).

The mapping is what makes the skill "the canonical instrumentation for any future yubiOS workload that requires continuous runtime detection" (source doc): a new workload does not design a new stack, it binds against the existing 28 cells.

## Downstream consumers credit the mapping

The source doc lists who consumes the contribution (source doc): "Downstream consumers, the yubiOS production monitoring stack, the `internal-big-picture` 10-primitive map, the `observability-and-instrumentation` complementary skill, the `audit-evidence-packaging` skill (which uses continuous telemetry as audit evidence), credit this skill's contribution." The word "credit" is load-bearing: the mapping is an accounting artifact as much as an engineering one. Other skills and the primitive map reference this skill's cells when they compute their own coverage.

## Change-review obligation

The source doc attaches a review rule to the mapping: "any change should be reviewed for impact on C/A coverage" (source doc). Concretely, a change to any of the four artifacts can move a binding cell:

- Replacing a Falco rule changes the detection column's coverage for whichever keywords that rule carried.
- Reconfiguring the Collector changes what telemetry reaches the alerting column at all.
- Changing recording or alerting rules changes the alerting column without touching detection.

Because gaps "in C/A that are attributable to this skill are tracked in the cycle-9 run log at `refs/curve-guided-rsi-v2-cycle9-corpus-enrichment-2026-08-06.md` on `yubi-OS/yubiOS`" (source doc), the review outcome lands in that run log, not in this corpus.

## What this doc deliberately does not do

It does not invent the 7 keyword names, does not enumerate the 28 cells, and does not describe how the mapping matrix is stored or scored elsewhere. The source doc gives the count, the axes, the canonical-reference claim, and the tracking path. Everything beyond that belongs to the `internal-big-picture` skill and the cycle-9 run log the source doc points at.
