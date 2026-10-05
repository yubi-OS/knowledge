# 01. The vfio-user mediation boundary

Scope: the vfio-user / IOMMU-gated PCI passthrough boundary the cutoff policy sits on, and why a host-side userspace device server is the right place to enforce a misbehavior cutoff.

## What vfio-user is

vfio-user is a protocol that lets a virtual device run in a separate process on the same host, talking to its client over a UNIX domain socket. The QEMU protocol specification describes the main idea as allowing "a virtual device to function in a separate process in the same host over a UNIX domain socket" [1] (jev weight 0.935). QEMU ships a client implementation, and the canonical worked example is a virtual PCI NVMe controller: SPDK implements the device, and "by setting up a vfio-user UNIX socket between QEMU and SPDK, a VM can send NVMe I/O to the SPDK process" [2] (jev weight 0.777).

The libvfio-user library is the reference framework for the server side. Its README is explicit about the shape: "vfio-user is a framework that allows implementing PCI devices in userspace. Clients (such as qemu) talk the vfio-user protocol over a UNIX socket to a server" [3] (jev weight 0.852; mirrored at [4], weight 0.792). The library is hosted under the QEMU project's git instance [5] (weight 0.733).

## Why the UNIX socket matters for a cutoff policy

The socket is the whole point for a misbehavior-triggered cutoff. Everything a guest GPU workload does at the device level crosses that socket or the mappings the server mediates: register accesses, interrupt delivery, and shared-memory windows for DMA. A server process that owns the socket can refuse to service it, revoke it, or hand it to a fresh server. File descriptor passing over AF_UNIX is the mechanism the protocol builds on [1] (weight 0.935), which is what makes "revoke the vfio-user socket" a concrete, implementable action rather than a metaphor.

The ADR-033 design exploits exactly this property. Its SEVER action is "snapshot full VM state, revoke vfio-user socket, freeze VM, alert operator" (source one-pager, adr-033-misbehavior-cutoff-policy-2026-07-28). Because the mediation boundary already exists as a process boundary with a single control channel, the policy adds no new mechanism; it decides when to pull the lever that ADR-031 already provides (source one-pager, adr-033-misbehavior-cutoff-policy-2026-07-28).

## The kernel VFIO and IOMMU foundation

vfio-user reuses the source-level definitions of the in-kernel VFIO framework, which is the kernel's "Virtual Function I/O" interface for exposing devices to userspace with IOMMU-enforced isolation [6] (jev weight 0.934). The kernel documentation describes how IOMMU groups define the smallest set of devices that must be isolated together for DMA safety, and how containers map IOMMU domains onto device access [6] (weight 0.934).

Two details of the kernel VFIO model carry directly into the cutoff design:

- DMA windows. The kernel documentation defines DMA windows as "the PCI address range within which DMA transfer is allowed" [7] (jev weight 0.860). A userspace vfio-user server that observes the windows a guest programs, and the DMA traffic inside them, has a well-defined signal surface. ADR-033's initial trigger evaluator is exactly a DMA-window anomaly score (source one-pager).
- IOMMU enforcement location. A secondary explainer notes that VFIO "uses the IOMMU to enforce memory access isolation while giving the userspace driver (or hypervisor) direct access to device MMIO, interrupts, and DMA" (weak backing, jev weight 0.459, kernel-internals.org) [8]. The kernel documentation itself is the authoritative statement here [6].

## Why a userspace server is the correct vantage point

Three properties make the vfio-user server, rather than the guest or the kernel, the home for the policy evaluator:

1. It is outside the guest. A model running inside the bootc VM cannot observe or attack a process it does not share an address space with (source one-pager, adr-033). The QEMU device documentation frames the server as an independent process the guest only reaches through the mediated device [2] (weight 0.777).
2. It is a single choke point. Every guest-to-device interaction traverses one socket [1] (weight 0.935). A cutoff decided anywhere else (inside the guest, or in the model runtime) is self-policing.
3. It survives the cutoff. Because the VM is frozen rather than killed and only the socket is revoked, the server itself remains intact and auditable after a SEVER event (source one-pager).

QEMU's client-side support for vfio-user landed as a first-class feature in the 10.1 release cycle, with the SPDK NVMe controller as the reference integration [9] (jev weight 0.551), so the boundary this policy sits on is current mainline virtualization infrastructure, not an experimental fork.

## What this doc does not claim

The hardware IOMMU gate for GPU passthrough remains, per ADR-031's honesty note, a post-launch validation item; the cutoff policy operates in software on top of ADR-031's design (source one-pager). Nothing in this doc asserts hardware enforcement is already validated.

## Sources

1. QEMU vfio-user protocol specification: https://www.qemu.org/docs/master/interop/vfio-user.html (weights 0.953, 0.935)
2. QEMU vfio-user device documentation: https://www.qemu.org/docs/master/system/devices/vfio-user.html (weight 0.777)
3. libvfio-user README: https://qemu.googlesource.com/libvfio-user/ (weight 0.852)
4. libvfio-user on GitHub: https://github.com/nutanix/libvfio-user (weights 0.792, 0.789)
5. libvfio-user README (pinned commit): https://qemu.googlesource.com/libvfio-user/+/a8242d117118d5191dad69a96e28a21d66fe8b50/README.md (weight 0.733)
6. Linux kernel VFIO documentation: https://www.kernel.org/doc/html/latest/driver-api/vfio.html (weights 0.934, 0.860 via https://docs.kernel.org/driver-api/vfio.html)
7. Kernel VFIO DMA-window definition: https://docs.kernel.org/driver-api/vfio.html (weight 0.860)
8. VFIO internals explainer (weak backing): https://kernel-internals.org/iommu/vfio-internals/ (weight 0.459)
9. vfio-user client in QEMU 10.1: https://movementarian.org/blog/posts/2025-08-27-vfio-user-client-in-qemu/ (weight 0.551)
