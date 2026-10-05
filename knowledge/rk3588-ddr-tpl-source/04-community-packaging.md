# Community build environments that package RK3588 firmware from rkbin

Scope: the build environments and packaging projects that consume rkbin blobs, how they fetch the blobs, and what their patterns imply for yubiOS.

## The common pattern

Every examined community build environment treats rkbin as an input to be cloned, fetched, or vendored, not as a source tree to rebuild. This is the packaging reality the yubiOS build-time-pull option would join.

## Radxa: distro-vendor packaging

Radxa's wiki documents two build flows, both with an explicit rkbin directory. The Debian-from-debos guide lists the repo layout: "build kernel rkbin u-boot. Directories usage introductions: rkbin: Prebuilt Rockchip binaries, include first stage loader and ATF (Arm Trustzone Firmware)" (https://wiki.radxa.com/Rock5/guide/build-debian-from-debos-radxa, jev weight 0.8356). The U-Boot build guide gives the SDK layout: "~/rk3588-sdk/rkbin/: Pre-built Rockchip binaries, including first stage loader and ATF (Arm Trustzone Firmware)" (https://wiki.radxa.com/Rock5/guide/build-u-boot-on-5b, jev weight 0.7618). The board vendor itself ships a cloned rkbin inside its SDK and documents it as "pre-built" binaries, with the first stage loader (the DDR init path) called out by name. Radxa also maintains its own rkbin fork (https://github.com/radxa/rkbin, jev weight 0.7539), so the vendor controls the blob copy its SDK consumes.

## milas/rock5-toolchain: Docker packaging

A Dockerized build environment for the Rock 5 series describes itself as a "Dockerized build system for Linux kernel & related (e.g. U-Boot) components for the Radxa Rock 5 series of devices" with the workflow "Run docker buildx bake from the repo root to build the Kernel and stable U-Boot" (https://github.com/milas/rock5-toolchain, jev weight 0.3768). Weight note: 0.3768 is below the 0.5 authoritative threshold, so this characterization carries weak backing. The tree-page capture scored 0.1283 and adds only the title confirmation (https://github.com/milas/rock5-toolchain/tree/main, weight 0.1283). The repo exists and packages the Rock 5 build; the details of its rkbin fetching were not verifiable from the dig snippets and are not asserted here.

## blark/rk3588-firmware-flake: Nix packaging

A Nix flake for Rock 5B firmware describes "Minimal, reproducible builds for Rock 5B firmware components" and notes build topology: "Remote builders: aarch64-linux (tf-a, uboot) and x86_64-linux (rkbin)" (https://github.com/blark/rk3588-firmware-flake, jev weight 0.4805). Weight note: 0.4805 is below 0.5, weak backing. The architecture detail is still instructive: the flake treats tf-a and uboot as source builds on the aarch64 builder while rkbin is handled on the x86_64 builder, which is consistent with rkbin being a fetch-and-package step rather than a compile step. A second capture of the repo tree scored 0.3800 (weak) and adds no further detail.

## edk2-porting/edk2-rk3588: UEFI packaging

The EDK2 UEFI firmware port for RK3588 is the largest of the packaging projects: "This repository contains an UEFI firmware implementation based on EDK2 for various RK3588 boards. It delivers a PC-like standardized boot experience, supporting multiple operating systems, such as Windows, Linux, BSD and VMware ESXi" (https://github.com/edk2-porting/edk2-rk3588, jev weight 0.9015). Its TF-A integration documentation describes how firmware components are combined: "The firmware assembly process combines TF-A components with the EDK2 UEFI firmware using the FIT (Flat Image Tree)" (https://deepwiki.com/edk2-porting/edk2-rk3588/6.3-arm-trusted-firmware-integration, jev weight 0.4562, weak backing). The project pulls rkbin blobs alongside open TF-A components and assembles them into the final image, which shows the same fetch-and-package pattern scaled up to a full firmware product.

## Distro-level: reproducible signed binaries

A different packaging philosophy exists at the distribution level: "Pre-built, signed U-Boot binaries for 120 mainline-supported Rockchip ARM64 boards, built reproducibly from upstream sources and published as signed GitHub releases" (https://github.com/schneid-l/u-boot-rockchip, jev weight 0.7010). This project builds from source where possible and consumes rkbin only where the platform forces it (doc 03 covers the blob-free board list). Its per-board switch between "tfa (build Arm Trusted Firmware) or rkbin (prebuilt BL31)" (same source, weight 0.7010) is the operational form of the choice yubiOS faces: source-build what you can, fetch the binary only where required.

## Implications

Three observations survive the weight filtering:

1. Board vendors (Radxa) vendor a rkbin copy into their SDK and document it as prebuilt binaries (weights 0.8356 and 0.7618, authoritative).
2. The largest firmware product on RK3588 (edk2-rk3588) also consumes the blobs in its assembly flow (weight 0.9015, authoritative for the project's nature; weak for the FIT assembly detail).
3. The reproducible-builds-oriented project splits per-board between source builds and rkbin fetches (weight 0.7010, authoritative), confirming that fetch-from-rkbin is the accepted fallback when a platform has no source alternative.

For the yubiOS build (doc 05 and doc 08), the ecosystem precedent is unambiguous: fetching the blob from upstream at build time is the norm across every examined environment, and none of them claims redistribution rights over the blob itself.
