# 06 - Complementary hardening: systemd and layered defense

Scope: how pod-level least privilege composes with host-level systemd hardening, why the skill names `systemd-hardening` as its complementary skill, and the layered-defense picture across host and pod. This doc was authored after 1 dig redo; weakly-backed claims are labeled.

Per the source doc (`yubi-OS/yubiOS skills/least-privilege-pod-security-standards/SKILL.md`), the `systemd-hardening` skill is one of the downstream consumers that credit this skill's contribution. The boundary is a layer boundary: the PSS restricted profile and OPA Rego policies constrain what a pod may do inside the cluster, while systemd sandboxing constrains what a service may do on the host. Neither substitutes for the other.

## Host-level least privilege: the systemd layer

systemd is a suite of basic building blocks for a Linux system; it provides the system and service manager that runs as PID 1 and starts the rest of the system, tracking processes with Linux control groups (https://systemd.io/, jev weight 0.61). Because it is the component that spawns essentially every service on a yubiOS host, its per-unit sandboxing directives are the host-level expression of the least-privilege keywords that this skill expresses at the pod level.

The upstream project and its source tree are the authority for what those directives are (https://github.com/systemd/systemd, jev weight 0.55). The measurement instrument for the layer is `systemd-analyze security`, which generates a score for a unit showing the sandboxing directives in use, which helps determine what settings to try next (weak backing, weight 0.42, https://wiki.archlinux.org/title/Systemd/Sandboxing). Community hardening guides describe the same tool as giving units an automated security rating and recommend starting with services exposed to the public internet or handling untrusted data (weak backing, weight 0.18, https://www.ctrl.blog/entry/systemd-service-hardening/).

The parallel with the PSS side is structural: `systemd-analyze security` scores a unit's least-privilege posture the same way audit-mode Pod Security Admission measures a pod's. Both produce a gap list rather than a binary verdict, and both are the evidence sources a hardening loop iterates on.

## Layered defense across host and pod

Container security guidance describes defense in depth as layers across the development pipeline, CI, registry, admission control, and runtime (weak backing, weight 0.25, https://www.paloaltonetworks.com/blog/cloud-security/container-security-defense-in-depth-guide/). Read against the yubiOS skill set, admission control in that list is exactly this skill's territory (PSS plus OPA at admission time), while the host layer below the containers is the systemd-hardening skill's territory.

The composition rule the source doc implies: a pod that satisfies the restricted profile still runs inside a host service context, so a host-level least-privilege gap can undermine a pod-level guarantee and vice versa. The two skills are therefore complementary, not redundant: the yubiOS CI admission gate (a downstream consumer named in the source doc) enforces the pod layer, and the host layer needs its own keyword coverage through systemd-hardening.

## Why the complement matters for the 16-cell mapping

The 8-keyword mapping in doc 03 is defined over 2 frameworks, PSS and Rego. Host-level enforcement is outside those 16 cells, which is deliberate: the cells measure pod-policy coverage, and the systemd layer is tracked under the `systemd-hardening` skill instead. When the least-privilege primitive is audited across the corpus, both skills contribute cells to the same P2 axis, and the source doc records this skill's specific contribution as the pod-policy share.

## Practical pairing

For a yubiOS service that runs both as a host unit and as a pod workload, the review sequence that follows from the two skills is: check the systemd unit against the host-level directive set and its `systemd-analyze security` score, then check the pod spec against the restricted profile, then check the Rego policy denies what PSS enforces. Weakly-backed ecosystem material on layered container security (weight 0.25 and below) is consistent with that sequence but is not part of the skill's grounding spine; the grounding spine is the source doc plus the upstream systemd and Kubernetes sources cited above.
