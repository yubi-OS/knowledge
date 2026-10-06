# yubikey-hw-validation-scenarios

Knowledge corpus on minimum real-hardware YubiKey validation scenarios: the proposed scenario set for validating FIDO2/PIV behavior on physical keys, and what each scenario proves. Minted from yubi-OS/yubiOS refs/yubikey-hw-validation-scenarios-2026-07-25.md.

## Docs

- 01-luks2-fido2-unlock.md: Fresh bootc install with systemd-cryptenroll FIDO2 enrollment and initrd unlock (scenario H1): the happy-path proof that the enrolled key boots and unlocks.
- 02-luks2-unlock-failures.md: LUKS2 unlock failure handling on real hardware (H2, H3): key absent falls back to passphrase, user-presence timeout fails cleanly and retries on touch.
- 03-systemd-homed-fido2.md: systemd-homed with FIDO2 on real hardware (H4, H5): homectl create with luks storage, login gated on key presence, and the recovery-key unlock path when the key is lost.
- 04-pam-touch-enforcement.md: PAM login and sudo require a physical touch, not mere enumeration (H6): pam_u2f and pam_systemd_home presence semantics with key present-but-untouched vs touched.
- 05-ssh-fido2-resident-keys.md: SSH authentication with FIDO2 resident keys (H7): ssh-keygen ed25519-sk on the YubiKey, authorized_keys, accept with key present and reject when removed.
- 06-piv-secure-boot-signing.md: PIV slot 9c signing for Secure Boot (H8, H9): sbsign via libykcs11 PKCS11 signs a UKI, hardware boots with SB enforcing, and a mis-signed or unsigned UKI is rejected.
- 07-token-identity-preauth.md: Token identity readable before authentication (H10): PIV identity visible pre-auth so systemd-homed pkcs11-token-uri auto-selects the right username per inserted key.
- 08-multikey-enrollment-revocation.md: Multi-key enrollment and revocation (H11): a second enrolled YubiKey unlocks the same resource, and wiping one slot leaves the other functional.
- 09-suspend-resume-key-material.md: Suspend and resume key handling (H12): suspend=1 PAM entries forget key material so resume demands a fresh touch instead of a cached session.
- 10-evidence-and-sequencing.md: Evidence capture and sequencing for the real-hardware run: what logs and artifacts each scenario must capture, and the B-VM-CTAP2-before-B-REAL-FIDO2 ordering with H8/H9 independence.

## Research summary

- Results collected: 95 (deduplicated from 120 raw kept results across 20 searXNG queries)
- Weight split: 44 high (>= 0.5) / 51 low (< 0.5)
- jev requests: 21, usage tokens in 17400 / out 0
- Redo counts: 0 (no thin digs required a redo)
- Skipped docs: none

## Per-doc sources

| doc | results kept | primary (>= 0.5) |
|---|---|---|
| 01-luks2-fido2-unlock | 10 | 5 |
| 02-luks2-unlock-failures | 6 | 2 |
| 03-systemd-homed-fido2 | 8 | 3 |
| 04-pam-touch-enforcement | 10 | 5 |
| 05-ssh-fido2-resident-keys | 11 | 4 |
| 06-piv-secure-boot-signing | 12 | 6 |
| 07-token-identity-preauth | 8 | 4 |
| 08-multikey-enrollment-revocation | 11 | 5 |
| 09-suspend-resume-key-material | 7 | 5 |
| 10-evidence-and-sequencing | 12 | 5 |

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
