# 05 - Verification gates

**Scope.** Post-bump verification gates: boot the built artifact, verify the UKI signs and boots, and gate the tools-tree change on image-level tests rather than tool-level smoke tests.

## What has to actually work

The gate that a tools-tree bump must pass, per the yubiOS plan: rebuild a candidate image with the new tools tree and run the existing image gates, meaning boot the artifact and verify the UKI signs and boots (yubiOS refs plan doc, source of this corpus).

## Why the UKI is the right gate object

A unified kernel image (UKI) is a single executable which can be booted directly from UEFI firmware, or automatically sourced by boot loaders with little or no configuration. It is the combination of a UEFI boot stub program like systemd-stub, a Linux kernel image, an initramfs, and further resources in a single UEFI PE executable ([wiki.archlinux.org/title/Unified_kernel_image](https://wiki.archlinux.org/title/Unified_kernel_image), jev weight 0.59, authoritative).

The second authoritative description adds the signing property: a Unified Kernel Image is a single PE-format EFI binary that bundles the kernel, initrd, kernel command line, OS release metadata, and an optional splash into one file that UEFI can execute directly and Secure Boot can sign as a whole ([botmonster.com/self-hosting/unified-kernel-images-systemd-boot-signed-linux/](https://botmonster.com/self-hosting/unified-kernel-images-systemd-boot-signed-linux/), jev weight 0.58, authoritative).

"Signs as a whole" is what makes the UKI a good gate for a tools-tree change: the tools tree contains the tooling that builds and signs the image, so a tools-tree bump can break signing or booting in ways that only show up on the artifact. A weak-source description of the same support surface: mkosi supports Unified Kernel Images, a self-contained bootable format that combines the kernel, initrd, and boot parameters into a single EFI executable ([deepwiki.com/systemd/mkosi/5.2-unified-kernel-images-(uki)](https://deepwiki.com/systemd/mkosi/5.2-unified-kernel-images-(uki)), jev weight 0.30, weak source).

## Sign the artifact, verify the artifact

The general signing principle behind the gate: a tag alone proves nothing, tags are mutable pointers, and signing and verification fix this with cryptography, an image is signed by its builder, and every consumer, CI or the production runtime, verifies the signature before trusting it ([allencharp.github.io/2026/08/11/Container-Image-Signing.html](https://allencharp.github.io/2026/08/11/Container-Image-Signing.html), jev weight 0.29, weak source). A weak-source how-to frames the UKI benefit identically: firmware or a boot manager executes one signed artifact instead of assembling mutable pieces from several file-system locations ([danielcosenza.com/posts/lx-howto-unified-kernel-image/](https://danielcosenza.com/posts/lx-howto-unified-kernel-image/), jev weight 0.41, weak source).

## Gate at the image level, not the tool level

The reason the plan points at boot and UKI verification rather than tool smoke tests is scope of effect. The tools tree provides the package managers, compilers, and other build utilities used to build the main image ([deepwiki.com/systemd/mkosi/3.5-tools-trees](https://deepwiki.com/systemd/mkosi/3.5-tools-trees), jev weight 0.74, authoritative). A new compiler or signing tool version inside the tools tree changes the artifact, not just the build. Therefore the artifact is the thing to test: the yubiOS plan routes the candidate image through the same gates used for base-image changes, which boot the artifact and verify the UKI (yubiOS refs plan doc).

CI quality-gate practice supports the shape: build verification and quality gates in CI pipelines are configured with policy thresholds and compliance-ready automation ([khimananda.com/blog/build-verification-and-quality-gates-in-ci](https://khimananda.com/blog/build-verification-and-quality-gates-in-ci), jev weight 0.16, weak source).

## Bottom line

The gate set for a tools-tree refresh is: rebuild the candidate with the new tool tree, boot it, verify the UKI signs and boots. Anything less is a tool-level smoke test that can pass while the produced image has changed in a way nobody verified.
