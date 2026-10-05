# mode-attestation-measurement

Knowledge corpus on execution modes for attestation and measurement tooling: one-shot versus daemon versus dry-run, what each mode proves, and how attestation behavior differs by mode. Minted 2026-10-05 from `yubi-OS/yubiOS refs/` source doc `mode-attestation-measurement-2026-09-01.md` (NSS mode axis).

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [01-one-shot-boot-checks.md](01-one-shot-boot-checks.md) | UKI signature check at UEFI boot and dm-verity root hash at mount: triggers, refusal semantics, what each proves once |
| 02 | [02-daemon-resident-measurement.md](02-daemon-resident-measurement.md) | fTPM measurement into PCRs as daemon-resident event-driven mode: append-only per boot, reset on reboot, event log as output |
| 03 | [03-runtime-detection-daemons.md](03-runtime-detection-daemons.md) | Falco and Tetragon as streaming daemons: Type=notify lifecycle, restart hazards, what a stream proves |
| 04 | [04-on-demand-remote-attestation.md](04-on-demand-remote-attestation.md) | Keylime-style quote as on-demand non-interactive mode: what it proves, why idempotent, exit contract |
| 05 | [05-idempotency-and-resume.md](05-idempotency-and-resume.md) | Why a non-idempotent measurement breaks resume-from-suspend; pure-function one-shots stay safe |
| 06 | [06-dry-run-and-verify-modes.md](06-dry-run-and-verify-modes.md) | sbverify --list, veritysetup verify, CHIPSEC results, Tetragon validation: what dry-run proves and cannot |
| 07 | [07-interactive-vs-batch-mode.md](07-interactive-vs-batch-mode.md) | Non-interactive default, the single FIDO2 touch prompt, batch mode under CI |
| 08 | [08-exit-code-contracts.md](08-exit-code-contracts.md) | Exit semantics per mode: process exits, kernel refusal and I/O error, daemon restart question |
| 09 | [09-isolation-and-mode-interaction.md](09-isolation-and-mode-interaction.md) | Rootless attestation agent: udev device grant plus systemd sandboxing composing with execution mode |

## Research summary

- Results collected: 127 (108 via searXNG digs, 19 via redo digs after the searxng incident)
- Weight split: 72 results at weight >= 0.5 (authoritative), 55 below 0.5 (labeled weak in the docs where cited)
- Jev requests: 25 total (1 outline validation, 22 weighting batches, 1 redo weighting, 1 failed preflight probe logged); usage 21618 input tokens, 0 output tokens
- Outline validation: 9 subtopics proposed, 0 dropped, 9 kept (t05 and t07 scored below 1.0 and were kept only after their digs returned usable material)
- Redo counts: 3 docs redone once each (03, 06, 07) with different queries after the searxng engine throttling degraded result quality; 0 docs redone twice
- Skipped docs: none
- Preflight 2026-10-05: searXNG 61 results healthy at 10:19Z (13 engines throttled); endpoint then 500ed for 85 minutes (n8n webhook failures, searxng engine throttling, and a broken q-form URL shape); searxng service restarted via Northflank at 11:43Z and all 18 digs completed over the qs-form URL; /api/decide (clef) 200 throughout
