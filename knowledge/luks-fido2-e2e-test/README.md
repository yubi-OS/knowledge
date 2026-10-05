# luks-fido2-e2e-test

Knowledge corpus on LUKS2 FIDO2 end-to-end testing: the test design for verifying FIDO2-based disk unlock from enrollment through boot unlock, in CI VMs and on real hardware. Minted 2026-10-05 from yubi-OS/yubiOS refs/luks-fido2-e2e-test-2026-07-23.md via the knowledge-corpus-mint flow (searXNG dig, jev/clef weighting, no copied source text).

## Docs

- [01-cryptenroll-fido2.md](01-cryptenroll-fido2.md): systemd-cryptenroll FIDO2 enrollment into the LUKS2 header and what an enrollment test verifies
- [02-boot-unlock-path.md](02-boot-unlock-path.md): The boot-time unlock path: crypttab options, initramfs FIDO2 handling, and observable boot stages
- [03-hmac-secret-vs-u2f.md](03-hmac-secret-vs-u2f.md): hmac-secret versus U2F: why the CTAP2 extension makes disk unlock possible and how pam-u2f differs
- [04-software-authenticators.md](04-software-authenticators.md): Software authenticators for CI: libfido2, softokens, and their CTAP1/CTAP2 coverage split
- [05-swtpm-measured-boot.md](05-swtpm-measured-boot.md): swtpm in QEMU for TPM test legs: device exposure, measured boot, and event log assertions
- [06-bcvk-vm-harness.md](06-bcvk-vm-harness.md): bcvk as the VM harness: ephemeral runs, disk images, and pinning the harness
- [07-yubikey-passthrough.md](07-yubikey-passthrough.md): Real hardware: YubiKey USB passthrough and hardware-in-the-loop legs as the release authority
- [08-test-guardrails.md](08-test-guardrails.md): Guardrails keeping software authenticators TEST-only and production authority on hardware
- [09-systemd-homed-fido2.md](09-systemd-homed-fido2.md): systemd-homed FIDO2 legs: LUKS2 home directories and the per-user unlock surface

## Research summary

- Results collected: 99 weighted entries (deduplicated across 32 searXNG queries, 18 original plus 14 redo queries).
- Weight split: 58 results at weight >= 0.5 (authoritative), 41 below 0.5 (weak backing, labeled as such in the docs).
- Jev requests: 22 (1 noul preflight probe, 1 score outline validation with 9 questions, 20 noul weighting batches of up to 5 results). Usage: 82585 input tokens, 0 output tokens as reported by the endpoint.
- Redos: 7 queries redone once each (s03 q2, s05 q2, s06 q2, s07 q2, s08 q1, s08 q2, s09 q2) after their first attempt returned mostly off-topic results. All redos succeeded.
- Skipped docs: none. All 9 subtopics authored. Note: the outline scores for 05 (1.25) and 09 (1.11) were marginal; both were kept because their digs returned 5 or more sources at weight >= 0.5. Doc 08 remains the thinnest: its source base is dominated by general FIDO2 ecosystem sources rather than disk-unlock-specific ones.

## Gaps

- The preflight /api/decide probe's usage tokens were not captured; the probe row in jev-log.json carries null usage.
- Source-doc-internal project facts (test script names, CI run numbers, PINNED.md references) were not carried into the docs because the corpus rules require every claim to carry a citable source URL; the docs cover the general, source-backed knowledge instead.

## Preflight

Preflight 2026-10-05: searXNG 49 results on probe healthy; /api/decide (clef) 200.
