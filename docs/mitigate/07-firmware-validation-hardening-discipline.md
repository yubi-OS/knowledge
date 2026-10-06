# 07. Firmware Validation and Hardening Discipline

Scope: the hardware bring up and hardening discipline the source doc records (yubi-OS/yubiOS docs/MITIGATE.md, sections "Firmware Validation", "systemd Hardening Notes", the out of scope list, the integration sections, and the drift check note).

## Firmware validation at first boot

The source doc specifies yubiOS-chipsec-firstboot.service as a one shot firmware validation service. Two scoping decisions are recorded with it:

- Raw hardware access is allowed only because firmware inspection requires it, and that exception is explicitly scoped.
- The service warns by default; fleet deployments may choose a fail-closed policy through kernel arguments.

CHIPSEC itself is the framework for analyzing platform level security of hardware, devices, system firmware, low level protection mechanisms, and platform component configuration (https://chipsec.github.io/, jev weight 0.68; project repository https://github.com/chipsec/chipsec, jev weight 0.57).

The source doc is explicit about the tool's limit: CHIPSEC does not provide a reliable automated Absolute/Computrace verdict. The best current evidence is informational scanning for WPBT and relevant UEFI variables, not a pass/fail guarantee. WPBT, the Windows Platform Binary Table, is an ACPI table that lets the vendor run a program on every boot (https://github.com/Jamesits/dropWPBT, jev weight 0.25, weak backing), which is why its presence is the scan target. This matches the doc's own Computrace rows in docs 03 and 05: detection is possible, automated verdicts are not, and removal requires reflashing.

## systemd hardening notes

The source doc records two rules that guard against feature conflation:

- Use RestrictFileSystems= when a filesystem type allow or deny policy is appropriate and the kernel has BPF LSM support. Do not describe it as a systemd v261 only feature.
- Track RestrictFileSystemAccess= separately, as the v261 filesystem access primitive to evaluate in future service audits. A v261 release tracker describes the new setting as using a BPF LSM program to restrict execution to binaries stored on signed and verified filesystems (https://newreleases.io/project/github/systemd/systemd/release/v261, jev weight 0.09, weak backing), consistent with the source doc's dating.

The BPF LSM dependency is grounded upstream: the kernel's LSM BPF documentation describes BPF_PROG_TYPE_LSM programs attaching to LSM hooks such as file_open (https://docs.kernel.org/bpf/prog_lsm.html, jev weight 0.80), and systemd's bpf-restrict-fs helper fails to load when the running kernel lacks the required BPF configuration (https://github.com/systemd/systemd/issues/32968, jev weight 0.65). The source doc's RestrictFileSystems= rows in the Faux Phy coverage chart therefore carry a kernel config precondition, not just a systemd version.

## The out of scope list

The source doc enumerates what no yubiOS mitigation claims to cover:

- A malicious or vulnerable CPU or SoC executing below the owner controlled chain.
- Closed boot ROM or firmware stages that cannot be replaced or verified by the owner.
- Physical coercion of the owner into providing PIN, touch, or recovery material.
- Compromise after the system is unlocked and the owner session is active.
- Supply chain compromise of a pinned source before the project detects and rotates the pin.

Each item bounds a class that the Primary Mitigations table (doc 06) prices as residual risk rather than eliminated threat.

## Integration sections and the drift check

The doc closes with three integration notes and one process record:

- Declarative policy coverage: the document integrates with the yubiOS declarative policy substrate, OPA/Rego policy files, signing config JSON, and policy as code workflows; policy evaluation is the gate, not an afterthought.
- Continuous and adaptive coverage: the document supports the runtime detection layer, falco, tracee, tetragon, kubeArmor, with alerts and metrics feeding the audit evidence rollup.
- Segmentation coverage: the document applies the segmentation primitive, namespaces, cgroups, sandbox and isolation boundary idioms including nsjail, bwrap and firejail, landlock and seccomp, with the boundary named and the trust domain transition documented.
- Drift check: the 2026-09-18 wayfinder round 11, cycle 18 note records that the mitigation coverage check found no unanchored mitigation, and marks the change as additive.

## Why the discipline matters

The bring up discipline in this document is the part that survives contact with real hardware: a one shot chipsec service with a scoped exception and a warn by default to fail-closed progression, hardening directives chosen per service with their kernel preconditions checked, and an out of scope list that keeps the claims honest. The doc's last reviewed date is 2026-07-11, and its status line reads "planning baseline for main", so the follow up log it names (refs/planning-cycle-2026-07-11.md) is the place where the systemd, PQ TLS, bootc and QEMU corrections are tracked.
