# 04. DMA-capable devices as a key-extraction primitive

Scope: what an untranslated DMA-capable peripheral can do to host memory, why that makes an unisolated GPU passthrough a key-extraction primitive against the LUKS2 unlock path, and why the IOMMU is the boundary that prevents it.

## The mechanics

Direct Memory Access lets bus-master devices read and write system memory without the system processor's involvement, which is exactly the capability that makes them a threat when they are not translated (source: https://learn.microsoft.com/en-us/windows/security/hardware-security/kernel-dma-protection-for-thunderbolt, jev weight 0.89). A DMA attack is the class of attack that gains direct access to a computer's memory this way, taking advantage of a feature of modern computers that allows devices to bypass the operating system (source: https://www.kroll.com/en/publications/cyber/what-is-dma-attack-understanding-mitigating-threat, jev weight 0.79). In offensive-security terms, DMA attacks give read and write access to the memory of a target system while bypassing the main CPU to reach kernel privileges directly (source: https://www.pentestpartners.com/security-blog/direct-memory-access-dma-attacks-risks-techniques-and-mitigations-in-hardware-hacking/, jev weight 0.66).

MITRE's EMB3D catalog classifies unauthorized DMA as its own threat: if separate discrete chips or peripherals have access to the same physical memory, a threat actor with access to one can reach memory outside the intended boundary (source: https://emb3d.mitre.org/threats/TID-107.html, jev weight 0.48, weak backing). Empirical work agrees the threat did not age out: physical DMA-based attacks remain a persistent and evolving class even against modern operating systems (source: https://thunderclap.io/physical-dma-based-security-attacks-on-windows-11-evolution-risks-and-modern-defenses/, jev weight 0.41, weak backing).

## The IOMMU as the boundary

The IOMMU's security function is translation: it turns device-visible IOVA addresses into physical memory accesses the platform approves, and unrestricted DMA is a critical security and reliability risk precisely where that translation is absent (source: https://vlsitrainers.com/pcie-dma-and-iommu/, jev weight 0.25, weak backing). The same lesson shows up in misconfiguration research: firmware-reserved memory regions that allow certain devices to DMA without normal IOMMU translation are exactly the interesting exceptions attackers probe for (source: https://splineuser.github.io/posts/iommu-bypass/, jev weight 0.50). Microsoft's Kernel DMA Protection for Thunderbolt-attached devices is the consumer-platform version of the same defense, treating external DMA-capable devices as untrusted by default (source: https://learn.microsoft.com/en-us/windows/security/hardware-security/kernel-dma-protection-for-thunderbolt, jev weight 0.89).

## Why this lands on the unlock path

The yubiOS-specific conclusion is a composition of the mechanics above with the trust architecture. yubiOS anchors its secrets in a YubiKey: the LUKS2 volume key is unsealed by the YubiKey through FIDO2 `hmac-secret` into kernel memory, where homed and the dm-crypt stack consume it. Once that unseal happens, the plaintext key lives in RAM that any bus-master device can read, unless the IOMMU confines the device.

A GPU assigned to a guest through vfio-pci without a working IOMMU is therefore not a performance optimization with a footnote. It is a key-extraction primitive: a DMA-capable, firmware-carrying peripheral positioned inside the memory domain the unlock path just populated. The kernel's own VFIO documentation frames the same contract from the defensive side, noting that DMA and interrupt remapping facilities exist to ensure I/O devices behave within the boundaries they have been allotted (source: https://docs.kernel.org/driver-api/vfio.html, jev weight 0.87).

## What follows for the image policy

Three concrete consequences, each traceable to the sources above:

1. No passthrough unless the IOMMU is present, enabled, and the device sits in an isolating group. "Absent any one, refuse; do not degrade" is the only safe default for a system whose keys are in RAM (doc 05, rule 2).
2. The popular enthusiast recipe, which blacklists host display drivers and binds `vfio-pci` at initramfs time, widens exactly the boot-path surface yubiOS signs, so it is the shape the image must not ship by default (doc 05).
3. The device-model-side mitigation is to keep the DMA grant explicit and narrow. vfio-user's `DMA_MAP` window model (doc 02) and iommufd's explicit `VFIO_DEVICE_BIND_IOMMUFD` DMA ownership claim (doc 01) are both answers to the same question: who may touch which memory, and who checked.
