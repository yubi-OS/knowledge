# 07 - The kernel VFIO contract and its limits

Scope: what kernel VFIO guarantees and what it cannot express: binary device ownership, no percentage metering or VRAM quota, DMA unmetered without an IOMMU, and the iommufd/cdev interface replacing the legacy group model.

## What VFIO is for

VFIO is the kernel framework for exposing PCI devices directly to userspace processes or VMs, using the IOMMU to enforce memory access boundaries. The kernel documentation opens with the premise: many modern systems provide DMA and interrupt remapping facilities to help ensure I/O devices behave within the boundaries they have been allotted, including x86 hardware with AMD-Vi and Intel VT-d (source: https://docs.kernel.org/7.1/driver-api/vfio.html, jev weight 0.78). Community explainers describe the same thing in one line: VFIO provides a secure mechanism to expose PCI devices directly to userspace processes or VMs, backed by IOMMU groups and DMA remapping (source: https://kernel-internals.org/virtualization/vfio/, jev weight 0.39, weak backing, labeled as such; the kernel docs are the primary source).

## The legacy group/container model

In the classic model, access is group-centric: to get a device fd you first open its group, attach the group to a container, and then obtain file descriptors for each device within the group (source: https://docs.kernel.org/7.1/driver-api/vfio.html, jev weight 0.93; https://kernel-internals.org/virtualization/vfio/, jev weight 0.39, weak backing). This group model is what the IOMMU group topology (doc 03) plugs into.

## The cdev and iommufd model

The kernel documentation is explicit that the legacy interface is being superseded: the vfio_iommu_type1 driver, as well as the legacy vfio container and group model, is intended to be deprecated (source: https://kernel-internals.org/virtualization/vfio/, jev weight 0.45, weak backing, labeled as such, quoting the kernel docs; the primary statement is at https://docs.kernel.org/driver-api/vfio.html, jev weight 0.88). Long term, VFIO users should migrate to device access through the cdev interface and native access through the IOMMUFD-provided interfaces (source: https://docs.kernel.org/7.1/driver-api/vfio.html, jev weight 0.94).

The new model is device-centric: the legacy kernel interface is group-centric while the new iommufd interface is device-centric, relying on device fd and iommufd, which is why QEMU abstracts both behind a common base container (source: https://www.qemu.org/docs/master/devel/vfio-iommufd.html, jev weight 0.90). The security model changed with it: both VFIO drivers and applications must adapt to the cdev security model, which requires using VFIO_DEVICE_BIND_IOMMUFD to claim DMA ownership before starting to actually use the device (source: https://docs.kernel.org/driver-api/vfio.html, jev weight 0.88). A side benefit: VFIO device cdev does not rely on VFIO group, container, or iommu drivers, so those modules can be fully compiled out in environments with no legacy VFIO application (source: https://docs.kernel.org/driver-api/vfio.html, jev weight 0.84).

Adoption timing is practical to know: the legacy group/container interface with the Type1v2 IOMMU driver is still the default in consumers like OpenVMM, with the cdev plus iommufd path available on Linux kernels 6.6 or newer (source: https://openvmm.dev/guide/user_guide/openvmm/vfio.html, jev weight 0.70).

## The contract's hard limit: binary ownership

The load-bearing host-side constraint for a misbehavior-cutoff design: kernel VFIO does not meter percent of GPU. The host owns or reclaims the whole device assignment and nothing finer-grained (source: yubiOS internal record, refs/bootc-uki-libvirt-gpu-passthrough-2026-08-07.md, internal provenance). Concretely, the host cannot, through kernel VFIO alone:

1. Throttle GPU compute on a running VM.
2. Cap VRAM usage mid-run.
3. Impose a percentage quota on the device.

The enforcement vocabulary is pause, poweroff, destroy, and detach (doc 06). Anything finer-grained requires a different device model: a userspace-emulated device (vfio-user), a kernel-mediated device (mdev), or a hardware-partitioned device (SR-IOV, vGPU), covered in doc 08.

## The unmetered-DMA boundary case

Without an IOMMU, a device can still be bound to vfio-pci but its DMA is unmetered and the isolation claim is moot (source: yubiOS internal record, internal provenance). The cdev security model makes ownership explicit for exactly this reason: the bind-iommufd step is the kernel asking the caller to accept responsibility for the device's DMA, and with a real IOMMU behind it that DMA is constrained; without one it is not.

## Operator checklist for this layer

1. Design cutoff policy around the binary contract: whole-device pause, poweroff, destroy, or detach, not quota (source: yubiOS internal record, internal provenance).
2. Prefer hosts and tooling that speak the cdev/iommufd interface (kernel 6.6+), while expecting legacy group/container interop to remain the default in current QEMU releases (sources: https://docs.kernel.org/7.1/driver-api/vfio.html, jev weight 0.94; https://www.qemu.org/docs/master/devel/vfio-iommufd.html, jev weight 0.90; https://openvmm.dev/guide/user_guide/openvmm/vfio.html, jev weight 0.70).
3. Treat VFIO_DEVICE_BIND_IOMMUFD as the ownership claim point in any custom userspace device consumer (source: https://docs.kernel.org/driver-api/vfio.html, jev weight 0.88).
