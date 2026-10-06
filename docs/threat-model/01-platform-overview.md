# 01 Platform Overview

Scope: what the yubiOS threat model is written against: a FIDO2-first immutable Linux OS delivered through bootc/OCI and mkosi image paths, with an ARM64 production Path A, an ARM64 Path B fallback, an x86-64 posture above the UKI, and a split between verified immutable `/usr` and encrypted writable state.

Grounding spine: yubi-OS/yubiOS docs/THREAT_MODEL.md (source doc), https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/THREAT_MODEL.md

## What yubiOS is

The source doc defines yubiOS as a FIDO2-first immutable Linux operating system delivered through bootc/OCI and mkosi image paths (source doc). The owner-facing root of trust is an owner-held YubiKey 5: PIV slot 9c signs Secure Boot artifacts, FIDO2 `hmac-secret` gates disk and home unlock, FIDO2 resident credentials protect SSH, and pam-u2f protects login and `sudo` (source doc). TPM/fTPM measurement is deliberately separate from owner identity and must not become the sole disk-unlock gate (source doc).

The immutable-update mechanism the model assumes matches the upstream bootc design: the bootc documentation describes bootable containers as transactional, in-place operating system updates using OCI/Docker container images, where the Linux kernel, bootloader, and drivers are part of the container image (https://docs.fedoraproject.org/en-US/bootc/getting-started/, jev weight 0.81). The bootc project describes the same idea as applying the container layer model to bootable host systems, using standard OCI/Docker containers as transport for base operating system updates (https://github.com/bootc-dev/bootc, jev weight 0.68). At update time, bootc applies the container image to a running system by switching out `/usr` and `/boot` (https://containers.github.io/bootable/how-does-it-work.html, jev weight 0.63). Red Hat describes bootc as using container technology to build and manage immutable operating systems (https://developers.redhat.com/articles/2024/09/24/bootc-getting-started-bootable-containers, jev weight 0.71).

mkosi is the second delivery path named by the model (source doc). Upstream, mkosi is a tool that builds bespoke OS images, wrapping package managers such as dnf, apt, pacman, and zypper (https://github.com/systemd/mkosi, jev weight 0.75). The mkosi site describes it as a fancy wrapper around those package managers that generates customized disk images (https://mkosi.systemd.io/, jev weight 0.45, weak backing, labeled per the corpus rule). A community characterization of mkosi as a powerful tool for building modern and legacy-free Linux images is weak-backed (https://commandmasters.com/commands/mkosi-linux/, jev weight 0.08) and is not used as authority here.

## Platform paths

The primary platform is ARM64 (source doc). The intended production Path A uses owner-provisioned ROTPK state, TF-A Trusted Board Boot, OP-TEE, an RPMB-backed fTPM and UEFI variable service, U-Boot UEFI, systemd-boot, and a signed unified kernel image (UKI) (source doc). ARM64 Path B uses verified or measured boot where an owner-enforced hardware root cannot safely be provisioned; it is not equivalent to Path A (source doc). x86-64 is supported above the UKI, but OEM firmware and the platform TPM remain unavoidable lower-layer trust anchors (source doc).

This layering matters for the threat model because the enforceable boundary starts where the owner holds the keys. On x86-64, everything below the UKI runs on OEM-owned firmware, which the model treats as a decisive limitation rather than a control (source doc).

## Runtime state split

The runtime design separates immutable verified operating-system content from encrypted writable state (source doc). `/usr` is intended to be read-only and verified through composefs/erofs and dm-verity (source doc). Root state, swap, and per-user homes are LUKS2-encrypted and unlocked with FIDO2 plus separately managed recovery material (source doc). Updates use A/B `/usr` slots, signed UKIs, boot-attempt counters, and a health check that marks a new boot good (source doc).

The A/B slot model is the same shape upstream bootc documents for image-mode systems: a new image is staged and swapped in, and rollback stays possible because the old `/usr` remains until the new one is confirmed (https://docs.fedoraproject.org/en-US/bootc/, jev weight 0.80). The immutability claim, however, is yubiOS-specific: the source doc requires verification through composefs/erofs and dm-verity, not mere read-only mounting (source doc).

## Why the supply chain is part of the platform

The repository also contains a security-critical software-supply-chain surface: pinned upstream images and GitHub Actions, build policy in `yubiOS.rego`, bootc and mkosi builds, firmware bundles, CI tests, provenance and SBOM generation, and publication to an OCI registry (source doc). The source doc states the core dependency directly: a release is only as trustworthy as both the owner-controlled boot-signing boundary and the build/publish path that selected the bytes to be signed (source doc).

## Consequences for the model

Three overview facts shape every later analysis. First, the root of trust is a possession device the owner holds, so attacker stories must be evaluated against what the YubiKey will and will not do (source doc). Second, the OS content is verified before authority is granted, so the boot chain and `/usr` are the highest-value targets (source doc). Third, the supply chain selects the bytes that get signed, so repository compromise is modeled as a first-class path to fleet compromise, not as an operations concern (source doc).
