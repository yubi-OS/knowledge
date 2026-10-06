# 05 - Updates and A/B lifecycle (ADR-013, ADR-032)

Scope: systemd-sysupdate A/B updates with Boot Assessment counters, the 4 artifact update set and automatic rollback, and the kernel plus rootfs split promoted to a first class principle with its bootc BLSConfig follow-ups.

## A/B updates with Boot Assessment (ADR-013)

The source doc (yubi-OS/yubiOS docs/ADR.md, ADR-013, status Accepted) frames OS updates as the most dangerous system operation and decides on systemd-sysupdate for A/B partition updates with Boot Assessment counters embedded in UKI filenames. The recorded mechanism has 5 parts: each update downloads 4 artifacts (new /usr partition, its verity data partition, its PKCS#7 signature partition, and a new UKI into the ESP); the new UKI filename carries a boot counter such as `yubiOS_0.9+3`; systemd-boot decrements the counter on each boot attempt and excludes the UKI from the menu when the counter reaches zero, falling back to the previous version; on a successful boot, userspace calls `bootctl set-boot-good` to strip the counter and mark the entry permanently good; and version selection is automatic through strverscmp() on partition labels and UKI filenames. (source doc; cited at https://systemd.io/AUTOMATIC_BOOT_ASSESSMENT and https://0pointer.net/blog/fitting-everything-together.html)

The systemd Automatic Boot Assessment documentation corroborates the counter and fallback design (https://systemd.io/AUTOMATIC_BOOT_ASSESSMENT/, weight 0.40, weak but primary project documentation; the GitHub mirror at https://github.com/systemd/systemd/blob/main/docs/AUTOMATIC_BOOT_ASSESSMENT.md scored 0.23, weak). Consequences recorded in the source doc: `yubiOS-upgrade.service` must call `bootctl set-boot-good` after verifying a successful boot (network up, key services healthy), and rollback should be actively monitored so regressions are caught before they affect all deployed instances.

## The kernel plus rootfs split (ADR-032)

ADR-032 (source doc, dated 2026-07-29, status Accepted) names a principle that 3 earlier ADRs implied but never stated. Its own context section is unusually evidential: ADR-006 contrasts mkosi's 3 separate artifacts (signed UKI, dm-verity root, composefs image) with bootc's single OCI image; ADR-013's update set is structurally separable into kernel (`/EFI/Linux/bootc/...`) and rootfs (`/sysroot`); and ADR-022 already publishes kernel and rootfs as separate OCI tags on `0mniteck/yubios`. The doc records that the phrase "kernel+rootfs split" had 0 occurrences in docs/ADR.md before this ADR, making the split an implicit invariant made explicit. (source doc)

The 3 reasons the split matters (source doc): A/B updates move only the rootfs when the kernel is unchanged and only the kernel when the rootfs is unchanged, so conflating them forces both to be re-fetched and re-verified on every update; reproducibility per ADR-030 is sharper when each artifact is independently pinable, with kernel regressions pinned to a known UKI digest and rootfs regressions to a known composefs digest; and bootc's composefs fsverity chain (blocker B-BOOTC-SEAL) is unsealed specifically because the BLS digest anchor mutates per image rebuild, with the fix requiring the kernel artifact to be addressable separately so its digest stays stable across rootfs only changes.

The decision text (source doc): the kernel UKI is a separately published OCI artifact at `docker.io/0mniteck/yubios:uki-<sha>-<arch>`, built once and signed once via systemd-sbsign plus PKCS#11 against YubiKey PIV slot 9c per ADR-008; the bootc OCI image is the rootfs, with `/usr/` composed of composefs EROFS plus fsverity per ADR-007; both paths agree on the kernel command line, with the bootc install config setting `[install] kargs = ["root=dissect", "mount.usr=dissect", "rw", "audit=0"]` to match mkosi's `[Content] KernelCommandLine`, embedded in the `.cmdline` PE section of bootc's auto-generated UKI so the two paths produce byte-identical cmdlines at runtime; and a BLSConfig drop-in for the pre-built UKI is staged as Phase 2.

The bootc side is corroborated weakly in the dig: bootc's composefs backend documentation describes the composefs digest as a SHA-512 hash of the entire root filesystem computed at build time, paired with a UKI (https://bootc.dev/bootc/experimental-composefs.html, weight 0.39, weak), and the bootc internals module page describes generating BLS entries for composefs deployments (https://bootc-dev.github.io/bootc/internals/bootc_lib/bootc_composefs/boot/index.html, weight 0.26, weak). A GitHub discussion about composefs parameter mismatch when using pre-made UKIs (https://github.com/bootc-dev/bootc/discussions/1984, weight 0.15, weak) and a DeepWiki summary of the backend (0.12, weak) record the community friction that motivated the split.

## Deferred follow-ups (recorded in ADR-032, source doc)

- B-BOOTC-SEAL Phase 2: a bootc side patch to mirror the secureboot-keys flow at `/usr/lib/bootc/install/loader-entries/`, so yubiOS can ship a BLS `.conf` drop-in alongside the UKI artifact. Without it, the pre-built UKI is published but bootc's install still generates its own UKI at install time.
- Base bump to fedora-bootc carrying bootc v1.16.4 or later for the `bootc container split-kernel-and-rootfs` subcommand and the user-provided-kargs extension (upstream PR #2305); v1.16.4 was released 2026-07-15 and Fedora 45 rebuilds lag by 1 to 2 weeks.
- `bootc container ukify` integration in the build pipeline as the long-term signer, replacing the mkosi `--secure-boot-sign-tool systemd-sbsign` step, contingent on packaging pkcs11-provider and softhsm2 into fedora-bootc.

Consequences recorded: the bootc install config gains the kargs line, `yubiOS-bake.hcl` gains a `yubios-uki` target packaging the pre-built signed UKI as a separate scratch-rootfs OCI artifact, `ci_mkosi-installer.yml` extracts the signed UKI into `inst/uki/`, and blocker B-BOOTC-SEAL is downgraded in scope because the kernel side split is shipped while install time BLSConfig wiring remains open. A 2026-09-18 drift check note in the source doc records that a round 8 upstream note (bootc v1.16.13) keeps the ADR-032 / OMN-150 option (b) viable. (source doc)

## Sources considered

| Source | Weight | Role |
|---|---|---|
| https://systemd.io/AUTOMATIC_BOOT_ASSESSMENT/ | 0.40 (weak) | Boot Assessment design |
| https://bootc.dev/bootc/experimental-composefs.html | 0.39 (weak) | composefs backend digest model |
| https://github.com/systemd/systemd/blob/main/docs/AUTOMATIC_BOOT_ASSESSMENT.md | 0.23 (weak) | mirror of boot assessment |
| https://bootc-dev.github.io/bootc/internals/bootc_lib/bootc_composefs/boot/index.html | 0.26 (weak) | BLS entry generation |
| https://github.com/bootc-dev/bootc | 0.25 (weak) | upstream project |
| https://github.com/bootc-dev/bootc/discussions/1984 | 0.15 (weak) | UKI friction record |
| https://deepwiki.com/bootc-dev/bootc/2.3.2-composefs-backend | 0.12 (weak, unused) | aggregator |
| yubi-OS/yubiOS docs/ADR.md (source doc) | n/a | ADR-013, ADR-032 text |
