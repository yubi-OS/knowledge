# VFIO and vGPU CI Context

Scope: Why libvfio-user exists in yubiOS CI at all: vGPU and vfio-user VM testing, socket-based device emulation, and the ADR-022 per-artifact OCI distribution scheme the whole decision leans on.

## The role of libvfio-user in the vGPU VM workflow

yubiOS's vGPU VM workflow (ci_test-vgpu-vm.yml) builds libvfio-user so its test VMs can exercise vfio-user device emulation end to end. The machinery underneath is worth spelling out, because it explains why a CI-time tool needs a deliberate build and distribution strategy in the first place.

vfio-user is a framework for implementing PCI devices in userspace. Clients such as QEMU talk the vfio-user protocol over a UNIX socket to a server, and libvfio-user provides the API for implementing such servers (https://github.com/nutanix/libvfio-user, jev weight 0.93). The key contrast is with kernel VFIO: where vfio is handled by the host kernel, vfio-user is handled entirely in userspace (https://www.qemu.org/docs/master/system/devices/vfio-user.html, jev weight 0.95).

That userspace property is what makes the CI use case clean. The canonical example from the QEMU documentation: SPDK includes a virtual PCI NVMe controller implementation, and by setting up a vfio-user UNIX socket between QEMU and SPDK, a VM can send NVMe I/O to the SPDK process (https://www.qemu.org/docs/master/system/devices/vfio-user.html, jev weight 0.93). No host kernel VFIO configuration, no IOMMU passthrough setup, no physical GPU in the loop. A vGPU test can exercise the full guest-to-device path against a userspace backend running as an ordinary process on the runner.

## The protocol's grounding

The protocol is not an invention of convenience. The vfio-user specification is partly based on the Linux VFIO ioctl interface, and the QEMU project describes VFIO as a mature and stable API; vfio-user reuses the core VFIO concepts defined in that API but implements them as messages sent over a socket (https://www.qemu.org/docs/master/interop/vfio-user.html, jev weight 0.89). Because the semantics mirror a stable kernel interface, test results against a vfio-user backend carry information about behavior that a real kernel VFIO path would also have.

Out-of-process device emulation as a category is established: for virtio-based devices, the same pattern is usually done via vhost-user, which lets a device implementation exist in a separate process, shuttling messages, file descriptors, and shared mappings between QEMU and the server (https://movementarian.org/blog/posts/2025-08-27-vfio-user-client-in-qemu/, jev weight 0.69). vfio-user extends the pattern beyond virtio to arbitrary PCI devices (https://www.qemu.org/docs/master/system/devices/vfio-user.html, jev weight 0.92), which is what a vGPU-shaped test device needs.

## Maturity context for the CI bet

QEMU 10.1 shipped a vfio-user client (https://movementarian.org/blog/posts/2025-08-27-vfio-user-client-in-qemu/, jev weight 0.69), so the consumer side is in released QEMU. The producer and integration side is still maturing: a QEMU project idea describes promoting QEMU's experimental vfio-user device support to production-ready status by adding comprehensive testing, documentation, and migration support (http://wiki.qemu.org/Internships/ProjectIdeas/VFIOUSER, jev weight 0.73). A CI suite that pins a known-good libvfio-user commit rides the protocol's stability without inheriting the ecosystem's churn.

## ADR-022 and the per-artifact distribution scheme

The adopted decision leans on ADR-022, Unified OCI Distribution, Per-Artifact Tags on 0mniteck/yubios (decision record, yubi-OS/yubiOS refs/libvfio-user-bundle-decision-2026-07-30.md, Linear OMN-100). ADR-022 establishes per-artifact OCI tags as the durable distribution surface: each build product gets its own tag on the org registry rather than sharing an image that accumulates purposes.

The bundling decision is an application of that scheme, not an extension of it. V1's proposed tag, 0mniteck/yubios:libvfio-user-<sha>, is exactly the ADR-022 shape: artifact name plus content version. V4, the CI cache, is the pre-artifact alternative that leaves the distribution surface untouched. The reason both were kept as a two-step plan is that ADR-022 tells you how to publish durably, but not whether this particular artifact justifies durable publishing; the cache hit-rate data answers that.

## The trust boundary this CI exists to test

A companion decision record (vgpu-vfio-user-trust-boundary-2026-07-25 in the yubiOS refs corpus) treats the vfio-user path as a trust boundary worth testing deliberately. That framing is the reason the build strategy matters at all: libvfio-user is not a test convenience like a linter, it is the counterparty in a security-relevant interaction between a guest VM and a device backend. A CI that validates the vGPU path with a stale, rebuilt, or tampered libvfio-user is testing against the wrong device. This is what makes the durability question real: the cache (V4) risks nothing beyond staleness within a single workflow, while the published artifact (V1) makes the tested bytes explicit, digest-pinned, and auditable.

## Why this context settles the framing

With the protocol picture in place, the bundling question resolves into what it always was: a distribution problem for one pinned CI-time dependency. The protocol is socket-based and stable, the library is small and permissively licensed, the CI workflow is the only consumer, and the org already has a per-artifact distribution scheme. Every variation in the decision (cache the build, publish the artifact, split by architecture, route through bcvk, keep building per runner) is a different answer to how that one dependency reaches the runners, nothing more. That is why the decision record keeps the production image out of scope entirely: libvfio-user serves the tests, and the tests serve the OS, and only the OS ships in production.
