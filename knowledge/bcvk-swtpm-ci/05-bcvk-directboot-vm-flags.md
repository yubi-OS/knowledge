# 05 bcvk ephemeral VMs, DirectBoot, and the fork flags

Scope: how bcvk runs bootc images as ephemeral VMs, why the DirectBoot path shapes the swtpm integration, and how the yubiOS fork's --swtpm and --swu2f flags are pinned.

## bcvk's execution model

bcvk is the bootc virtualization kit. "Everything with bcvk ephemeral creates a podman container that reuses the host virtualization stack, making it simple to test bootc containers without requiring root privileges or dedicated VM infrastructure" [1] (weight 0.842). The README shows the canonical workflow: "bcvk ephemeral run -d --rm -K --name mytestvm quay.io/fedora/fedora-bootc:42 bcvk ephemeral ssh mytestvm", with the VM automatically terminating when the SSH client exits [2] (weight 0.939).

Red Hat's documentation frames the same tool from the platform side: "the bootc virtualization kit (bcvk) bridges the gap between container development and hardware deployment. With the bcvk tool, you can launch ephemeral virtual machines (VMs) from bootc containers to test bootable images locally or generate disk images" [3] (weight 0.933).

Under the hood this is a multi-stage execution model "combining containers, namespaces, and Q"EMU [4] (weight 0.752). That unprivileged, container-reusing architecture is the reason swtpm works in CI at all: the host-side swtpm process and the QEMU instance both live inside the same ephemeral podman container the test run creates (docs 02 and 08).

## DirectBoot and what it bypasses

bcvk's DirectBoot path extracts the kernel and initrd from the image's UKI and boots them directly, bypassing the normal firmware boot stack (yubiOS ref premise). The QEMU mechanism it leans on is Direct Linux Boot: "This section explains how to launch a Linux kernel inside QEMU without having to make a full bootable image. It is very useful for fast Linux kernel testing. The syntax is: qemu-system-x86_64 -kernel bzImage -drive file=rootdisk.img -append ..." [5] (weights 0.588, 0.923, 0.665, 0.624 across four mirrors).

The consequence for TPM testing is the one that redirected the yubiOS integration: with no guest firmware in the boot path, nothing issues TPM_Startup for the vTPM, and guest-side TPM services that assume a firmware-provisioned TPM do not see the state they expect (see doc 02 on the TPM_Startup requirement [6] and doc 04 on the guest-side service that was set aside). The reliable route is host-side QEMU vTPM attachment (yubiOS ref premise).

## The fork flags and the pin

The yubiOS fork of bcvk exposes two flags upstream does not ship: --swtpm (attach a host-side software TPM to the ephemeral VM) and --swu2f (the companion lane for the software FIDO2 token experiments) (yubiOS ref premise). This is confirmed drift-safe as of the 2026-07-23 cross-check: upstream bootc-dev/bcvk was at v0.18.0 (2026-07-02) with no native USB-passthrough or swtpm-flag features documented upstream (yubiOS ref premise).

The CI discipline that follows: CI consumes the immutable yubi-OS/bcvk release-descendant commit recorded in PINNED.md, never upstream main (yubiOS ref premise). Without that pin, a plain upstream bcvk upgrade silently drops the --swtpm and --swu2f surface and every TPM-backed CI lane stops working at once.

Upstream bootc itself is the substrate the images ride on: "This project aims to apply the same technique for bootable host systems - using standard OCI/Docker containers as a transport and" upgrade mechanism [7] (weight 0.659).

## The remaining hardware gap

The fork flags close the software side of the matrix. They do not close the hardware side: physical hardware remains required for final YubiKey passthrough confidence (yubiOS ref premise). The CI matrix therefore has two honest tiers: swtpm-backed VM lanes for TPM2/measured-boot code paths, and a smaller hardware leg for the FIDO2/passthrough flows that a vTPM cannot model. VM tests should assert TPM presence and measured-boot gates while staying honest about DirectBoot limitations (yubiOS ref premise).

## Sources

1. https://github.com/bootc-dev/bcvk (weight 0.842)
2. https://github.com/bootc-dev/bcvk/blob/main/README.md (weight 0.939)
3. https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/using_image_mode_for_rhel_to_build_deploy_and_manage_operating_systems/managing-image-updates-with-the-bootc-virtualization-kit-bcvk (weight 0.933)
4. https://deepwiki.com/bootc-dev/bcvk/3.1-ephemeral-vm-architecture (weight 0.752)
5. https://qemu.readthedocs.io/en/v9.0.4/system/linuxboot.html (weight 0.923; also 0.588, 0.665, 0.624)
6. https://www.qemu.org/docs/master/specs/tpm.html (weight 0.901)
7. https://github.com/bootc-dev/bootc (weight 0.659)
