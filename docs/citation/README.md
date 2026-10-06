# yubiOS citation and attribution standards

Knowledge corpus minted from the ground source yubi-OS/yubiOS `docs/CITATION.md` on 2026-10-06. The corpus explicates and deepens that doc: how yubiOS cites upstream work and prior art, what the citation discipline requires, and the standards it references. The source doc remains the primary source of record.

## Docs

| NN | doc | scope |
| --- | --- | --- |
| 01 | [01-project-citation.md](01-project-citation.md) | the canonical project citation and BibTeX record for yubiOS |
| 02 | [02-authentication-standards.md](02-authentication-standards.md) | WebAuthn Level 2, CTAP 2.1, RFC 7512 PKCS#11 URI, with a dated author correction for RFC 7512 |
| 03 | [03-trusted-boot-platform-integrity.md](03-trusted-boot-platform-integrity.md) | Arbaugh 1997, Sailer 2004, Parno 2011, TPM 2.0 Library, UEFI v2.10 |
| 04 | [04-firmware-supply-chain-nist.md](04-firmware-supply-chain-nist.md) | NIST SP 800-147, 800-155 (draft), 800-193 |
| 05 | [05-supply-chain-provenance.md](05-supply-chain-provenance.md) | OpenSSF SLSA v1.0 and Sigstore cosign / Rekor |
| 06 | [06-security-advisory-pamu2f.md](06-security-advisory-pamu2f.md) | YSA-2025-01, pam-u2f partial authentication bypass, CVE-2025-23013 |
| 07 | [07-upstream-reference-index.md](07-upstream-reference-index.md) | the doc's internal reference index and maintenance rule (internal-record, no dig) |
| 08 | [08-citation-discipline-drift.md](08-citation-discipline-drift.md) | the 2026-09-18 drift checks and citation-integrity audit discipline (internal-record, no dig) |

## Research summary

- Results collected: 69 unique results across 14 searXNG queries (12 planned + 2 redo), kept top 6 per query, deduped by URL.
- Weight split: 44 high (>= 0.5) / 25 low (< 0.5).
- jev requests: 7 (1 outline score validation + 6 noul weighting batches), usage 8517 input / 1558 output tokens.
- Redo counts: 1 dig redo (doc 02, original RFC 7512 query returned 0 results; redo attempt 2 returned 6 RFC results).
- Skipped docs: none. Dropped at outline validation: t05 image-based-os-systemd (score 0.48) and t06 disk-encryption (score 0.19), both decoding to 0 (padding: drop) under the nearest-integer rule; their content remains in the source doc, which the kept docs cite as the primary source of record.
- Subtopics 07 and 08 are internal-record subtopics, no dig: their content is the source doc's own reference index and drift-check records.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); decide via DefAPI direct (agent probe skipped for speed; zero 429s across all batches).
