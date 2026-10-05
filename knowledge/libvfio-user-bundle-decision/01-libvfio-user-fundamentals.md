# libvfio-user Fundamentals

Scope: What libvfio-user is, its role in userspace VFIO device emulation, its upstream homes and maintenance model, and why those facts make vendor-pinning the right dependency model for yubiOS CI.

## What vfio-user is

vfio-user is a framework that allows implementing PCI devices in userspace. Clients such as QEMU talk the vfio-user protocol over a UNIX socket to a server, and libvfio-user is the C library that provides the API for implementing such servers (https://github.com/nutanix/libvfio-user, jev weight 0.93).

The underlying kernel facility it mirrors is VFIO, which provides secure access to PCI devices in userspace, including pass-through to a VM (https://github.com/nutanix/libvfio-user, jev weight 0.93). With vfio-user, a device implementation runs entirely outside the kernel: the QEMU documentation states that whereas vfio is handled by the host kernel, vfio-user is handled entirely in userspace (https://www.qemu.org/docs/master/system/devices/vfio-user.html, jev weight 0.92).

## Relationship to QEMU and vhost-user

QEMU's documentation places vfio-user alongside vhost-user: it allows implementing PCI devices in userspace outside of QEMU, similar to vhost-user, but with one important difference. vfio-user can emulate arbitrary PCI devices, not just virtio devices (https://www.qemu.org/docs/master/system/devices/vfio-user.html, jev weight 0.92). For virtio-based devices, out-of-process device emulation is usually done via vhost-user, which shuttles messages, file descriptors, and shared mappings between QEMU and the server process (https://movementarian.org/blog/posts/2025-08-27-vfio-user-client-in-qemu/, jev weight 0.69).

The wire protocol is deliberately conservative. The vfio-user specification is partly based on the Linux VFIO ioctl interface, and the project describes VFIO as a mature and stable API; vfio-user reuses the core VFIO concepts but implements them as messages sent over a socket (https://www.qemu.org/docs/master/interop/vfio-user.html, jev weight 0.89).

## Concrete use: out-of-process NVMe

The canonical example is SPDK. SPDK includes a virtual PCI NVMe controller implementation; by setting up a vfio-user UNIX socket between QEMU and SPDK, a VM can send NVMe I/O to the SPDK process (https://www.qemu.org/docs/master/system/devices/vfio-user.html, jev weight 0.95). This is the property yubiOS CI exploits: a test VM can talk to a device backend that lives in an ordinary userspace process, with no host kernel VFIO configuration and no physical hardware in the loop.

## Upstream homes and maturity

libvfio-user lives under the QEMU project umbrella. Public mirrors exist at GitLab (https://gitlab.com/qemu-project/libvfio-user, jev weight 0.75) and on qemu.googlesource.com (https://qemu.googlesource.com/libvfio-user/, jev weight 0.75), with the Nutanix GitHub repository serving as the primary public entry point (https://github.com/nutanix/libvfio-user, jev weight 0.91).

Maturity is still climbing. A QEMU project idea describes promoting QEMU's experimental vfio-user device support to production-ready status by adding comprehensive testing, documentation, and migration support (http://wiki.qemu.org/Internships/ProjectIdeas/VFIOUSER, jev weight 0.73). On the consumer side, QEMU 10.1 shipped a vfio-user client, documented in August 2025 (https://movementarian.org/blog/posts/2025-08-27-vfio-user-client-in-qemu/, jev weight 0.69). The direction of travel is clear: the protocol is stabilizing and client support is now in released QEMU, but the ecosystem is young enough that pinning a known-good commit beats tracking upstream heads.

## Why vendor-pinning fits this library

Two facts from the yubiOS decision record (yubi-OS/yubiOS refs/libvfio-user-bundle-decision-2026-07-30.md, Linear OMN-100) drive the dependency model. First, libvfio-user is licensed BSD-3-Clause, so ownership of a fork buys nothing legally or technically. Second, upstream commit cadence is low, so a pinned commit stays valid for a long time.

The pinning discipline is well supported in the wider CI/CD world: security guidance following supply-chain incidents recommends pinning dependencies to verified commit SHAs instead of floating version tags (https://oversightinstitute.org/blog/should-you-pin-every-ci-cd-dependency-to-a-sha, jev weight 0.66), and GitHub organization-level policy can make SHA pinning mandatory across workflows (https://www.romainlespinasse.dev/posts/github-actions-commit-sha-pinning/, jev weight 0.65). The same logic applies to a vendored C library: pin the commit, rebuild deterministically, and only move the pin through a reviewed change. That is exactly the model yubiOS adopted, with commit 37491ed9 as the pinned libvfio-user revision at the time of the decision record.

## Why this matters for the build-strategy question

Everything downstream in this corpus rests on these properties. libvfio-user is a CI-time tool: it exists so the vGPU VM workflow can exercise vfio-user device emulation, not because the production yubiOS image needs it at runtime. It is a small, stable, permissively licensed C library with an upstream the project does not want to own. Those three facts together make both final options in the decision (CI cache versus published OCI artifact) cheap and reversible, and they rule out heavier alternatives like forking before any scoring is even needed.
