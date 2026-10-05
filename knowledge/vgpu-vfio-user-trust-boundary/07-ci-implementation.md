# 07. The CI implementation: workflow, bcvk patch, and pinned libvfio-user

Scope: how the vGPU CI lane is actually built: the derived workflow, the QEMU 10.1 vfio-user client, the bcvk `--extra-qemu-arg` patch, the pinned libvfio-user server build, and the loud-SKIP contract.

## The vfio-user client is upstream

The vfio-user client landed upstream in QEMU 10.1. The release adds QEMU's own vfio-user client, and the announcement walkthrough shows trying it out directly (source: https://movementarian.org/blog/posts/2025-08-27-vfio-user-client-in-qemu/, jev weight 0.80). The device documentation confirms the shape: QEMU includes a vfio-user client, and the specification allows implementing PCI devices in userspace outside of QEMU, similar to vhost-user (source: https://www.qemu.org/docs/master/system/devices/vfio-user.html, jev weight 0.93; same page for 10.1 at https://qemu.eu/doc/10.1/system/devices/vfio-user.html, jev weight 0.92, and the pre-release docs at https://qemu-stsquad.readthedocs.io/en/docs-next/system/devices/vfio-user.html, jev weight 0.89). The client is configured as a device with a UNIX socket transport, in the form `-device '{"driver":"vfio-user-pci","socket":{"path":"...","type":"unix"}}'` (source: https://www.qemu.org/docs/master/system/devices/vfio-user.html, jev weight 0.93).

Because the client is host-side, a CI leg can exercise the whole negotiation without a guest. QEMU runs with `-S`, so PCI realize and the entire `VFIO_USER_VERSION` / `GET_INFO` / `REGION_INFO` negotiation happen with no guest code running: no kernel, no firmware, no disk needed (test design grounded in the protocol being entirely host-userspace, https://www.qemu.org/docs/master/system/devices/vfio-user.html, jev weight 0.93).

## The pinned server build

The server side is libvfio-user, built from source at a pinned commit with meson and ninja. The library is the reference framework for implementing vfio-user PCI device servers: applications provide region and IRQ descriptions plus callbacks the library invokes on region access (source: https://github.com/nutanix/libvfio-user, jev weight 0.80; architecture statement at https://qemu.googlesource.com/libvfio-user/, jev weight 0.83). The build stages `samples/gpio-pci-idio-16` plus `libvfio-user.so*`, then smoke-checks that the staged binary actually opens a socket before the test leg is allowed to depend on it.

The gpio sample is not arbitrary. It is the server the upstream QEMU walkthrough uses: the walkthrough starts the gpio server process and connects a Linux guest whose kernel carries the pci-idio-16 driver (source: https://qemu.googlesource.com/libvfio-user/+/HEAD/docs/qemu.md, jev weight 0.81; GitHub copy at https://github.com/nutanix/libvfio-user/blob/master/docs/qemu.md, jev weight 0.80). That kernel module is part of the standard Linux kernel but is not usually built and shipped on x86, so a walkthrough consumer typically builds it (source: https://qemu.googlesource.com/libvfio-user/+/a8242d117118d5191dad69a96e28a21d66fe8b50/README.md, jev weight 0.85). The sample is declared in the library's `samples/meson.build` (source: https://qemu.googlesource.com/libvfio-user/+/HEAD/samples/meson.build, jev weight 0.56, weak backing). The vfio-user-as-vhost-user-analog pattern is broader than QEMU: Cloud Hypervisor documents the same experimental protocol for implementing devices in another process over a socket (source: https://intelkevinputnam.github.io/cloud-hypervisor-docs-HTML/docs/vfio-user.html, jev weight 0.58, weak backing).

## The bcvk patch

The guest-facing legs need to pass QEMU arguments through bcvk, and the pinned bcvk does not expose that. The CI lane therefore applies a patch to the pinned bcvk source before `cargo build`, in the same perl-regex style as the existing privileged, CAP_SYS_ADMIN, ed25519, and DirectBoot-SSH patches. The patch adds `extra_qemu_args: Vec<String>` to `QemuConfig`, emitted verbatim onto the emulator command line; a repeatable `--extra-qemu-arg` clap option on `RunEphemeralOpts`; and the wiring between them. Because `RunEphemeralOpts` already derives `Serialize` and `Deserialize` and is handed to the in-container process as JSON, the new field crosses that boundary without further work.

Two contract details matter. First, the build cache prefix is `-vgpu1`-suffixed so the unpatched binary built by the base VM workflow is never reused. Second, if a hunk stops applying, the step SKIPs instead of shipping a bcvk that silently ignores the flag; a silently-ignoring build is the one failure mode worse than no build. Upstreaming the patch into `yubi-OS/bcvk` retires it.

## The workflow and its contract

`ci_test-vgpu-vm.yml` is derived from `ci_test-vm.yml`: same lint gate, same host-deps, zstd-QEMU, bcvk-build, KVM, and AppArmor preflight, same rc contract of 0 pass, 77 loud SKIP, else fail, same artifact upload and `ci.yml` callback. It runs every leg of the base workflow with `YUBIOS_VGPU=1` in scope, plus two new legs:

1. `tests/vm/test-vgpu-virtio-ci.sh`: a host-side device-model probe, then a guest leg that boots with a virtio-gpu attached and asserts the DRM nodes, the bound driver, and the negative VFIO surface. It SKIPs 77, naming the gap, when the pinned bcvk exposes no QEMU-argument passthrough.
2. `tests/vm/test-vfio-user-host-ci.sh`: a QEMU version plus `vfio-user-pci` probe, then a real client and server handshake against the staged libvfio-user sample server, asserting socket mode `0600` and that no kernel `vfio` module was loaded.

Both dependencies are provisioned in-run by the workflow and cached under `/opt` keyed by the pinned commit, the same pattern as the zstd QEMU build. As of 2026-09-09 the workflow is green on current main: three consecutive successful runs on the rock1 self-hosted ARM64 runner (runs 34408180552, 34410693076, and 34410693069), and the B-VGPU-VM-UNZIP host-deps gap is fixed in code.
