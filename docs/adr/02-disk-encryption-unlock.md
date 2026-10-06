# 02 - Disk encryption and unlock (ADR-003, ADR-009, ADR-011)

Scope: LUKS2 unlocked by FIDO2 through systemd-cryptenroll, the PIN policy and mandatory recovery key, systemd-homed per-user LUKS2 home volumes, and the deliberate choice of HMAC-secret enrollment over TPM2 PCR binding so OS updates need no re-enrollment.

## The base decision (ADR-003)

The source doc (yubi-OS/yubiOS docs/ADR.md, ADR-003, status Accepted) decides that disk encryption uses LUKS2 with `systemd-cryptenroll --fido2-device=auto` and that no TPM slot is enrolled. The FIDO2 credential using the HMAC-secret extension is stored in the LUKS2 token header, so the disk is unlockable on any machine where the YubiKey is present, unlike TPM-bound disks which are board locked. Touch is required at every boot to prevent silent decryption. The systemd man page for systemd-cryptenroll corroborates the enrollment model: it enrolls hardware security tokens into a LUKS2 volume for use at boot (https://www.freedesktop.org/software/systemd/man/251/systemd-cryptenroll.html, weight 0.48, weak but primary documentation; the upstream latest URL from the source doc is https://www.freedesktop.org/software/systemd/man/latest/systemd-cryptenroll.html). A community guide describing the same TPM2, FIDO2, PKCS#11 triad scored 0.10 and is not load bearing (weak, aggregator).

A v261 review note dated 2026-07-11 in the source doc records that no regressions in the v257 to v261 systemd range affect the `--fido2-device=auto` and `--fido2-with-client-pin=yes` paths.

## PIN policy and recovery key

ADR-003 sets 2 defaults (source doc): `--fido2-with-client-pin=yes` is the yubiOS default, so boot requires FIDO2 PIN plus touch, described as the strongest available option without biometrics; and a recovery key enrolled with `systemd-cryptenroll --recovery-key` is mandatory alongside FIDO2, printed once and stored physically offline, because it is the only escape hatch if the YubiKey is lost or damaged.

## Optional TPM layer on TPM-present hardware

The source doc adds a scoped carve-out: on hardware with a TPM, or the yubiOS owned ARM64 fTPM of ADR-018, the data encryption key can additionally be sealed to PCR 11 phase word `initrd-enter`; once `initrd-leave` is measured it can no longer be unsealed from userspace, which protects against post-boot key extraction. On the no TPM configuration this layer does not apply, because FIDO2 hmac-secret has no PCR sealing mechanism; the post-boot guarantee instead rests on the key never being stored at rest, derived per boot from the YubiKey with PIN and touch. The doc is careful to say this phase word sealing is a separate, optional, TPM dependent layer, consistent with the no PCR hash binding rationale below. (source doc)

## Per-user homes: systemd-homed (ADR-009)

ADR-009 (source doc, status Accepted) replaces system wide full disk encryption as the user data boundary: each home directory is an independent LUKS2 volume unlocked by the user's own YubiKey FIDO2 credential. Recorded rationale: user data is cryptographically inaccessible even when the system is running but the user is not logged in; homed flushes LUKS2 keys before system suspend and resumes only after YubiKey re-authentication, so the key never sits in RAM during suspend; the LUKS2 home volume is a self contained file that migrates between machines with `homectl adopt` without re-encryption; and UID assignment is dynamic at login via uidmap mounts, avoiding fixed UID conflicts across machines. The 0pointer essay on authenticated boot and disk encryption is cited by the source doc as the conceptual grounding (https://0pointer.net/blog/authenticated-boot-and-disk-encryption-on-linux.html).

Implementation details from the source doc: `homectl create --fido2-device=auto <user>` at first boot inside the enrollment wizard step, `homectl update --fido2-device=auto` to add a second YubiKey as backup token, the v258 additions `homectl add-signing-key` and `homectl list-signing-keys` for portable home migration and audit, and btrfs as the required home filesystem for online resize.

Community corroboration for the portability and suspend locking behavior exists (https://wiki.archlinux.org/title/Systemd-homed, weight 0.32, weak; https://dev.to/lyraalishaikh/practical-encrypted-home-directories-with-systemd-homed-on-linux-bhp, weight 0.07, weak) but the ADR text itself is the authority for the yubiOS specifics.

## Update survivability: HMAC-secret over PCR binding (ADR-011)

ADR-011 (source doc, status Accepted) is the decision that explains why no TPM slot is enrolled in ADR-003: TPM2 PCR hash policies invalidate the LUKS2 enrollment on every kernel, initrd, or boot configuration change, because PCR 11 changes with every UKI rebuild. FIDO2 HMAC-secret produces a deterministic key from credential ID, salt, and PIN, independent of the running OS version, so updates require zero re-enrollment. The source doc cites the systemd 248 unlock essay (https://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-248.html, weight 0.29 in the dig, weak) and the Brave New Trusted Boot World essay (https://0pointer.net/blog/brave-new-trusted-boot-world.html), noting that signed PCR policies solve the update problem for TPM2 but need a distribution maintained signing infrastructure, while FIDO2 achieves update survivability with hardware possession as the proof.

The recorded trade-off: FIDO2 does not verify which OS is running before releasing the key. The disk unlocks with the correct YubiKey regardless of the boot environment. The ADR accepts this consciously, arguing physical possession is the equivalent protection and it avoids OEM and distribution trust dependencies.

## Sources considered

| Source | Weight | Role |
|---|---|---|
| https://www.freedesktop.org/software/systemd/man/251/systemd-cryptenroll.html | 0.48 (weak) | cryptenroll enrollment model |
| https://wiki.archlinux.org/title/Systemd-cryptenroll | 0.37 (weak) | community corroboration |
| https://0pointer.net/blog/unlocking-luks2-volumes-with-tpm2-fido2-pkcs11-security-hardware-on-systemd-248.html | 0.29 (weak) | FIDO2/TPM2 unlock essay |
| https://wiki.archlinux.org/title/Systemd-homed | 0.32 (weak) | homed portability |
| https://dev.to/lyraalishaikh/practical-encrypted-home-directories-with-systemd-homed-on-linux-bhp | 0.07 (weak) | community corroboration |
| yubi-OS/yubiOS docs/ADR.md (source doc) | n/a | ADR-003, ADR-009, ADR-011 text |
