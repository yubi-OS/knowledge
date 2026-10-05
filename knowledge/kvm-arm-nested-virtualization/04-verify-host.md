# 04 - Verifying nested KVM state on a running ARM64 host

Scope: How to verify nested KVM state on a running ARM64 host: kernel cmdline, dmesg KVM mode reporting, cpufeature evidence, lsmod and module-builtin distinctions, and why the old sysfs path is absent on modern kernels.

## The wrong first step: the x86 sysfs check

Most tutorials start with `/sys/module/kvm_intel/parameters/nested` or `/sys/module/kvm_amd/parameters/nested` (weight 0.977, Fedora docs; 0.909, Fedora QA wiki; 0.940, Ubuntu server docs). On an ARM64 host these paths do not exist: they are x86 module parameters, and the Fedora documentation scopes them explicitly to Intel and AMD processors. A Server Fault question from a user on an ARM64 Neoverse N1 VM documents exactly this failure: every tutorial pointed at kvm_amd or kvm_intel sysfs folders, none of which exist on ARM64 (weight 0.068, weak backing, labeled as such).

The same logic rules out the ARM-era prototype check `/sys/module/kvm_arm/parameters/nested` on modern kernels: the supported selection surface moved to the kernel command line (see doc 01 for the history, doc 02 for the current parameter).

## What to actually check

Three checks, in increasing strength of evidence:

1. Kernel command line. The mode is a boot-time selection, so the authoritative runtime check is the cmdline: `grep kvm-arm.mode /proc/cmdline`. The kernel's command-line parameter documentation is the canonical reference for this parameter class (weight 0.919, kernel.org admin-guide). If the parameter is absent, the host booted with the default mode and nested is not enabled.

2. dmesg at boot. KVM reports the mode it initialized in. A Fedora community post documents the expected boot message after adding `kvm-arm.mode=nested`: `kvm [1]: VHE+NV2 mode initialized successfully`, along with the required QEMU configuration `-M virt,accel=kvm,virtualization=on` (weight 0.084, weak backing, labeled as such: a community forum post, not primary documentation; the message text is worth grepping for but should be confirmed against your own kernel's source).

3. Mode-documentation cross-check. The kernel pKVM documentation defines what booting with `kvm-arm.mode=protected` does at boot time: pKVM installs a stage-2 identity map page-table for the host and uses it to isolate the hypervisor running at EL2 (weight 0.876 and 0.927, kernel.org). This gives a concrete behavioral signal: in protected mode, the hypervisor is isolated from the host kernel, which is observable in the boot log structure.

## A negative fact worth testing for

Nested virtualization on ARM64 is not on unless somebody turned it on at boot: the kernel's own parameter documentation describes the nested value of kvm-arm.mode as requiring at least ARMv8.4 hardware with FEAT_NV2 (weight 0.325, weak backing, labeled as such: a security briefing quoting the kernel parameter doc; the quote is consistent with the LKML doc patch text at weight 0.796). So the correct verification posture is to check both halves: the boot-time selection (cmdline plus dmesg) and the hardware capability (FEAT_NV2), because a host can satisfy one without the other.

## Underlying modes you are verifying between

KVM on arm64 supports two distinct execution modes: VHE, where the host hypervisor runs natively at EL2, and nVHE, where the host runs at EL1 while a separate hypervisor image executes at EL2 (weight 0.657, DeepWiki over the Linux tree; corroborated by the pKVM kernel documentation at 0.927). `nested` is a VHE-based mode per the 2024-10 parameter documentation patch (weight 0.725, LKML), so a host that ends up in nVHE did not run the nested configuration.

## Module-loading checks and their limits

`lsmod | grep kvm` confirms loaded KVM modules, but on many distributions the arm64 KVM code is built into the kernel rather than built as a module, in which case lsmod shows nothing and absence of output is not evidence of absence. The x86 documentation similarly notes distribution defaults vary (weight 0.975, kernel.org running-nested-guests doc, for the x86 default-on behavior since v4.19). Treat module checks as advisory only; the cmdline and dmesg checks above are the ones that carry signal.

## Sources

- https://www.kernel.org/doc/html/latest/admin-guide/kernel-parameters.html (0.919)
- https://www.kernel.org/doc/html/next/virt/kvm/arm/pkvm.html (0.876)
- https://docs.kernel.org/7.1/virt/kvm/arm/pkvm.html (0.927)
- https://docs.fedoraproject.org/en-US/quick-docs/using-nested-virtualization-in-kvm/ (0.977)
- http://fedoraproject.org/wiki/QA:Testcase_KVM_nested_virt (0.909)
- https://ubuntu.com/server/docs/how-to/virtualisation/enable-nested-virtualisation/ (0.940)
- https://www.kernel.org/doc/html/v5.7/virt/kvm/running-nested-guests.html (0.975)
- https://lkml.org/lkml/2024/10/24/1791 (0.725)
- https://deepwiki.com/torvalds/linux/7.3-kvm-on-arm64:-sysreg-emulation-nested-and-vgic (0.657)
- https://discussion.fedoraproject.org/t/nested-virtualization/179358 (0.084, weak)
- https://www.pk-sharma.com/briefing/linux-arm64-kvm-nested-escape-exposure (0.325, weak)
- https://serverfault.com/questions/1098604/how-to-check-if-kvm-nested-virtualization-is-supported-on-arm64-processor (0.068, weak)
