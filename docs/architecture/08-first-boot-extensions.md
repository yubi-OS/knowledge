# 08. First-boot services and the four extension models

Scope: what runs on first boot, and the four ways software is added to a running yubiOS system, ranked by trust.

Grounding spine: source doc `yubi-OS/yubiOS docs/ARCHITECTURE.md`.

## First-boot services

The source doc defines three first-boot mechanisms (source doc):

| Service | Gate | Notes |
|---|---|---|
| yubiOS-chipsec-firstboot.service | ConditionSecurity=measured-os, ConditionFirstBoot=yes | One-shot firmware validation; raw hardware access is explicitly scoped |
| yubiOS-enroll.service | Measured boot expected | Enrolls owner YubiKey and recovery material after first boot |
| repart and install flow | DPS and systemd-repart | No traditional /etc/fstab installer model |

The gating conditions are the important part. systemd 261 introduced ConditionSecurity=measured-os, a unit condition checking whether the system booted with measured-boot semantics, similar to but broader than ConditionSecurity=measured-uki (https://linuxiac.com/systemd-261-lands-with-cloud-imds-tpm-and-network-updates/, jev weight 0.09, weak backing). Enrollment is deliberately sequenced after measurement: the owner's YubiKey is enrolled only into a system that has already proven its measured state.

The partition side of first boot uses the Discoverable Partitions Specification with systemd-repart rather than a traditional /etc/fstab installer model (source doc). systemd's first-boot machinery initializes machine configuration during first boot, that is when the system is freshly installed or after a factory reset (https://www.man7.org/linux/man-pages/man1/systemd-firstboot.1.html, jev weight 0.43, weak backing; the ArchWiki page describes the same tool since systemd 216 at https://wiki.archlinux.org/title/Systemd-firstboot, jev weight 0.44, weak backing).

## The four extension models

The source doc answers one question with four answers: what are you adding? Each answer trades flexibility against trust (source doc):

1. **systemd-sysext, extends /usr in the same namespace.** Examples: debug tools, drivers, the YubiKey tools overlay. Trust: verity plus PKCS#7, deployed as a read-only overlayfs on /usr. The systemd-sysext manual describes system extension images as dynamically extending the /usr and /opt hierarchies with additional files at runtime (https://www.freedesktop.org/software/systemd/man/latest/systemd-sysext.html, jev weight 0.44, weak backing), and the sysext services are guaranteed to finish start-up before basic.target (https://man7.org/linux/man-pages/man8/systemd-sysext.8.html, jev weight 0.3, weak backing). On Trusted Boot systems, extension images are verified against public keys stored in the firmware (https://kairos.io/docs/advanced/sys-extensions/, jev weight 0.45, weak backing).

2. **Portable services, isolated system service with its own root and namespace.** Examples: chipsec, yubikey-agent. Trust: verity plus PKCS#7 GPT image, with sandboxing opt-out. The systemd portable-services introduction describes them as stricter by default, with sandboxing as the primary design goal and portablectl as the main tool (https://systemd.io/PORTABLE_SERVICES/, jev weight 0.25, weak backing). Portable services attach units to a root image via RootDirectory= or RootImage= drop-ins (https://www.freedesktop.org/software/systemd/man/portablectl.html, jev weight 0.23, weak backing). A research note in the ecosystem documents that systemd-dissect supports dm-verity plus PKCS#7 signatures only for DDI-format images with a GPT partition table following the Discoverable Partitions Specification (https://github.com/offline-lab/documentation/blob/main/decisions/rejected/portablectl-verity.md, jev weight 0.31, weak backing), which is the exact image shape the source doc's portable-service row requires.

3. **systemd-nspawn, full secondary OS for legacy packages.** Examples: Debian dev container, RPM compatibility layer. Trust: the same PKCS#7 verity model.

4. **Flatpak or OCI, end-user app. Trust: weakest, no verity attestation** (source doc).

## Ranking by trust

The models descend in trust in the order listed: sysext and portable services both carry verifiable, signature-anchored images and integrate with the measured OS; nspawn containers inherit the same image verification for their root image but run a full secondary OS; flatpak and OCI applications carry no verity attestation and are treated as the weakest class (source doc). The source doc's color coding makes the same point: green for sysext, brown for portable services, dark for nspawn, gray for flatpak.

## Why this ordering exists

In an immutable OS, every mechanism that mutates /usr at runtime is a potential hole in the image-integrity story. The sysext and portable-service paths exist precisely because they mutate without breaking verification: their images are separately signed and verity-checked, so the runtime extension is authenticated even though the base /usr is immutable. The source doc places the chipsec example under portable services deliberately, since firmware validation tools need raw hardware access that must be scoped and sandboxed rather than merged into /usr.

## First boot as the enrollment gate

Read together, the first-boot table and extension models express a single rule: identity material (the YubiKey enrollment, recovery material) is installed once, early, on a system whose measured state has been verified, and everything added afterward must declare which trust class it belongs to. A change that adds a new extension mechanism, or relaxes a first-boot condition, is an architecture-level change and should be reviewed against this ranking.
