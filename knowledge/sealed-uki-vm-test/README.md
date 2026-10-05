# sealed-uki-vm-test

Knowledge corpus on sealed UKI VM test lanes: scoping the missing Secure Boot end-to-end proof for immutable OS images in VMs, the design of the test lane, and what it validates. Minted from `yubi-OS/yubiOS refs/sealed-uki-vm-test-2026-07-30.md`.

## Docs

| NN | doc | one-line scope |
|---|---|---|
| 01 | 01-uki-anatomy-signing.md | UKI PE structure, ukify and mkosi UKI builds, and PKCS#11 URI signing against a SoftHSM-emulated PIV slot 9c. |
| 02 | 02-systemd-sbsign-engine-signing.md | systemd-sbsign with the engine:pkcs11 backend, its contrast with legacy sbsigntools and sbverify verification. |
| 03 | 03-ovmf-secure-boot-qemu.md | OVMF Secure Boot in QEMU: pflash variable storage, enrolling the ROTPK in db, and the SecureBoot=yes runtime assertion. |
| 04 | 04-swtpm-measured-boot-pcrs.md | swtpm as the VM TPM, what systemd-stub measures into PCR4 and PCR11, and the tpm2_pcrread golden-value assertion set. |
| 05 | 05-dmverity-composefs-roothash.md | mkosi Verity embedding roothash= in the UKI cmdline, composefs digest binding in BLS entries, and kernel tamper rejection. |
| 06 | 06-luk2-fido2-sealing.md | systemd-cryptenroll FIDO2 sealing of LUKS2 at install time, TPM2 PCR-bound unlock as the complementary primitive. |
| 07 | 07-ci-lane-separation-design.md | Why the sealed lane is its own CI workflow: failure-class isolation, QEMU-in-CI precedents, and the staged evidence plan. |
| 08 | 08-bootc-sealed-build-primitives.md | bootc container ukify and split-kernel-and-rootfs capabilities, and the BLS-entry wiring gap the lane deliberately excludes. |

## Research summary

- Results collected: 96 (16 searXNG queries, 2 per subtopic, top 6 per query kept; 88 unique URLs, 8 cross-query duplicates retained as separate archive entries).
- Weight split: 61 results at weight >= 0.5 (primary/official backing), 35 results below 0.5 (weak backing, labeled as such in the docs).
- Jev requests: 24 logged (1 preflight probe, 1 outline validation with 8 score questions, 20 noul weighting batches of 5, plus 2 recorded 429 rate-limit attempts that were retried and succeeded). Usage: 17149 input tokens, 0 output tokens.
- Dig redos: 0. Every subtopic's first-pass dig was strong enough to author honestly.
- Skipped docs: none. All 8 subtopics passed outline validation (no score-0 drops; lowest was 06 luk2-fido2-sealing at 1.34) and all 8 were authored.

## Source grounding note

The yubiOS-specific design facts (the lane's workflow sketch, its 6 positive and 3 negative assertions, the OMN-53/OMN-150 scope split, the bootc 1.16.6 capability-probe evidence from run #11 at commit 7eba4856e7) come from the source doc itself and are cited inline as "source doc: yubi-OS/yubiOS refs/sealed-uki-vm-test-2026-07-30.md". General technical claims carry their collected source URL and jev weight inline.

## Preflight

Preflight 2026-10-05: searXNG 141 results healthy; /api/decide (clef) 200.

## Gaps / skips

- 07-ci-lane-separation-design: thinnest dig; the lane-separation rationale rests on the source doc plus two weakly backed (< 0.5) CI-triage articles, and the docs say so.
- No docs were skipped; no dig redos were needed.
- archive.json collected_at values are the timestamps of the jev weighting batch that scored each result (the dig ran immediately before each batch), recorded for audit rather than as collection instants.
