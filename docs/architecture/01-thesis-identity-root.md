# 01. Thesis: the FIDO2-first identity root of trust

Scope: why yubiOS puts the owner-held YubiKey at the center of the trust model, and how the platform root of trust is kept intentionally separate.

Grounding spine: source doc `yubi-OS/yubiOS docs/ARCHITECTURE.md`.

## The thesis itself

The source doc states the thesis directly: yubiOS is a FIDO2-first immutable Linux system where the owner-held YubiKey is the human-presence and identity root of trust (source doc). Two words carry most of the weight. "Owner-held" means the key is in the hands of the person running the system, not an OEM, not a cloud provider, and not a certificate authority. "Human-presence" means the key enforces physical interaction: a tap on the capacitive sensor is the proof that a human authorized the action.

The platform root of trust is deliberately a different object. On ARM64 the long-term production path is an owner-provisioned TF-A + OP-TEE + fTPM stack; on x86-64 the platform firmware and TPM remain OEM-supplied, so x86-64 is fully supported but is not the flagship ownership story (source doc). In other words, the identity layer (who am I, unlock my disk, authorize sudo) is always the YubiKey, while the platform-integrity layer (is this firmware authentic) differs by platform.

## What FIDO2-first buys

FIDO2 is the Yubico-supported open authentication standard for passwordless login; passkeys are built on the same FIDO2 specifications (https://fidoalliance.org/passkeys/, jev weight 0.55). FIDO2 keeps private authentication keys on a user's device, which protects against phishing and credential theft (https://www.microsoft.com/en-us/security/business/security-101/what-is-fido2, jev weight 0.42, weak backing). yubiOS leans on that same property but pushes it further than typical web login: the FIDO2 credential becomes the disk unlock factor, the home encryption factor, the SSH key type, and the PAM factor for login and sudo, all described in the source doc's trust-boundaries table.

The Yubico FIDO2 overview confirms the standard's direction of travel toward hardware-bound, user-verifying credentials (https://www.yubico.com/authentication-standards/fido2/, jev weight 0.5).

## The design lineage

The yubiOS repository describes the project as a FIDO2-first immutable OS with HSM/U2F as the root of trust, and cites the "Fitting Everything Together" essay at 0pointer.net as the primary design reference: hermetic /usr, Discoverable Partitions Specification partitions, systemd-repart on first boot, A/B sysupdate, and systemd-homed per-user encryption (https://github.com/yubi-OS/yubiOS, jev weight 0.8). The project landing page frames the same idea as "no OEM, no trust anchors you don't control" (https://yubi-os.github.io/, jev weight 0.49, weak backing).

That lineage explains the split-root design. Poettering's model separates the immutable system image from per-machine state and per-user secrets; yubiOS keeps the image integrity side on systemd's native tooling while relocating the secrets side to a YubiKey the owner physically holds.

## Why the platform root is separate

The source doc is explicit that measurement is complementary to YubiKey possession, not a replacement (source doc). A TPM or fTPM can attest what booted, but it cannot prove a human was present, and it cannot move between machines. A FIDO2 key can prove presence but cannot attest firmware state. yubiOS therefore uses both, each for what it is good at: fTPM PCRs for the sealed-boot digest chain, FIDO2 for everything that must touch a human.

The consequence is a small, checkable set of owner-controlled materials listed in the source doc trust-boundaries table: the PIV private key and enrolled certificate for signing, FIDO2 hmac-secret credentials plus recovery keys for disk unlock, per-user FIDO2 credentials for homes, and FIDO2 resident keys for SSH. Nothing in that list requires trusting an OEM on the flagship path.

## What this means for the rest of the architecture

The thesis drives the document's later sections. Target platforms exist to answer one question: can the owner burn their own root of trust into the board (Path A) or not (Path B, x86-64). The boot flow exists to bind a signed UKI to a composefs digest that the YubiKey-signed key material anchors. First-boot services exist to enroll the YubiKey at the earliest safe moment. The kernel plus rootfs split (ADR-032) exists so that the signed artifact set stays stable across update granularity changes. Every later section is the thesis applied.
