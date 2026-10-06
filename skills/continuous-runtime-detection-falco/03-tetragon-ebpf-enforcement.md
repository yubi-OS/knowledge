# 03. Tetragon eBPF enforcement via TracingPolicy

Scope: Tetragon as the skill's eBPF enforcement layer: what a TracingPolicy is, what hook points it covers, and how enforcement differs from the detection-only role Falco plays in the same stack.

Ground source: `yubi-OS/yubiOS skills/continuous-runtime-detection-falco/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/continuous-runtime-detection-falco/SKILL.md). Dug external sources carry their jev noul weight; weight below 0.5 means weak backing and is labeled.

## Tetragon in the skill's stack

The source doc names Tetragon as the second of the four frameworks: "Falco syscall detection + Tetragon eBPF enforcement + OTel Collector telemetry + Prometheus alerting" (source doc). The division of labor matters: Falco detects and alerts at the syscall level, while Tetragon is the layer where policy can enforce, not just observe. The source doc also credits Tetragon's declarative shape explicitly: "Falco rules + Tetragon TracingPolicy + OTel Collector config + Prometheus recording rules are all declarative" (source doc), which is why the TracingPolicy artifact anchors the P3 declarative-policy primitive in this skill.

## What TracingPolicy is

Tetragon's own documentation defines TracingPolicy as "a user-configurable Kubernetes custom resource (CR) that allows users to trace arbitrary events in the kernel and optionally enforce" (https://tetragon.io/docs/concepts/tracing-policy/, jev weight 0.90). The reference documentation extends that: "A TracingPolicy is a user-configurable Kubernetes custom resource (CR) that defines how Tetragon observes events in both the kernel and userspace using eBPF. It supports a variety of hook points including kprobes, fentry" (https://tetragon.io/docs/reference/tracing-policy/, jev weight 0.91). The observable shape is a YAML resource: the worked example in the docs shows the required fields as `apiVersion: cilium.io/v1alpha1`, `kind: TracingPolicy`, and a metadata name, saved as a normal YAML file (https://tetragon.io/docs/concepts/tracing-policy/example/, jev weight 0.87).

Drift note, dated 2026-10-06: the dig sources uniformly describe TracingPolicy as a Kubernetes custom resource. The source doc names Tetragon TracingPolicy as a yubiOS mechanism but does not specify the deployment shape yubiOS uses; no dig source covers a non-Kubernetes deployment of TracingPolicy, so this corpus does not claim one. Treat the Kubernetes-CR form as the documented form.

## Enforcement, not just observation

Tetragon positions itself as "a flexible Kubernetes-aware security observability and runtime enforcement tool that applies policy and filtering directly with eBPF, allowing for reduced observation overhead" (https://tetragon.io/, jev weight 0.83). The project repository is more specific about the reactive half: "Tetragon detects and is able to react to security-significant events, such as Process execution event" (https://github.com/cilium/tetragon, jev weight 0.91). That reaction capability is what the source doc's phrase "eBPF enforcement" refers to: the same eBPF hooks that produce the event stream can carry a policy action, so detection and enforcement share one mechanism instead of two.

Being Kubernetes-aware matters for how events are labeled: "Tetragon is Kubernetes-aware, that is, it understands Kubernetes identities such as namespaces, pods and so on, so that security event detection can be configured in relation to" those identities (https://github.com/cilium/tetragon, jev weight 0.91). For yubiOS telemetry this is the enrichment layer: an enforcement decision or detection event arrives already tagged with workload identity, which the OTel Collector pipeline (doc 04) can pass through without re-deriving it.

## Policy and filtering directly with eBPF

The claim that filtering happens in-kernel is the performance argument for Tetragon's place in a continuous stack: applying "policy and filtering directly with eBPF" reduces observation overhead (https://tetragon.io/, jev weight 0.83). A weakly-backed corroboration (jev weight 0.18, khimananda.com) describes Tetragon as covering "enforce policies, detect threats, and automate compliance evidence in production Kubernetes clusters"; the compliance-evidence phrasing matches this skill's P6 anchor but is weakly sourced, so hold it loosely.

## Why the skill needs both Falco and Tetragon

The source doc assigns the two engines different closures (source doc): both residual cells (composefs kernel floor, FIDO2 ceremony) are named as Falco-rule closures, while Tetragon's named role in the description is enforcement. The practical split this corpus draws from the sources: Falco's rule engine evaluates enriched syscall events against conditions after the fact in userspace (https://github.com/falcosecurity/falco, jev weight 0.87), while Tetragon can act at the hook point itself because its policy and filtering run in eBPF (https://tetragon.io/, jev weight 0.83). Detection breadth comes from Falco's rule language and exception machinery (doc 02); hard stops on known-forbidden behavior come from Tetragon policy. Keeping the split explicit is what lets both stay declarative and reviewable without overlapping ownership.
