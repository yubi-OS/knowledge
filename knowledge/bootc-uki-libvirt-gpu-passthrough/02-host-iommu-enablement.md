# 02 - Host kernel IOMMU enablement

Scope: enabling the IOMMU on the passthrough host: intel_iommu=on and amd_iommu=on on x86_64, SMMU bring-up on ARM64, firmware prerequisites, and verifying that DMA is actually translated before any device is passed through.

## x86_64: kernel command line

On x86 hosts the IOMMU is enabled with the intel_iommu=on parameter for Intel and the amd_iommu=on parameter for AMD. Two facts change the default expectations: with AMD CPUs the IOMMU is enabled by default, and on recent kernels (6.8 or newer) this is also true for Intel CPUs (source: https://pve.proxmox.com/wiki/PCI(e)_Passthrough, jev weight 0.90). A second pass of the same wiki page confirms the arm64 contrast directly: on arm64 the SMMU is enabled through firmware and ACPI, so no kernel command line parameter is needed (source: https://pve.proxmox.com/wiki/PCI(e)_Passthrough, jev weight 0.80).

Before the kernel parameter matters, VT-d (Intel) or AMD-Vi (AMD) must be enabled in platform firmware. Step-by-step firmware guides cover this step but are low-quality aggregator content; treat the firmware toggle as a prerequisite check, not a documented guarantee (sources: https://vormox.com/blog/how-to-enable-iommu-vt-d-amd-vi-in-your-bios-and-proxmox-ve-for-pci-passthrough, jev weight 0.49; https://gadgetsfeed.com/how-to-enable-iommu/, jev weight 0.18; both weak backing, labeled as such).

## ARM64: SMMU, not cmdline

On ARM64 the equivalent capability is the SMMU, and passthrough depends on kernel support for it rather than a command line flag. The kernel's ARM IOMMU driver selection lives in drivers/iommu/arm Kconfig (source: https://github.com/torvalds/linux/blob/master/drivers/iommu/arm/Kconfig, jev weight 0.53). The LWN coverage of KVM PCIe/MSI passthrough on ARM/ARM64 documents the kernel-side work that made passthrough viable there, including MSI IOMMU mapping for devices attached to a DMA ops domain (source: https://lwn.net/Articles/702725/, jev weight 0.71, and the earlier design discussion at https://lwn.net/Articles/675380/, jev weight 0.70).

For yubiOS this maps to a concrete constraint: an ARM64 SoC with an integrated GPU typically cannot meet passthrough isolation requirements, so the yubiOS ARM64 profile is a virtio-gpu and vfio-user platform rather than a passthrough target (source: yubiOS internal record, refs/bootc-uki-libvirt-gpu-passthrough-2026-08-07.md, internal provenance).

## Verify translation, not just the flag

The verification the operator cares about is that a device shows "Kernel driver in use: vfio-pci", which means the device is ready to be used for passthrough (source: https://pve.proxmox.com/wiki/PCI(e)_Passthrough, jev weight 0.90). Working-procedure writeups summarize the full sequence as: enable IOMMU in firmware, isolate the device with vfio-pci, configure the libvirt guest XML, then verify the guest actually sees and uses the device (source: https://stackharbor.com/en/knowledge-base/gpu-passthrough-vfio-iommu/, jev weight 0.23, weak backing, labeled as such).

## The unmetered-DMA hazard

The sharpest host-side constraint: without an IOMMU, a device can still be bound to vfio-pci, but its DMA is unmetered and the entire isolation claim is moot (source: yubiOS internal record, refs/bootc-uki-libvirt-gpu-passthrough-2026-08-07.md, internal provenance). Binding to vfio-pci is not isolation. The isolation comes from the IOMMU translating and constraining device DMA; the binding only changes which driver owns the device. This is why the enablement check must verify actual IOMMU groups and translation, not merely that the kernel parameter parsed.

The kernel's own VFIO documentation frames the same prerequisite positively: many modern systems provide DMA and interrupt remapping facilities to ensure I/O devices behave within the boundaries they have been allotted, including x86 hardware with AMD-Vi and Intel VT-d (source: https://docs.kernel.org/7.1/driver-api/vfio.html, jev weight 0.78).

## Operator checklist for this layer

1. Confirm firmware exposes VT-d or AMD-Vi and the kernel reports IOMMU support at boot; on Intel kernels older than 6.8 add intel_iommu=on explicitly (source: https://pve.proxmox.com/wiki/PCI(e)_Passthrough, jev weight 0.90).
2. On ARM64, do not look for a kernel parameter; verify SMMU firmware/ACPI bring-up and kernel SMMU driver config instead (source: https://pve.proxmox.com/wiki/PCI(e)_Passthrough, jev weight 0.80; https://github.com/torvalds/linux/blob/master/drivers/iommu/arm/Kconfig, jev weight 0.53).
3. Verify each passthrough candidate device shows vfio-pci as its kernel driver in use before any libvirt configuration (source: https://pve.proxmox.com/wiki/PCI(e)_Passthrough, jev weight 0.90).
4. Never treat vfio-pci binding alone as isolation; without IOMMU translation the device's DMA is unconstrained (source: yubiOS internal record, internal provenance, consistent with the kernel VFIO boundary description at https://docs.kernel.org/7.1/driver-api/vfio.html, jev weight 0.78).
