# 01. The Faux Phy Attack Chain

Scope: the three phase Qualcomm supply chain and absolute persistence attack chain that yubiOS docs/MITIGATE.md is written against, and why the yubiOS defence posture rests on cryptographic validation before execution.

## The chain in outline

The source doc (yubi-OS/yubiOS docs/MITIGATE.md) frames the Faux Phy ... Phe Phum v1.05 attack chain, by Shant Tchatalbachian (0mniteck), as a multi stage, supply chain initiated compromise across three phases:

1. Step 1, OEM and vendor persistence: a modified power manager, stacked UEFI firmware, hidden partitions, and CVE driven page cache poisoning.
2. Step 2, pre init hijack: kernel modules loaded before systemd, modified libc and LSM libraries sideloaded through firmware, and /usr bind mounted over /usr with poisoned systemd generators.
3. Step 3, runtime control: faux ACPI tables loaded from hidden media, a TEE and TrustZone man in the middle, Absolute Persistence (Computrace), radio persistence, and dmesg and proc scrubbing.

The chain is attributed to a Qualcomm (qcom) vendor context: the attacker is assumed to hold a position inside the OEM or vendor supply chain, toolchain, or open source code, per the 0mniteck gist the source doc references (https://gist.github.com/0mniteck/e92c74276333e43912a5baa6802fcbd4, weak external corroboration, jev weight 0.07). The gist is the primary external reference the source doc names; its low weighting reflects aggregator style presentation, not absence of relevance. Where this doc leans on the gist, the claim is a source doc claim first.

## Why the chain is credible as a class

Firmware persistence below the operating system is an established attack class. Securelist's MoonBounce analysis documents a UEFI firmware bootkit implanted in the SPI flash image, executing before the OS and surviving OS reinstalls (https://securelist.com/moonbounce-the-dark-side-of-uefi-firmware/105468/, jev weight 0.62). That is the same structural property the Faux Phy chain exploits: code placed in firmware runs before anything the OS can validate. A community whitepaper cataloguing the same family, LoJax, BlackLotus, MoonBounce and WPBT based OEM backdoors, corroborates that firmware persistence techniques observed in modern operations target UEFI firmware and embedded controllers (https://github.com/patapik/uefi-persistence-whitepaper, jev weight 0.25, weak backing).

The Qualcomm specific half of the chain has recent independent coverage. Kaspersky's analysis of Qualcomm CVE-2026-25262 notes that fixing already deployed devices is fundamentally impossible and that Qualcomm committed to shipping fixed future silicon (https://www.kaspersky.com/blog/qualcomm-cve-2026-25262/55811/, jev weight 0.40, weak backing). A March 2026 writeup of the Qualcomm UEFI and GBL boot chain describes the ABL firmware executing a partition traversal loop through the EDK2 GetBlkIOHandles function during initialization (https://tryigit.dev/qualcomm-uefi-gbl-bootchain-zero-day-exploit/, jev weight 0.22, weak backing). A separate deep dive frames modern Snapdragon boot chain security as a shift in trust boundaries rather than a single bug (https://alephgsm.com/2026/03/09/gbl-boot-chain-research/, jev weight 0.15, weak backing). These are corroborations of the shape of the threat, not of the source doc's specific 91 hidden GPT partition claim, which remains a source doc claim.

## The yubiOS posture against the chain

The source doc states the design principle plainly: every component must be cryptographically validated before it runs. The three phases all require substituting artefacts yubiOS treats as untrusted without a valid signature:

- /usr files: dm-verity validates every read against a Merkle tree whose root hash is baked into the signed kernel command line (usrhash=). A substituted library or generator produces an IO error instead of silent execution (source doc).
- The initrd: the initrd is embedded in the signed UKI as a PE section and measured into PCR 11, so module injection without invalidating the signature is impossible (source doc).
- ACPI tables: overrides require modifying the signed UKI command line, which breaks the Secure Boot signature (source doc).
- UEFI firmware: PCR 4 and PCR 11 measurements plus chipsec detection surface modified firmware, and ConditionSecurity=measured-os refuses to enroll on altered PCR state (source doc).

The chain's runtime phase additionally assumes a TrustZone TEE the attacker can man in the middle (tz.uefisecapp). yubiOS has no TEE dependency: the trust anchor is YubiKey FIDO2, so there is no TEE component to compromise, an architectural immunity the source doc marks explicitly (source doc).

## Reading order

This corpus explicates the chain phase by phase: docs 02 and 03 cover the pre init hijack and runtime control mitigations, doc 04 maps every attack surface in the doc's coverage chart, doc 05 records what yubiOS cannot fully prevent, and docs 06 and 07 carry the mitigation matrix and the hardware validation discipline.
