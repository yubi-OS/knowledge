# 03 Unified Kernel Images and the Boot Chain

Scope: how the 0pointer vision builds the boot trust chain: UKIs, systemd-boot version sorting, the usrhash kernel parameter, and measured boot into TPM PCRs.

## What a UKI is

A Unified Kernel Image is a single UEFI PE executable that bundles the kernel, initrd, kernel command line, and splash, per the UAPI Group specification: "A Unified Kernel Image (UKI) is a combination of an UEFI boot stub program, a Linux kernel image, an optional initrd, and further resources" (source: https://uapi-group.org/specifications/specs/unified_kernel_image/, jev 0.85). ArchWiki describes the practical effect: a UKI can be booted directly from UEFI firmware, or automatically sourced by boot loaders with little or no configuration (source: https://wiki.archlinux.org/title/Unified_kernel_image, jev 0.46, low weight). Bundling matters because the signed kernel command line travels inside the signed PE binary, which is what lets the boot chain carry integrity data like verity root hashes without an attacker rewriting them.

## systemd-boot and version sorting

In the vision's boot flow, systemd-boot picks the newest UKI by version sort, so booting the fresh A/B slot requires no explicit switching mechanism; the boot loader logic does it automatically (source: https://0pointer.net/blog/fitting-everything-together.html, jev 0.95). This is the mechanism that makes the self-updating goal work: install the new slot, reboot, and the boot loader sorts it first.

## usrhash and the verity root hash

The signed kernel command line carries the dm-verity root hash for the root filesystem via the usrhash= parameter, so the kernel learns the expected hash from a signature-protected source rather than an unsigned file (source: https://0pointer.net/blog/fitting-everything-together.html, jev 0.95). At boot, the systemd-veritysetup-generator translates kernel command line options configuring verity protected block devices into native systemd units early at boot (source: https://www.man7.org/linux/man-pages/man8/systemd-veritysetup-generator.8.html, jev 0.73). A dm-verity root setup consists of the root filesystem image or partition, the verity hash tree, the root hash, and the systemd-veritysetup integration that verifies the tree at activation (source: https://wiki.archlinux.org/title/Dm-verity, jev 0.72).

## Measured boot into TPM PCRs

systemd's early boot components implement measured boot on UEFI: the systemd-boot boot manager and the UKI with the systemd-stub record cryptographic hashes of boot components into TPM PCRs, enabling boot integrity attestation (source: https://deepwiki.com/systemd/systemd/4.1-early-boot-uefi-and-measured-boot, jev 0.66, secondary source). PCR 11 is used to track dm-verity integrity data measured by systemd-stub (source: https://deepwiki.com/systemd/systemd/4.1-early-boot-uefi-and-measured-boot, jev 0.66, secondary source). A walkthrough account describes the pairing: the UKI .pcrsig section lets systemd-stub extend TPM2 PCRs predictably, so systemd-cryptenroll with --tpm2-pcrs=11 can bind a LUKS unlock key to the specific measured kernel (source: https://botmonster.com/self-hosting/unified-kernel-images-systemd-boot-signed-linux/, jev 0.26, low weight).

## Why the chain matters for image-based systems

The vision requires that all code be cryptographically validated before execution, from the boot loader through the kernel to OS images and services (source: https://0pointer.net/blog/fitting-everything-together.html, jev 0.95). The UKI design is what makes the middle of that chain enforceable: because the initrd and cmdline are inside the signed UKI, there is no unsigned initramfs for an attacker to swap. Poettering's later "Brave New Trusted Boot World" essay builds directly on this, assuming the reader is familiar with TPM 2.0 PCRs, measurements, and the SRK, boot loaders, the shim binary, Linux, and the initrd (source: https://0pointer.net/blog/brave-new-trusted-boot-world.html, jev 0.92; LWN coverage: https://lwn.net/Articles/912370/, jev 0.50, which names the UKI as central to the proposed design).

## v261 addition: UKI addons

The v261 release added systemd-stub "addon" handling: a UKI can consume sidecar initrds, kernel command line overlays, and devicetree blobs via a new BLS "extra" Type 1 stanza, which is directly relevant to ARM64 firmware work where devicetrees live outside the UKI (source: https://github.com/systemd/systemd/releases/tag/v261, jev 0.86, per the parent source material). This extends the single-binary model with a signed-extension escape hatch instead of breaking it.
