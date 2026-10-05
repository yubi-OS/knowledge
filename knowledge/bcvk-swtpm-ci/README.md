# bcvk-swtpm-ci knowledge corpus

Software TPM (swtpm) integration for bootc VM testing in CI: running a software TPM 2.0 device in QEMU VMs for reproducible TPM-backed flows without real hardware. Minted 2026-10-05 from yubi-OS/yubiOS `refs/bcvk-swtpm-ci-2026-07-23.md`.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-swtpm-fundamentals.md](01-swtpm-fundamentals.md) | What the swtpm emulator is, its libtpms front-end interfaces, and companion provisioning tooling. |
| 02 | [02-qemu-tpm-integration.md](02-qemu-tpm-integration.md) | QEMU -tpmdev emulator backend, tpm-tis vs tpm-crb guest devices, TPM_Startup ordering. |
| 03 | [03-guest-kernel-tpm-plumbing.md](03-guest-kernel-tpm-plumbing.md) | Guest kernel tpm_tis/tpm_crb drivers and the /dev/tpm0 + /dev/tpmrm0 device nodes. |
| 04 | [04-systemd-tpm2-stack.md](04-systemd-tpm2-stack.md) | systemd-tpm2-setup services, systemd PCR measurements, and TPM2 cryptenroll in guests. |
| 05 | [05-bcvk-directboot-vm-flags.md](05-bcvk-directboot-vm-flags.md) | bcvk ephemeral VMs, the DirectBoot UKI path, and the yubiOS fork's --swtpm/--swu2f flags. |
| 06 | [06-measured-boot-verification.md](06-measured-boot-verification.md) | PCR banks, the TPM2 event log, and tpm2-tools assertions without hardware. |
| 07 | [07-swtpm-state-provisioning.md](07-swtpm-state-provisioning.md) | swtpm_localca certificate provisioning, persistent state, and seal/unseal test flows. |
| 08 | [08-swtpm-ci-automation.md](08-swtpm-ci-automation.md) | The TPM2 stack's emulator support, platform precedents, and swtpm+QEMU composition with bcvk in CI. |

## Research summary

- Results collected: 108 (top 6 per query across 18 queries; subtopic 08's off-topic second query was redone with 2 different queries).
- Weight split: 66 results at weight >= 0.5 (primary/official), 42 at weight < 0.5 (weak/aggregator; labeled as weak where cited).
- Jev requests: 25 (1 probe, 1 outline validation with 8 score questions, 23 noul weighting batches). Usage: 18951 input tokens, 0 output tokens.
- Redos: 1 (subtopic 08, dig judged thin; attempt-1 second query discarded unweighted, 2 replacement queries run and weighted).
- Skipped docs: none. All 8 validated subtopics digged strongly enough to author.
- Outline: 8 subtopics proposed, 8 kept (scores 1.553 to 1.920, none dropped).

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

## Outline validation

| NN | slug | score | verdict |
|---|---|---|---|
| 01 | swtpm-fundamentals | 1.888 | load-bearing, kept |
| 02 | qemu-tpm-integration | 1.92 | load-bearing, kept |
| 03 | guest-kernel-tpm-plumbing | 1.553 | load-bearing, kept |
| 04 | systemd-tpm2-stack | 1.811 | load-bearing, kept |
| 05 | bcvk-directboot-vm-flags | 1.877 | load-bearing, kept |
| 06 | measured-boot-verification | 1.716 | load-bearing, kept |
| 07 | swtpm-state-provisioning | 1.706 | load-bearing, kept |
| 08 | swtpm-ci-automation | 1.907 | load-bearing, kept |

## Per-doc sources

| doc | results kept | primary (>= 0.5) |
|---|---|---|
| 01-swtpm-fundamentals.md | 11 | 6 |
| 02-qemu-tpm-integration.md | 11 | 12 |
| 03-guest-kernel-tpm-plumbing.md | 10 | 8 |
| 04-systemd-tpm2-stack.md | 12 | 8 |
| 05-bcvk-directboot-vm-flags.md | 12 | 9 |
| 06-measured-boot-verification.md | 12 | 8 |
| 07-swtpm-state-provisioning.md | 12 | 7 |
| 08-swtpm-ci-automation.md | 18 | 20 |

## Research database

Under `research-db/`: `preflight.json`, `outline.json`, `archive.json` (one entry per collected result with jev weight and full decision record), `digs/` (one record per subtopic), `jev-log.json` (one entry per jev HTTP request), `db.ts` (interfaces).
