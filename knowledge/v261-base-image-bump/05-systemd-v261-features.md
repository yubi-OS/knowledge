# 05. What systemd v261 shipped that the bump unblocked

Scope: the systemd v261 release itself, the capabilities the yubiOS base bump was performed to obtain, and where those capabilities are documented upstream.

## The release

systemd v261 exists as a tagged upstream release; the release listing page for the systemd repository is the canonical index of tagged releases (https://github.com/systemd/systemd/releases, noul 0.95), and the v261 tag page exists at https://github.com/systemd/systemd/releases/tag/v261 (noul 0.94). The rolling NEWS file in the systemd repository is the changelog of record for what each release contains (https://github.com/systemd/systemd/blob/main/NEWS, noul 0.89). LWN covered the v261 release with a summary of the change list: a new cloud "Instance Metadata Service" (IMDS) subsystem, "boot secret" functionality for systems that lack a physical TPM, and support for the kernel's Live Update Orchestrator, among a long list of other changes (https://lwn.net/Articles/1078708/, noul 0.88). An rc-era news summary adds systemd-sysinstall as an OS installer component and a storagectl command to the v261 feature list (https://www.phoronix.com/news/systemd-261-rc1, noul 0.54, weak backing).

## The v261 feature the corpus can anchor with certainty

One v261 addition is directly verifiable from the man pages: the kernel command line directive `systemd.restrict_filesystem_access=`, which controls the `RestrictFileSystemAccess=` execution enforcement policy, is documented as "Added in version 261" (https://www.man7.org/linux/man-pages/man7/kernel-command-line.7.html, noul 0.82). This gives the corpus a hard upstream anchor for the claim that v261 is the release where `RestrictFileSystemAccess=` appeared, which is the version relationship the source ref's consistency note depends on (source ref, no external weight for the yubiOS-specific note itself; the version attribution is backed at noul 0.82).

## What the bump unblocked in yubiOS

The source ref records that the v261 base bump unblocked three pieces of yubiOS work (source ref, no external weight for the internal unblocking claims):

1. `ConditionSecurity=measured-os`, a unit condition gating on measured OS boot state.
2. `systemd-tpm2-swtpm.service`, the software TPM service unit.
3. The current yubiOS enrollment-unit hardening work.

The mechanism is straightforward: a systemd feature cannot be used by a unit if the systemd inside the booted image predates the feature. The base image ships systemd configured to run by default even when executed as a container (https://docs.stg.fedoraproject.org/en-US/bootc/base-images/, noul 0.88), so the systemd version inside the bootc base image is the binding constraint on which unit directives and conditions are available to the OS built on it. The bump gate in doc 04 checks exactly this with `systemd --version`.

## How to verify a v261 feature claim independently

Two upstream surfaces allow independent verification of any systemd feature version claim: the release listing and tag pages (https://github.com/systemd/systemd/releases, noul 0.95), and the man page "Added in version" annotations, which the directives index collects (https://www.freedesktop.org/software/systemd/man/latest/systemd.directives.html, noul 0.83). The systemd project's own site describes the suite as the basic building blocks of a Linux system and links the documentation set (https://systemd.io/, noul 0.88). A claim like "v261 added X" should be checked against both: the tag's changelog and the directive's man page version stamp.

## Why this release mattered for a measured-boot OS

Two of the v261 features highlighted by LWN sit directly on the yubiOS security surface: "boot secret" functionality for systems that lack a physical TPM (https://lwn.net/Articles/1078708/, noul 0.88) aligns with the software-TPM service the bump unblocked, and measured-boot-adjacent capabilities align with the `ConditionSecurity=measured-os` condition. The IMDS subsystem is a cloud-side feature with no direct yubiOS use recorded in the source ref. The release's overall shape, more security-relevant gating built into the init system, is the reason a systemd-version bump on a base image is treated as a security-relevant change in this project rather than a routine dependency refresh.
