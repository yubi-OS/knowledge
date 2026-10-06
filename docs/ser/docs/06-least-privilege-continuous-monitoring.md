# 06 - Least privilege and continuous monitoring

**Scope:** What the ground doc's least-privilege-coverage and continuous/adaptive-coverage sections record, and the external mechanisms behind the named directives and runtime-detection tools.

**Ground spine:** `yubi-OS/yubiOS docs/SER.md` (https://github.com/yubi-OS/yubiOS/blob/main/docs/SER.md, jev weight 0.61)

## What the source doc records

The least-privilege-coverage section states the document applies least-privilege hardening: Linux capabilities (drop plus ambient), ProtectSystem and ProtectHome, rootless execution, dynamic user, RBAC, and PrivilegeBoundary (source doc). It adds that sandbox or jail idioms (bwrap, nsjail, landlock, seccomp) are used where isolation beyond containerization is required (source doc).

The continuous/adaptive-coverage section states the document supports the yubiOS continuous-monitoring layer: runtime detection (falco, tracee, tetragon, kubeArmor), adaptive policy, and real-time monitoring (source doc). It says the document is observable from the runtime-detect surface and that alerts and metrics feed into the audit-evidence rollup (source doc).

## systemd hardening directives

The dig grounds the systemd half of the least-privilege list. A Rocky Linux 10 guide covers systemd unit hardening including capabilities and related sandboxing directives (https://docs.rockylinux.org/10/guides/security/systemd_hardening/, weight 0.81). A practitioner guide enumerates the same family: sandboxing with ProtectHome and ProtectSystem, capability reduction with CapabilityBoundingSet (https://blog.gntech.me/posts/2026-05-24-systemd-service-hardening-linux/, weight 0.22, weak). Another guide lists ProtectSystem, PrivateTmp, NoNewPrivileges, CapabilityBoundingSet, SystemCallFilter, and DynamicUser together (https://mylinux.work/guides/systemd-hardening/, weight 0.17, weak). A baseline datum: a freshly installed service on Ubuntu 24.04 typically scores 8 to 9 on systemd-analyze security, marked EXPOSED, because default units grant broad privileges (https://virtualserversvps.com/blog/systemd-service-hardening-sandboxing-capabilities/, weight 0.14, weak). systemd itself is the system and service management suite on Linux (https://en.wikipedia.org/wiki/Systemd, weight 0.54).

## Runtime detection tools

On the monitoring half, the dig is weakly backed but directionally consistent. An eBPF runtime-security overview describes kernel-level syscall and network visibility with detection by Falco and Tetragon (https://safeguard.sh/resources/blog/ebpf-runtime-security, weight 0.24, weak). A comparison of Falco, Tetragon, and Tracee covers architecture, enforcement model, and detection content (https://safeguard.sh/resources/blog/kubernetes-runtime-security-tools-comparison, weight 0.21, weak). A tooling guide compares Falco, Tetragon, Tracee, and KubeArmor as the leading eBPF security tools (https://www.armosec.io/blog/best-ebpf-security-solutions-runtime-protection/, weight 0.20, weak). A PDF technical guide compares the architectures of container runtime security tooling (https://www.accuknox.com/wp-content/uploads/Container_Runtime_Security_Tooling.pdf, weight 0.18, weak). A 2026 roundup characterizes Falco as behavioral anomaly detection and Tetragon as having enforcement capability (https://www.decryptiondigest.com/blog/ebpf-runtime-security-tools-falco-tetragon, weight 0.16, weak).

## What is grounded and what is not

The strongest grounding (0.81) covers the systemd directive family that the doc's least-privilege list names. The runtime-detection tools are grounded only weakly (0.16 to 0.24); the doc's claim that alerts and metrics feed the audit-evidence rollup, the RBAC and PrivilegeBoundary anchors, and the bwrap/nsjail/landlock/seccomp isolation idiom have no external corroboration in this dig and are reported as the source doc's own records (source doc).
