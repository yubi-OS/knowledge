# 08 - fTPM vs YubiKey: keep them complementary

Scope: the trust-boundary split between the on-device fTPM (platform integrity) and the off-device YubiKey (user identity and disk unlock), and the rule that keeps the fTPM from ever becoming the sole gate.

## The two roles

The source doc fixes the split as a table (source doc, section "fTPM vs YubiKey - keep them complementary"):

| | fTPM (in OP-TEE) | YubiKey 5 |
|---|---|---|
| Job | Platform integrity, PCR measurement, attestation, optional seal | User identity, secret unlock, signing |
| Location | On-device, secure world | External hardware, off-device |
| yubiOS use | Measured boot + attestation root on ARM64; bind ConditionSecurity=measured-os | Primary RoT, unchanged; FIDO2 hmac-secret unlocks LUKS2 (ADR-003) |

The division is by trust direction: the fTPM answers "is this machine running the firmware and OS we signed" (platform integrity, measured boot, attestation), while the YubiKey answers "is the person holding this machine the one who enrolled it" (user identity, secret unlock, signing). The Yubico documentation confirms the mechanism on the YubiKey side: the hmac-secret and hmac-secret-mc FIDO2 extensions enable creation of a symmetric secret value scoped to a credential (https://docs.yubico.com/yesdk/users-manual/application-fido2/hmac-secret.html, jev weight 0.08, weak backing), which is the primitive ADR-003 uses for LUKS2 unlock.

## The rule

The source doc states the rule in one line: the YubiKey stays the disk-unlock path; the fTPM seal, if used, is an additive attestation or fallback bound to PCRs, never the sole gate (source doc, section "fTPM vs YubiKey"). The rationale is the reason the skill exists at all: if the fTPM becomes the only unlock, yubiOS has reintroduced exactly the on-device, vendor-shaped trust anchor it exists to remove (source doc, section "fTPM vs YubiKey"). The fTPM is on-device software; an attacker with the device has the device's TPM. The YubiKey is off-device; possession of the machine does not include possession of the unlock factor.

The two mechanisms are technically capable of overlapping, which is why the rule needs to be explicit. TPM 2.0 sealing binds a secret to PCR state so it releases only under matching platform conditions (https://www.wolfssl.com/tpm-2-0-sealing-policies-with-wolftpm-pcr-policies-policy-authorize-and-nv-storage-for-tpm-2-0-secrets/, jev weight 0.11, weak backing; https://learn.microsoft.com/en-us/windows/security/hardware-security/tpm/tpm-fundamentals, jev weight 0.28, weak backing). TPM-bound full-disk auto-unlock is a standard pattern in the Linux ecosystem, documented by Ubuntu for TPM-based LUKS decryption with clevis (https://ubuntu.com/server/docs/how-to/security/tpm-backed-luks-decryption-with-clevis/, jev weight 0.10, weak backing) and by Fedora Magazine for automatically decrypting a disk using TPM2 (https://fedoramagazine.org/automatically-decrypt-your-disk-using-tpm2/, jev weight 0.09, weak backing). The YubiKey path likewise supports passwordless LUKS unlock: FIDO2 tokens with the hmac-secret extension work as a strong single factor for LUKS (https://github.com/nyancient/fido2-luks, jev weight 0.04, weak backing), and systemd supports unlocking LUKS volumes with a YubiKey since systemd 248 (https://www.guyrutenberg.com/2022/02/17/unlock-luks-volume-with-a-yubikey/, jev weight 0.08, weak backing). Both routes exist; yubiOS deliberately picks the off-device one as primary.

## Why the fTPM seal still matters

An additive fTPM seal buys a property the YubiKey cannot provide: continuity with the platform state. A YubiKey unlock proves the user is present and enrolled; it says nothing about what firmware booted the machine the user is unlocking. The fTPM seal bound to PCRs 0, 1, and 7 (doc 07) asserts the firmware and policy are the signed ones. Used together, the unlock requires the user factor and the seal check asserts platform integrity; used alone, the fTPM seal degrades to a possession-of-device factor, which is the failure mode the rule forbids.

The Microsoft TPM fundamentals page makes the same division of labor explicit for BitLocker: the TPM can seal and unseal data generated outside the TPM, and sealed keys lock data until specific hardware or software conditions are met (https://learn.microsoft.com/en-us/windows/security/hardware-security/tpm/tpm-fundamentals, jev weight 0.28, weak backing). That is the platform-integrity role; nothing in it authenticates a user across devices.

## Interaction with the rest of the corpus

The split composes with the measured-boot and sealing docs as follows:

1. Docs 01 through 06 establish that the fTPM is alive from OP-TEE boot and produces a trustworthy PCR set.
2. Doc 07 fixes what those PCRs measure and what to seal to them.
3. This doc fixes who may consume the seal: attestation consumers and, additively, a fallback unlock path. The disk-unlock primary remains ADR-003's YubiKey FIDO2 hmac-secret path.
4. The ConditionSecurity=measured-os binding in the source doc's yubiOS row is the enforcement point: measured boot state gates OS-level security conditions, not disk decryption.

## Weak-backing note

This subtopic's dig produced no source at 0.5 or above, across the original queries and one redo with different queries (systemd-cryptenroll and clevis-focused searches). All external claims above carry weak labels (0.04 to 0.28). The sources are nevertheless the official vendor or project documentation for the mechanisms they describe (Yubico SDK docs, Ubuntu server docs, Yubico-backed FIDO2-LUKS tooling), which is why they are cited despite the low scores. The trust-boundary table, the rule, and the ADR-003 references come from the source doc.
