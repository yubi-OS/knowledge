# 01. Skill scope and 10-primitive mapping

Scope: what the continuous-runtime-detection-falco skill is, the exact mechanisms its frontmatter names, and how it maps onto the yubiOS 10-primitive spine. This doc is grounded in the source doc alone; it is an internal-record subtopic, no dig.

Ground source: `yubi-OS/yubiOS skills/continuous-runtime-detection-falco/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/continuous-runtime-detection-falco/SKILL.md). All claims in this doc are attributed to the source doc.

## What the skill is

The frontmatter description defines the skill in one sentence: it "detects runtime security events using Falco rules, Tetragon TracingPolicy, OTel Collector, and Prometheus recording rules" and provides "declarative continuous/adaptive telemetry for yubiOS" (source doc). Four frameworks, one job: continuous runtime detection. The skill is not a tutorial on any single tool; it is the yubiOS canonical reference for how the four frameworks combine into a detection stack whose rules, policies, and alert expressions are all declarative artifacts.

The description also names the skill's place in the architecture: it "provides the audit artifact for primitive P4 and anchors P3 (declarative policy) and P6 (audit/evidence)" (source doc). Those primitive labels come from the 10-primitive model that yubiOS uses across its skill corpus, per the `internal-big-picture` skill the source doc itself credits.

## The primitive mapping

The source doc spells out three primitive contributions (all attributed to the source doc):

- P4 (continuous/adaptive), primary. The skill is the corpus-additive anchor for the continuous/adaptive primitive. Its entire output, the running telemetry stack, is what makes the primitive "continuous" rather than a one-time check.
- P3 (declarative policy). The source doc is explicit about why this primitive anchors here: "Falco rules + Tetragon TracingPolicy + OTel Collector config + Prometheus recording rules are all declarative". Four artifacts, one property: each is a file or resource that states what to detect, not how to detect it. A change to detection behavior is a config change, reviewable in version control like any other policy.
- P6 (audit/evidence). The continuous telemetry the stack emits is itself the audit artifact. The same event stream that feeds alerting is what an assessor consumes as evidence that detection was actually running.

## Downstream consumers

The source doc names the consumers that credit this skill's contribution (source doc):

1. The yubiOS production monitoring stack, which is the direct deployment target for the four frameworks.
2. The `internal-big-picture` 10-primitive map, which places this skill at the C/A (continuous/adaptive) cell.
3. The `observability-and-instrumentation` complementary skill, which covers instrumenting code so production behavior is visible; this skill covers the security-specific detection layer that runs on top of that instrumentation.
4. The `audit-evidence-packaging` skill, which the source doc says "uses continuous telemetry as audit evidence". The telemetry stream this skill produces is an input to evidence bundles, not a parallel system.

## Scope discipline

The Guidelines section of the source doc is a single rule: "Every use stays inside the frontmatter description's scope; anything beyond it is a different skill's job" (source doc). In practice this bounds the skill three ways:

- Detection, not prevention. Falco and Tetragon observe and alert (and Tetragon can enforce); the skill's scope is detection of runtime events, and anything beyond it belongs to another skill.
- Declarative artifacts, not imperative scripts. The four mechanisms are all config-as-policy. A detection implemented as an ad hoc daemon script is outside the skill's shape.
- The four named frameworks. Adding a fifth detection technology is a corpus change, not a skill use.

## The boundary case

The Examples section of the source doc adds one routing rule: "when the request only names a trigger without the artifact it acts on, route to the owning surface instead of improvising here" (source doc). A request like "alert on X" names a trigger but no artifact; the correct move is to find which yubiOS surface owns the artifact X acts on and route there, because this skill's contribution is always the detection instrumentation layered on an existing artifact, not the artifact itself.

## Why the mapping matters

Because the primitive mapping is recorded in the source doc's frontmatter and coverage section, any change to the skill must be reviewed for impact on C/A coverage. The source doc states this directly: "any change should be reviewed for impact on C/A coverage; gaps in C/A that are attributable to this skill are tracked in the cycle-9 run log at `refs/curve-guided-rsi-v2-cycle9-corpus-enrichment-2026-08-06.md` on `yubi-OS/yubiOS`" (source doc). The mapping is not decoration; it is the bookkeeping that ties this skill to the corpus-wide primitive accounting.
