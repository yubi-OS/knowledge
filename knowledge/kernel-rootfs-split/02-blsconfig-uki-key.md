# 02 - bootc BLSConfig uki key

Scope: the bootc v1.16.3 BLSConfig `uki` key (PR #2269): the EFIKey enum, which bootloaders get efi versus uki lines, the EFI/Linux/bootc directory choice, the BLS .conf naming scheme, and what v1.16.3 still cannot do.

## The specification the key implements

The Boot Loader Specification defines a set of file formats and naming conventions that let boot loader menu entries be shared between multiple operating systems and boot loaders on one device; operating systems cooperatively manage drop-in files in boot loader menu entry directories (https://uapi-group.org/specifications/specs/boot_loader_specification/, jev 0.89). A BLS entry carries its payload either as a `linux` line pointing at a kernel image, or as an `efi`/`uki` line pointing at a prebuilt EFI binary. systemd exposes loader capability bits for this: bit 1 << 17 marks a boot loader as supporting the `uki-url` field defined by the specification (https://systemd.io/BOOT_LOADER_INTERFACE/, jev 0.86).

systemd-boot expects the configuration files, kernel images, initrd images, and other EFI images to reside on the EFI system partition, and loads the entry the user selects (https://dragonwingdocs.qualcomm.com/Key-Documents/Yocto-Guide/configure-and-secure-boot-with-systemd-boot-and-uki, jev 0.77). BLS support is not a systemd-boot monoculture: U-Boot's BLS support boots OSes configured with BLS entries and is used by Fedora, RHEL, and Ubuntu via kernel-install (https://u-boot-concept.readthedocs.io/en/latest/usage/bls.html, jev 0.62). Any writer of BLS entries must therefore be conservative about which field names and directory layouts it emits, because more than one loader may read them.

## What v1.16.3 shipped

bootc v1.16.3 added the `uki` key in BLSConfig via PR #2269 (https://github.com/bootc-dev/bootc/releases, jev 0.73; PR detail from the yubiOS source note: https://github.com/yubi-OS/yubiOS/blob/main/refs/kernel-rootfs-split-2026-07-29.md). The implementation details, per the source note's reading of the diff:

1. `crates/lib/src/parsers/bls_config.rs` gains an `EFIKey` enum with `Efi(Utf8PathBuf)` and `Uki(Utf8PathBuf)` variants. The parser accepts both `efi ...` and `uki ...` lines, and the key cannot be mixed with `linux`.
2. An `EFIKey::for_bootloader` helper selects `Uki` when the bootloader is systemd-boot and systemd is version 258 or later, and `Efi` otherwise. GrubCC always emits `Efi` per issue #2268.
3. `crates/lib/src/bootc_composefs/boot.rs` defines `BOOTC_UKI_DIR: &str = "EFI/Linux/bootc"`, deliberately not the standard `/EFI/Linux/` directory that systemd-boot auto-discovers. The code comment says the goal is to control the ordering of UKIs, so bootc puts them in a directory outside the BLS-specified one.
4. The BLS `.conf` filename pattern is `bootc_<os_id>-<version>-<priority>.conf`, with hyphens in `os_id` replaced by underscores to satisfy grub's RPM-style filename parser.
5. `crates/lib/src/bootloader.rs` caches a `bootctl_systemd_version()` probe in a `OnceLock<u32>` to decide which BLS variant to write.

The directory choice is the most opinionated piece. By moving UKIs out of the auto-discovered directory, bootc keeps control of entry ordering instead of letting the loader enumerate a shared namespace. The cost is that the `uki` key in the generated entry must point into that private directory, which is exactly what the key exists to express.

## The signing and measurement context

A UKI referenced by a BLS entry is a single signed PE binary, so Secure Boot verification applies to the whole bundle rather than to separate kernel and initramfs files. Secure Boot is the UEFI standard feature that maintains a cryptographically signed list of binaries authorized or forbidden to run at boot, adding a layer of protection to the pre-boot process (https://wiki.archlinux.org/title/Unified_Extensible_Firmware_Interface/Secure_Boot, jev 0.81). This is why a prebuilt, signed UKI artifact is attractive for yubiOS: the signature travels with the artifact, and the BLS entry only has to name it.

## What v1.16.3 does not do

Two gaps matter for yubiOS (source note, unweighted):

1. No project-authored BLSConfig drop-in intake. bootc writes the BLS `.conf` itself at install time; there is no `/usr/lib/bootc/install/loader-entries/*.conf` mirror of the existing secureboot-keys flow (`/usr/lib/bootc/install/secureboot-keys`). A yubiOS drop-in would need either an image-build-time FinalizeScript or a bootc-side patch mirroring the secureboot-keys flow. A first-boot systemd unit that copies the UKI and writes the entry is also viable, but it runs after boot rather than at install time in the bootc sense.
2. No `bootc container split-kernel-and-rootfs` subcommand. That command lands in v1.16.4. v1.16.3 has `bootc container ukify`, which generates a UKI from the OCI image's kernel and initrd, but the split command that keeps `/kernel` outside the digested final rootfs is v1.16.4 and later.

The practical consequence, drawn directly in the source note: a prebuilt UKI artifact published by yubiOS is parallel to the bootc install-time UKI, not a replacement for it, until one of these intake paths lands.
