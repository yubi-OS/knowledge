# 01 - Interface history: three nested-virtualization selection mechanisms on ARM

Scope: The three nested-virt selection mechanisms in ARM KVM history, the 2017-2018 prototype sysfs knob, the multi-year upstream patch-series run, and the kvm-arm.mode consolidation; why the old module-parameter path is stale.

## The x86 module-parameter world ARM never matched

On x86, nested virtualization in KVM has been a module parameter for years. The Fedora quick-doc instructs readers to check `/sys/module/kvm_intel/parameters/nested` for Intel processors and the `/sys/module/kvm_amd/parameters/nested` equivalent for AMD, then enable nesting by unloading and reloading the module with `modprobe kvm_intel nested=1` and persisting it with `options kvm_intel nested=1` in `/etc/modprobe.d/kvm.conf` (weight 0.977). The Fedora QA wiki test case describes the same per-module check (weight 0.909). Ubuntu's server docs document the same `/etc/modprobe.d/kvm.conf` recipe (weight 0.940, weak relevance to ARM but authoritative for the x86 path). The kernel's own documentation, "Running nested guests with KVM", states that from Linux kernel v4.19 onwards the nested KVM parameter is enabled by default for Intel and AMD (weight 0.975).

That is the interface many ARM how-tos copy. It is an x86 interface: it names `kvm_intel` and `kvm_amd`, not `kvm_arm`. On ARM there is no equivalent module parameter to read, which is why ARM-focused guides that reuse the x86 check come back empty (weight 0.068, weak backing: a Server Fault question from an ARM64 Neoverse N1 user whose VM matched none of the x86 sysfs paths).

## The early ARM prototype era

The first ARM nested-virtualization work upstreamed as a patch series by Jintack Lim describes "recursive nested virtualization" and was tested on the FastModel with the v8.3 extension for arm64 and on a cubietruck for arm32 (weight 0.731, LWN kernel patch archive). This is the era the `/sys/module/kvm_arm/parameters/nested` knob is associated with: a prototype-era selection surface that predates the current consolidated design. The knob path still circulates in tutorials, but it belongs to this prototype lineage, not to the supported interface.

A kvmtool patch series from the same development lineage shows how early the support was: enabling KVM guests to run their own guests needed VGIC support patches, arch timer offset handling, and enabling non-VHE guests "at the cost of losing recursive nested virtualization" (weight 0.835, marc.info KVM list).

## The long series run, not a single landing

ARM nested virtualization did not arrive in one merge. The LWN record shows repeated cover-letter drops of the same support code:

- A series explicitly titled "KVM: arm64: ARMv8.3/8.4 Nested Virtualization support" described as "the least loved series in the history of KVM" (weight 0.839, LWN 877175).
- A second drop of NV support on arm64 within one year, with fixed TLB invalidation (weight 0.841, LWN 921783).
- A third drop, with the timer code "completely revamped" to handle both global and per-VM timers (weight 0.870, LWN 928426).
- A v11 series of 43 patches consolidated to "FEAT_NV2 only" (weight 0.902, lore.kernel.org KVM archive; corroborated at weight 0.871).

Marc Zyngier's 2026 talk "NeVer again: the last KVM/arm64 rewrite?" states that nested virtualization support for KVM/arm64 was expected to go live in Linux v6.16, should everything work according to plan (weight 0.676, YouTube recording of the talk). This is the current best-anchored merge timing: treat "nested KVM on ARM is in the kernel" as a claim about v6.16-era kernels and later, not about earlier releases.

Development continues after the merge: a September 2026 LKML discussion of "KVM: arm64: nv: Implement nested MMU" shows work on shadow stage-2 tables and MMU notifier interaction, including the observation that even with an L1 in VHE mode there is a window during boot where the L1 runs in its own EL1 (weight 0.855, LKML).

## What this means for the obsolete sysfs path

The supported ARM selection surface today is the `kvm-arm.mode` kernel command-line parameter (documented across a 2024-10 doc patch run, weights 0.725 to 0.889, see doc 02). The `/sys/module/kvm_arm/parameters/nested` check is a prototype-era artifact: it names a selection mechanism that the consolidated upstream design replaced with a boot-time mode choice. A verification procedure that starts by reading that sysfs file on a modern arm64 host is checking the wrong layer entirely.

## Sources

- https://docs.fedoraproject.org/en-US/quick-docs/using-nested-virtualization-in-kvm/ (0.977)
- https://www.kernel.org/doc/html/v5.7/virt/kvm/running-nested-guests.html (0.975)
- https://ubuntu.com/server/docs/how-to/virtualisation/enable-nested-virtualisation/ (0.940)
- http://fedoraproject.org/wiki/QA:Testcase_KVM_nested_virt (0.909)
- https://lkml.org/lkml/2026/9/6/384 (0.855)
- https://lwn.net/Articles/928426/ (0.870, 0.653)
- https://lwn.net/Articles/921783/ (0.841)
- https://lwn.net/Articles/877175/ (0.839, 0.792, 0.881)
- https://marc.info/?l=kvm&m=175378332614995 (0.835)
- https://www.youtube.com/watch?v=Ox6YSdJAm1s (0.676)
- https://lwn.net/Articles/728193/ (0.731)
- https://marc.info/?l=kvm&m=170055774032652 (0.734)
- https://serverfault.com/questions/1098604/how-to-check-if-kvm-nested-virtualization-is-supported-on-arm64-processor (0.068, weak)
