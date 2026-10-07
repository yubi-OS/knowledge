# ftpm-optee-tpm knowledge corpus

Minted from the yubiOS ground source `yubi-OS/yubiOS skills/ftpm-optee-tpm/SKILL.md`.
The corpus explicates the skill: the firmware TPM 2.0 for yubiOS on ARM64, the Microsoft
ms-tpm-20-ref reference implementation running as an OP-TEE Trusted Application, RPMB-backed
NV storage, the measured-boot event log handoff, and the fTPM-vs-YubiKey trust-boundary split.

## Docs

1. [`docs/01-why-ftpm-arm64.md`](docs/01-why-ftpm-arm64.md) - Why yubiOS builds its own fTPM on ARM64: measured boot needs, vendor fTPM as an unowned trust anchor.
2. [`docs/02-optee-ftpm-integration-repo.md`](docs/02-optee-ftpm-integration-repo.md) - OP-TEE/optee_ftpm and microsoft/ms-tpm-20-ref, the commit pin, TA UUID, and the BlueField worked example.
3. [`docs/03-build-the-ftpm-ta.md`](docs/03-build-the-ftpm-ta.md) - Building the fTPM TA against the OP-TEE TA dev kit: flags, event-log sizing, output artifacts.
4. [`docs/04-early-ta-vs-dynamic-ta.md`](docs/04-early-ta-vs-dynamic-ta.md) - Early TA vs dynamic TA: why U-Boot and IMA force the Early TA build into .rodata.early_ta.
5. [`docs/05-rpmb-bootstrap-hazard.md`](docs/05-rpmb-bootstrap-hazard.md) - The RPMB-before-supplicant bootstrap hazard (OP-TEE issue #5766) and its two mitigations.
6. [`docs/06-uboot-linux-handoff.md`](docs/06-uboot-linux-handoff.md) - U-Boot tpm2_ftpm_tee and Linux tpm_ftpm_tee drivers, event log handoff, IMA probe ordering.
7. [`docs/07-pcr-layout-sealing.md`](docs/07-pcr-layout-sealing.md) - The yubiOS PCR layout convention and the seal-to-PCR-0/1/7 policy.
8. [`docs/08-ftpm-vs-yubikey-trust-boundary.md`](docs/08-ftpm-vs-yubikey-trust-boundary.md) - The fTPM (platform integrity) vs YubiKey (user identity, disk unlock) trust-boundary split.
9. [`docs/09-pinning-supply-chain.md`](docs/09-pinning-supply-chain.md) - Pinning optee_ftpm, ms-tpm-20-ref, OP-TEE OS, and TF-A; Renovate and OPA/Rego pipeline integration; CVE tracking.

## Research summary

- Results collected: 113 (kept top 6 per query); 104 archived after URL deduplication.
- Weight split (archived results): 15 at weight >= 0.5 (authoritative backing), 89 below 0.5 (weak backing, labeled in text).
- jev requests: 11 logged (1 outline score validation, 9 noul weighting batches, 1 outline score re-validation on 2026-10-07), usage 19102 input / 2465 output tokens.
- Redos: 2 (docs 01 and 08, one redo each with different queries; both still yielded no source at >= 0.5, so their external claims are labeled weak).
- Skipped docs: none. All 9 subtopics authored.
- Repair note: the first push (closed PR #250, unmerged) omitted outline.json; the outline validation was re-run live on 2026-10-07 and outline.json added in this commit. All other files are carried over unchanged from the verified prior push.
- Weighting ran via DefAPI direct (https://api.defapi.org/api/v1/decisions, model typesafe/jev-1.13); zero 429s, no fallback needed.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); /api/decide (jev-1.13) 200 via DefAPI direct.
