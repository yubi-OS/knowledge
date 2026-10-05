# 07 - KVM arm64 nested internals: VNCR_EL2, shadow stage-2, and the series structure

Scope: How KVM arm64 nested virtualization works under the hood: the multi-year patch-series structure, VNCR_EL2 virtual nested control register pages, FEAT_NV2 traps, and the cpufeature gating.

## VNCR_EL2: the central mechanism

The foundational description comes from the NEVE research paper: NEVE introduces an EL2 Virtual Nested Control Register, VNCR_EL2, which is managed exclusively by the host hypervisor (weight 0.925, Columbia University SOSP 2017 paper). The purpose is to avoid high trapping overhead on every EL2 register write by an L1 hypervisor.

The Linux implementation follows that design. In the kernel tree, KVM implements VNCR memory-backed pages, a vncr_array, in arch/arm64/kvm/nested.c: the guest hypervisor writes directly to these memory pages, which KVM then synchronizes (weight 0.598, DeepWiki over the torvalds/linux tree, labeled as such: an AI-generated code wiki, mid-weight). A second DeepWiki description of the ARM64 nested implementation summarizes the same design as managing shadow stage-2 MMU contexts and VNCR for efficient state access (weight 0.201, weak backing, labeled as such).

## Shadow stage-2 contexts

The nested memory-management design is about shadow stage-2 tables: when an L1 hypervisor configures its own stage-2 mappings for an L2 guest, KVM builds shadow stage-2 tables that it controls directly. The September 2026 LKML thread on "KVM: arm64: nv: Implement nested MMU" makes the subtleties explicit: for shadow stage-2 tables to be built and to affect MMU notifiers, you need to run an L2, and even with an L1 in VHE mode there is a small window during boot where the L1 runs in its own EL1, so one nested MMU configuration applies during that window (weight 0.855, LKML). This is current development work, not settled code: treat shadow-stage-2 behavior as moving.

## The series structure: bi-annual drops

The upstream record is a sequence of large series drops rather than a single merge:

- "KVM: arm64: ARMv8.3/8.4 Nested Virtualization support", described by the author as "the least loved series in the history of KVM", with bug fixes around wrong MMU context selection leading to failing TLB invalidations and nested fault handling (weight 0.839, LWN 877175).
- The next drop: "This is the second drop of NV support on arm64 for this year. Something is happening! ... TLB invalidation has been fixed" (weight 0.841, LWN 921783).
- The third drop: "The timer code has been completely revamped", properly dealing with both global and per-VM timers (weight 0.870, LWN 928426).
- The v11 series: 43 patches, retitled "FEAT_NV2 only" (weight 0.902, lore.kernel.org), which is the consolidation point: the series dropped support for FEAT_NV-only hardware.

Feature gating is by cpufeature: the series ties the nested capability to the ARM64_HAS_NESTED_VIRT cpufeature class, and the final parameter documentation requires FEAT_NV2 hardware for `kvm-arm.mode=nested` (weights 0.796 and 0.725, LKML doc patch; corroborated at 0.325 weak by a briefing quoting the doc). No collected source names the cpufeature symbol in a primary text, so the gating claim rests on the parameter documentation plus the series titles, not on a cited symbol definition.

## Guests, GIC, and timers

Earlier series work shows the scope of the plumbing: nested GICv3 tracepoints, restricting stage-2 read/write permissions to match the guest's configuration, and allowing userspace to request the KVM_ARM_VCPU_NESTED_VIRT vCPU feature (weight 0.799, LWN 791695). The kvmtool-side series shows the guest-facing prerequisites from the other end: allowing KVM guests to run their own guests needed VGIC support with a settable maintenance IRQ, and arch timer offset handling, while enabling non-VHE guests came at the cost of losing recursive nested virtualization (weight 0.835, marc.info KVM list). The timer revamp in the third drop (0.870) is the counterpart to that timer-offset work in the mainline series.

## What this means operationally

The internals explain the operational properties documented elsewhere in this corpus: why `nested` is mutually exclusive with `protected` (both configure the EL2 role for the host, doc 02), why feature masking must happen before first vCPU run (the ID-register snapshot at KVM_RUN, doc 06), and why the merge timing claim is version-bound rather than architectural (the series was still dropping major rewrites, including a full timer and TLB invalidation overhaul, into 2026, doc 01 and doc 08).

## Sources

- https://www.cs.columbia.edu/~nieh/pubs/sosp2017_neve.pdf (0.925)
- https://lkml.org/lkml/2026/9/6/384 (0.855)
- https://lwn.net/Articles/928426/ (0.870, 0.653)
- https://lwn.net/Articles/921783/ (0.841)
- https://lwn.net/Articles/877175/ (0.839, 0.792, 0.881)
- https://lwn.net/Articles/791695/ (0.799)
- http://lore.kernel.org/kvm/86le8g86t6.wl-maz@kernel.org/T/ (0.902)
- https://marc.info/?l=kvm&m=175378332614995 (0.835)
- https://deepwiki.com/torvalds/linux/7.3-kvm-on-arm64:-sysreg-emulation-nested-and-vgic (0.598, 0.657)
- https://deepwiki.com/jason-sophia/linux/3.3.3-arm64-nested-virtualization (0.201, weak)
- https://lkml.org/lkml/2024/10/24/1791 (0.725)
- https://lkml.org/lkml/2024/10/24/1323 (0.796)
