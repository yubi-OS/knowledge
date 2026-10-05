# UKI anatomy and signing: what the sealed lane builds and signs

Scope: Unified Kernel Image structure (PE sections), building UKIs with ukify and mkosi, and signing them for Secure Boot with PKCS#11 URIs against a SoftHSM-emulated PIV slot 9c.

## What a UKI is

A unified kernel image (UKI) is a single executable which can be booted directly from UEFI firmware, or sourced by boot loaders with little or no configuration. It is the combination of a UEFI boot stub program such as systemd-stub, a Linux kernel image, an initramfs, and further resources in a single UEFI PE binary (weight 0.86, https://wiki.archlinux.org/title/Unified_kernel_image). ukify is the tool whose primary purpose is to combine these components, usually a kernel, an initrd, and the systemd-stub UEFI stub, to create a Unified Kernel Image: a single PE binary that boots the system, with the stub extracting and booting the embedded kernel at execution time (weight 0.888, https://www.freedesktop.org/software/systemd/man/ukify.html). The Debian man page describes the same contract: ukify combines a kernel, an initrd, and a UEFI boot stub into a PE binary executable by the firmware to start the embedded kernel (weight 0.668, https://manpages.debian.org/man/ukify).

A command-library man page summary adds the operational framing: ukify combines a kernel, an initrd, a kernel command line, the systemd-stub UEFI boot stub, and other resources into one PE/COFF EFI executable that the firmware can boot directly or systemd-boot can list, removing the need for separate boot loader configuration for the kernel and initrd (weight 0.213, weak backing, https://linuxcommandlibrary.com/man/ukify).

## Building UKIs with mkosi

mkosi supports a wide range of output formats: raw GPT disk image, plain directory, tar, cpio, and UKI. It can build bootable Unified Kernel Images, including UKIs signed for Secure Boot (weight 0.549, https://wiki.archlinux.org/title/Mkosi). This is the property the sealed UKI VM test lane relies on: the lane builds the UKI straight from the yubiOS OCI image with `mkosi --profile yubiOS --output-format uki build` rather than assembling the UKI by hand (source doc: yubi-OS/yubiOS refs/sealed-uki-vm-test-2026-07-30.md).

mkosi's own documentation covers UKI creation as an output format, the structure of UKI files, and companion tools mkosi-initrd and mkosi-addon that simplify UKI generation (weight 0.195, weak backing, https://deepwiki.com/systemd/mkosi/5.2-unified-kernel-images-(uki)). For signing, mkosi handles the complete Secure Boot signing workflow, from development environments with local key pairs to production builds with hardware security modules or remote signing services (weight 0.295, weak backing, https://deepwiki.com/systemd/mkosi/5.5-secure-boot-and-signing). Both DeepWiki figures are secondary documentation of the mkosi repository, so treat them as weak backing and confirm against the mkosi man page when implementing.

## Signing with a PKCS#11 key URI

The yubiOS sealed lane does not hold a real YubiKey in CI. It initializes a SoftHSM token labeled `yubiOS-ci` and generates an EC P-256 key labeled `sb-key` inside it, then points mkosi at the key through a PKCS#11 URI of the form `SecureBootKey=pkcs11:token=yubiOS-ci;object=sb-key;type=private` (source doc: yubi-OS/yubiOS refs/sealed-uki-vm-test-2026-07-30.md). The yubiOS mkosi-image-builder skill documents this path: mkosi wraps distro package managers to produce disk images, UKIs, OCI containers, sysexts, and initrds, with Secure Boot signing, dm-verity, and bootloader support baked in, and covers configuring PIV/PKCS11 UKI signing (weight 0.351, weak backing, https://skillsmp.com/creators/yubi-os/yubios/skills-mkosi-image-builder; the underlying skill file at https://github.com/yubi-OS/yubiOS/blob/main/skills/mkosi-image-builder/SKILL.md scored 0.269, weak backing).

## Why this matters for the lane

The lane's first job is to prove that the signed-UKI primitive works at all before any install-time wiring exists. The assertion inventory for this stage is: the UKI builds, `sbverify --cert` validates the signature against the signing certificate, `systemd-ukify verify` accepts the image, and the `.cmdline` payload contains the expected `roothash=` entry (source doc: yubi-OS/yubiOS refs/sealed-uki-vm-test-2026-07-30.md). Verification tooling details are covered in the systemd-sbsign doc; the key structural point here is that a UKI is one signed PE artifact, so a single signature covers stub, kernel, initrd, and command line, which is exactly the property that makes the tampered-UKI negative test in the lane decisive.

## Gaps

The dig did not surface a primary-source enumeration of the UKI PE section names (.osrel, .cmdline, .linux, .initrd) with their load order; the section-level anatomy claim rests on the ArchWiki and ukify man page summaries above. Implementers should read the systemd-stub and ukify man pages directly when wiring section-specific assertions.
