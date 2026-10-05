# bootc-uki-libvirt-gpu-passthrough

Knowledge corpus on host-level configuration for running a bootc-UKI host with libvirt/QEMU GPU passthrough: VFIO, IOMMU groups, host kernel setup, and the host-side constraints. Minted 2026-10-05 from yubi-OS/yubiOS refs/bootc-uki-libvirt-gpu-passthrough-2026-08-07.md.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | 01-bootc-uki-host-layout.md | bootc install layout, systemd-boot, composefs, UKI signing, attestation as GPU launch gate |
| 02 | 02-host-iommu-enablement.md | intel_iommu=on / amd_iommu=on on x86_64, SMMU on ARM64, verifying DMA translation |
| 03 | 03-iommu-group-topology.md | IOMMU group discovery, co-membership constraints, ACS override tradeoffs |
| 04 | 04-vfio-pci-binding-lifecycle.md | managed=yes vs manual sysfs binding, nodedev-detach/reattach, rebind failure modes |
| 05 | 05-libvirt-domain-xml.md | hostdev subsystem=PCI XML, watchdog element and actions, qemu:commandline |
| 06 | 06-host-cutoff-hooks.md | libvirt qemu hooks, phases, return codes, and the pause/poweroff/destroy/detach ladder |
| 07 | 07-kernel-vfio-contract.md | binary device ownership, no quota metering, iommufd/cdev replacing the group model |
| 08 | 08-host-policy-constraints.md | virtio-gpu default, guest /dev/vfio suppression, IOMMU gate, SR-IOV/mdev/vGPU/vfio-user alternatives |

## Research summary

- Results collected: 96 (searXNG, 16 queries, top 6 per query kept)
- Weight split: 44 high (noul >= 0.5) / 52 low (noul < 0.5) of 96; 0 unweighted
- Jev requests: 21 (usage 17084 in / 0 out tokens), all via clef on /api/decide
- Redo counts: 0 dig redos; 1 weighting batch required 3 attempts after HTTP 429 (recovered, no data loss)
- Skipped docs: none; all 8 outline subtopics scored above 0 in validation and dug strong enough to author
- Outline validation: score metric, all 8 subtopics kept (lowest score 0.94, highest 1.93, none dropped)

Internal yubiOS claims (ADR-031, PR #137/#151/#153, OMN-108/144..149) are sourced from the mint source note and labeled as internal provenance in each doc; every external claim carries its source URL and jev weight.

Preflight 2026-10-05: searXNG 51 results healthy; /api/decide (clef) 200
