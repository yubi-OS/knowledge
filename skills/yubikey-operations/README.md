# yubikey-operations knowledge corpus

Knowledge corpus explicating the yubiOS skill `skills/yubikey-operations` (yubi-OS/yubiOS): YubiKey-specific identity operations, FIDO2 enrollment (hmac-secret, passkey, PRF), PIV slot management, ssh-key provisioning from PIV and FIDO2, attestation certificate extraction, multi-key quorum patterns, and the backup/restore discipline.

Ground source: `yubi-OS/yubiOS skills/yubikey-operations/SKILL.md` (15,859 bytes, fetched 2026-10-06 with User-Agent omni-agent/1.0). The source doc is the primary source of record; every doc below cites it as the grounding spine plus searXNG dig results with jev noul weights.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | 01-identity-root-model.md | The YubiKey vs fTPM split: owner-held cryptographic identity vs platform-bound attestation |
| 02 | 02-piv-slot-conventions.md | PIV slot map (9a/9c/9d/9e/82-95), slot F9 attestation key, generation history |
| 03 | 03-fido2-hmac-secret.md | hmac-secret extension mechanics and consumers (cryptenroll, homed, age) |
| 04 | 04-prf-and-passkeys.md | PRF extension and the passkey / discoverable-credential posture |
| 05 | 05-ssh-key-provisioning.md | SSH keys from PIV slot 9a via PKCS#11 and from FIDO2 sk keys |
| 06 | 06-multi-key-quorum.md | 2-of-3 and 3-of-5 owner-held root-of-trust patterns |
| 07 | 07-backup-restore-discipline.md | The five-step destructive-enrollment ceremony and 90-day retirement |
| 08 | 08-attestation-extraction.md | PIV attest action, slot F9 chain, FIDO2 enterprise attestation, audit workflow |

## Research summary

- Results collected: 91 (82 first pass + 9 from the 06 redo)
- Weight split: 43 at or above 0.5 (authoritative) / 48 below 0.5 (weak, labeled in text)
- jev requests: 8 (1 outline score + 6 noul weighting batches + 1 redo noul batch), usage 10,635 input / 1,790 output tokens
- Redo counts: 1 (subtopic 06 multi-key-quorum, initial dig too thin and mostly off-topic)
- Skipped docs: none. All 8 subtopics authored.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); decide via DefAPI direct (typesafe/jev-1.13), agent-side probe skipped for speed per brief.

## Notes

- The 06 subtopic scored 0.96 (marginal, keep only if the dig comes back strong). The first dig returned mostly off-topic results; the redo added 9 results including a weight-0.72 Yubico backup/recovery plan page, so it was kept.
- Claims from the source doc are attributed "source doc". Claims from digs carry their URL and jev weight; weights below 0.5 are labeled as weak backing.
- research-db/ holds schema v2: preflight.json, outline.json, archive.json, digs/NN-slug.json, jev-log.json, db.ts.
