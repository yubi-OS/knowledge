# 02. The vfio-user protocol: a device model in a separate process

Scope: how vfio-user moves the device model out of the host kernel and out of QEMU, the AF_UNIX session and message sequence, the mutual-distrust rule written into the specification, and the protocol's stated limitations.

## The architecture

vfio-user allows implementing PCI devices in userspace, outside of QEMU; clients such as QEMU talk the vfio-user protocol over a UNIX socket to a server (source: https://github.com/nutanix/libvfio-user, jev weight 0.89). It is similar to vhost-user in this respect (source: https://www.qemu.org/docs/master/system/devices/vfio-user.html, jev weight 0.93). The critical contrast with kernel VFIO: where vfio is handled by the host kernel, vfio-user is handled entirely in userspace (source: https://qemu-stsquad.readthedocs.io/en/latest/system/devices/vfio-user.html, jev weight 0.85). No kernel VFIO modules are involved on either side of the socket.

The canonical example of why this split is useful: SPDK includes a virtual PCI NVMe controller implementation, and by setting up a vfio-user UNIX socket between QEMU and SPDK, a VM can send NVMe I/O to the SPDK process (source: https://www.qemu.org/docs/master/system/devices/vfio-user.html, jev weight 0.93). The same shape is what a GPU device server would use.

## The session and message sequence

The protocol runs over one socket per connection. On AF_UNIX sockets, file descriptors must be passed as SCM_RIGHTS type ancillary data (source: https://www.qemu.org/docs/master/interop/vfio-user.html, jev weight 0.88). The negotiation sequence from the specification is:

1. `VFIO_USER_VERSION` to agree on protocol parameters.
2. `GET_INFO` / `REGION_INFO` to enumerate the device's regions and capabilities.
3. `DMA_MAP` / `DMA_UNMAP` to negotiate the memory windows the device model may access.
4. `READ` / `WRITE` / `SET_IRQS` for the actual device operation (source: https://www.qemu.org/docs/master/interop/vfio-user.html, jev weight 0.88; the IRQ info structures are defined in `<linux/vfio.h>` per https://www.qemu.org/docs/master/interop/vfio-user.html, jev weight 0.90).

Two protocol rules with direct security value: a command to map over an existing region must be failed by the server with `EEXIST` (source: https://www.qemu.org/docs/master/interop/vfio-user.html, jev weight 0.88), and the specification states that client and server must not trust each other and both must validate input (source: https://www.qemu.org/docs/master/interop/vfio-user.html, jev weight 0.88). That mutual-distrust clause is the reason vfio-user fits a hardended host: the boundary is not a promise of good behavior, it is an obligation on both peers to check everything that arrives on the socket.

## Stated limitations

The specification is narrow on purpose: one socket per connection, PCI devices only, no client or device multiplexing, and live migration is deferred (source: https://www.qemu.org/docs/master/interop/vfio-user.html, jev weight 0.88). For a vGPU design this means the protocol is a fit for a single dedicated device-model process per VM, and the migration story has to come from elsewhere or wait.

## The server-side library

libvfio-user is the reference framework for implementing such servers. Applications provide a description of the device, for example region and IRQ information, plus a set of callbacks that libvfio-user invokes when those regions are accessed (source: https://github.com/nutanix/libvfio-user, jev weight 0.92; same statement in the Google-hosted mirror at https://qemu.googlesource.com/libvfio-user/+/a8242d117118d5191dad69a96e28a21d66fe8b50/README.md, jev weight 0.90). The library abstracts most of the complexity of representing the device over the wire.

A community-maintained protocol overview also flags operational hazards the library does not hide for you: a vfio-user server must appropriately handle client disconnection (source: https://deepwiki.com/nutanix/libvfio-user/1.2-protocol-overview, jev weight 0.26, weak backing). Treat disconnection handling as an implementation obligation to verify in tests, not a property the protocol guarantees.

## Why this is the yubiOS architecture

For a host whose trust anchors live in a YubiKey and whose unlock path runs in kernel memory, the important property is where the DMA grant lives. Under kernel VFIO the grant is enforced by the IOMMU and owned through a privileged bind. Under vfio-user the device model is an unprivileged userspace process, the DMA window is explicit through `DMA_MAP`, and the access boundary is a filesystem-permissioned socket. A hostile or compromised device model can only reach the windows it negotiated, and the peer that granted them is the VMM, not the kernel (sources: https://www.qemu.org/docs/master/interop/vfio-user.html, jev weight 0.88; https://www.qemu.org/docs/master/system/devices/vfio-user.html, jev weight 0.93). The residual risk is socket exposure, which is a filesystem policy problem addressed in doc 05, not a kernel attack surface problem.
