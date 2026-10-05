# fido2-secure-boot-boundary

Knowledge corpus on YubiKey FIDO2 as the sole anchor at boot-time security boundaries, minted from yubi-OS/yubiOS `refs/adjacent-problems-fido2-secure-boot-2026-09-01.md` (NSS axis 6/12, Adjacent problems).

The focal problem: one YubiKey anchors four boot-time boundaries. PIV slot 9c signs the UKI that Secure Boot verifies; `systemd-cryptenroll --fido2-device` binds the LUKS2 root to an hmac-secret credential; `systemd-homed` binds the LUKS2 home the same way; `pam-u2f` gates login. The corpus covers each boundary, the alternative unlock models it beats (TPM2 sealing, PKCS#11 PIV unlock, passphrase-only, network-bound disk encryption), and the lifecycle joints (loss and recovery, CI testing, threat model).

## Docs

1. [01-uki-signing-piv9c.md](01-uki-signing-piv9c.md) - PIV slot 9c signing the UKI and boot manager via sbsign/sbctl through YKCS11, and enrollment into UEFI db.
2. [02-cryptenroll-fido2-hmac.md](02-cryptenroll-fido2-hmac.md) - systemd-cryptenroll --fido2-device: hmac-secret LUKS2 credential mechanics and the LUKS2 header metadata.
3. [03-homed-pam-u2f.md](03-homed-pam-u2f.md) - systemd-homed FIDO2-backed LUKS2 homes, pam-u2f login gating, and the circular-lockout failure mode.
4. [04-tpm2-sealing-alternative.md](04-tpm2-sealing-alternative.md) - TPM2 sealing with PCR policies, the firmware-update coupling, and the flip condition for admitting it as a second factor.
5. [05-pkcs11-piv-unlock-alternative.md](05-pkcs11-piv-unlock-alternative.md) - PKCS#11/PIV slot 9a unlock: PIN at every boot, the split verdict that keeps PIV for signing only.
6. [06-tang-clevis-alternative.md](06-tang-clevis-alternative.md) - Network-bound disk encryption: what it buys for fleets and why the anchor becomes a server for a laptop.
7. [07-loss-recovery-quorum.md](07-loss-recovery-quorum.md) - Key loss, the recovery-key slot, rotation via slot removal, and the two-YubiKey quorum gate on removing the passphrase path.
8. [08-fido2-ci-testing.md](08-fido2-ci-testing.md) - FIDO2 end-to-end testing in CI: libfido2 tooling, QEMU U2F emulation and canokey, real-key USB passthrough.
9. [09-anchor-threat-model.md](09-anchor-threat-model.md) - Possession vs knowledge vs server as anchors, the touch surface, and authorisation-to-machine vs identity-to-service.

## Research summary

- Source: `refs/adjacent-problems-fido2-secure-boot-2026-09-01.md`, decomposed into 9 subtopics, all validated load-bearing by jev (noul 0.4324 to 0.9152, none dropped).
- Results collected: 108 (18 searXNG queries, 2 per subtopic, top 6 kept per query).
- Weight split: 68 high / 40 low (jev noul >= 0.5 = high).
- Jev requests: 23 total (1 outline validation + 22 weighting batches of 5). Two 429 rate-limit retries encountered, both recovered on first retry within the pacing budget.
- Redos performed: 0 (every subtopic's first dig yielded enough authoritative material).
- Skipped docs: none. Gaps: none. The 08 FIDO2 CI testing subtopic had the thinnest dig (5 high-weight results) but supports its doc honestly.
- Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200.

## Research DB

- `research-db/archive.json` - every collected result with weight and jev answer.
- `research-db/digs/<subtopic>.json` - per-doc record (queries, redo_count, results_kept).
- `research-db/db.ts` - typed index (`DugResult`, `DigRecord`, `ArchiveEntry`).
- `research-db/outline-validation.json` - the outline validation jev response.
