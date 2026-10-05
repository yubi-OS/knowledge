# 02 QEMU/libvirt GPU mediation: VFIO mdev and vfio-user

Scope: the two GPU mediation paths relevant to the cutover synthesis, VFIO mediated devices (mdev) and vfio-user, the libvirt attachment surface, and the vendor landscape that constrains where each path works.

## vfio-user: devices in userspace

vfio-user is a framework for implementing PCI devices in userspace. Clients such as QEMU talk the vfio-user protocol over a UNIX socket to a server; libvfio-user provides the API for implementing such servers, while VFIO itself is the kernel facility for secure access to PCI devices (weight 0.74, https://github.com/nutanix/libvfio-user). A mirrored README on QEMU's own hosting describes the same architecture (weight 0.65, https://qemu.googlesource.com/libvfio-user/+/a8242d117118d5191dad69a96e28a21d66fe8b50/README.md).

For the synthesis this matters because vfio-user moves the device boundary into a named socket endpoint. A socket is a discrete, observable handoff point, which is why the synthesis treats the vfio-user connect as the natural place for a C3 policy check ("the GPU binding the guest gets is the one policy admits").

## mdev and the mediated-device lineage

Mediated device support entered QEMU/libvirt through a patch series discussed publicly in 2016, with libvirt maintainers involved in the review (weight 0.69, http://lists.nongnu.org/archive/html/qemu-devel/2016-09/msg00272.html). The mdev framework is the mechanism GVT-g built on: ArchWiki describes Intel GVT-g as a deprecated technology providing mediated-device passthrough for Intel iGPUs from 5th generation (Broadwell) through 10th generation (Comet Lake) processors (weight 0.70, https://wiki.archlinux.org/title/Intel_GVT-g). A community wiki adds that on Intel GPUs from 11th generation onward, vfio-mdev has been superseded by SR-IOV, and notes the framework might work with compatible NVIDIA or AMD GPUs (weight 0.39, https://wiki.phyllo.me/gofurther/vfio-mdev, weak backing). A deep technical summary of the GVT-g kernel implementation covers vGPU creation, MMIO emulation, page-table shadowing, and KVM/VFIO integration (weight 0.37, https://deepwiki.com/intel/gvt-linux/2.2-intel-gvt-g-gpu-virtualization, weak backing).

Tooling exists to keep mdev viable beyond the stock vendor paths: Arc-Compute's Mdev-GPU is a user-configurable utility that lets vendor drivers register arbitrary mdev types with the VFIO mediated-device framework, released under GPLv2 as part of the GPU Virtual Machine project (weight 0.75, https://github.com/Arc-Compute/Mdev-GPU/).

## The libvirt attachment surface

For classic passthrough, VFIO exposes the isolated device to QEMU and libvirt handles attachment through a managed hostdev definition; a passed-through GPU is normally exclusive to one running guest (weight 0.09, https://medium.com/@carvajaldaniel699/gpu-passthrough-kvm-setup-with-vfio-and-libvirt-3086b7acbbb0, weak backing). Host-side setup guides covering IOMMU and driver binding are available for Ubuntu hosts (weight 0.35, https://www.cloudrift.ai/blog/host-setup-for-qemu-kvm-gpu-passthrough-with-vfio-on-linux, weak backing). These are practitioner guides, not authoritative specs, and are cited only to show the default flow is configure-and-attach with no attestation step.

## Vendor landscape

The dig supports three load-bearing observations:

1. Intel's iGPU mediation path is deprecated; Broadwell through Comet Lake hardware is the affected range, and newer Intel iGPUs route through SR-IOV instead (weights 0.70, 0.39).
2. The mdev framework itself remains generically extensible, as shown by the Mdev-GPU registration utility (weight 0.75).
3. vfio-user is a maintained, documented framework with QEMU as a client (weights 0.74, 0.65).

What the dig did not surface is vendor-specific evidence for the NVIDIA side of the synthesis's mediation claims (the source topic's assertion that NVIDIA moved Ada/Hopper off mdev to a vendor-specific VFIO framework). No kept result carries that claim at any weight, so this corpus does not independently confirm it; it is recorded as a gap in the README.

## Why this anchors C2 of the mediation story

The cutover synthesis treats GPU binding as a gated event, not a configuration constant. The dig shows the two binding surfaces a gate could act on: the vfio-user socket connect (a protocol handshake with a version and capability exchange) and the classic vfio-pci hostdev attach (a libvirt lifecycle event). Both are discrete, hookable moments in the guest lifecycle, which is the property the Boot Admission Policy design (doc 04) needs.
