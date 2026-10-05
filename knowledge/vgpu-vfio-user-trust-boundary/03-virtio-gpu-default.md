# 03. virtio-gpu as the default device model

Scope: why the default yubiOS image ships virtio-gpu only, what virtio-gpu actually is, and why a paravirtualized device introduces no new trust peer into the boot path.

## What virtio-gpu is

The virtio-gpu device provides a GPU and display controller paravirtualized using VirtIO (source: https://www.qemu.org/docs/master/system/devices/virtio/virtio-gpu.html, jev weight 0.84). VirtIO devices are paravirtualized devices designed to be efficient to emulate and virtualize (source: https://www.qemu.org/docs/master/system/devices/virtio/index.html, jev weight 0.93). Emulation is the operative word: the device model runs in the host's QEMU process, in host userspace, and every guest interaction goes through the hypervisor's own virtio transport rather than through a hardware path the host does not control.

On the guest side, virtio-gpu requires a guest Linux kernel built with the `CONFIG_DRM_VIRTIO_GPU` option (source: https://www.qemu.org/docs/master/system/devices/virtio/virtio-gpu.html, jev weight 0.93). The driver itself is the standard kernel DRM driver at `drivers/gpu/drm/virtio/virtgpu_drv.c`, which registers PCI device ID 0x1050 (source: https://github.com/torvalds/linux/blob/master/drivers/gpu/drm/virtio/virtgpu_drv.c, jev weight 0.88). Proxmox's driver documentation makes the same point from the operations side: VirtIO drivers enable direct access to devices and peripherals for virtual machines instead of slower, fully emulated hardware (source: https://pve.proxmox.com/wiki/Windows_VirtIO_Drivers, jev weight 0.90).

## Backends and their hardware appetite

QEMU provides a 2D virtio-gpu backend plus two accelerated backends: virglrenderer exposed as the `gl` device label and rutabaga_gfx exposed as `rutabaga`, with a vhost-user backend variant beyond those (source: https://qemu.eu/doc/10.1/system/devices/virtio-gpu.html, jev weight 0.85). The accelerated backends are the reason the default stays 2D in CI: 3D acceleration needs host GPU access, which is a bare-metal property (see doc 09). The paravirtualized 2D path needs nothing but a working hypervisor.

## Why no new trust peer

The security argument is architectural, and it follows from what each architecture grants:

1. With emulated virtio-gpu, the device model runs in host userspace already, and its only memory access is guest RAM the hypervisor already owns. There is no new peer with a DMA grant, no IOMMU group to manage, no kernel VFIO binding, and nothing to bind with root.
2. With vfio-pci passthrough, the guest drives real hardware and the enforcement boundary becomes the IOMMU group plus DMA ownership (doc 01). The failure mode when the IOMMU is absent is covered in doc 04.
3. With vfio-user, the device model moves to a separate process and the boundary becomes the socket plus the negotiated DMA windows (doc 02). That is a controlled expansion, not a default.

For a locked-down image the asymmetry is decisive. virtio-gpu is the only one of the three that requires no privilege escalation in the image at all: no `vfio.conf`, no initramfs driver binding, no blacklisted host display drivers, no IOMMU-group policy decision. Everything else is opt-in.

## What CI can assert about it

Because virtio-gpu is pure emulation, the CI surface is fully testable without hardware. A host-side probe confirms the device model is present in the CI QEMU build, and a guest leg boots a yubiOS image with a virtio-gpu attached and asserts the DRM nodes appear, `/dev/dri/card0` and `renderD128` exist, the `virtio_gpu` driver is bound, and the negative VFIO surface holds (no `/dev/vfio`, no `vfio-pci` bound, no IOMMU-group claim). The ArchWiki's treatment of guest graphics acceleration describes virtio-gpu as a paravirtualized 3D accelerated graphics driver similar to the non-graphics virtio drivers (source: https://wiki.archlinux.org/title/QEMU/Guest_graphics_acceleration, jev weight 0.85), which is the community's shorthand for the same paravirt contract the kernel driver implements.

## The invariant that keeps it a default

The rule the yubiOS image policy draws from this: adding or removing a virtio-gpu device must be a no-op for the unlock path. Secure Boot, LUKS2 FIDO2 unlock, homed, pam-u2f, and fTPM PCR behavior must not change when a display device appears or disappears (doc 05, rule 5). A paravirtualized device with no DMA grant outside guest RAM and no firmware in the boot chain is the architecture that makes that invariant structurally easy to keep, which is why it is the default rather than merely the cheap option.
