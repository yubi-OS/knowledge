# systemd-v262-refresh: knowledge corpus

Minted 2026-10-05 from `yubi-OS/yubiOS refs/systemd-v262-refresh-2026-09-13.md`. Topic: the systemd v262 refresh, covering release-candidate state, the still-current removal audit, and which interface changes matter to an image-based OS consumer of upstream systemd.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-release-cadence.md](01-release-cadence.md) | v262 RC state vs the stable v261 line, the vNNN-stable backport model, and the dig finding that v262 stable has since shipped |
| 02 | [02-boot-loader-entries-removal.md](02-boot-loader-entries-removal.md) | The /run/boot-loader-entries removal, the BLS, and the UKI addon path as the supported overlay surface |
| 03 | [03-sysupdated-varlink.md](03-sysupdated-varlink.md) | systemd-sysupdated dropping its experimental D-Bus API for Varlink IPC, with the removal positioned for v263 in the captured release-notes text |
| 04 | [04-ukify-inspect-json.md](04-ukify-inspect-json.md) | Changes to ukify inspect --json= machine-readable output and why yubiOS tooling is unaffected |
| 05 | [05-tpm2-measure-bank.md](05-tpm2-measure-bank.md) | The tpm2-measure-bank= crypttab option removal claim and the primary-confirmed TPM2 PCR measurement landscape around it |
| 06 | [06-credentials-hardening.md](06-credentials-hardening.md) | v262 credential hardening: primary-confirmed SRK pinning against MITM interposer attacks, the null-key mode, and the cross-version compatibility cliff |
| 07 | [07-image-os-consumer.md](07-image-os-consumer.md) | Which v262 interface changes matter to an image-based OS consumer, mapped onto the upstream image-building doctrine |

## Research summary

- Results collected: 120 (84 from the initial dig across 14 queries, 36 from 3 redo passes across 6 queries), top 6 kept per query.
- Weight split: 69 results at weight >= 0.5 (authoritative backing), 51 results below 0.5 (weak backing, labeled as such in the docs).
- Jev requests: 27 (1 preflight probe, 1 outline score validation with 7 questions, 17 weighting batches over the initial dig, 8 weighting batches over the redos), 19774 input tokens / 0 output tokens.
- Redos: 3 docs got one redo pass each (04 ukify inspect json, 05 tpm2-measure-bank, 06 credentials hardening), each with different queries as required by the redo rule. The 06 redo surfaced the primary confirmation of the SRK pinning change at weight 0.92.
- Skipped docs: none. Two claims remain source-doc-asserted rather than primary-confirmed and are labeled as such in text: the tpm2-measure-bank removal itself (no primary text captured) and the exact ukify inspect shape change (only weak-backed secondary coverage).

Preflight 2026-10-05: searXNG 63 probe results healthy; /api/decide (clef) 200
