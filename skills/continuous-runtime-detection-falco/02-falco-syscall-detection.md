# 02. Falco syscall detection and rule structure

Scope: Falco as the syscall-level detection engine of the skill's stack: how it observes events, how rules, macros, and lists are structured, and the two yubiOS rules the source doc assigns to Falco.

Ground source: `yubi-OS/yubiOS skills/continuous-runtime-detection-falco/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/continuous-runtime-detection-falco/SKILL.md). Dug external sources are cited with their jev noul weight; weight below 0.5 means weak backing and is labeled as such.

## What Falco is and how it sees events

Falco is "a cloud native runtime security tool for Linux operating systems" designed to "detect and alert on abnormal behavior and potential security threats in real-time"; at its core it is "a kernel monitoring and detection agent that observes events, such as syscalls, based on custom rules", enriched with metadata from the container runtime (https://github.com/falcosecurity/falco, jev weight 0.87). The events come from a driver running in kernelspace: Falco's documentation describes "several supported drivers" for the syscall event source, listing the "Modern eBPF probe (default)" and the "Kernel module" (https://falco.org/docs/concepts/event-sources/kernel/, jev weight 0.81). A weakly-backed source (jev weight 0.24, igorzhivilo.com) adds that the kernel module and eBPF probe are installed on the node through an init container that tries to download a prebuilt driver or builds it on the fly as a fallback; treat that deployment detail as unverified until checked against official docs.

## The two yubiOS rules the source doc assigns

The source doc states that the 2 residual continuous/adaptive coverage cells are closed by instrumenting their verifiers with Falco rules (source doc):

- `composefs-kernel-floors` (kernel version floor): "closed via Falco rule on below-floor kernel mount" (source doc). The rule alerts when a mount happens on a kernel below the composefs floor that the `composefs-kernel-floors` skill pins.
- `yubikey-operations` (YubiKey ceremony): "closed via Falco rule on unexpected FIDO2 enrollment" (source doc). The rule alerts when a FIDO2 ceremony happens outside the enrollment windows the `yubikey-operations` skill governs.

These two rules are the skill's own canonical examples: detection logic expressed as Falco rules rather than as imperative checks, which is what makes the closure continuous rather than one-shot.

## Rule structure

Falco rules are written in a YAML domain-specific language built from three primitives: rules (complete detection logic with conditions and outputs), macros (reusable condition fragments), and lists (collections of values) (https://falco.org/docs/concepts/rules/, jev weight 0.86; rule structure corroborated by https://falco.org/docs/concepts/rules/basic-elements/, jev weight 0.17, weak). The official custom-ruleset guide says that using macros and lists "allows for more straightforward and more concise rule creation while promoting the reuse of conditions" (https://falco.org/docs/concepts/rules/custom-ruleset/, jev weight 0.84).

A rule's minimum fields follow the pattern rule, condition, desc, output, priority: the condition is a boolean expression in Falco's filter syntax matching syscall properties, process attributes, file paths, and metadata; the output defines the alert message format (https://falco.org/docs/concepts/rules/, jev weight 0.86; field list corroborated by a weak source, https://dev.to/ptuladhar3/falco-must-know-for-cks-exam-7en, jev weight 0.08, weak). For the yubiOS rules above, that maps directly: the below-floor kernel rule conditions on mount events plus kernel version fields; the FIDO2 ceremony rule conditions on the enrollment event stream plus an allowlist of expected ceremony contexts.

## Authoring and tuning discipline

The official docs recommend custom rules go in files loaded after the default ruleset; overriding an existing default rule requires the custom rules file (for example /etc/falco/rules.d/custom-rules.yaml) to be loaded after the default rules file (/etc/falco/falco_rules.yaml) (https://falco.org/docs/concepts/rules/overriding/, jev weight 0.25, weak). The Falco organization maintains a rules repository providing "easy-to-install rules and examples for rule writers", though the registry "currently includes only rules for the syscall call data source" (https://github.com/falcosecurity/rules, jev weight 0.72). Exceptions are supported as a first-class construct so a rule can stay general while known-benign behavior is carved out (https://falco.org/docs/concepts/rules/exceptions/, jev weight 0.2, weak); that matters for the FIDO2 ceremony rule, whose allowlist is the exception set.

Because yubiOS ships these rules as declarative artifacts, the maintenance loop is: adjust the rule condition or its lists, keep the exceptions current, and let the same file drive detection across every host.

## Where Falco sits in the four-framework stack

The source doc's four frameworks divide the work (source doc): Falco covers syscall-level detection, Tetragon covers eBPF enforcement via TracingPolicy, the OTel Collector carries the telemetry, and Prometheus recording rules close the alerting loop. Falco is the only one of the four whose native event source is the syscall stream; that is why the source doc assigns it the two verifier-instrumentation rules. The stack-level consequence: a Falco alert is an event in the telemetry pipeline (doc 04) and a label source for recording rules (doc 05), not a dead-end notification.
