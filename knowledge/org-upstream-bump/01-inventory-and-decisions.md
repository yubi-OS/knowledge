# 01-inventory-and-decisions

**Scope.** Inventory and decisions: detailed analysis grounded in yubi-OS/yubiOS refs/org-upstream-bump-2026-10-17.md.

> Ground source: yubi-OS/yubiOS refs/org-upstream-bump-2026-10-17.md. External dig queries: OP-TEE OS 4.11 fTPM reference implementation ARM Trusted Firmware; git rebase upstream release tag supply chain pinning.

## The inventory as a decision table

The ground source (yubi-OS/yubiOS refs/org-upstream-bump-2026-10-17.md) lists every upstream the org consumes with four columns: item, pinned version, latest stable, and decision. The source of truth is PINNED.md on main at 3e76363d. The table has 28 rows (one row groups three already-latest actions). Decisions fall into three classes: no change, BUMP, and HOLD.

## Firmware forks

| Item | Pinned | Latest | Decision |
|---|---|---|---|
| arm-trusted-firmware (fork) | v2.15.0 | v2.15.0 | No change: fork pin equals the release commit, zero yubiOS commits |
| edk2 (fork) | edk2-stable202602 | edk2-stable202608 | HOLD unless compatible; Lane E proves or disproves 202608 |
| edk2-platforms (snapshot) | 20260316-before-platform-removals | no stable tags | No change |
| ms-tpm-20-ref (fork) | v1.83r1 | v1.83r1 | No change |
| optee_ftpm (fork, feat/volatile-nv-ci) | 4.10.0 | 4.11.0 | BUMP: rebase 11 yubiOS commits onto 4.11.0 |
| optee_os (fork, feat/stmm-volatile-storage-ci) | 4.10.0 | 4.11.0 | BUMP: rebase, preserve every yubiOS-only commit, drop upstream-already-merged commits |
| u-boot (fork) | v2026.10 | v2026.10 | No change |

The two BUMP rows in firmware are the OP-TEE pair. OP-TEE is a Trusted Execution Environment designed as a companion to a non-secure Linux kernel on Arm A-profile systems using TrustZone, per the Trusted Firmware project page at [OP-TEE - Trusted Firmware](https://www.trustedfirmware.org/projects/op-tee/) (clef weight: 0.7487). The secure-side source lives in [GitHub - OP-TEE/optee_os: Trusted side of the TEE · GitHub](https://github.com/OP-TEE/optee_os) (clef weight: 0.6971). The fTPM Trusted Application provides a firmware TPM using the Microsoft reference implementation, with platform-specific integration code kept in the optee_ftpm repository, per [GitHub - OP-TEE/optee_ftpm: OP-TEE integration for the MS TPM 2.0 ...](https://github.com/OP-TEE/optee_ftpm) (clef weight: 0.4739) (weak backing, clef weight < 0.5) and the same text in [optee_ftpm/README.md at master · OP-TEE/optee_ftpm](https://github.com/OP-TEE/optee_ftpm/blob/master/README.md) (clef weight: 0.4737) (weak backing, clef weight < 0.5); both are marginally below the 0.5 line. That is why optee_ftpm and ms-tpm-20-ref appear as separate rows: the reference TPM stays at v1.83r1 while the OP-TEE integration layer moves to 4.11.0. Trusted Firmware-A, the reference secure-world software for Armv8-A, is described at [Trusted Firmware-A - Wiki - Open Source Software and Platforms -...](https://community.arm.com/oss-platforms/w/docs/483/trusted-firmware-a) (clef weight: 0.6303); the plan leaves it at v2.15.0.

The edk2 HOLD is a compatibility hold. The pinned edk2-stable202602 is the bound for the StandaloneMM ArmBaseLib used by the pre-removal edk2-platforms snapshot. Moving edk2 forward without proving that pairing could break the StandaloneMM build, so Lane E must prove or disprove 202608 compatibility first.

## Tooling forks

bcvk (fork, yubios branch) stays at v0.21.0 with 41 yubiOS commits as-is. mkosi (fork, feature/yubiOS-profile) stays at v27.1 with 27 yubiOS commits. Both pins are already the latest release.

## Release binaries and libraries

| Item | Pinned | Latest | Decision |
|---|---|---|---|
| docker/buildx | v0.35.0 | v0.38.0 | BUMP: release assets, SHA-512 for linux amd64 and arm64 |
| Mbed-TLS | mbedtls-3.6.6 | 3.6.7 (3.x), 4.2.0 (major) | BUMP to 3.6.7; HOLD 4.x unless TF-A v2.15 is proven compatible |
| pando85/passless | v0.11.2 | v0.20.2 | BUMP; hmac-secret must remain implemented, test-image CI must pass |
| sigstore/cosign | v3.1.2 | v3.1.3 | BUMP: SHA-512, cross-check cosign_checksums.txt, update verify tooling pins |
| qemu/qemu | 3a18e8a2 | v11.1.2 tag commit | BUMP to the commit behind v11.1.2 |
| docker static engine | 29.6.0 | latest stable static | BUMP: 4 artifacts, SHA-512 each |

## Images and actions

moby/buildkit (v0.31.2 to v0.34.0) and hadolint (v2.14.0 to v2.15.1) BUMP by multi-arch INDEX digest. jekyll-build-pages is verified and bumped only if a newer build exists. Six actions BUMP to pinned SHAs: attest v4.2.2 (1e69f48a), deploy-pages v5.0.1 (368f8252), download-artifact v8.0.2 (9000827c), setup-python v7.0.0 (5fda3b95), upload-artifact v7.0.2 (cf430e03), setup-buildx-action v4.4.1 (f87e5991); four carry a "major: check inputs" note. checkout, configure-pages and upload-pages-artifact are already latest. dhi.io/debian-base and fedora-bootc:45 were already refreshed on main (6326b0b4 and 3e76363d).

## Rebasing forks onto a release tag

The plan's fork rows all say "rebase yubiOS commits onto the release". The git documentation describes rebase as replaying each commit from the working branch on top of the upstream, per [Git - git-rebase Documentation](https://git-scm.com/docs/git-rebase) (clef weight: 0.7551), the strongest result in this dig. The Atlassian tutorial frames rebase as a way to integrate upstream changes without a superfluous merge commit, per [Git rebase \| Atlassian Git Tutorial](https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase) (clef weight: 0.2658) (weak backing, clef weight < 0.5). Rebasing onto a tag rather than a branch is addressed in [rebase - Git - rebasing to a particular tag - Stack Overflow](https://stackoverflow.com/questions/12469855/git-rebasing-to-a-particular-tag) (clef weight: 0.0543) (weak backing, clef weight < 0.5); GitKraken's explainer is at [Git Rebase - What is Git Rebase? \| Learn Git](https://gitkraken.com/learn/git/git-rebase) (clef weight: 0.2001) (weak backing, clef weight < 0.5), and the git home page at [Git](https://git-scm.com/) (clef weight: 0.4820) (weak backing, clef weight < 0.5). The plan's specific constraint, that commits already merged upstream drop while every yubiOS-only commit survives, is what rebase does when an upstream commit's patch is already present.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | GitHub - OP-TEE/optee_ftpm: OP-TEE integration for the MS TPM 2.0 ... | https://github.com/OP-TEE/optee_ftpm | 0.4739 | weak (< 0.5) |
| 2 | OP-TEE - Trusted Firmware | https://www.trustedfirmware.org/projects/op-tee/ | 0.7487 | authoritative (>= 0.5) |
| 3 | optee_ftpm/README.md at master · OP-TEE/optee_ftpm | https://github.com/OP-TEE/optee_ftpm/blob/master/README.md | 0.4737 | weak (< 0.5) |
| 4 | GitHub - OP-TEE/optee_os: Trusted side of the TEE · GitHub | https://github.com/OP-TEE/optee_os | 0.6971 | authoritative (>= 0.5) |
| 5 | Trusted Firmware-A - Wiki - Open Source Software and Platforms -... | https://community.arm.com/oss-platforms/w/docs/483/trusted-firmware-a | 0.6303 | authoritative (>= 0.5) |
| 6 | rebase - Git - rebasing to a particular tag - Stack Overflow | https://stackoverflow.com/questions/12469855/git-rebasing-to-a-particular-tag | 0.0543 | weak (< 0.5) |
| 7 | Git rebase \| Atlassian Git Tutorial | https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase | 0.2658 | weak (< 0.5) |
| 8 | Git - git-rebase Documentation | https://git-scm.com/docs/git-rebase | 0.7551 | authoritative (>= 0.5) |
| 9 | Git | https://git-scm.com/ | 0.4820 | weak (< 0.5) |
| 10 | Git Rebase - What is Git Rebase? \| Learn Git | https://gitkraken.com/learn/git/git-rebase | 0.2001 | weak (< 0.5) |
