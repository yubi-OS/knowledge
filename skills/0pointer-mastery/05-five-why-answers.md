# 05 - The Five Why Answers

Scope: the 5 design-rationale answers the 0pointer-mastery skill carries verbatim, explaining why the Poettering design (and yubiOS after it) picks dm-verity over ostree, ships no installer, extends /usr with sysext, uses FIDO2 over TPM2 for secrets, and requires discoverable partitions.

Grounding spine: yubi-OS/yubiOS skills/0pointer-mastery/SKILL.md (source doc). Each of the 5 answers is a source-doc claim; the dig adds weighted external sources for the mechanisms they name.

## Why not ostree?

The source doc's answer: ostree validates at download, not at every I/O. dm-verity validates on every single read, so an attacker cannot modify the disk offline without detection. ostree cannot provide on-access integrity; dm-verity can. The source doc cites Lennart's FAQ in "Fitting Everything Together" (https://0pointer.net/blog/fitting-everything-together.html) as the primary statement of this position (source doc).

The dig confirms the two mechanisms' shapes but did not produce a source with weight >= 0.5 for the comparison itself. The official ostree documentation describes ostree as an upgrade system for Linux-based systems with atomic transitions between parallel-installable read-only filesystem trees, comparing itself to package managers and to block/image replication (https://ostreedev.github.io/ostree/introduction/, weight 0.24, weak). A third-party overview notes that image-based systems treat the entire OS as a single artifact and that Bottlerocket uses A/B partitions with dm-verity (https://canartuc.medium.com/immutable-linux-distros-how-they-differ-and-where-theyre-going-57b14b630f7b, weight 0.11, weak). Vendor pages on dm-verity deployment exist (https://www.systemshardening.com/articles/linux/dm-verity/, weight 0.13, weak; https://www.lynx.com/blog/dm-verity-without-an-initramfs/, weight 0.14, weak), as does Microsoft's guidance on measuring read-only workload images with dm-verity and IMA for attestation (https://learn.microsoft.com/en-us/azure/confidential-computing/how-to-attest-linux-workload, weight 0.10, weak). Treat the ostree comparison as a source-doc claim; the weak-weight pages are orientation only.

## Why not a traditional installer?

The source doc's answer (source doc): installers generate crypto keys before first boot, so the key leaves the factory. systemd-repart generates LUKS keys on first boot on the target device, so keys never leave it. As a consequence, the shipped image, the installer image, and the live image are all the same GPT image. This is goal 13 of the 17 design goals (doc 02) and it is what makes goal 8, factory reset, trustworthy.

## Why sysext over editing /usr?

The source doc's answer (source doc): /usr is dm-verity protected, so writing to it breaks the Merkle tree. sysext overlays via overlayfs on top of the verified base. The base stays validated and the extension is validated separately via PKCS#7. Both remain immutable and modular simultaneously. The sysext man page adds the operational boundary: OS extension images are not suitable for shipping resources processed by subsystems running in earliest boot, and not suitable for system services (https://www.freedesktop.org/software/systemd/man/latest/systemd-sysext.html, weight 0.74).

## Why FIDO2 over TPM2 for secrets?

The source doc's answer (source doc): TPM2 is soldered to the board, so no physical possession is required; an attacker with your machine also has your TPM. A YubiKey is portable and requires physical possession. FIDO2 hmac-secret provides equivalent sealing without requiring hardware attestation of PCR values, survives OS updates without re-enrollment, and is not OEM-dependent.

The dig strongly backs the mechanism this answer relies on. systemd-cryptenroll is the tool that enrolls PKCS#11, FIDO2, and TPM2 tokens into LUKS2 encrypted volumes, with FIDO2 security tokens that implement the hmac-secret extension covering most FIDO2 keys including YubiKeys (https://man7.org/linux/man-pages/man1/systemd-cryptenroll.1.html, weight 0.58). Lennart's own blog post introducing the tool states its single purpose is to make it easy to enroll your security token or chip of choice into an encrypted volume (https://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-248.html, weight 0.79). The ArchWiki page confirms the flow: enroll hardware security tokens and devices into a LUKS2 encrypted volume, which may then be used to unlock the volume during boot (https://wiki.archlinux.org/title/Systemd-cryptenroll, weight 0.58). Weaker pages found by the same dig (https://www.yubico.com/authentication-standards/fido2/, weight 0.21, weak; https://www.golinuxcloud.com/systemd-cryptenroll-luks2-tpm2-fido2-linux/, weight 0.11, weak; https://fidoalliance.org/passkeys/, weight 0.06, weak) add nothing load-bearing.

## Why discoverable partitions?

The source doc's answer (source doc): /etc/fstab stores the root fs location inside the root fs, which is a circular dependency. DPS instead embeds all mount information in the partition table, which any tool can read before mounting anything. The result: the same disk image boots on bare metal, in a VM, in a container, and via systemd-nspawn with zero configuration change. The authoritative spec lives at https://systemd.io/DISCOVERABLE_PARTITIONS (source doc).

## How the 5 answers relate

The answers are not independent: the no-installer answer (on-device key generation) is what makes the YubiKey-enrollment-at-first-boot model work; the sysext answer is the modularity-ladder rung 1 justification (doc 03); the DPS answer is what allows the uniform GPT image format (goal 16) to serve every rung; and the dm-verity answer is the integrity basis that makes the boot chain of doc 04 measurable in the first place (source doc).

Redo note: the ostree query dig was redone once because the first pass returned off-topic results for 5 of 6 entries (see research-db/digs/05-five-why-answers.json). The comparison axis remains source-doc grounded by design.
