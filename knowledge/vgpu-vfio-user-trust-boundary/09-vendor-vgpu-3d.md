# 09. Vendor mediated vGPU and 3D acceleration: the bare-metal-only tier

Scope: NVIDIA vGPU mediated devices, the archived Intel GVT-g, and virgl and Venus 3D acceleration, and why every one of these is a bare-metal-only tier for yubiOS CI.

## NVIDIA vGPU: mediated devices

The vGPU feature makes it possible to divide a physical NVIDIA GPU device into multiple virtual devices, referred to as mediated devices, which can then be assigned to virtual machines (source: https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/configuring_and_managing_virtualization/assembly_managing-gpu-devices-in-virtual-machines_configuring-and-managing-virtualization, jev weight 0.88). Broadcom's knowledge base records the coexistence constraint that matters for planning: a physical GPU can host NVIDIA vGPUs, or can be used for pass-through, but cannot do both at the same time (source: https://knowledge.broadcom.com/external/article/432926/using-nvidia-vgpu-and-gpu-passthrough-on.html, jev weight 0.86).

The full setup stack is nontrivial: host driver install, SR-IOV, PCI resource mapping, VM configuration, and guest GRID licensing all appear as steps in practical setup guides for mediated devices on hypervisors (source: https://vormox.com/blog/setting-up-nvidia-vgpu-mediated-devices-in-proxmox-ve, jev weight 0.32, weak backing). Community decision guides frame the allocation options as a matrix of whole GPU, passthrough, vGPU, and MIG, where passthrough hands the physical PCIe device to one VM and the guest driver owns the GPU (source: https://digitalthoughtdisruption.com/2026/07/25/enterprise-gpu-allocation-decision-matrix/, jev weight 0.16, weak backing). The official driver distribution channel for NVIDIA GPU drivers is nvidia.com (source: https://www.nvidia.com/en-us/drivers/, jev weight 0.77).

For yubiOS CI the conclusion is positional, not evaluative: a mediated vGPU leg needs a vendor driver plus real hardware, so it belongs to the bare-metal tier with real passthrough (doc 06), not to the hosted-runner tier.

## Intel GVT-g: the archived path

Intel GVT-g is a deprecated technology that provided mediated device passthrough for Intel iGPUs on 5th generation (Broadwell) through 10th generation (Comet Lake) processors (source: https://wiki.archlinux.org/title/Intel_GVT-g, jev weight 0.63). Intel's own guidance describes its graphics virtualization portfolio moving forward through SR-IOV and successor technologies (source: https://www.intel.com/content/www/us/en/support/articles/000093216/graphics/processor-graphics.html, jev weight 0.83). The practical consequence for the corpus: GVT-g is cited as the historical caution that a mediated-vGPU dependency can be archived upstream out from under a design, which is exactly why the yubiOS posture prefers architectures whose components are not vendor-locked (docs 02 and 03) and treats vendor vGPU as an explicitly gated bare-metal option.

## 3D acceleration: virgl and Venus

QEMU's virtio-gpu accelerated backends are virglrenderer (the `gl` device label) and rutabaga_gfx, per the device documentation (source: https://qemu.eu/doc/10.1/system/devices/virtio-gpu.html, jev weight 0.85). In the Mesa stack, VirGL is an OpenGL driver for VirtIO-GPU and Venus is an experimental Vulkan driver for VirtIO-GPU (source: https://gist.github.com/peppergrayxyz/fdc9042760273d137dddd3e97034385f, jev weight 0.16, weak backing for the naming; the Mesa project documents Venus directly at https://docs.mesa3d.org/drivers/venus.html, jev weight 0.69).

Venus's own documentation describes the memory-mapping mechanics that make it hypervisor-dependent: the hypervisor, host KVM, and the guest kernel work together to set up a write-back or write-combined guest mapping through the virtio-gpu kernel driver (source: https://docs.mesa3d.org/drivers/venus.html, jev weight 0.69). The ecosystem is active: a Direct3D driver for Windows guests, Yttrium, is built on the Venus protocol over paravirtualized virtio-gpu, bringing hardware-accelerated Direct3D 9, 10, and 11, Vulkan, and OpenGL to KVM guests without passthrough (source: https://github.com/arehnman/yttrium-virtio-gpu, jev weight 0.80). The ArchWiki summary of guest graphics acceleration matches: virtio-gpu is a paravirtualized 3D accelerated graphics driver in the same family as the other virtio drivers (source: https://wiki.archlinux.org/title/QEMU/Guest_graphics_acceleration, jev weight 0.85).

The operational caveat stays the one from QEMU's own guidance: GPU-accelerated 3D needs host GPU access, which puts virgl and Venus legs on bare metal or a host with a real GPU, not on a hosted CI runner (doc 06).

## The tiering conclusion

Across the three families the pattern is identical and it is what the testability matrix encodes: everything vendor-mediatated or 3D-accelerated requires hardware or a vendor driver that CI cannot conjure, while everything paravirtualized or protocol-level (virtio-gpu 2D, the vfio-user negotiation) runs anywhere. The yubiOS v1 posture follows: ship the paravirtualized tier by default, exercise the protocol tier in CI, and treat the vendor tier as a documented bare-metal deviation rather than a promised feature.
