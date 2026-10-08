# systemd-homed knowledge corpus

Minted 2026-10-06 from the yubiOS ground source `yubi-OS/yubiOS skills/systemd-homed/SKILL.md` (11213 bytes fetched from raw.githubusercontent.com with User-Agent omni-agent/1.0). The corpus explicates the skill: what systemd-homed is, how yubiOS uses it, and the domain knowledge it encodes. Every factual claim carries its source URL and jev weight; claims from the source doc are attributed to it explicitly.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | docs/01-homed-model-and-user-records.md | The homed model: portable homes, embedded JSON user records, NSS synthesis, no /etc/passwd |
| 02 | docs/02-create-luks2-home-fido2.md | Creating a LUKS2 home with FIDO2 unlock, btrfs, recovery key ordering, PIN plus presence flags |
| 03 | docs/03-enroll-fido2-existing-home.md | Enrolling FIDO2 on an existing home, recovery-key update on v259+, password fallback reality |
| 04 | docs/04-pkcs11-piv-yubikey.md | PKCS#11 / PIV unlock with YubiKey slot 9c, token enumeration, PIV pre-auth identity advantage |
| 05 | docs/05-inspect-and-manage-homes.md | homectl inspect, list, passwd re-keying, resize, group membership updates |
| 06 | docs/06-migration-between-machines.md | Home migration: key exchange, .home copy, SIGUSR1 rescan since v258, activation, re-signing |
| 07 | docs/07-pam-configuration.md | pam_systemd_home.so across all four stacks, control flags, suspend=1 key erasure |
| 08 | docs/08-homed-conf-and-defaults.md | homed.conf and drop-ins: DefaultStorage=luks, DefaultFileSystemType=btrfs |
| 09 | docs/09-home-areas-v258.md | Home areas since v258: ~/Areas subdirs, %area login, run0 --area, --default-area |
| 10 | docs/10-signing-keys-and-trust.md | local.private/local.public, trusted remote keys, v258+ signing-key verbs |
| 11 | docs/11-yubios-deployment-checklist.md | The 7-gate yubiOS deployment checklist and the verification pass |
| 12 | docs/12-yubios-primitive-integration.md | 10-primitive mapping, trust-chain anchor role, cycle 5 to 7 RSI audit trail |

## Research summary

- Results collected: 144 (searXNG dig, 2 queries per subtopic, top 6 per query kept)
- Weight split: 51 primary (weight >= 0.5) / 93 low (< 0.5)
- Docs kept/skipped: 12 / 0
- Redo counts: 0 (all 24 first-attempt queries returned 200)
- Skipped docs: none
- jev requests: 13 (1 outline validation, 12 weighting batches), usage 19140 input / 2968 output tokens
- Weighting endpoint: https://api.defapi.org/api/v1/decisions (DefAPI direct, model typesafe/jev-1.13), batches of 12, 0.6s pacing; worker relay fallback not needed

Preflight 2026-10-06: searXNG results healthy (campaign preflight by orchestrator, agent-side probe skipped per brief); /api/decide (clef) healthy, DefAPI direct 200.

## Research DB

Under research-db/: preflight.json, outline.json, archive.json (all 144 weighted results), digs/ (per-subtopic dig records), jev-log.json, db.ts (schema v2 interfaces).
