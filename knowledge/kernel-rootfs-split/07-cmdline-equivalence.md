# 07 - Cmdline equivalence

Scope: the kernel command line contract that makes the mkosi-built UKI and bootc's auto-generated UKI runtime-equivalent: the dissect-style kargs, the composefs boot path, and how the cmdline and signature are verified.

## Why cmdline parity is the acceptance test

A kernel artifact is only interchangeable with another kernel artifact if it boots the rootfs identically. On Fedora/CentOS bootc the rootfs is verified by composefs by default (https://docs.fedoraproject.org/en-US/bootc/filesystem/, jev 0.95), and the boot path is explicit about where the command line enters: the bootc-root-setup.service mounts the composefs image specified in the kernel command line, sets up /etc and /var from the deployment state, and prepares the root filesystem for switch-root (https://bootc-dev.github.io/bootc//man/bootc-root-setup.service.5.html, jev 0.78). If two UKIs carry different cmdline, they select different rootfs mounts, so parity of the cmdline PE section is the real equivalence criterion, not version numbers.

## The dissect-style kargs

The yubiOS research note behind ADR-032 records the fix: `usr/lib/bootc/install/50-yubiOS.toml` gains `[install] kargs = ["root=dissect", "mount.usr=dissect", "rw", "audit=0"]` so that bootc's auto-generated UKI matches the mkosi cmdline at install time (source note: https://github.com/yubi-OS/yubiOS/blob/main/refs/kernel-rootfs-split-2026-07-29.md, unweighted). The dissect-style arguments address partitions by the Discoverable Partitions Specification rather than by device path, which is what lets the same cmdline work across both build paths (the DPS contract is covered in doc 04; its GPT-UUID discovery model is documented at https://uapi-group.org/specifications/specs/discoverable_partitions_specification/, jev 0.77).

Where the kargs land is a documented bootc mechanism: kargs.d files included in a container build are applied after installation, the difference between kernel argument sets is applied to the current boot loader configuration, and machine-local kernel arguments are preserved; /boot/loader/entries is a standardized format any tool can edit (https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/using_image_mode_for_rhel_to_build_deploy_and_manage_operating_systems/managing-kernel-arguments-in-bootc-systems, jev 0.89).

## Where the cmdline physically lives

In a UKI the command line is a PE section inside the signed binary. ukify, the tool that assembles UKIs, exposes `Cmdline=` / `--cmdline=` among its sections alongside Microcode, OSRelease, DeviceTree, PCRPKey, and others, and can assemble a PE binary from these components (https://www.man7.org/linux//man-pages/man1/ukify.1.html, jev 0.79). Because the cmdline is inside the PE, it is covered by the UKI's signature, which is why changing kargs normally means regenerating and re-signing the UKI. The user-provided-kargs path added in bootc v1.16.4 (PR #2305, per the source note) exists to let BLS entries written by the composefs flow carry runtime command line tweaks without regenerating the UKI (https://github.com/bootc-dev/bootc/releases, jev 0.69).

## Verifying the result

The research note specifies two verification gates after merge (source note, unweighted):

1. Cmdline equivalence: `bootc install to-disk` against a _yubios-base-derived image with the updated 50-yubiOS.toml must produce a UKI whose `.cmdline` PE section contains `root=dissect mount.usr=dissect rw audit=0`, verifiable with `objdump -s -j .cmdline`. This check is what proves the two build paths produce a runtime-equivalent kernel.
2. Signature chain integrity: `sbverify --cert yubios.efi_ci-secure-boot-cert.pem yubios.efi` on a SoftHSM-built CI image must return `Signature verification OK`, confirming the PKCS#11 signing path is intact end to end.

The SB verification context is standard: Secure Boot maintains a cryptographically signed list of binaries authorized or forbidden to run at boot, protecting the pre-boot process (https://wiki.archlinux.org/title/Unified_Extensible_Firmware_Interface/Secure_Boot, jev 0.81). A UKI whose cmdline section is inside the signed PE therefore gets its boot arguments covered by the same signature check.

## The Phase 2 follow-on

The note's follow-up PR (Phase 2) wires install-uki.sh and proves that `bootc container ukify --rootfs /target --kernel-dir ... -- --output /out/yubios.efi --signtool systemd-sbsign ...` works inside the fedora-bootc:45 buildroot without an extra pkcs11-provider/softhsm2 packaging step (source note, unweighted). That matters because ukify is the cmdline authority on the bootc side: the same tool that assembles the PE section must be available in the buildroot where bootc's UKI gets built, or the two paths drift again. The UKI format itself is stable ground for this work: a single executable combining boot stub, kernel, initramfs, and resources, bootable directly from UEFI firmware or sourced by loaders with little configuration (https://wiki.archlinux.org/title/Unified_kernel_image, jev 0.79).
