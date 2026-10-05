# 03 - systemd Feature Floors

Scope: the systemd feature floors that constrain the base image: boot loader spec entries at v246, discoverable partitions and LUKS2 hardware unlock at v252, portable services at v254, and sysext plus confext at v256, with the digest-bump verification implication of each.

## Why systemd needs a feature table, not one number

systemd's floor is a feature-by-feature table because each capability the yubiOS boot and unlock flows depend on landed in a different release. The yubiOS target is v256 or above, with the base image currently tracking systemd v261 (source doc: refs/package-floor-verification-checklist-2026-08-04.md section 2.2). When a digest bump changes the systemd version, each row of the table is re-tested; a bump that stays above every floor passes, and any row that regresses aborts the bump.

## Boot loader spec entries: v246 (2020-06)

The boot loader spec (BLS) entry format is the oldest floor in the table. BLS entries are what the boot chain reads to enumerate kernels, so any build producing BLS-format entries needs systemd at v246 or above (floor source doc: refs/package-floor-verification-checklist-2026-08-04.md section 2.2, referencing systemd-boot(7)). The Phase 2 BLSConfig wiring work in the yubiOS pipeline (OMN-150) consumes this format, which is why a systemd regression below v246 would break kernel enumeration rather than merely degrade a feature.

## Discoverable Partitions Specification: v252 (2022-10)

The discoverable partitions specification (DPS) is the floor for systemd-repart-driven partition layout (floor source doc: refs/package-floor-verification-checklist-2026-08-04.md section 2.2, referencing systemd-repart(8)). The same release line introduced the LUKS2 hardware unlock path that yubiOS's disk-unlock flow depends on.

## LUKS2 hardware unlock (FIDO2, TPM2, PKCS#11): v252 (2022-10)

The hardware-token unlock flow is the security-critical row. systemd-cryptenroll is the tool for enrolling PKCS#11, FIDO2, and TPM2 tokens and devices into LUKS2 encrypted volumes so they can be used to unlock the volume during boot (source: https://www.man7.org/linux/man-pages/man1/systemd-cryptenroll.1.html, jev weight 0.90). The man page documents enrolling hardware security tokens and devices into a LUKS2 encrypted volume, which may then be used to unlock the volume during boot (source: https://wiki.archlinux.org/title/Systemd-cryptenroll, jev weight 0.71). The upstream manual for the 251 era already describes the full flow, including how the TPM lockout mechanism is a global property of the TPM that systemd-cryptenroll does not control (source: https://www.freedesktop.org/software/systemd/man/251/systemd-cryptenroll.html, jev weight 0.95). Lennart Poettering's write-up of the systemd 248 era records the original enrollment mechanics: `systemd-cryptenroll --pkcs11-token-uri=auto /dev/sda5` enrolls the security token as an additional way to unlock the volume (source: https://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-248.html, jev weight 0.95). The v252 floor is where yubiOS pins this capability; a digest bump that ships an older systemd breaks enrollment and boot unlock together.

## Portable services: v254 (2023-06)

The portable services subsystem, with portablectl attach and detach, is the floor for the nspawn-portable-service workflow yubiOS uses as a lightweight substitute for heavier image-mode swaps (floor source doc: refs/package-floor-verification-checklist-2026-08-04.md section 2.2, referencing portablectl(1)). A systemd regression below v254 removes the attach/detach lifecycle the workflow assumes.

## sysext and confext: v256 (2024-06)

The extension-image lifecycle is the youngest floor. systemd-sysext merges extension images over /usr and /opt, and systemd-confext applies the same principle to /etc: files and directories contained in the confext images extend the configuration tree (source: https://www.freedesktop.org/software/systemd/man/latest/systemd-sysext.html, jev weight 0.94). The man7 mirror of the sysext page documents commands added in version 256, including the reload and restart behavior after merging, refreshing, or unmerging an extension (source: https://man7.org/linux/man-pages/man8/systemd-sysext.8.html, jev weight 0.69). The v256 release announcement itself is the release boundary: systemd 256 shipped in June 2024 with a long change list (source: https://lwn.net/Articles/978151/, jev weight 0.87; release announcement: https://lists.freedesktop.org/archives/systemd-devel/2024-June/050407.html, jev weight 0.70). The 256 announcement also documents sysext gaining support for enabling system extensions in a mutable fashion, with a writeable upperdir stored under /var/lib/extensions.mutable/ and a new --mutable= option (same announcement source). Because yubiOS targets v256 for the sysext and confext lifecycle and for factory reset and stateless-system behavior, a digest bump shipping v255 or older fails this row even though every older floor passes.

## The verification implication

Each row maps to a concrete check in the pre-bump protocol: after pulling the new digest, run `rpm -q systemd` and compare the version against the table. The pass criterion is the highest floor the build's feature set actually uses; the yubiOS target of v256 or above covers all rows at once. If the systemd version regressed, the bump is aborted and a new issue is filed (source doc: refs/package-floor-verification-checklist-2026-08-04.md sections 3.3 and 4.2). The post-bump cascade re-checks the same floor against the rebuilt image via the verification script, so a regression that slips past review still fails CI.
