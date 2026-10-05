# 05 - Enabling kvm-arm.mode=nested: the command-line path and why modprobe is not it

Scope: How to enable kvm-arm.mode=nested via the kernel command line on systemd-boot, GRUB, and UKI EFI-stub cmdlines; why the modprobe kvm_arm nested=1 recipe fails on modern kernels; nvhe as the safe baseline.

## The parameter is a boot-time selection

The kernel's command-line parameter documentation is the canonical reference for boot-time switches of this class (weight 0.919, kernel.org admin-guide). ARM Linux receives its command line from the boot loader, which is expected to initialise devices and then pass information to the kernel at boot (weight 0.867, kernel.org ARM booting documentation). That establishes the mechanism: to enable nested KVM you set `kvm-arm.mode=nested` in whatever surface produces your kernel command line, not at module load time.

Concretely, the boot-time surfaces are:

- GRUB: append the parameter in the boot entry configuration so it lands in the kernel command line.
- systemd-boot: append it to the boot entry's options line.
- UKI (unified kernel image): bake it into the EFI-stub cmdline embedded in the image.

The parameter documentation itself does not prescribe a boot loader; those are three standard ways a command line reaches the kernel (weight 0.867, kernel.org ARM booting doc, for the bootloader-passes-cmdline mechanism).

## What the parameter selects

The 2024-10 documentation patch defines `kvm-arm.mode` with values `nvhe`, `protected`, and `nested`, where nested is a VHE-based mode requiring at least ARMv8.4 hardware with FEAT_NV2, and flags the non-default modes with extreme-caution wording (weights 0.725, 0.796, 0.855, LKML). The default is the safe baseline: if you never set the parameter, you get the default nVHE-style mode and no nested capability.

The patch also documents the forced-nVHE escape hatch: nVHE protected mode can still be forced on VHE systems using `kvm_arm.mode=protected arm64_sw.hvhe=0 id_aa64mmfr1.vh=0` (weight 0.725, LKML). This shows the general pattern: mode selection can be refined with additional arm64 command-line switches, which is exactly why the mode belongs on the kernel command line rather than in a module option.

## Why the modprobe recipe is the wrong path

The popular enablement recipe circulating in tutorials is x86-specific: unload the module, reload it with `nested=1`, persist via `/etc/modprobe.d/kvm.conf` (weight 0.940, Ubuntu server docs; 0.977, Fedora docs; 0.909, Fedora QA wiki). Two things make this a wrong transfer to ARM64:

1. Those documents name `kvm_intel` and `kvm_amd` modules. ARM64 KVM is not those modules, and the ARM nested capability has no documented module parameter anywhere in the sources collected here.
2. The kernel documentation states that on x86, from Linux kernel v4.19 onwards, the nested parameter is enabled by default for Intel and AMD (weight 0.975 and 0.6, kernel.org running-nested-guests doc), so the modprobe ritual is largely vestigial even on x86. On ARM there is no equivalent: the selection surface is the boot-time mode switch.

The Ubuntu KVM FAQ documents general KVM module handling but contains no ARM nested module parameter (weight 0.597, help.ubuntu.com). A Virtual Open Systems ARMv8 KVM setup guide, one of the few ARM-specific KVM enablement guides in the public record, describes setting up a KVM development environment on ARM64 processors but is a dated guide with weak relevance to the modern mode-switch era (weight 0.279, weak backing, labeled as such).

## Hardware precondition

Enabling the mode does nothing without the silicon: the parameter documentation ties `nested` to at least ARMv8.4 hardware with FEAT_NV2 (weight 0.796, LKML doc patch text; corroborated at weight 0.325, weak, by a security briefing quoting the same doc text). The only high-confidence hardware evidence in the collected record for running nested KVM is Apple M1/M2-class silicon, where maintainers tested nVHE and protected modes bare metal and as a nested guest (weight 0.889, linux-arm-kernel). Claims about specific server cores rest on weak sources (see doc 03). So the enablement procedure is: confirm FEAT_NV2 on the host, then set the command-line parameter, then verify in dmesg (doc 04).

## Sources

- https://www.kernel.org/doc/html/latest/admin-guide/kernel-parameters.html (0.919)
- https://origin.kernel.org/doc/html/latest/arch/arm/booting.html (0.867)
- https://www.kernel.org/doc/html/v5.7/virt/kvm/running-nested-guests.html (0.975)
- https://docs.kernel.org/virt/kvm/x86/running-nested-guests.html (0.6)
- https://lkml.org/lkml/2024/10/24/1791 (0.725)
- https://lkml.org/lkml/2024/10/24/1323 (0.796)
- https://lkml.iu.edu/hypermail/linux/kernel/2410.2/11356.html (0.855)
- https://ubuntu.com/server/docs/how-to/virtualisation/enable-nested-virtualisation/ (0.940)
- https://docs.fedoraproject.org/en-US/quick-docs/using-nested-virtualization-in-kvm/ (0.977)
- http://fedoraproject.org/wiki/QA:Testcase_KVM_nested_virt (0.909)
- https://help.ubuntu.com/community/KVM/FAQ (0.597)
- http://www.virtualopensystems.com/en/solutions/guides/kvm-on-armv8/ (0.279, weak)
- https://www.pk-sharma.com/briefing/linux-arm64-kvm-nested-escape-exposure (0.325, weak)
- https://lists.openwrt.org/pipermail/linux-arm-kernel/2023-May/837104.html (0.889)
