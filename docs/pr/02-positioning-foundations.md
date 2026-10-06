# 02 - Positioning foundations: credible ownership, timing, whitespace, comparison map

Scope: what yubiOS can credibly own in public messaging, why 2026 category timing makes the campaign possible, the public-discovery whitespace, and the reference map that keeps comparisons non-adversarial.

Grounding spine: yubi-OS/yubiOS docs/PR.md, section "Research synthesis".

## What the project can credibly own

The source doc enumerates the design facts the repository itself supports (source doc: yubi-OS/yubiOS docs/PR.md):

- A FIDO2-first, image-based Linux system with the YubiKey as the owner-facing human-presence and identity root.
- PIV/PKCS#11 for owner-controlled Secure Boot signing; FIDO2 hmac-secret for LUKS2 and home unlock; resident FIDO2 credentials for SSH; pam-u2f for login and sudo.
- A read-only, verified /usr, signed unified kernel images, bootc/OCI delivery, digest-pinned inputs, build policy, provenance, SBOMs, and A/B recovery.
- ARM64 as the primary platform because it offers a plausible path to an owner-provisioned chain below the UKI; x86-64 remains supported above OEM firmware.
- A public threat model distinguishing preventive controls, detection, proposed controls, and residual risk.
- An unusual mission: use AI heavily while designing a system that does not rely on trusting the author, human or machine.

These are the only facts the campaign may lead with. Everything else in the positioning is commentary on this list.

## Why the timing works

The source doc argues that image-based and verifiable Linux became a recognizable category rather than an obscure implementation detail, citing 4 external anchors (source doc, with dig corroboration):

- bootc applies OCI container-image transport and update mechanics to host operating systems. The official bootc repository (https://github.com/bootc-dev/bootc, jev weight 0.85) describes applying the container model to bootable host systems, and the Fedora bootc documentation (https://docs.fedoraproject.org/en-US/bootc/getting-started/, jev weight 0.93) frames bootable containers as transactional, in-place operating system updates.
- Fedora Atomic Desktops present image-based, read-only desktop systems, and Fedora published sealed bootable container test images with a verified boot-chain story (source doc link: https://fedoramagazine.org/sealed-atomic-desktops-test-images/).
- Amutable is publicly framing determinism and cryptographically verifiable integrity as a new Linux foundation (source doc link: https://amutable.com/blog/introducing-amutable). The dig found Amutable's own site stating it is "bringing determinism and verifiable integrity to Linux systems" (https://amutable.com/, jev weight 0.17, weak backing) and independent press coverage by heise (https://www.heise.de/en/news/Secure-Linux-Amutable-brings-cryptographically-verifiable-integrity-11157020.html, jev weight 0.31, weak backing). Both weak-weighted results are used only to confirm the framing exists publicly, not to add claims.
- SLSA and CISA Secure by Design give audiences an established vocabulary for provenance, transparency, and shifting security burden away from users (source doc; the SLSA specification's provenance pages are live at https://slsa.dev/spec/v0.1/provenance, jev weight 0.93, and the source doc cites the v1.2 specification at https://slsa.dev/spec/v1.2/).

The document draws the correct boundary from this convergence: it validates the category but removes any basis for claiming that immutability, OCI delivery, or verified boot is unique. yubiOS must differentiate on owner-held control, physical presence, the identity/platform split, and unusually explicit evidence boundaries (source doc).

## Public whitespace

As of 2026-07-16, broad web discovery primarily surfaces the project's own GitHub repository (https://github.com/yubi-OS/yubiOS) and GitHub Pages site (https://yubi-os.github.io/) (source doc). The document reads this as a clean opportunity: establish the category language before outside summaries harden around the ambiguous "No TPM" slogan.

## Reference and comparison map

The document positions 5 projects as references or adjacent alternatives, never targets for adversarial comparison (source doc):

| Project | Public center of gravity | yubiOS distinction to explain |
|---|---|---|
| Qubes OS | Desktop security through compartmentalization | yubiOS centers boot integrity, owner-held credentials, and image delivery; it does not replace application compartmentalization |
| secureblue | Hardened Fedora Atomic desktop/server images | yubiOS centers an owner-held signing/unlock boundary and a planned owner-owned ARM64 platform chain |
| Fedora Atomic Desktops | Image-based general-purpose desktops | yubiOS is a security thesis and integration project built on the same broader ecosystem, not a Fedora replacement |
| Talos Linux | Minimal, immutable, API-managed Kubernetes nodes | yubiOS targets owner-operated machines and physical-presence workflows rather than Kubernetes-only infrastructure |
| Amutable | Deterministic, verifiable Linux foundations | yubiOS adds an owner-held identity and secret-release constraint while building from many of the same systemd-era ideas |

The blanket rule attached to this map: never claim "first," "only," or "most secure." The defensible language is "yubiOS explores," "yubiOS is building," or "the project combines" (source doc).
