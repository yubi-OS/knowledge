# systemd-homed-reference

Knowledge corpus minted from yubi-OS/yubiOS refs/systemd-homed-reference-2026-07-23.md. Topic: the systemd-homed reference, portable encrypted home directories, LUKS2 backing, FIDO2/PKCS#11 authentication, homectl operations, and the PAM integration.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [01-architecture-user-records.md](./docs/01-architecture-user-records.md) | How systemd-homed makes the home carry its own identity: embedded JSON user record, NSS synthesis with no /etc/passwd, userdbctl, signed records, blob directories. |
| 02 | [02-storage-backends.md](./docs/02-storage-backends.md) | The five storage backends (luks, fscrypt, subvolume, directory, cifs), how each mounts, and homed.conf defaults DefaultStorage/DefaultFileSystemType. |
| 03 | [03-homectl-operations.md](./docs/03-homectl-operations.md) | The homectl command surface: create, update, resize, passwd, inspect and its -E/-EE export formats, and the activate/deactivate/lock/unlock lifecycle. |
| 04 | [04-fido2-authentication.md](./docs/04-fido2-authentication.md) | FIDO2/YubiKey authentication via the hmac-secret extension: enrollment flags, COSE algorithms, enrollment rough edges, and the single-device limitation. |
| 05 | [05-pkcs11-piv-authentication.md](./docs/05-pkcs11-piv-authentication.md) | PKCS#11/PIV token authentication: token URIs and PIV slot selection, the YKCS11 module, the pre-auth identity advantage, and known failure modes. |
| 06 | [06-pam-integration.md](./docs/06-pam-integration.md) | pam_systemd_home PAM stack wiring across auth/account/password/session, bracketed control structure, and the suspend=1 key-material semantics. |
| 07 | [07-migration-signing-keys.md](./docs/07-migration-signing-keys.md) | Moving homes between hosts: the Ed25519 signing key model under /var/lib/systemd/home, the copy-and-rescan flow, export-based migration, and key backup. |
| 08 | [08-version-evolution.md](./docs/08-version-evolution.md) | What systemd v257 through v261 changed in the homed surface, and the still-open issue 28893 multi-FIDO2-device limitation. |

## Research summary

- Results collected: 96 (top 6 per query, 16 searXNG queries across 8 subtopics)
- Weight split: 61 authoritative (weight >= 0.5), 35 weak (weight < 0.5), 0 unscored
- jev requests: 22 (16158 input tokens, 0 output tokens)
- Redos: 1 (outline request retried once after a 502 from /api/decide; all weighting batches passed first try)
- Redo digs: 0 (every subtopic's first-pass dig was strong enough to author)
- Skipped docs: none
- Per-doc result counts (kept / primary >= 0.5): 01: 12/9, 02: 12/7, 03: 12/8, 04: 12/5, 05: 12/6, 06: 12/9, 07: 12/8, 08: 12/9

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

## Gaps

- Claims carried from the source reference without dig backing (systemd issue 28893 status, v257/v260 table rows) are labeled in-text as not dig-scored and point at their primary upstream URLs.
- Two forum-sourced failure reports in 05-pkcs11-piv-authentication are cited at their measured weights (0.04) and labeled weak in-text.
