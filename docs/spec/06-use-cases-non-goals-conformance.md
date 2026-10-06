# Use cases, non-goals and conformance checklist

**Scope line:** sections 5 to 7: the 7 sample use cases, the 4 non-goals, and the 7-point conformance checklist that defines what a build must satisfy to claim yubiOS conformance.

This is an internal-record subtopic, no dig: the material is the source document's own sections, explicated without external research. Grounding spine: `yubi-OS/yubiOS docs/SPEC.md` (source doc).

## The 7 use cases

### UC-1: Personal laptop, full trust chain (x86-64, secondary platform)

Ana installs to her laptop's NVMe with `bootc install to-filesystem --root-mount-spec=""` after preparing and mounting the target filesystems, enrolls her own Secure Boot Platform Key from a YubiKey-generated certificate, and walks the 4-step wizard (source doc). The daily pattern: YubiKey touch plus FIDO2 PIN unlocks the disk, sudo requires a touch, and SSH to servers uses the resident ed25519-sk key. The threat-model payoff is stated in both directions: a stolen laptop leaves the disk unopenable without token and PIN, and a lost YubiKey is recoverable through the printed recovery key followed by re-enrolling a backup key. Updates arrive via `bootc upgrade` with zero re-enrollment, which is the ADR-011 property in practice.

### UC-2: Developer workstation with dev tooling overlays

Ben ships compilers and debug tools as a signed sysext overlay on /usr rather than polluting the immutable base, and runs a Debian toolchain in systemd-nspawn for legacy packages (source doc). The properties the spec calls out: the verity-measured base never changes, `systemd-analyze security` scores stay intact, and removing the overlay restores stock yubiOS byte-for-byte. This is the modularity ladder from section 4.5 exercised at its 2 top rungs.

### UC-3: Multi-user shared machine

A lab machine with 5 users gives each a systemd-homed LUKS2 home bound to their own YubiKey (source doc). The key property is cryptographic inaccessibility: user data is unreadable while its owner is logged out, "even to root on the running system". On suspend, homed flushes keys; resume requires the owner's token. A departing user's home migrates to another machine with `homectl adopt` without re-encryption.

### UC-4: Fleet deployment with attestation

An ops team pins the fleet to `0mniteck/yubios@sha256:...` by digest, verifies SLSA provenance before rollout, and monitors Boot Assessment rollback events as a regression signal (source doc). `ConditionSecurity=measured-os` gates fleet-secret services so that a box with a broken trust chain fails closed. Update cadence is a registry push, and failed updates self-revert.

### UC-5: Offline signing / high-assurance workstation

A release engineer keeps a yubiOS machine as the UKI-signing station: the signing key lives in PIV slot 9c and never leaves the token, `pcscd` plus `systemd-sbsign` sign artifacts with a physical touch per signature (source doc). The spec adds a subtle chain-closure argument: because the signing machine's own chain is signed UKI, verity /usr, and FIDO2 disk, "a compromised artifact pipeline cannot silently persist on the box that signs it".

### UC-6: CI and VM testing (hardware-free)

CI exercises the trust chain without physical tokens (source doc). bcvk ephemeral VMs with host-side swtpm provide `/dev/tpm0` for measured-boot paths, and the swu2f software authenticator covers the pam-u2f CTAP1 leg and the cryptenroll/homed CTAP2 leg. Physical-YubiKey passthrough via `bcvk ephemeral run` USB passthrough covers the remaining hardware-gated tests. The normative constraint: emulated authenticators are TEST-only and MUST NOT appear in production images.

### UC-7: ARM64 single-board computer, owner-owned firmware

Dana provisions a Rock 5B (RK3588): she burns her ROTPK into SoC OTP (Path A, rehearsed on a sacrificial board), builds TF-A, OP-TEE, the ms-tpm-20-ref fTPM, and U-Boot from the pinned yubi-OS forks, and boots the same signed systemd-boot plus UKI she uses on x86-64 (source doc). "Every layer from the boot ROM key up is hers"; the fTPM holds PCRs for attestation while her YubiKey still unlocks the disk. A Path B dev board gets measured-boot attestation instead of enforcement, documented as such (ADR-019). Hardware bring-up is post-launch.

## The 4 non-goals

The spec's non-goals section is as normative as its requirements (source doc):

1. **Malicious UEFI ROM below the Secure Boot chain.** It can be detected with chipsec but cannot be removed; MITIGATE.md owns this residual risk.
2. **TPM-PCR-bound disk encryption.** Deliberately rejected per ADR-011, not merely unsupported.
3. **Hardware that cannot satisfy the version floors of section 4.6.**
4. **Convenience features that would weaken a trust boundary.** Per MISSION.md: "if a feature needs a security exception to exist, it gets cut".

The second item is the clearest statement of design philosophy in the document: the rejection of PCR-bound disk unlock is the mechanism that makes update-survivability possible, so it is a non-goal precisely because it contradicts a MUST.

## The 7-point conformance checklist

Section 7 defines what a build or deployment MUST satisfy to claim conformance (source doc):

1. Base image and every CI action digest-pinned per PINNED.md; build passes yubiOS.rego.
2. UKI signed via owner-held PIV slot 9c; Secure Boot db contains only owner-enrolled keys.
3. /usr mounted read-only via composefs plus dm-verity (erofs backing store); `usrhash=` in the signed cmdline.
4. LUKS2 root enrolled with FIDO2 hmac-secret (PIN plus touch) and a recovery key; no TPM PCR-hash slot.
5. A/B updates with Boot Assessment; `yubiOS-upgrade.service` calls `bootctl set-boot-good` only after health checks.
6. `yubiOS-enroll.service` gated by `ConditionSecurity=measured-os`.
7. No mutable-tag (`:latest`, branch) references anywhere in Containerfile or workflows.

The checklist is a restatement of the spec's MUSTs in testable form. Point 4 encodes both halves of the trust-model decision: FIDO2 enrollment with PIN plus touch, and the explicit absence of a TPM PCR-hash slot. Point 7 closes the mutable-tag loophole that would otherwise undermine the digest-pinning of point 1.

## How the 3 sections work together

The use cases show the normative text in operation, the non-goals show what the text refuses, and the checklist compresses both into an audit surface. A reader validating a yubiOS claim starts at the checklist, drills into the corresponding section for semantics, and uses the use cases to see the intended operational behavior.
