# 02 - Ephemeral VMs

**Scope:** the ephemeral VM lifecycle that bcvk provides: running a bootc image as a short-lived unprivileged VM, SSH access, detached mode, port forwarding, and the fact that the VM disappears on stop.

## The lifecycle

The source doc gives the commands:

```bash
bcvk ephemeral run quay.io/fedora/fedora-bootc:42        # short-lived VM, unprivileged
bcvk ephemeral run --ssh-port 2222 dhi.io/yubi-OS/yubiOS:latest  # SSH port forwarding
bcvk ephemeral run --detach dhi.io/yubi-OS/yubiOS:latest         # background
bcvk ssh <vm-id>                                          # SSH into a running VM
```

And states the contract plainly: "The VM disappears on stop. No disk persistence. Fast iteration." All four behaviors are source-doc claims. The `--ssh-port 2222` flag is how the host reaches the guest without colliding with the host's own sshd, and `--detach` returns the shell while the VM keeps running.

## What happens under the hood

Upstream explains the mechanism: "Everything with bcvk ephemeral creates a podman container that reuses the host virtualization stack, making it simple to test bootc containers without requiring root privileges or dedicated VM infrastructure" (https://github.com/bootc-dev/bcvk, jev weight 0.83, high). The same repository describes the project as helping "launch ephemeral VMs from bootc containers, and also create disk images that can be imported into other virtualization frameworks" (https://github.com/bootc-dev/bcvk, jev weight 0.85, high).

Inside that podman container, issue 22 on the bcvk repository describes the runtime as "bootc container images as lightweight VMs using QEMU with virtiofs for the root filesystem" (https://github.com/bootc-dev/bcvk/issues/22, jev weight 0.86, high). Virtiofs is what lets the container's rootfs appear inside the guest without a disk copy, which is why ephemeral VMs start fast and leave nothing behind.

## The production-likeness caveat

The single most important caveat for using ephemeral VMs as a test harness comes from the project's own issue tracker. Issue 22 states: "This is incredibly useful for testing and development, but the current implementation differs from how bootc actually runs in production in ways that can mask real issues or cause false failures" (https://github.com/bootc-dev/bcvk/issues/22, jev weight 0.86, high). The issue is titled "Make `ephemeral` more production-like" (https://github.com/bootc-dev/bcvk/issues/22, jev weight 0.86, high).

Practical reading for yubiOS: ephemeral VMs are the fast inner loop (does it boot, does systemd come up, does the FIDO2 test pass), but anything that depends on real disk layout, real firmware, or real TPM PCR state must go through to-disk, native-to-disk, or hardware. The source doc's own LUKS + TPM gotcha (doc 08) is exactly this boundary.

## Red Hat's framing of the loop

Red Hat's RHEL 10 documentation dedicates a chapter to testing and deploying bootable containers with bcvk and frames the tool as bridging "the gap between container development and hardware deployment. With the bcvk tool, you can launch ephemeral virtual machines (VMs) from bootc containers to test bootable images locally or generate disk images for production frameworks" (https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/using_image_mode_for_rhel_to_build_deploy_and_manage_operating_systems/managing-image-updates-with-the-bootc-virtualization-kit-bcvk, jev weight 0.77, high). The ephemeral mode is the testing half of that bridge.

bootc itself ships upgrade mechanics inside the image: "boot and upgrade via container images", with standard OCI/Docker containers as transport for base operating system updates (https://github.com/bootc-dev/bootc, jev weight 0.67, high). An ephemeral VM therefore exercises the same upgrade path a deployed yubiOS box would use, which is what makes the short-lived loop a meaningful proxy.

## Weak-signal sources, labeled

Two results in the dig are low weight and are noted only as corroboration, not as evidence: a community man page mirror for `bcvk-ephemeral-run` (https://www.mankier.com/8/bcvk-ephemeral-run, jev weight 0.16, weak) and a third-party architecture write-up (https://deepwiki.com/bootc-dev/bcvk/3.1-ephemeral-vm-architecture, jev weight 0.18, weak). Neither contradicts the primary sources above; both were excluded from any load-bearing claim.

## yubiOS usage pattern

The source doc's examples operate on `dhi.io/yubi-OS/yubiOS:latest` with `--ssh-port 2222` for interactive access and `--detach` plus `bcvk ssh <vm-id>` for the scripted path. The CI example (doc 09) shows the timeout-guarded variant, `bcvk ephemeral run --timeout 60 ./mkosi.output/yubiOS`, which is the shape used when the boot test must fail fast rather than hang a job.
