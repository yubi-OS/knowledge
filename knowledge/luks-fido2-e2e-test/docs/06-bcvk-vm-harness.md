# 06 - bcvk as the VM harness

Scope: bcvk, the bootc virtualization kit, as the harness layer that runs bootc container images as VMs for CI: ephemeral runs, disk image creation, and the trust model of pinned tooling.

## What bcvk is

The bootc virtualization kit bridges the gap between container development and hardware deployment. With bcvk, you can launch ephemeral virtual machines from bootc containers to test bootable images locally, or generate disk images for production frameworks (Red Hat Enterprise Linux documentation, https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/using_image_mode_for_rhel_to_build_deploy_and_manage_operating_systems/managing-image-updates-with-the-bootc-virtualization-kit-bcvk, weight 0.950). The project's own summary matches: bcvk makes it easy to run bootc container images as virtual machines (bootc.dev blog, https://bootc.dev/blog/2026-may-07-sealed-images-deploying/, weight 0.706).

## Ephemeral runs

The ephemeral mode runs bootc containers as stateless VMs managed by podman, with the VM booting directly from the container image filesystem via virtiofs (ManKier man page, https://www.mankier.com/8/bcvk-ephemeral-run, weight 0.228, weak backing). The upstream description adds the mechanism: everything created by bcvk ephemeral is a podman container that reuses the host virtualization stack, which makes testing boot flows simple and disposable (GitHub bootc-dev/bcvk, https://github.com/bootc-dev/bcvk, weight 0.440, weak backing). The README shows the canonical loop a CI harness would script: launch a detached, self-removing VM from an image such as quay.io/fedora/fedora-bootc:42, then connect over SSH with bcvk ephemeral ssh, optionally arranging for the VM to terminate automatically when the SSH client exits (GitHub bcvk README, https://github.com/bootc-dev/bcvk/blob/main/README.md, weight 0.732).

For an unlock test suite, the ephemeral path is the right one for regression coverage because every run starts from the image itself: no persistent state can mask an enrollment or unlock failure.

## Disk images and install-to-disk legs

For tests that must exercise a real boot from disk rather than a virtiofs root, bcvk calls bootc install to-disk to create a bootable disk image, then manages the VM lifecycle (bootc.dev blog, https://bootc.dev/blog/2026-may-07-sealed-images-deploying/, weight 0.706). The disk image creation subsystem uses ephemeral VMs to execute bootc install to-disk commands and implements caching to avoid redundant installations (DeepWiki, https://deepwiki.com/bootc-dev/bcvk/5-disk-image-creation, weight 0.313, weak backing). This is the path that hardware-in-the-loop legs mirror: install to disk first, then boot the disk.

## Pinning the harness

A CI pipeline that gates releases on a VM harness needs the harness itself to be a fixed quantity. The established practice in the bootc ecosystem is to pin tool versions and digest-pinned images; the snosi build tool notes that native A/B Secure Boot validation and the established bootc install and test workflow remain unaffected by its own changes, implying the test workflow is treated as a stable contract (GitHub frostyard/snosi, https://github.com/frostyard/snosi, weight 0.592). For bcvk the equivalent discipline is pinning a specific immutable release rather than tracking main, so a CI failure is attributable to the image under test rather than to a moving harness. The project architecture documentation describes the ephemeral system as a multi-stage execution model combining containers, namespaces, and QEMU virtualization (DeepWiki, https://deepwiki.com/bootc-dev/bcvk/3.1-ephemeral-vm-architecture, weight 0.167, weak backing), which is the stack a pin must cover: podman, QEMU, and bcvk itself.

## What a harness leg asserts

Mapping bcvk onto an unlock test design: the ephemeral leg provides a stateless guest for enrollment and software-token flows, where a failed run discards the VM; the disk-image leg provides the realistic boot path where crypttab and the initramfs must be correct in the image; and SSH from the harness provides the evidence channel for asserting the guest reached multi-user state after an unlock. The strongest sources for this subtopic are the Red Hat documentation chapter, the project README, and the bootc.dev blog; the man page and architecture writeups are secondary and weakly weighted, consistent with a young tool whose canonical documentation is still the source repository.
