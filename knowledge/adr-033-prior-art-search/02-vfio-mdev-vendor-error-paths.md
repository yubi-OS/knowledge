# 02 - VFIO mediated devices and vendor error paths

Scope: kernel VFIO mediated devices (mdev), IOMMU-group isolation, vendor-driver-mediated error handling, and the absence of a shared behavioral policy engine across vendors.

## The mdev framework

The kernel's VFIO mediated device framework lets a parent device driver expose mediated sub-devices. The mediated core driver provides interfaces to create and destroy a mediated device, add and remove it from a mediated bus driver, and add and remove it from an IOMMU group (https://www.kernel.org/doc/html/latest/driver-api/vfio-mediated-device.html, weight 0.96). The mediated bus driver's probe function creates a vfio_device on top of the mdev_device and connects it to an implementation of vfio_device_ops; the kernel documentation diagrams the framework with NVIDIA, Intel, and IBM devices as examples (https://docs.kernel.org/driver-api/vfio-mediated-device.html, weight 0.93).

The performance path is direct: the mediated sub-device gets direct MMIO and DMA access, with the vendor driver mediating everything else. Isolation is enforced by the IOMMU, not by the mdev abstraction itself.

## IOMMU awareness was added to mdev explicitly

The IOMMU-aware mediated device patch series added an iommu device attribute to each mdev, determines the isolation type according to the existence of an iommu device when a group is attached in the vfio type1 iommu module, and attaches the domain to IOMMU-aware mediated devices (https://lwn.net/Articles/779650/, weight 0.81). This confirms the isolation unit is the IOMMU group, not the mdev: hardware isolation depends on IOMMU presence and type.

VFIO's general contract backs this: modern systems provide DMA and interrupt remapping facilities to help ensure I/O devices behave within the boundaries they have been allotted, including AMD-Vi, Intel VT-d, and POWER Partitionable Endpoints (https://www.kernel.org/doc/html/v6.15/driver-api/vfio.html, weight 0.97). VFIO exposes groups and containers; once a group is attached to a container, the VFIO IOMMU interfaces become available and device file descriptors can be obtained (https://docs.kernel.org/driver-api/vfio.html, weight 0.94).

## Behavioral handling lives in vendor drivers

There is no shared policy engine across mdevs. Each vendor driver implements its own error and isolation semantics. The kernel can report that a device is in error, but the reviewed sources show no cross-vendor vocabulary for "this device is exhibiting a behavioral pattern that should escalate."

The open-source vendor-reset project illustrates what the vendor error path looks like in practice: a kernel module capable of resetting hardware devices into a state where they can be re-initialized or passed through into a virtual machine with VFIO (https://github.com/gnif/vendor-reset, weight 0.66). Reset is the terminal response; there is no tiered or graded response in this path.

A third-party internals writeup describes VFIO's containers, groups, mdev, and KVM integration as the framework for safely exposing physical devices while the IOMMU enforces memory-access isolation (https://kernel-internals.org/iommu/vfio-internals/, weight 0.39, weak backing). An Open-IOV document details the internals of a VFIO-driven shared I/O device and notes that an absence of critical technical documentation has historically slowed growth of GPU virtualization ecosystems (https://open-iov.org/index.php/Virtual_I/O_Internals, weight 0.63).

## What is absent against ADR-033

1. No shared trigger vocabulary across vendors. The error path is per-vendor and binary: device works or device is reset.
2. No severity ladder. Nothing in the mdev framework escalates gradually in response to observed behavior.
3. No snapshot-on-behavioral-trigger. mdevs can be paused or resumed via vendor APIs, but a kernel-mediated snapshot tied to a behavioral trigger is not a documented feature in any reviewed source.

The mdev family therefore anchors the same conclusion as the vfio-user baseline: device mediation exists, behavioral policy on top of it does not.

## Sources considered

| source | weight |
|---|---|
| https://www.kernel.org/doc/html/latest/driver-api/vfio-mediated-device.html | 0.96 |
| https://docs.kernel.org/driver-api/vfio-mediated-device.html | 0.93, 0.93 |
| https://github.com/torvalds/linux/blob/master/Documentation/driver-api/vfio-mediated-device.rst | 0.91 |
| https://lwn.net/Articles/779650/ | 0.81 |
| https://docs.kernel.org/driver-api/vfio.html | 0.94, 0.87 |
| https://www.kernel.org/doc/html/v6.15/driver-api/vfio.html | 0.97 |
| https://github.com/gnif/vendor-reset | 0.66 |
| https://open-iov.org/index.php/Virtual_I/O_Internals | 0.63 |
| https://kernel-internals.org/iommu/vfio-internals/ | 0.39 (weak) |
| https://gist.github.com/Chester-Gillon/aeba238f4960d82f1f25ef1f5d90966c | 0.28 (weak) |
