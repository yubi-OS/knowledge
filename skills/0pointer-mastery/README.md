# 0pointer Mastery - Knowledge Corpus

Explication of the yubiOS skill `0pointer-mastery`: the Lennart Poettering / systemd ecosystem mastery skill, the blog canon it covers, the big-picture mapping it provides, and how it bridges the Poettering vision to yubiOS (YubiKey replaces TPM2 for secrets).

Ground source of record: yubi-OS/yubiOS skills/0pointer-mastery/SKILL.md (fetched 2026-10-06, 21540 bytes). The corpus explicates the skill; the SKILL.md itself is not replaced.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [01-skill-usage-model.md](01-skill-usage-model.md) | How the skill is used: triggers, the 4-step usage method, reference sub-files, audit-trail sections |
| 02 | [02-design-goals-17.md](02-design-goals-17.md) | The 17 design goals mapped to yubiOS implementations |
| 03 | [03-modularity-ladder.md](03-modularity-ladder.md) | sysext vs portable services vs nspawn vs app payloads, and the uniformity rule |
| 04 | [04-trusted-boot-chain.md](04-trusted-boot-chain.md) | UEFI to UKI boot chain, PCR assignments, boot phases, TPM2 vs YubiKey |
| 05 | [05-five-why-answers.md](05-five-why-answers.md) | The five design-rationale answers (ostree, installer, sysext, FIDO2, DPS) |

## Research summary

- Results collected: 45 (8 searXNG queries across 3 web-shaped subtopics; 2 of the 5 kept subtopics are internal-record, no dig)
- Weight split: 17 results weighted >= 0.5 (primary/official), 28 results weighted < 0.5 (weak, labeled in text where used)
- jev requests: 7 total (1 failed 500 on the outline request, 2 successful outline sends including 1 duplicate resend, 4 noul weighting batches of 12/12/12/9); usage 7,410 input / 1,134 output tokens, cost 0.000639 USD
- Redos: 2 dig redos (t04 q2 re-queried for PCR 12/15-specific sources; t09 q1 re-queried after 5 of 6 first-pass results were off-topic slang pages). No doc skipped
- Skipped docs: none. Dropped outline candidates (jev score < 0.5 band): partition-layout-factory-reset (0.43), update-lifecycle (0.41), systemd-homed-homes (0.40), systemd-version-landscape (0.15), amutable-2026 (0.14)
- Gaps: none blocking. The ostree-vs-dm-verity comparison axis has no external source weighted >= 0.5, so doc 05 attributes that claim to the source doc and labels the weak-weight pages as weak

## Research-db

- research-db/preflight.json, outline.json, archive.json, jev-log.json, db.ts
- research-db/digs/01-skill-usage-model.json through 05-five-why-answers.json

Metrics: score (outline validation) and noul (source weighting) via typesafe/jev-1.13 on the DefAPI direct endpoint (https://api.defapi.org/api/v1/decisions), per the 2026-10-06 speed optimization.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); jev decision model healthy on DefAPI direct.
