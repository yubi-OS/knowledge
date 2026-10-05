# 02. The IOMMU and DMA threat model for GPU passthrough

Scope: why DMA from a PCI device inside a guest is an exfiltration and compromise channel that a network cutoff cannot stop, and what the IOMMU does and does not contain.

## DMA as an attack primitive

A device with DMA rights reads and writes host memory directly, without going through the operating system's syscall path. The Thunderclap research program (Cambridge, Edinburgh, and collaborators, NDSS 2019) mapped this space: the "complex vulnerability space for IOMMU-exposed shared memory available to DMA-enabled peripherals allows attackers to extract private data (sniffing cleartext VPN traffic)" and more [1] (jev weight 0.838). The project's own summary states the containment limit plainly: "With IOMMU usage enabled, operating systems can protect against DMA attacks by restricting memory access to peripherals that perform legitimate functions and only allow access to the memory regions they need" [2] (jev weight 0.574). In other words, the IOMMU constrains where a device may DMA, but a device legitimately mapped into a workload's memory regions can read that workload's memory by design.

Thunderclap's second paper context notes the practical state of deployment: IOMMU enablement had to be announced as part of threat models such as Windows 10 Kernel DMA Protection, "where the IOMMU is enabled in firmware and Windows uses it for protection" [3] (jev weight 0.835).

## What the IOMMU buys and what it costs

Vendors treat IOMMU-based DMA protection as a first-line control, not an optional one. Intel's firmware guidance states that "UEFI firmware should use the IOMMU to resist DMA attack" and calls the IOMMU "an attractive feature for protecting UEFI firmware against DMA attacks" [4] (jev weight 0.888). On the client side, Microsoft's Kernel DMA Protection "uses the system Input/Output Memory Management Unit (IOMMU) to block external peripherals from starting and performing DMA, unless the drivers for these peripherals support" the required negotiation [5] (jev weight 0.930). Thunderspy 2 demonstrates a complementary hardening path: for older systems without native kernel DMA protection, boot-time tooling makes the system "use the IOMMU features of the CPU to partition the memory" so devices behave as if native protection were present [6] (jev weight 0.693).

The cost side is real and explains why the control is unevenly enabled. A USENIX Security 2024 paper on DMA-hardened pointer integrity opens: "IOMMU has been introduced to thwart DMA attacks. However, the performance degradation prevents it from being enabled on most systems" [7] (jev weight 0.913). A GPU passthrough policy cannot assume the hardware gate is uniformly on; ADR-031's honesty note says exactly this about post-launch hardware enforcement (source one-pager, adr-033-misbehavior-cutoff-policy-2026-07-28).

## Why this threat model applies to a misbehaving model

In the yubiOS shape, an AI/ML workload runs in a bootc VM with a GPU passed through under ADR-031's mediation boundary. From the threat-model standpoint that GPU is a DMA-capable peripheral whose DMA windows are programmed by the workload. Two consequences follow:

1. Exfiltration does not need the network. A compromised or misaligned model that can shape DMA traffic can read memory mapped into its own device regions, including host-side buffers placed there by the server. This is the same class of finding Thunderclap documented for external peripherals [1] (weight 0.838), relocated inside a virtualized boundary.
2. A network-only cutoff is structurally insufficient. The source one-pager's variation analysis rejected the network-only cutoff (V2) for precisely this reason: DMA from the GPU "can read LUKS keys directly, no network needed" (source one-pager). The point generalizes: the cutoff must sit at the PCI mediation boundary, not at the NIC.

The weak-backing sources in this doc's dig agree with the general direction (GPU passthrough carries DMA and hardware-level risk beyond the OS's view, per security.stackexchange [8], weight 0.084, and laptopjudge [9], weight 0.139) but are not load-bearing; the peer-reviewed and vendor sources above carry the claims.

## Where the policy boundary sits

The IOMMU defines where a device can DMA; the vfio-user server defines when a device exists at all. ADR-033's cut point is the second one. The IOMMU cannot be revoked per-event without disrupting the whole VM; the vfio-user socket can be revoked while the VM stays alive and snapshotted. The threat model therefore dictates the design: detection and severance live at the mediation boundary (doc 01), and enforcement tiers escalate from observation to full socket revocation (doc 03).

## Sources

1. Thunderclap NDSS 2019 paper: https://thunderclap.io/wp-content/uploads/2024/01/thunderclap-paper-ndss2019.pdf (weights 0.838, 0.835)
2. Thunderclap project summary: https://thunderclap.io/ (weight 0.574)
3. Thunderclap NDSS paper (deployment context): https://thunderclap.io/wp-content/uploads/2024/01/thunderclap-paper-ndss2019.pdf (weight 0.835)
4. Intel white paper, DMA Protection in UEFI: https://www.intel.com/content/dam/develop/external/us/en/documents/intel-whitepaper-using-iommu-for-dma-protection.pdf (weight 0.888)
5. Microsoft Learn, Kernel DMA Protection: https://learn.microsoft.com/en-us/windows/security/hardware-security/kernel-dma-protection-for-thunderbolt (weight 0.930)
6. Thunderspy 2: https://thunderspy.io/ts2.html (weight 0.693)
7. USENIX Security 2024, DMA pointer-integrity hardening: https://www.usenix.org/system/files/usenixsecurity24-wang-xingkai.pdf (weight 0.913)
8. Security Stack Exchange, GPU passthrough security (weak backing): https://security.stackexchange.com/questions/162122/gpu-passthrough-security (weight 0.084)
9. LaptopJudge GPU DMA explainer (weak backing): https://laptopjudge.com/what-is-gpu-dma-and-iommu-memory-access/ (weight 0.139)
