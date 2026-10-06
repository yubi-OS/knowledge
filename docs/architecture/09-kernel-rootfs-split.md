# 09. Kernel plus rootfs split (ADR-032)

Scope: the ADR-032 decision to publish the signed kernel as a separate OCI artifact, its motivations, and the Phase 1 and Phase 2 implementation cut.

Grounding spine: source doc `yubi-OS/yubiOS docs/ARCHITECTURE.md`.

## The decision

yubiOS adopts the kernel plus rootfs split as a first-class principle in ADR-032 (source doc). The kernel, as a signed UKI, is published as a separate OCI artifact at docker.io/0mniteck/yubios:uki-<sha>-<arch>, alongside the bootc OS image (latest and <sha> tags) which carries the rootfs (source doc).

The split is grounded in three pre-existing ADRs (006, 013, 022) and motivated by three things (source doc):

1. A and B update granularity: only the rootfs or only the kernel moves per update.
2. Sharper reproducibility: each artifact is independently pinable and attestable.
3. The bootc composefs fs-verity chain's path to a sealed anchor: the BLS digest anchor must stay stable across rootfs-only changes.

That third motivation is the subtle one. In the sealed bootc target the UKI carries the composefs digest of the rootfs. If the kernel image were bundled inside the same artifact stream as the rootfs, a rootfs-only change would still need a new kernel artifact. Splitting them lets the digest anchor discipline stay clean: whichever side changes gets a new artifact, and the other side keeps its identity.

## What the split means concretely

A unified kernel image is a single PE executable that can be booted directly from UEFI firmware or sourced by boot loaders with little or no configuration, combining kernel, initrd, command line, and related payload sections (https://wiki.archlinux.org/title/Unified_kernel_image, jev weight 0.42 and 0.47, weak backing). yubiOS's UKIs additionally carry .pcrsig and .pcrpkey for PCR binding, per the source doc boot-flow record (source doc).

bootc ships the split machinery yubiOS uses: bootc container split-kernel-and-rootfs splits the kernel and rootfs from a container image, and bootc container ukify builds a UKI using ukify with arguments computed from the container image (kernel, initrd, cmdline, os-release), passing any additional arguments after -- through to ukify (https://bootc.dev/bootc/man/bootc-container.8.html, jev weight 0.38, weak backing; the same command text appears in the in-repo man page at https://github.com/bootc-dev/bootc/blob/main/docs/src/man/bootc-container-ukify.8.md, jev weight 0.28, weak backing, and on ManKier at https://www.mankier.com/8/bootc-container-ukify, jev weight 0.22, weak backing).

The mkosi path produces the signed UKI as a side artifact of mkosi build via --secure-boot-sign-tool systemd-sbsign (ADR-008), anchored to the YubiKey PIV slot 9c through PKCS#11 with the provider:pkcs11 syntax (source doc).

## Phase 1: what landed

The bootc install configuration usr/lib/bootc/install/50-yubiOS.toml now sets [install] kargs so bootc's auto-generated UKI uses the yubiOS standard command line (root=dissect mount.usr=dissect rw audit=0), matching the mkosi path per ADR-006's principle that both paths behave identically at runtime (source doc).

Phase 1 also established the dual publication: the bootc OS image and the uki-<sha>-<arch> kernel artifact are separate tags in the same repository (source doc).

## Phase 2: what is staged

The install-time BLSConfig wiring to use a pre-built UKI (the v1.16.3 uki key, per upstream bootc PR https://github.com/bootc-dev/bootc/pull/2269) is staged as Phase 2 because bootc 1.16.3 has no project-authored BLSConfig drop-in intake (source doc). The usr/lib/yubiOS/uki/install-uki.sh script in the yubiOS repository documents the install-time copy path: write the UKI to /EFI/Linux/bootc/bootc_composefs-<digest>.efi and write a BLS .conf with the uki key, for the follow-up that wires it into either a bootc install hook or a first-boot systemd unit (source doc).

The relevant bootc release line is visible in the project's release history, which notes support for the uki key in BLSConfig among its features (https://github.com/bootc-dev/bootc/releases/, jev weight 0.26, weak backing). The composefs boot module inside bootc handles setting up boot entries for composefs deployments, including generating BLS entries and managing UKI files (https://bootc-dev.github.io/bootc/internals/bootc_lib/bootc_composefs/boot/index.html, jev weight 0.46, weak backing), which is the surface Phase 2 will integrate with. The BLS Type 1 entries that systemd-boot consumes live in /loader/entries/ on the ESP (https://dragonwingdocs.qualcomm.com/Key-Documents/Yocto-Guide/configure-and-secure-boot-with-systemd-boot-and-uki, jev weight 0.37, weak backing).

## Why A/B granularity motivated it

The sealed composefs flow requires the UKI to embed the rootfs digest, and every rootfs change produces a new digest (source doc). With the split, the update system can move the rootfs and regenerate only the UKI anchor, or move the kernel artifact alone for a kernel security fix, without disturbing the other side's publication identity. The bootc documentation frames the overall model as transactional, in-place OS updates using OCI images (https://docs.fedoraproject.org/en-US/bootc/, jev weight 0.42, weak backing), and the RHEL sealing documentation shows the digest-embedded-in-UKI flow the split serves (https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/using_image_mode_for_rhel_to_build_deploy_and_manage_operating_systems/cryptographic-sealing-of-bootc-images-technology-preview, jev weight 0.35, weak backing).

## Review checklist for the split

- Any change to the rootfs must trigger UKI regeneration and re-signing, since the embedded composefs digest changes (source doc).
- The standard command line must stay identical between the bootc-generated UKI and the mkosi path (ADR-006, source doc).
- The uki-<sha>-<arch> artifact must be independently pinable; run-specific digests are evidence, not evergreen requirements, per the PINNED.md rule (source doc).
- Phase 2 work touching BLSConfig intake should reference upstream PR 2269 and the install-uki.sh staging script rather than inventing a new wiring path (source doc).
