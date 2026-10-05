# 08 - Host-side policy and hardware constraints

Scope: the policy layer on top of the plumbing: virtio-gpu as the guest default, guest /dev/vfio suppression, the IOMMU-gated passthrough access gate, and the vGPU alternatives (SR-IOV, mdev, NVIDIA vGPU, vfio-user) with the hardware each requires.

## The yubiOS guest default: virtio-gpu only

yubiOS ships guests with virtio-gpu only. /dev/vfio is suppressed in production guests via a multi-layer fix (a modprobe blacklist at 50-yubiOS-no-vfio.conf, a dracut omit at 52-yubiOS-no-vfio.conf, and tmpfiles.d override), verified at OMN-149 close (source: yubiOS internal record, refs/bootc-uki-libvirt-gpu-passthrough-2026-08-07.md, internal provenance). The vfio-pci driver remains for host-side use only: binding host GPUs for passthrough. Guests never see it.

The suppression history is instructive for any host policy that wants a device invisible: a tmpfiles.d override shipped silently broken for 4 days because systemd-tmpfiles sorts files lexicographically, not numerically, so the override fired before the upstream re-create rule and the cdev was re-created on every boot; the fix was a lex-sort-safe rename, and the fix alone was still insufficient because the devtmpfs daemon registers VFIO cdevs at the structural-kernel level regardless of modprobe blacklist, which required udev rules plus a oneshot purge service to close (source: yubiOS internal record, internal provenance, OMN-149). Layered suppression is the durable pattern; a single deny rule is not.

## The access gate

ADR-031 sets the mechanism: virtio-gpu default, vfio-user preferred for emulated vGPU work, and IOMMU-gated PCI passthrough as the access gate (source: yubiOS internal record, commit 67c740c, 2026-07-26, internal provenance). Rule 5, "no trust-boundary component consumes GPU state", is the reason /dev/vfio is suppressed in guests. Hardware enforcement of the IOMMU gate is post-launch: no runner in the org has IOMMU plus a real GPU (source: yubiOS internal record, internal provenance). Rule 7 adds boot-time image attestation as a libvirt launch gate (source: yubiOS internal record, PR #153, 2026-07-30, internal provenance).

## The alternatives, with their hardware costs

Passthrough is one of several GPU virtualization paths; the others trade isolation for allocation granularity:

1. SR-IOV: the specification splits a single physical port (the physical function) into multiple virtual functions (source: https://canonical.com/openstack/docs/latest/how-to/misc/configuring-sriov/, jev weight 0.71). SR-IOV devices are supported by standard VFIO PCI direct assignment with an established QEMU VFIO/PCI driver, KVM-agnostic and well-defined UAPI (source: https://www.linux-kvm.org/images/5/59/02x03-Neo_Jia_and_Kirti_Wankhede-vGPU_on_KVM-A_VFIO_based_Framework.pdf, jev weight 0.86). It requires IOMMU and ACS support; yubiOS has no SR-IOV-capable GPU in CI today, and ARM64 lacks SMMU bring-up there (source: yubiOS internal record, internal provenance).
2. Mediated devices (mdev): kernel-mediated interfaces presenting a per-VM mediated device backed by a parent. The vGPU-on-KVM framework is VFIO-based mediated device work from NVIDIA engineers (source: https://www.linux-kvm.org/images/5/59/02x03-Neo_Jia_and_Kirti_Wankhede-vGPU_on_KVM-A_VFIO_based_Framework.pdf, jev weight 0.86), and tooling exists for registering arbitrary mdev types with the VFIO mediated device framework for GPU vendor drivers (source: https://github.com/Arc-Compute/Mdev-GPU/, jev weight 0.73). mdev lives in the kernel but exposes a per-VM interface, making it closer to vfio-user than to full passthrough (source: yubiOS internal record, internal provenance).
3. NVIDIA vGPU: proprietary, requires an NVIDIA GPU, a license, and the vGPU software driver installed on the physical host before guest configuration (source: https://docs.nvidia.com/vgpu/latest/pdf/grid-vgpu-user-guide.pdf, jev weight 0.87). Untested on yubiOS, no NVIDIA hardware in CI, post-launch evaluation (source: yubiOS internal record, internal provenance).
4. vfio-user: a userspace-emulated PCI device served over a unix socket, requiring no special hardware, which is why it is yubiOS's preferred path (source: yubiOS internal record, internal provenance).

A weak-backed summary draws the same taxonomy: passthrough differs from mediated virtualization technologies like SR-IOV, NVIDIA vGPU, or MIG, which split a single physical GPU across multiple guests in software (source: https://tech-insider.org/gpu-passthrough-iommu-vfio-setup-2026/, jev weight 0.17, weak backing, labeled as such).

## The runner shape constraint

Bare-metal PCI passthrough testing was deferred for the v1 launch (OMN-146, done 2026-07-30). The future runner shape is an x86_64 host with Intel or AMD CPU, a discrete GPU in an IOMMU-isolated slot, and spare SATA or NVMe storage; the existing rock1 runner is insufficient (source: yubiOS internal record, internal provenance). Until that runner exists, passthrough claims in CI are unenforceable and the honest default is the emulated track (virtio-gpu plus vfio-user).

Kubernetes-oriented guidance independently lands on the same hardware prerequisites for the passthrough/SR-IOV path: kernel parameters for IOMMU, IOMMU groups, and device isolation are the configuration core (source: https://kubernetes.recipes/recipes/configuration/iommu-gpu-passthrough-sriov-kubernetes/, jev weight 0.52, weak backing, labeled as such). Ubuntu's server documentation positions QEMU/KVM GPU virtualization, including graphics frontends, backends, 3D acceleration, and advanced passthrough options, as a supported configuration surface (source: https://ubuntu.com/server/docs/how-to/graphics/gpu-virtualization-with-qemu-kvm/, jev weight 0.85).

## Operator checklist for this layer

1. Keep guests on virtio-gpu; verify /dev/vfio is absent in guest images rather than trusting one suppression layer (source: yubiOS internal record, internal provenance).
2. Treat IOMMU presence plus attested boot as the gate before any hostdev is attached to a VM (source: yubiOS internal record, internal provenance).
3. Pick the alternative by hardware budget: SR-IOV or vGPU needs capable silicon and licenses, mdev needs kernel driver support, vfio-user needs nothing but a host process (sources: https://canonical.com/openstack/docs/latest/how-to/misc/configuring-sriov/, jev weight 0.71; https://docs.nvidia.com/vgpu/latest/pdf/grid-vgpu-user-guide.pdf, jev weight 0.87; https://www.linux-kvm.org/images/5/59/02x03-Neo_Jia_and_Kirti_Wankhede-vGPU_on_KVM-A_VFIO_based_Framework.pdf, jev weight 0.86).
4. Do not claim bare-metal passthrough support in CI until an IOMMU-isolated GPU runner exists (source: yubiOS internal record, internal provenance).
