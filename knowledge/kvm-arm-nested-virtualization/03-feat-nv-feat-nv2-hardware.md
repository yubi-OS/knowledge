# 03 - FEAT_NV versus FEAT_NV2 and the hardware matrix

Scope: FEAT_NV vs FEAT_NV2 architectural difference (VNCR_EL2 addressing change), the ARM64_HAS_NESTED_VIRT cpufeature, and the hardware matrix: which silicon can actually run nested KVM.

## What nested virtualization means architecturally

ARM's own learning material defines the concept: nested virtualization is running a hypervisor inside a virtual machine, with the first hypervisor called the host hypervisor and the hypervisor within the VM called the guest hypervisor (weight 0.890, Arm "Learn the architecture" AArch64 virtualization guide). The architectural feature that makes this efficient is FEAT_NV, introduced in ARMv8.3, and its successor FEAT_NV2 in ARMv8.4.

The NEVE research paper describes the mechanism precisely: NEVE introduces an EL2 Virtual Nested Control Register, VNCR_EL2, which is managed exclusively by the host hypervisor (weight 0.925, Columbia University SOSP 2017 paper). FEAT_NV2 changes how VNCR_EL2 pages are addressed relative to FEAT_NV, which is why the two features are not binary-compatible from a hypervisor implementation standpoint.

## The kernel consolidates on FEAT_NV2

The KVM/arm64 series history shows the consolidation explicitly. The v11 cover letter is titled "KVM: arm64: Nested Virtualization support (FEAT_NV2 only)" (weight 0.902 and 0.871, lore.kernel.org KVM archive), meaning the 43-patch series dropped FEAT_NV-only support and targets FEAT_NV2 hardware. FEAT_NV-only hardware is effectively unaddressed: the earlier kvmtool work already traded away recursive nested virtualization to enable non-VHE guests (weight 0.835, marc.info KVM list).

## The hardware matrix: weaker evidence than you would want

Here the published record is thinner and partially contradictory, and the weights reflect that honestly.

Primary-adjacent evidence (weight 0.889 and 0.753, linux-arm-kernel): the VHE-in-nVHE patch series was tested on an M1 box bare metal as well as a nested guest on M2. This is direct evidence that Apple M-series silicon at the M2 generation runs nested KVM workloads in practice, on an actual kernel patch series, not a spec sheet.

Weak evidence on the negative side: an ARM Community forum post reports that even though FEAT_NV and FEAT_NV2 have been defined for some time, no ARM CPU seemed to support them when reading the technical reference manuals (weight 0.062, weak backing, labeled as such). A systemonchips analysis from February 2025 states that as of the latest CPU models, including Cortex-A710 and Cortex-A715, these features remain unsupported, and that ARM will eventually introduce CPUs with support but the timeline is uncertain (weights 0.369 and 0.439, weak backing, labeled as such: a vendor blog, not silicon documentation).

Weak evidence on Graviton: an AWS re:Post answer states Graviton 2 uses the ARMv8.2 architecture, which does not have native support for nested virtualization, since that is added in ARMv8.3, and points at metal instances instead (weight 0.154, weak backing, labeled as such: a community Q&A, not an AWS service announcement).

Putting the matrix together with honest confidence levels:

| Silicon | Nested KVM evidence | Weight class |
|---|---|---|
| Apple M1 | nVHE and protected tested bare metal | high (0.889) |
| Apple M2 | tested as a nested guest on an actual series | high (0.889, 0.753) |
| Cortex-A710/A715 | reported unsupported as of Feb 2025 | weak (0.369, 0.439) |
| Graviton 2 (ARMv8.2) | no FEAT_NV by architecture level | weak (0.154) |

The load-bearing conclusion for any CI or fleet planning: nested KVM on ARM64 is hardware-bound, the only high-confidence hardware evidence in the public record is Apple M1/M2-class silicon used by the KVM maintainers themselves, and claims about specific server cores (Neoverse generations, Cortex derivatives) currently rest on weak sources. Verify on the actual host rather than assuming.

## Sources

- https://support.arm.com/documentation/102142/0100/Nested-virtualization (0.890)
- https://www.cs.columbia.edu/~nieh/pubs/sosp2017_neve.pdf (0.925)
- http://lore.kernel.org/kvm/86le8g86t6.wl-maz@kernel.org/T/ (0.902)
- https://lore.kernel.org/all/86jzqayq2q.wl-maz@kernel.org/ (0.871)
- https://marc.info/?l=kvm&m=170055774032652 (0.734)
- https://lists.openwrt.org/pipermail/linux-arm-kernel/2023-May/837104.html (0.889, 0.753)
- https://marc.info/?l=kvm&m=175378332614995 (0.835)
- https://www.systemonchips.com/nested-virtualization-support-in-arm-cpus-current-limitations-and-future-prospects/ (0.369, 0.439, weak)
- https://repost.aws/questions/QUEoabj2ZERq2P5QFL6d6-RQ/nested-virtualization-on-graviton (0.154, weak)
- https://community.arm.com/forums/f/architectures-and-processors-forum/54629/nested-virtualization-support (0.062, weak)
