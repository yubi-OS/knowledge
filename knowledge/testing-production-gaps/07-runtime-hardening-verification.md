# 07 - Runtime hardening verification

## Scope

Runtime hardening evidence: static audits vs booted-image verification with systemd-analyze security and live RestrictFileSystems assertions.

## The static-versus-runtime distinction

A systemd service's hardening directives are only effective when the unit actually runs with them applied. The yubiOS gap is exactly this: the hardening audit (refs/systemd-hardening-audit-2026-07-17.md) is a static analysis of unit files, and nobody has booted a target image to watch the sandbox actually fire during enrollment (yubiOS source: refs/testing-production-gaps-2026-08-01). Static analysis can miss: a unit may be overridden by a drop-in, masked by an ordering bug, or running under a different unit name than the audit checked.

systemd-analyze security evaluates a unit against its sandboxing and privilege-related settings and reports an exposure score with detailed findings, which makes it the standard triage tool for prioritizing what to harden first (source: https://dev.to/lyraalishaikh/harden-linux-services-with-systemd-analyze-security-from-score-to-enforceable-policy-5415, jev weight 0.11, weak backing). The important property for CI use: systemd-analyze security works offline on a unit file, but its real value as evidence is running it on the booted graph, where the loader has merged drop-ins and resolved the actual unit.

## The canonical verification commands

The Linux systemd sandboxing model restricts services through kernel primitives; systemd exposes a suite of sandboxing features from access control to namespacing for services (source: https://www.ctrl.blog/entry/systemd-service-hardening/, jev weight 0.48, weak backing). Distribution guides document the two-step verification pattern yubiOS's fix adopts (source: https://docs.rockylinux.org/10/guides/security/systemd_hardening/, jev weight 0.82):

1. systemd-analyze security [UNIT] for the exposure score and per-directive findings.
2. systemctl show [UNIT] -p [PROPERTY] for the live effective value of a specific directive.

For yubiOS the specific assertions the audit proposes are (yubiOS source: refs/testing-production-gaps-2026-08-01):

- systemctl show yubiOS-enroll.service -p RestrictFileSystems, asserting the value equals ~@network (the restriction is in force at runtime, not merely declared).
- systemd-analyze security yubiOS-enroll.service, asserting the exposure score is below a fixed threshold.
- ConditionSecurity=measured-os asserted on the unit, tying the enrollment service's start to a measured boot state.

The systemd sandboxing reference documents RestrictFileSystems semantics: it limits the filesystem trees a process can access via mount namespaces, and the @-prefixed groups name predefined sets such as @network (source: https://wiki.archlinux.org/title/Systemd/Sandboxing, jev weight 0.82). A live assertion on the booted system is stronger than the same grep on the unit file because it proves the loader merged the right drop-ins.

## Where this sits in the test architecture

yubiOS's blocker B-HARDENING-RUNTIME covers this gap; the fix requires ci_test-vm.yml to boot a hardened image first, which is the prerequisite (1 week of work once the image boots, yubiOS source: refs/testing-production-gaps-2026-08-01). The VM harness already boots images for the FIDO2 chain, so the additional cost is assertion plumbing, not a new lane.

Two design details matter for the assertion scripts:

1. Fail loudly on absence. systemctl show -p RestrictFileSystems returning an empty value must fail the test, not print an empty line that a human skims past.
2. Pin the unit name. The audit found static units, drop-ins, and runtime units can diverge; asserting on the wrong unit name (for example a templated instance) yields false greens.

## Continuous verification beyond CI

A one-time CI green proves the state at one commit. For an immutable OS whose promise is a hardened runtime, the same assertions can run post-boot on every upgrade transaction as a health gate: after bootc boots the new deployment, run the systemctl show and systemd-analyze security checks before marking the deployment good. systemd's automatic boot assessment machinery (boot-complete.target and systemd-bless-boot) exists precisely to gate the A/B fallback on a health verdict (source: https://systemd.io/AUTOMATIC_BOOT_ASSESSMENT/, jev weight 0.86). Wiring the hardening assertions into the boot-complete target turns hardening evidence from a CI artifact into a runtime property: a hardened image that boots with broken sandboxing fails its own boot assessment and triggers rollback.

DeepWiki's overview of systemd's process sandboxing documents the mechanism set (namespaces, seccomp, capability bounding) that these directives map to, useful background when a directive appears not to fire (source: https://deepwiki.com/systemd/systemd/8.2-process-sandboxing-and-isolation, jev weight 0.38, weak backing).

## Cost and fix

The audit prices runtime hardening evidence at 1 week once the VM boots a hardened image, with the fix being the three assertions above wired into ci_test-vm.yml post-enrollment (yubiOS source: refs/testing-production-gaps-2026-08-01). The corresponding Linear candidate (issue 4 in the audit) marks it High priority: it is the only gap that verifies the security posture users actually run, as opposed to the posture the build tree declares.

## Sources

- https://docs.rockylinux.org/10/guides/security/systemd_hardening/ (weight 0.82)
- https://wiki.archlinux.org/title/Systemd/Sandboxing (weight 0.82)
- https://systemd.io/AUTOMATIC_BOOT_ASSESSMENT/ (weight 0.86)
- https://l2dy.github.io/notes/Operating-System/Linux/Systemd-service-hardening (weight 0.54)
- https://www.ctrl.blog/entry/systemd-service-hardening/ (weight 0.48, weak backing)
- https://deepwiki.com/systemd/systemd/8.2-process-sandboxing-and-isolation (weight 0.38, weak backing)
- https://dev.to/lyraalishaikh/harden-linux-services-with-systemd-analyze-security-from-score-to-enforceable-policy-5415 (weight 0.11, weak backing)
- yubiOS refs/testing-production-gaps-2026-08-01 (internal source doc for all repo-internal claims)
