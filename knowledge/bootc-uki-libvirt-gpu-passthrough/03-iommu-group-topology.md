# 03 - IOMMU group topology on the passthrough host

Scope: IOMMU groups as the isolation unit: discovery via /sys/kernel/iommu_groups, group co-membership constraints, ACS override tradeoffs, and what makes a GPU passthrough-safe.

## Groups are the kernel's isolation unit

The kernel VFIO documentation is explicit about the shape: once a group (or groups) is attached to a container, the remaining ioctls become available, and it becomes possible to get file descriptors for each device within a group (source: https://docs.kernel.org/7.1/driver-api/vfio.html, jev weight 0.93). The group, not the device, is the granularity at which VFIO hands out access. A device cannot be split from its group.

The practical rule every passthrough guide converges on: all devices in an IOMMU group must be passed through together, or bound together to vfio-pci, because they share one isolation boundary (source: https://wiki.archlinux.org/title/PCI_passthrough_via_OVMF, jev weight 0.75; https://docs.kernel.org/7.1/driver-api/vfio.html, jev weight 0.93).

## Discovery

Every PCI device lives in exactly one IOMMU group, discoverable under /sys/kernel/iommu_groups. The canonical one-liner is find /sys/kernel/iommu_groups/*/devices -type l (source: yubiOS internal record, refs/bootc-uki-libvirt-gpu-passthrough-2026-08-07.md, internal provenance; the sysfs layout itself is standard kernel behavior, see https://docs.kernel.org/7.1/driver-api/vfio.html, jev weight 0.93). Guides for group analysis lean on pciutils and lspci to resolve what each device in a group actually is before deciding what can move (source: https://www.heiko-sieger.info/iommu-groups-what-you-need-to-consider/, jev weight 0.69).

## What makes a GPU passthrough-safe

A consumer GPU on an x86_64 desktop usually sits in its own IOMMU group, which is the good case for passthrough. An integrated GPU on an ARM64 SoC typically shares a group with the display controller and the USB stack, which makes clean passthrough impractical (source: yubiOS internal record, internal provenance). Community guides agree on the shape of the problem: IOMMU groups are the foundation of PCI passthrough, and the operator should first understand the hardware layout with an IOMMU group script, then bind target devices to vfio-pci, passing all devices in the group together (source: https://proxmoxr.com/blog/proxmox-iommu-groups, jev weight 0.50, weak backing, labeled as such).

## Binding by device ID

vfio-pci normally targets PCI devices by ID, so the operator specifies the IDs of the devices to passthrough, and when a GPU and its audio function share a group both IDs are bound together (source: https://wiki.archlinux.org/title/PCI_passthrough_via_OVMF, jev weight 0.75). The consequence is mechanical: a GPU on bus 01 slot 00 plus the audio function on the same device at function 0.1 must both be bound before either passes cleanly.

## ACS override: the documented escape hatch with a cost

If devices are grouped among others that the operator does not wish to pass through, Alex Williamson's ACS override patch can separate them (source: https://wiki.archlinux.org/title/PCI_passthrough_via_OVMF, jev weight 0.81). Community guidance is consistent on when to reach for it: apply the ACS override patch only when necessary (source: https://proxmoxr.com/blog/proxmox-iommu-groups, jev weight 0.50, weak backing, labeled as such). The reason for restraint is that ACS override asks the kernel to pretend isolation exists where the hardware does not provide it, which weakens the isolation claim the whole passthrough design rests on. A Kubernetes-oriented writeup shows the same tradeoff from the other direction: disabling ACS is desirable for GPU peer-to-peer workloads, and enabling ACS override (pcie_acs_override=downstream,multifunction) is the price of getting SR-IOV-style isolation back (source: https://kubernetes.recipes/recipes/ai/disable-acs-pcie-gpu-direct-p2p/, jev weight 0.29, weak backing, labeled as such).

## Grouping errors and shared-driver requirements

Errors where a device refuses to leave its group appear when the kernel's IOMMU grouping requires all devices within a shared hardware isolation boundary to be managed by the same driver (typically vfio-pci) before any single device in the group can be handed to a VM (source: https://deepwiki.com/jmarhee/sles-qemu-gpu-passthrough-tools/3.1-iommu-group-analysis-and-fixing, jev weight 0.42, weak backing, labeled as such). This matches the kernel contract: the group is the atomic unit.

## Operator checklist for this layer

1. Enumerate groups with find /sys/kernel/iommu_groups/*/devices -type l and resolve every endpoint with lspci before choosing passthrough candidates (source: yubiOS internal record, internal provenance; https://www.heiko-sieger.info/iommu-groups-what-you-need-to-consider/, jev weight 0.69).
2. Plan to bind and pass all devices in a chosen group together; a GPU plus its audio function is the common pair (source: https://wiki.archlinux.org/title/PCI_passthrough_via_OVMF, jev weight 0.75).
3. Reject hosts where the target GPU shares a group with devices the host cannot spare, rather than reaching for ACS override by default (source: https://wiki.archlinux.org/title/PCI_passthrough_via_OVMF, jev weight 0.81; https://proxmoxr.com/blog/proxmox-iommu-groups, jev weight 0.50, weak backing).
4. For yubiOS targets, prefer x86_64 hosts with a discrete GPU in its own group; treat ARM64 iGPU shares as a disqualifier (source: yubiOS internal record, internal provenance).
