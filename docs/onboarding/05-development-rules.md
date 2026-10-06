# 05. Development Rules

Scope: the standing rules the onboarding doc imposes on contributors: ARM64 as the primary architecture for hardware-root trust planning, keeping x86-64 working without letting it override trust-chain priorities, pin hygiene through PINNED.md, the distinction between RestrictFileSystems= and RestrictFileSystemAccess= in systemd hardening notes, and dated refs/ notes for substantial research cycles.

Grounding spine: yubi-OS/yubiOS docs/ONBOARDING.md (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/ONBOARDING.md), last reviewed 2026-07-11.

## Rule 1: ARM64 is primary for hardware-root planning

The first rule states: treat ARM64 as primary for mission-critical hardware-root planning (source doc). The architecture matters here because the hardware root of trust is where the boot chain starts, and ARM platforms carry a specific set of firmware and security primitives for that role. ARM's platform security architecture documentation describes building a secure system on a chain starting in hardware (https://support.arm.com/documentation/PRD29-GENC-009492/c/TrustZone-Software-Arc, weight 0.49, weak backing), and ARM publishes a dedicated platform security boot guide covering the boot security architecture for ARM systems (https://documentation-service.arm.com/static/5fae7507ca04df4095c1caaa, weight 0.26, weak backing). The rule is not "ignore x86-64"; it is a priority ordering: when a design decision touches the hardware root of trust, the ARM64 shape of the problem is the one that must be solved first and best.

## Rule 2: keep x86-64 working, with an explicit asymmetry

The second rule keeps x86-64 support working but forbids letting x86-specific VM behavior override ARM64 trust-chain priorities (source doc). The asymmetry is the point: x86-64 is the convenient development and virtualization target, so its quirks exert constant pull on design conversations. The rule names that pull as a hazard. Concretely, a fix that makes an x86-64 VM boot path work but weakens or bypasses the ARM64 trust chain is the exact failure the rule prohibits.

## Rule 3: pin hygiene lives in PINNED.md

The third rule: do not copy old workflow-run digests into docs as current pins; update PINNED.md instead (source doc). This is a single-source-of-truth rule for version state. A digest copied from a past workflow run is a snapshot of a past moment, and the moment it is copied into a doc as if current, the doc lies about the build. The rule redirects all pin updates to PINNED.md, which the reading path (doc 01) already established as the live base-image and tool pins document. The practical workflow for a contributor is: when a base image or tool moves, change PINNED.md, and never hardcode the digest anywhere else.

## Rule 4: keep the two RestrictFileSystems directives distinct

The fourth rule: keep `RestrictFileSystems=` and `RestrictFileSystemAccess=` distinct when writing systemd hardening notes (source doc). These are two different systemd directives with different semantics, and hardening documents that conflate them produce guidance that cannot be implemented correctly. A hardening guide from Rocky Linux walks systemd unit hardening directives in their distinct categories (https://docs.rockylinux.org/10/guides/security/systemd_hardening/, weight 0.40, weak backing), and independent systemd hardening references treat filesystem-related directives as a set of distinct controls rather than interchangeable names (https://www.vlacia.com/os-security/systemd-unit-file-hardening, weight 0.16, weak backing). yubiOS maintains its own audit trail for exactly this area: the repo carries a dated systemd hardening audit note under refs/ (https://github.com/yubi-OS/yubiOS/blob/main/refs/systemd-hardening-audit-2026-07-17.md, weight 0.36, weak backing), showing the rule is backed by an existing audit practice, not just stated as policy.

## Rule 5: substantial research gets a dated refs/ note

The fifth rule: make a dated refs/ note for substantial research cycles (source doc). This is the documentation counterpart of rule 3: pins go to PINNED.md, and research findings go to refs/ with a date in the name. The reading path already made one of these notes load-bearing (refs/planning-cycle-2026-07-11.md is the pointer the onboarding doc itself follows), so the rule closes the loop: today's research note is a future reader's step 5.

## How the rules fit together

The 5 rules divide into an architecture policy (rules 1 and 2), a documentation-state policy (rules 3 and 5), and a precision policy for security prose (rule 4). All 5 are process rules, not product features: they tell contributors how to keep the project's decision record trustworthy while the hardware-root work proceeds. A contributor who follows them produces work that stays legible to the next reader, which is the onboarding doc's implicit goal throughout.
