# 08 - A/B update kernel separability

Scope: what the A/B update model requires from a separable kernel: the 4-artifact update shape, how ostree-family systems place kernel and initramfs in boot entries and slot partitions, and where systemd-sysupdate fits.

## The 4-artifact update shape

The yubiOS research note behind ADR-032 records that ADR-013 already models A/B updates as 4 separate artifacts: a new /usr partition, verity data, a PKCS#7 signature, and a new UKI in the ESP (source note: https://github.com/yubi-OS/yubiOS/blob/main/refs/kernel-rootfs-split-2026-07-29.md, unweighted in this dig). The structural claim is that the kernel is separable from the rootfs in the update model even before any build-pipeline work: three of the four artifacts are rootfs-side and one, the UKI, is kernel-side. Once the UKI is published as its own OCI artifact (the Phase 1 work), the update pipeline can pull and verify the kernel half without touching the rootfs half.

The corollary the note draws for Phase 2 option B: A/B updates via systemd-sysupdate would need to call the same first-boot-style unit that installs the prebuilt UKI, because an update that ships a new UKI must place it in the ESP, not just on disk (source note, unweighted).

## How the ostree family handles boot entries

The ostree lineage that bootc descends from gives concrete precedent for kernel-side artifacts living outside the rootfs digest. In image mode for RHEL, the boot menu entry references an OSTree deployment, which consists of a Linux kernel, an initramfs, and a hash linking to an OSTree commit, passed via the ostree= kernel argument (https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/using_image_mode_for_rhel_to_build_deploy_and_manage_operating_systems/managing-file-systems-in-image-mode-for-rhel, jev 0.85). The deployment is therefore a triple: kernel files, initramfs, and a rootfs commit hash, stitched by one command line argument. That is precisely the seam the UKI model formalizes: kernel+initramfs inside a signed PE, rootfs commit referenced by cmdline.

Atomic upgrade behavior backs this up: modern OSTree keeps /boot as a read-only mount by default and automatically remounts it read-write only for the portion of time necessary to update the bootloader configuration (https://ostreedev.github.io/ostree/atomic-upgrades/, jev 0.90). Boot entry mutation is thus a narrow, controlled window in the update flow, which is the same property an install-time UKI intake needs to preserve.

The bootloader-facing side is documented in the ostree bootloaders doc: various bootloaders read /boot/loader/entries as metadata, and the Android bootloader packages kernel+initramfs+cmdline+dtb into a signed binary blob called an Android Boot Image, written to either partition boot_a or boot_b depending on which slot is active (https://github.com/ostreedev/ostree/blob/main/docs/bootloaders.md, jev 0.94). The Android Boot Image is effectively a slot-partitioned UKI: kernel and command line sealed together in one signed blob, A/B swapped at the partition level. It is the strongest precedent that a separable kernel artifact and A/B slot updates compose naturally.

## bootc and rpm-ostree share the bones

It is supported to install and use rpm-ostree on a Fedora/CentOS bootc system, because the bootc and rpm-ostree projects share significant underlying code (https://docs.fedoraproject.org/en-US/bootc/rpm-ostree/, jev 0.90). The deployment-menu model above therefore carries into the bootc world, even as bootc repositions ostree as an implementation detail behind a container-native interface (https://bootc.dev/bootc/filesystem.html, jev 0.80).

## Slot A/B outside the ostree world

A/B partition management is not ostree-specific. ParticleOS manages atomic system updates with automatic rollback through A/B partition management (https://deepwiki.com/systemd/particleos/8.3-ab-partition-management, jev 0.49, weak backing). An appliance-oriented implementation documents the lifecycle plainly: after an update, system partition B contains version 2; after booting version 2 from partition B, partition A can be removed, though successive updates can reuse the old partition (https://github.com/applicative-systems/nixos-appliance-ota-update, jev 0.50, weak backing). The reuse point matters for a kernel artifact pipeline: a stale UKI in an inactive slot is harmless, because the next update overwrites it.

## What the split changes for updates

With the UKI published as a separate OCI artifact, the update model gains an ordering freedom it lacked: the kernel-side and rootfs-side artifacts can be staged, verified, and applied on independent cadences, and the runtime equivalence between them is pinned by the cmdline contract (doc 07) rather than by shipping them inside one image digest. The bootloader integration stays conservative: BLS entries remain the shared vocabulary, with the spec's file formats and naming conventions letting entries be shared between operating systems and boot loaders on one device (https://uapi-group.org/specifications/specs/boot_loader_specification/, jev 0.89), and systemd loaders advertising UKI support through the uki-url capability bit (https://systemd.io/BOOT_LOADER_INTERFACE/, jev 0.86).

The open question that remains for yubiOS is exactly the Phase 2 question in doc 06: which mechanism places the prebuilt UKI into the ESP, and whether A/B updates invoke it. The artifact-side work (Phase 1) removes the packaging blocker; the lifecycle-side work (Phase 2) is where the update story is decided.
