# 08 - Nested KVM in CI: host matrix, fail-closed testing, and upstream drift

Scope: Testing nested KVM in CI: hardware-fail-closed capability probes, host matrix enumeration (Graviton 3 vs Graviton 2), fail-safe test design, and upstream drift surfaces to watch.

## The CI constraint: capability is host-bound

Nested virtualization on ARM64 is a boot-time and silicon property of the host, not a portable property of arm64. The parameter documentation ties `kvm-arm.mode=nested` to ARMv8.4 hardware with FEAT_NV2 (weight 0.796 and 0.725, LKML doc patch), and a security briefing summarizes the posture directly: nested virtualisation on ARM64 is not on unless somebody turned it on at boot (weight 0.325, weak backing, labeled as such).

For cloud CI hosts, the AWS documentation states that nested virtualization on EC2 works by adding processor-level virtualization support so a hypervisor running in the instance can create and manage virtual machines (weight 0.964, AWS EC2 user guide). Community answers narrow the picture: EC2 VMs do not support nested virtualization for any architecture, and running your own hypervisor requires metal instances (weight 0.241, weak backing, labeled as such); a question on Graviton 3 metal instances reports a Linux VM that ran but did not expose /dev/kvm (weight 0.346, weak backing, labeled as such); and an answer states Graviton 2 uses ARMv8.2, which does not have native nested support since that is added in ARMv8.3 (weight 0.154, weak backing, labeled as such).

The CI conclusion, with honest confidence: every nested-KVM CI job needs an explicit host-capability gate, because the strong sources (AWS docs 0.964, kernel parameter doc 0.796) establish that capability varies by instance class and boot configuration, while the weak sources suggest the Graviton-specific matrix is unsettled. Do not build a CI matrix entry that assumes nested; build one that verifies then skips.

## Fail-closed test design

The kernel's nested-guests documentation warns about the classic CI false positive: operators without KVM enabled for their level-1 hypervisor run with pure emulation, QEMU calls it TCG, and they believe they are running nested KVM (weight 0.273, weak backing, GitHub mirror of the kernel doc; matches the kernel doc text at 0.943). A test that passes on TCG is worse than a test that fails: it gives false coverage.

The corresponding guest-side failure signature is documented in the Lima issue tracker: `qemu-system-aarch64: mach-virt: host kernel KVM does not support providing Virtualization extensions to the guest CPU` (weight 0.119, weak backing, labeled as such). A well-formed CI probe treats that message, and any TCG fallback, as a skip-with-reason rather than a pass.

Design rules derivable from the sources:

1. Gate on the host boot mode first. The mode is selected at boot (weight 0.919, kernel command-line parameters doc), so the probe checks the kernel command line before launching anything.
2. Gate on hardware second. The FEAT_NV2 requirement is documented in the parameter doc (0.796).
3. Fail closed. A host that fails either gate exits with a skip, never a pass, and never silently falls to TCG (the TCG trap is documented at 0.943/0.273).

## A security consideration for CI hosts

Weak-backed but worth recording for risk triage: multiple 2026 reports describe CVE-2026-89775, an ARM64 KVM nested virtualization vulnerability allowing a guest read and write access to freed host kernel memory, reported as affecting hosts with nested virtualization enabled (weights 0.190, 0.218, 0.249, 0.325, all weak backing, labeled as such: security blogs and briefings, no primary advisory in this dig). The consistent claim across the weak sources is that exposure requires the nested mode to be on, which reinforces the fail-closed default: CI hosts that do not need nested should not boot with the mode enabled. Treat the CVE as unverified until checked against a primary advisory.

## Upstream drift surfaces to watch

Three moving surfaces make "nested works on ARM" a version-bound claim:

1. The kernel series is still landing major changes. The third drop of the year revamped the timer code completely (weight 0.870, LWN 928426), and a September 2026 thread reworks the nested MMU with shadow stage-2 tables and MMU notifier interaction (weight 0.855, LKML).
2. The QEMU ID-register surface is growing. The customizable KVM host model RFC states that since the v6.7 kernel, KVM/arm allows userspace to overwrite a subset of ID regs and the list of writable fields continues to grow (weight 0.606, mail-archive qemu-devel), with later revisions exposing writable ID reg field properties on the KVM host vCPU model (weight 0.296, weak).
3. The mode documentation itself was patched as recently as the 2024-10 run, after a commit changed protected-mode behavior without a doc update (weight 0.579, 0.855, LKML).

Operationally: pin any nested-KVM CI result to a specific Linux minor version and QEMU minor version, and re-run the capability probe after either moves.

## Sources

- https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/amazon-ec2-nested-virtualization.html (0.964)
- https://www.kernel.org/doc/html/latest/admin-guide/kernel-parameters.html (0.919)
- https://www.kernel.org/doc/html/v5.7/virt/kvm/running-nested-guests.html (0.943)
- https://lwn.net/Articles/928426/ (0.870, 0.653)
- https://lkml.org/lkml/2024/10/24/1323 (0.796)
- https://lkml.org/lkml/2024/10/24/1791 (0.725)
- https://lkml.org/lkml/2026/9/6/384 (0.855)
- https://www.mail-archive.com/qemu-devel@nongnu.org/msg1219778.html (0.606)
- https://lkml.iu.edu/hypermail/linux/kernel/2410.2/11356.html (0.855)
- https://lists.gnu.org/archive/html/qemu-arm/2026-09/index.html (0.296, weak)
- https://www.repost.aws/questions/QUChyy06f6TRKgitoNLKV4DQ/nested-virtualization-support-on-ec2-graviton-3-metal-instances (0.346, weak)
- https://repost.aws/questions/QU8NxrQuk3Rla42meRIear6g/does-graviton-3-support-nested-virtualization (0.241, weak)
- https://repost.aws/questions/QUEoabj2ZERq2P5QFL6d6-RQ/nested-virtualization-on-graviton (0.154, weak)
- https://www.pk-sharma.com/briefing/linux-arm64-kvm-nested-escape-exposure (0.325, weak)
- https://securityarsenal.com/blog/cve-2026-89775-arm64-kvm-nested-virtualization-guest-escape-detection-mitigation-and-patching-guide (0.190, weak)
- https://freenode.net/article/kvm-arm64-nested-virt-flaw-allows-guest-escape-to-host (0.218, weak)
- https://aviatrix.ai/threat-research-center/linux-kernel-cve-2026-89775-arm64-kvm-nested-virtualization/ (0.249, weak)
- https://github.com/lima-vm/lima/issues/4498 (0.119, weak)
- https://github.com/zalexdev/linux-um-arm64/blob/um-arm64/Documentation/virt/kvm/x86/running-nested-guests.rst (0.273, weak)
