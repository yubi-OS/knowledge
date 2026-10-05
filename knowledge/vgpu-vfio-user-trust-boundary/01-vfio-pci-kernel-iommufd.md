# 01. Kernel VFIO: IOMMU groups, the container model, and the iommufd migration

Scope: the kernel VFIO framework that GPU passthrough stands on, its IOMMU group isolation unit, the classic container/group/device model, and the iommufd plus device cdev migration that supersedes it.

## What VFIO is for

VFIO exists because modern systems provide DMA and interrupt remapping facilities "to help ensure I/O devices behave within the boundaries they've been allotted" (source: https://docs.kernel.org/6.0/driver-api/vfio.html, jev weight 0.95). Without those facilities a bus-master device is not confined to the memory its driver intended it to touch. VFIO is the kernel framework that turns IOMMU capability into a usable permission model for handing devices to unprivileged userspace, including virtual machine monitors doing device assignment.

## The classic model: groups, containers, devices

The unit of isolation in VFIO is the IOMMU group: the set of devices the IOMMU cannot distinguish from each other, so they must be assigned together or not at all (source: https://docs.kernel.org/driver-api/vfio.html, jev weight 0.96). The user-facing object model has three layers:

1. A container, opened through `/dev/vfio/vfio`, which carries the IOMMU programming.
2. A group node, `/dev/vfio/$GROUP`, added to the container with `VFIO_GROUP_SET_CONTAINER`.
3. Device file descriptors inside the group.

Binding a device to VFIO requires root; but using an already-permissioned node is not inherently privileged, and `/dev/vfio/vfio` on its own grants no capability (source: https://docs.kernel.org/driver-api/vfio.html, jev weight 0.94). That split matters for a locked-down image: the dangerous step is the bind, not the open.

## The iommufd migration

The classic path is being replaced. iommufd is the user API to control the IOMMU subsystem from userspace by managing IO page tables through file descriptors, intended to be general and consumable beyond VFIO (source: https://docs.kernel.org/userspace-api/iommufd.html, jev weight 0.86). The kernel documents a second approach that extends VFIO with a device-centric API built on that iommufd kernel API, requiring userspace changes but matching the device model better (source: https://docs.kernel.org/next/userspace-api/iommufd.html, jev weight 0.89).

The device-centric surface is the vfio_device cdev. The cdev only works with IOMMUFD, and both VFIO drivers and applications must adapt to its security model, which requires `VFIO_DEVICE_BIND_IOMMUFD` to claim DMA ownership of the device (source: https://docs.kernel.org/driver-api/vfio.html, jev weight 0.94). The cdev patch series that introduced this landed as a 14-patch set in February 2023, adding per-device file structures and accepting vfio device files in the driver-facing kAPI (source: https://lwn.net/Articles/922356/, jev weight 0.81).

The kernel documentation is explicit about the destination: eventually the `vfio_iommu_type1` driver, as well as the legacy vfio container and group model, will be deprecated (source: https://docs.kernel.org/driver-api/vfio.html, jev weight 0.96). A secondary writeup states the same shift in implementation terms: instead of `VFIO_GROUP_SET_CONTAINER` and `VFIO_SET_IOMMU`, userspace opens `/dev/iommu` and claims DMA ownership of the device (source: https://kernel-internals.org/virtualization/vfio/, jev weight 0.34, weak backing).

## What QEMU does with it

QEMU supports both backends behind one VFIO device layer. The legacy kernel interface is group-centric while the new iommufd interface is device-centric, relying on device fds and iommufd, and QEMU's VFIO implementation supports both so a single build works across kernels (source: https://www.qemu.org/docs/master/devel/vfio-iommufd.html, jev weight 0.92). The two paths use different control nodes: `/dev/vfio/vfio` for the legacy container versus `/dev/iommu` for iommufd (source: https://www.qemu.org/docs/master/devel/vfio-iommufd.html, jev weight 0.95).

## Consequences for yubiOS

Three rules fall out of this landscape, all anchored in the sources above:

1. The IOMMU group is the isolation boundary that makes passthrough survivable. A device shared with other devices in its group breaks that boundary (source: https://docs.kernel.org/driver-api/vfio.html, jev weight 0.96).
2. New yubiOS code should prefer iommufd plus the device cdev, because the kernel marks the legacy container and group path for deprecation and the cdev path makes DMA ownership an explicit, auditable ioctl (`VFIO_DEVICE_BIND_IOMMUFD`) rather than a side effect of container membership (source: https://docs.kernel.org/driver-api/vfio.html, jev weight 0.94).
3. Root is needed to bind a device, so a default image that never binds anything to vfio-pci keeps the privileged surface empty by construction (source: https://docs.kernel.org/driver-api/vfio.html, jev weight 0.94).

The migration-era detail worth noting for CI: QEMU's VFIO migration support hooks device state into VM state transitions between running and not-running (source: https://www.qemu.org/docs/master/devel/migration/vfio.html, jev weight 0.72), which is the machinery a future live-migration story would sit on; vfio-user defers live migration entirely (see doc 02).
