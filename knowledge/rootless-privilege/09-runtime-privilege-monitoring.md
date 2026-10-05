# Runtime privilege monitoring and moment-boundary privilege

## Scope

The ongoing-detection layer for privilege use: Falco's syscall-based rule model and Tetragon's eBPF enforcement, plus the moment-boundary pattern where privilege is confined to a lifecycle moment instead of a lifetime.

## Falco: rules over syscall events

Falco monitors system calls inside nodes and containers and detects suspicious behaviour such as privilege escalation, file tampering, command execution inside containers, namespace escapes, and other anomaly patterns (VulnTech, https://vulntech.com/tutorials/devsecops/runtime-protection-falco/). Its detection model is rule-based over syscall events: a syscall-based detection model with custom rules for privilege escalation, container escapes, and credential access, tuned to eliminate false positives and routed through Falcosidekick for alerting (systemshardening.com, https://www.systemshardening.com/articles/observability/falco-security-rules/). Operational walkthroughs confirm the shape: Falco evaluates runtime events against rules and emits alerts when a process, file access, or container action looks suspicious, with syscall collection on the modern eBPF driver (golinuxcloud, https://www.golinuxcloud.com/falco-kubernetes-runtime-security/).

The role in a privilege-minimisation design is the audit of the exception path: the rootless default plus the small CapabilityBoundingSet grants are the policy, and Falco is the instrument that records whether the policy holds at runtime, catching a process that reaches for privileges its unit never declared.

## Tetragon: eBPF observation and enforcement

Tetragon is an eBPF-based security observability and runtime enforcement tool that detects and reacts to security-significant events: process execution events, system call activity, and I/O activity including network and file access, with Kubernetes awareness (cilium/tetragon, https://github.com/cilium/tetragon; tetragon.io, https://tetragon.io/). Tracing policies express the rules: the project's tracing-policy example documents the declarative format by which specific syscalls and argument patterns are observed or enforced (tetragon.io, https://tetragon.io/docs/concepts/tracing-policy/example/). It runs independently of Cilium when used outside that network stack (tetragon.io resources, https://tetragon.io/docs/resources/).

The distinction from Falco: Falco is alert-oriented rules over collected events, Tetragon is in-kernel observation with enforcement, able to act on the event, not just record it. A privilege-monitoring layer wants both verbs over time: record first, enforce once the baseline is trusted.

## Moment-boundary privilege

The companion pattern is temporal: confine privilege to the lifecycle moment that needs it instead of granting it for the process lifetime. The reference case is full-disk-unlock enrolment: systemd-cryptenroll --fido2-device runs as root at enrolment time only, and the boot-time unlock happens in the initrd before any unprivileged user exists, so the privileged window is a moment, not a lifetime (source decision, adjacent-problems analysis, 2026-09-01). The same shape applies to build tooling: the podman and bcvk invocations that genuinely need the rootful store are wrapped in sudo only at their invocation, rather than the builder holding standing privilege.

Monitoring closes the loop on both patterns: a moment-boundary privilege design is auditable precisely because the privileged moments are enumerable, and runtime detection flags privilege use outside the enumerated moments.

## Position

Static minimisation (rootless by default, bounded capabilities, hardened units) and dynamic detection (Falco, Tetragon) are not alternatives; the detection layer is what makes the minimisation claims falsifiable at runtime, and the moment-boundary discipline is what keeps the detection surface small enough to enumerate.
