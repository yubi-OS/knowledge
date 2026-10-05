# 08 systemd Version History v256 to v261

Scope: the feature arc from v256 (2024-06) through v261 (2026-06) as it builds out the image-based OS stack, and the current release state as of 2026-07.

## Current state

systemd v261 is the current stable release, shipped 2026-06-19, with Poettering's "Mastodon Stories for systemd v261" post as the latest systemd-cycle post on 0pointer.net (source: https://0pointer.net/blog/mastodon-stories-for-systemd-v261.html and index: https://0pointer.net/blog/category/projects.html, jev 0.47). LWN reported the v261 release with a long list of changes, including a new cloud Instance Metadata Service (IMDS) subsystem and boot secret functionality for systems that lack a physical TPM (source: https://lwn.net/Articles/1078708/, jev 0.66). v262 is not yet released; the release notes for v261 already flag planned v262 removals of legacy /run/boot-loader-entries/ support and the systemd-sysupdated D-Bus API (source: https://github.com/systemd/systemd/releases/tag/v261, jev 0.86, per the parent source material).

The authoritative change log for any version check is the NEWS file in the systemd repository (source: https://github.com/systemd/systemd/blob/main/NEWS, jev 0.87), and the project's release listing aggregates all tagged releases (source: https://github.com/systemd/systemd/releases, jev 0.86).

## v256 (2024-06)

v256 introduced run0 as a sudo replacement, SSH access into systemd-homed accounts, the systemd-vmspawn VM launcher, mutable systemd-sysext variants, and systemd-cryptenroll without a device argument (source: https://github.com/systemd/systemd/releases, jev 0.77, per the parent source material). run0 and vmspawn matter to the vision because they reduce the privileged-shell surface and make VM-based image testing first-class.

## v257 (2024-12)

v257 added SecureBoot signing with systemd-sbsign, replacing sbsigntools, multi-profile UKIs, combined signed PCR plus locally managed PCR policies, IPE LSM support, fully locked accounts in systemd-sysusers, SecureBoot key enrollment preparation in bootctl, and ID-mapped mounts (source: https://github.com/systemd/systemd/releases, jev 0.77, per the parent source material). sbsign and multi-profile UKIs are boot-chain pieces: signing moves in-house to the systemd toolset and UKIs gain variant selection.

## v258 (2025-09)

v258 delivered homectl list-signing-keys and add-signing-key for FIDO2 signing key management in homed, offline signing of artifacts, PAMName= in services, PrivateUsers=full, LoadCredentialEncrypted= in the per-user service manager, a factory reset rework, and fsverity support in systemd-repart (source: https://github.com/systemd/systemd/releases, jev 0.77, per the parent source material). Offline signing and repart fsverity directly serve reproducible, verifiable image builds.

## v259 (2025-12)

LWN reported v259 on 2025-12-18 with notable changes including the new --empower option for run0 that provides elevated privileges to a user without switching to root, plus the ability to propagate signals (source: https://lwn.net/Articles/1051163/, jev 0.85). v259 also brought NvPCR support, a systemd-repart Varlink IPC API, ExecReloadPost=, and --defer-partitions-factory-reset= for repart (source: https://github.com/systemd/systemd/releases, jev 0.77, per the parent source material). Independent coverage framed v259 as one of the most wide-ranging updates in recent cycles while preparing users and distributions for more disruptive changes planned for v260 (source: https://linuxiac.com/systemd-259-released-with-major-changes-ahead-of-legacy-sysv-removal/, jev 0.26, low weight).

## v260 (2026-03)

v260 introduced .mstack overlay mount stacks with RootMStack=, NvPCR measurements for activated DDIs, LUKS volume key fixation, unprivileged portable services, image policy improvements, PrivateUsers=managed, RefreshOnReload=, BindNetworkInterface=, importctl pull-oci, and a TPM2 quirks database in udev (source: https://github.com/systemd/systemd/releases, jev 0.77, per the parent source material). RootMStack and image policy are direct image-based OS primitives; pull-oci brings OCI images into the sysupdate/import pipeline.

## v261 (2026-06)

v261's release notes added systemd-sysinstall, the RestrictFileSystemAccess= BPF-LSM restriction to binaries on signed, dm-verity-protected filesystems, sysext/confext sysroot services for early-initrd extension merges, UKI addon handling via a new BLS extra Type 1 stanza, systemd-cryptenroll defaulting to RSA-OAEP plus SHA-256 for LUKS2 key sealing, systemd-tpm2-swtpm.service software TPM fallback with stub-to-initrd boot secret, priority-based NvPCR allocation in systemd-tpm2-setup.service, and a batch of repart options: EncryptKDF=, VolumeName=, BlockDeviceReplace=, --grain-size=, and per-partition Discard= (source: https://github.com/systemd/systemd/releases/tag/v261, jev 0.86, per the parent source material). Two v261 changes were singled out in independent reporting: the IMDS subsystem and the boot secret functionality for systems without a physical TPM (source: https://lwn.net/Articles/1078708/, jev 0.66).

A conference talk on the v260 and v261 releases explores two additions aimed at letting service owners minimize the impact of servicing interruptions (source: https://www.youtube.com/watch?v=PnMcNaEdFc4, jev 0.24, low weight).

## The arc

Read as a sequence, v256 through v261 is the image-based OS checklist being filled in: boot-chain signing (v257), verifiable image building (v258), partition and reset tooling (v259), image policies and OCI imports (v260), and installer plus integrity-enforcement plus software TPM (v261). Each release tightens the same invariant the vision demands: nothing runs that was not cryptographically validated (source: https://0pointer.net/blog/fitting-everything-together.html, jev 0.95; release record: https://github.com/systemd/systemd/blob/main/NEWS, jev 0.87).
