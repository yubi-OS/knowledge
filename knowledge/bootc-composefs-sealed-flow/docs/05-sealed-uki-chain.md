# 05 - sealed UKI chain

Scope: the sealed UKI boot chain: UKI assembly with ukify, signing the whole artifact, placement in /boot/EFI/Linux, and how a signed UKI command line anchors the composefs digest so the boot path itself is authenticated.

## What a UKI is

A Unified Kernel Image is a single PE-format EFI binary that bundles the kernel, initrd, kernel command line, OS release metadata, and an optional splash into one file that UEFI can execute directly and Secure Boot can sign as a whole (weight 0.67, [Boot signed Linux with no bootloader config](https://botmonster.com/self-hosting/unified-kernel-images-systemd-boot-signed-linux/)). ArchWiki defines it the same way: the combination of a UEFI boot stub program like systemd-stub, a Linux kernel image, an initramfs, and further resources in a single UEFI PE executable that firmware can boot directly or a boot loader can source with little or no configuration (weight 0.81, [ArchWiki, Unified kernel image](https://wiki.archlinux.org/title/Unified_kernel_image)).

ukify is the assembly tool. Its primary purpose is to combine components, usually a kernel, an initrd, and the systemd-stub UEFI stub, to create a Unified Kernel Image: a single PE binary that boots the system. When the UKI executes, the stub extracts and boots the embedded Linux kernel, and the UKI can be started directly by the firmware or through a boot loader (weight 0.67, [ukify, freedesktop.org](https://www.freedesktop.org/software/systemd/man/ukify.html)). The man page records the same contract: combine components into a signed Unified Kernel Image for UEFI systems (weight 0.67, [ukify(1), man7](https://man7.org/linux/man-pages/man1/ukify.1.html)).

## Why bundling is the security property

The UKI's security value comes from what the signature covers. A traditional boot assembles mutable pieces from several filesystem locations: a raw kernel, a raw initramfs, and a bootloader configuration file carrying the kernel command line. Each piece is independently mutable, so a signature over one piece does not cover the others. A UKI puts all of them inside one PE binary, and UEFI Secure Boot verifies that binary as a whole before it runs (weight 0.67, [Botmonster, UKI writeup](https://botmonster.com/self-hosting/unified-kernel-images-systemd-boot-signed-linux/)).

This is what upgrades the composefs digest from doc 04's unsealed state. When the `composefs=<digest>` argument travels inside the signed UKI command line, substituting a different digest means producing a different binary, which fails signature verification. The kernel command line stops being attacker-writable configuration and becomes part of the measured artifact.

## Placement and boot path

A signed `.efi` UKI drops into the EFI system partition, where systemd-boot picks it up with no per-entry configuration to edit and no kernel parameters to wire up by hand (weight 0.67, [Botmonster, UKI writeup](https://botmonster.com/self-hosting/unified-kernel-images-systemd-boot-signed-linux/)). The yubiOS sealed-image layout places the signed UKI at `/boot/EFI/Linux/<kernel-version>.efi` in the final image, which is the conventional UKI directory UEFI boot managers scan.

The ArchWiki definition covers the no-configuration property from the loader side: a UKI can be booted directly by UEFI firmware or automatically sourced by boot loaders with little or no configuration (weight 0.81, [ArchWiki, Unified kernel image](https://wiki.archlinux.org/title/Unified_kernel_image)).

## The two signatures

Sealing the boot path for a composefs install requires signing more than the UKI. The firmware Secure Boot chain is separate from fs-verity enforcement, and both are required for a full production authenticity claim. In practice that means two signatures: the UKI itself, and the systemd-boot binary that firmware executes first when the UKI is not booted directly. The signing tooling supports this split: systemd's ukify gained a `systemd-sbsign` signtool backend for signing UKIs in the Secure Boot style (weak backing, weight 0.13, [mylinux.work Secure Boot and UKI guide](https://mylinux.work/guides/secure-boot-uki/)); the stronger public evidence for the tooling split is the ukify man page contract, which documents ukify as producing a signed UKI (weight 0.67, [ukify, freedesktop.org](https://www.freedesktop.org/software/systemd/man/ukify.html)).

An unsigned UKI is not useless, but it is a strictly weaker claim. A centos-bootc composefs experiment documents the distinction directly: in its unsigned mode the UKI itself carries no Secure Boot signature, which only removes firmware verification of the UKI, while the root-filesystem fs-verity seal is still enforced (weak backing, weight 0.48, [rkollataj/centos-bootc-cfs](https://github.com/rkollataj/centos-bootc-cfs)). The converse is the trap doc 04 identifies: a signed UKI built with `--allow-missing-verity` is firmware-authenticated but still unsealed at the root-filesystem level (weight 0.90, [composefs backend](https://bootc.dev/bootc/experimental-composefs.html)). Both halves are needed.

## Regeneration coupling

Every rootfs content change changes the composefs digest, because the digest names the exact tree. The UKI therefore has to be regenerated and re-signed for every derived image; a stale signed UKI references a digest for a tree that no longer exists, and a fresh tree is referenced by nothing. This coupling is the operational cost of sealing: the build pipeline must treat UKI generation and signing as a per-image step, not a one-time artifact, and must inject signing material through a protected secret or external signing infrastructure rather than build-recipe inputs.

## What boot evidence looks like

A sealed boot is provable from the running system, not just from build artifacts: `bootc status --json` on a booted composefs deployment reports the active boot, which a promotion gate can require to show a UKI-based composefs boot with a strict 128-hex verity digest (weight 0.93, [bootc-dev/bootc](https://github.com/bootc-dev/bootc)). Combined with Secure Boot enabled in firmware and a negative tamper test (doc 09), this closes the loop from firmware to root filesystem.
