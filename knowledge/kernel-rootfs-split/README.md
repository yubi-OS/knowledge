# kernel-rootfs-split

Knowledge corpus on the kernel and rootfs split for immutable OS images (yubiOS ADR-032): the research and design behind splitting the kernel (UKI) from the root filesystem, the surveyed alternatives, the upstream bootc sources, and the Phase 1 / Phase 2 cut.

Minted 2026-10-05 from yubi-OS/yubiOS refs/kernel-rootfs-split-2026-07-29.md.

## Docs

- 01-artifact-split-principle.md: Why kernel and rootfs should be independently addressable build artifacts in an immutable OS: monolithic OCI vs separated artifacts, the per-artifact tag scheme, and what ADR-006/013/022 already imply.
- 02-blsconfig-uki-key.md: bootc v1.16.3 BLSConfig uki key (PR #2269): EFIKey enum, efi vs uki lines, systemd-boot vs grub emission, EFI/Linux/bootc directory and BLS .conf naming.
- 03-bootc-v1164-kernel-split.md: bootc v1.16.4 and beyond: UKI Cleanup (PR #2200), user-provided kargs (PR #2305), and the split-kernel-and-rootfs subcommand that keeps /kernel outside the digested rootfs.
- 04-mkosi-split-artifacts.md: The mkosi path: DPS-partitioned disk image with embedded UKI, SplitArtifacts=uki,partitions, and extracting the signed UKI as a standalone artifact.
- 05-build-pipeline-seams.md: Where the split touches the yubiOS build: new yubios-uki bake target, Containerfile.uki FROM scratch pattern, CI extraction in ci_mkosi-installer.yml, and install config kargs in 50-yubiOS.toml.
- 06-install-time-wiring-options.md: Phase 2 install-time UKI wiring options: mirroring the bootc secureboot-keys loader-entries intake, a first-boot systemd unit, or bumping the base image to bootc v1.16.4+; tradeoffs and sequencing.
- 07-cmdline-equivalence.md: Kernel command line parity between the mkosi-built UKI and bootc's auto-generated UKI: root=dissect, mount.usr=dissect, composefs kargs, and verifying the .cmdline PE section.
- 08-ab-update-kernel-separability.md: A/B update model with a separable kernel: ADR-013's 4-artifact update (usr partition, verity data, PKCS#7 signature, UKI in ESP) and how systemd-sysupdate handles independent kernel artifacts.

## Research summary

- Results collected: 96 (2 searXNG queries per subtopic, top 6 kept per query).
- Weight split: 52 results at weight >= 0.5 (primary/official backing), 44 below 0.5 (weak backing, labeled in text).
- Jev requests: 22 total (1 probe, 1 outline validation with 8 score questions, 20 weighting batches of 5 noul questions). Usage: 16612 input tokens, 0 output tokens.
- Redo counts: 0. Every subtopic dug strong on the first pass (6+ high-weight results each), so no redo digs were needed.
- Skipped docs: none. All 8 subtopics authored.

## Per-doc source counts

| doc | results weighted | primary (>= 0.5) |
|---|---|---|
| 01-artifact-split-principle | 12 | 6 |
| 02-blsconfig-uki-key | 12 | 6 |
| 03-bootc-v1164-kernel-split | 12 | 8 |
| 04-mkosi-split-artifacts | 12 | 6 |
| 05-build-pipeline-seams | 12 | 6 |
| 06-install-time-wiring-options | 12 | 7 |
| 07-cmdline-equivalence | 12 | 6 |
| 08-ab-update-kernel-separability | 12 | 7 |

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200.

## Gaps

None. Claims sourced only from the source research note (yubiOS repo internals such as bake targets and CI steps) are labeled as source-note backed in text and were not independently corroborated by the dig.
