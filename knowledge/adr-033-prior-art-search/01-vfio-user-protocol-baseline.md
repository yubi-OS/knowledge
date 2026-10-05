# 01 - vfio-user protocol baseline: what the protocol itself mandates

Scope: what the vfio-user protocol specification requires when a client misbehaves (mutual distrust, socket disconnect handling, FSM error states, negotiated DMA windows) and where it stops short of any trigger model or severity ladder.

## The substrate: PCI device emulation in userspace

vfio-user is a framework for implementing PCI devices in userspace. Clients such as QEMU talk the vfio-user protocol over a UNIX socket to a server process, and libvfio-user is the reference server-side API for writing such servers (https://github.com/nutanix/libvfio-user, weight 0.89). QEMU ships a vfio-user client, and the specification explicitly allows emulating arbitrary PCI devices, not just virtio devices, making it a generalization of the vhost-user pattern (https://www.qemu.org/docs/master/system/devices/vfio-user.html, weight 0.94).

The architectural split matters for any cut-off policy: classic VFIO device assignment is handled by the host kernel, while vfio-user moves the entire device implementation into a userspace process. A documented example is SPDK, which includes a virtual PCI NVMe controller implementation; a vfio-user UNIX socket between QEMU and SPDK lets a VM send NVMe I/O to the emulated device (https://www.qemu.org/docs/master/system/devices/vfio-user.html, weight 0.94). A policy engine that lives in that server process therefore sits outside the kernel and outside the guest, which is exactly the position ADR-031 selected for yubiOS's GPU trust boundary.

## Protocol-level discipline: mutual distrust

The specification treats client and server as mutually distrusting parties. The QEMU protocol documentation defines the message set, all prefixed with vfio_user or VFIO_USER to distinguish them from base VFIO symbols (https://www.qemu.org/docs/master/interop/vfio-user.html, weight 0.89). This is protocol-level discipline, not a policy engine: the spec tells each side how to survive a hostile peer, not when to classify peer behavior as misbehavior.

## Socket disconnection is the one built-in behavioral response

The spec's Socket Disconnection Behavior section states that the server and the client can disconnect from each other, either intentionally or unexpectedly, and defines the required handling (https://www.qemu.org/docs/master/interop/vfio-user.html, weight 0.89). The reviewed protocol documentation defines reset as the response to disconnection and device failure. There is no intermediate response vocabulary: no throttle, no warn, no quarantine. The response set is binary.

## DMA windows are explicit and negotiated

DMA is not implicit. The client sends VFIO_USER_DMA_MAP to inform the server of the memory regions the server may access, and symmetric unmap messages revoke them (https://www.qemu.org/docs/master/interop/vfio-user.html, weight 0.94). This gives a vfio-user server a precise, protocol-visible record of every DMA window the guest ever opened. What the protocol does not define is any interpretation of that record: nothing in the reviewed documentation describes detecting anomalous DMA frequency or suspicious region access patterns.

## The migration FSM exists but is a migration feature, not a policy hook

The specification defines a device migration finite state machine, described as a Mealy machine whose actions are taken on the arcs between states, supporting direct state transitions (https://www.qemu.org/docs/master/interop/vfio-user.html, weight 0.94). This FSM is the protocol's closest analogue to a severity ladder: states progress through defined transitions and failed transitions put the device in an error state requiring explicit reset. But the FSM is scoped to migration, and its transitions are driven by migration commands, not by observed device behavior. It is a lifecycle contract, not a misbehavior response ladder.

## What is absent

Against ADR-033's four assumptions, the reviewed vfio-user documentation shows:

1. No trigger model. The spec is silent on what counts as misbehavior; it defines only what happens after misbehavior has already occurred (https://www.qemu.org/docs/master/interop/vfio-user.html, weight 0.89).
2. No severity ladder. One built-in response exists (reset on disconnect or failure).
3. No forensic-state capture. Reset discards device state; nothing in the protocol snapshots state before revoking access.
4. A latent observation surface. The negotiated DMA map/unmap message stream is protocol-visible data that a policy layer could evaluate, which is the opening ADR-033's pluggable evaluator interface targets.

## Sources considered

| source | weight |
|---|---|
| https://www.qemu.org/docs/master/interop/vfio-user.html | 0.89, 0.94 |
| https://www.qemu.org/docs/master/system/devices/vfio-user.html | 0.94, 0.85 |
| https://github.com/nutanix/libvfio-user | 0.89, 0.88 |
| https://qemu-stsquad.readthedocs.io/en/latest/system/devices/vfio-user.html | 0.51 |
| https://qemu.googlesource.com/libvfio-user/+/a8242d117118d5191dad69a96e28a21d66fe8b50/README.md | 0.81 |
| https://lists.gnu.org/archive/html/qemu-devel/2021-05/msg01046.html | 0.75 |
| https://www.kernel.org/doc/html/latest/driver-api/vfio.html | 0.86 |
| https://www.kernel.org/doc/html/v5.8/driver-api/vfio.html | 0.93 |
| https://github.com/nutanix/libvfio-user/blob/master/include/libvfio-user.h | 0.84 |
