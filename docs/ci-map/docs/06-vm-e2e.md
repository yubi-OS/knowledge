# 06 VM e2e lane: the vm-tests group

**Scope:** the 3 workflows that run the final VM e2e, the destructive-input guardrails that make them safe on shared hardware, and the one `workflow_call` entry point in the repo. Grounding spine: source doc (yubi-OS/yubiOS docs/CI_MAP.md, https://github.com/yubi-OS/yubiOS/blob/main/docs/CI_MAP.md).

## The 3 workflows

- `ci_test-vm.yml` runs the bcvk-based VM e2e: bcvk built at pinned source, a hard `/dev/kvm` gate, the yubiOS image pulled into Podman storage, and mandatory CTAP2/LUKS2/homed/ed25519-sk assertions. 3 jobs (lint-vm-scripts, vm-e2e with 24 steps, ci-callback).
- `ci_test-vgpu-vm.yml` is the same e2e plus the vGPU/virtio CI legs, at 61 KB the second largest file in the repo. 3 jobs (lint-vm-scripts, vgpu-vm-e2e with 32 steps, ci-callback).
- `ci_test_sealed-uki-vm.yml` is the sealed-UKI Secure Boot VM e2e, green at V83 per PR #155, joined the group on the 2026-10-05 map pass. It is the only `workflow_call`-callable workflow in the repo (3 jobs: build-and-verify-uki, boot-secure-vm, negative-tamper-tests) and is also directly dispatchable.

All three are from the source doc (source doc).

## Key invariants

The source doc (source doc) records three:

1. **The `hw_device` input is destructive and opt-in only.** It names a spare block device on rock1 that the workflow wipes; it never runs on push.
2. **The VM lane intentionally stays outside Bake.** bcvk reads Podman's local store, so the VM e2e is not a Bake target unlike every Docker build in the non-fork chain.
3. **ARM64 DirectBoot delivers the public root key via the systemd kernel command-line `tmpfiles.extra` credential path.**

## The real-U2F guard

Both `ci_test-vm.yml` and `ci_test-vgpu-vm.yml` carry the real-U2F guard: `ALLOW_REAL_U2F=1` must be set on rock1 because a physical YubiKey is attached there. PR #144 made this explicit so the workflows refuse to silently run passless tests on the shared runner (source doc). Combined with the destructive `hw_device` input, the lane is deliberately unsafe-by-default on rock1: two explicit opt-ins are required before the e2e touches either the physical key or a block device (source doc).

## What the lane proves

The mandatory assertions list (CTAP2 hmac-secret, LUKS2, homed, pam-u2f, ed25519-sk per the source doc's carried diagram) is the identity story of yubiOS exercised end to end inside a VM: the same YubiKey-derived credentials that unlock a physical install must unlock the VM boot. The sealed-UKI workflow adds the negative direction: its `negative-tamper-tests` job deliberately runs tampered artifacts and expects boot refusal, which is the only honest way to test Secure Boot enforcement (source doc).

For the sealed-UKI lane specifically, the repo carries its own debug playbook: the lane builds a PKCS#11-signed UKI (SoftHSM slot emulating PIV 9c), boots it under OVMF Secure Boot, and runs negative tamper tests (github.com/yubi-OS/yubiOS playbooks/sealed-uki-vm-debug.md, https://github.com/yubi-OS/yubiOS/blob/main/playbooks/sealed-uki-vm-debug.md, jev weight 0.43, weak).

## External grounding

bcvk is the tool the lane is built on: the bootc virtualization kit launches ephemeral VMs from bootc containers, and its `libvirt run` command wraps `bcvk to-disk`, which wraps `bootc install to-disk` (github.com/bootc-dev/bcvk, https://github.com/bootc-dev/bcvk, jev weight 0.12, weak). Red Hat's RHEL 10 documentation describes bcvk as bridging the gap between container development and hardware deployment by launching ephemeral VMs from bootc containers (docs.redhat.com, "Testing and deploying bootable containers with bcvk", https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/using_image_mode_for_rhel_to_build_deploy_and_manage_operating_systems/managing-image-updates-with-the-bootc-virtualization-kit-bcvk, jev weight 0.43, weak).

On the sealed-UKI side, UKIs combine the kernel, initrd, and kernel command-line into a single EFI executable, and Type 2 UKIs are considered more secure because the image carries all information needed to boot (docs.qualcomm.com, "Configure and secure boot with systemd-boot and UKI", https://docs.qualcomm.com/bundle/publicresource/topics/80-70029-27/configure_and_secure_boot_with_systemd_boot_and_uki.html, jev weight 0.4, weak). General UKI hardening guides describe the same threat model the negative tamper tests encode: an unsigned or maliciously modified artifact lacks a valid Secure Boot signature and must fail to boot (systemshardening.com, https://www.systemshardening.com/articles/linux/uki-secure-boot-hardening/, jev weight 0.14, weak).

## Composes with

The lane consumes the published `firmware-qemu-arm64` image from the firmware lane (source doc, doc 04) and the production image from the builders (source doc, doc 03). Its evidence lands in CI logs rather than a registry, like the tests group (source doc). Because `ci_test_sealed-uki-vm.yml` is `workflow_call`-callable, other workflows in the repo can invoke it as a reusable step, which is the one place the otherwise-flat dispatch topology gains a caller edge (source doc).
