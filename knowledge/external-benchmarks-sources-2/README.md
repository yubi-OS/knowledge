# external-benchmarks-sources-2

A knowledge corpus on the refreshed external benchmarks and comparison sources register: checklist-driven source selection, retrieval dating, and claim boundaries for benchmark citations. Minted from yubi-OS/yubiOS refs/external-benchmarks-sources-2026-07-26.md on 2026-10-05.

## Docs

1. [01-checklist-driven-source-selection.md](01-checklist-driven-source-selection.md) - The OMN-80 five item checklist workflow for external benchmark sources: accuracy and relevance review, directional versus self evidence separation, explicit validation notes, refresh tracking, and a reusable citation register.
2. [02-breach-cost-benchmarks.md](02-breach-cost-benchmarks.md) - Cost of data breach benchmarks (IBM Cost of a Data Breach 2025, phishing as initial attack vector) as directional status quo cost evidence, with annual refresh cadence.
3. [03-security-key-market-sizing.md](03-security-key-market-sizing.md) - FIDO2 hardware security key market size and growth estimates from commercial market research vendors, with vendor to vendor variance and range caveats.
4. [04-vendor-market-share.md](04-vendor-market-share.md) - Yubico market position estimates as context for hardware root of trust choice and naming or trademark risk, never for self share claims.
5. [05-hardware-cost-validation.md](05-hardware-cost-validation.md) - Live retail price validation for YubiKey 5 Series (US and EU store pricing), the checkable number discipline, and the unreconciled 25 dollar worksheet floor.
6. [06-regulatory-tailwind.md](06-regulatory-tailwind.md) - The federal and regulatory push toward phishing resistant MFA (OMB M-22-09, NIST SP 800-63B, agency playbooks), and the certification claim boundary.
7. [07-claim-boundaries.md](07-claim-boundaries.md) - The directional benchmark versus product evidence boundary: what it supports and do not use for pairs, misuse patterns, and per claim validation notes.
8. [08-refresh-cadence-and-source-aging.md](08-refresh-cadence-and-source-aging.md) - Per benchmark refresh cadence, retrieval dating discipline, sources needing refresh or replacement, and weakest source handling for vendor forecasts.
9. [09-citation-register-dependencies.md](09-citation-register-dependencies.md) - The reusable citation register table structure (source, use for, do not use for) and its dependency map into pricing, ROI, and funding target documents.

## Research summary

- Results collected: 146 weighted search results across 9 subtopics (9 kept, 0 dropped, 0 skipped).
- Weight split: 50 results at weight >= 0.5 (primary/official backing), 96 below 0.5 (weak backing, labeled as such in the docs). Every archive entry carries a non-null weight.
- Jev requests: 32 to /api/decide (clef model), usage 25334 input / 0 output tokens. Includes 1 outline validation (score metric, 9 questions), 1 preflight probe, and 27 weighting batches (noul metric).
- Redo counts: doc 07 one redo dig; doc 08 two redo digs; doc 09 two redo digs. Docs 01-06 and 09's first pass: none. All redos used different queries per the REDO rule; no primary-source fallback was used.
- Skipped docs: none. Docs with persistently weak dig backing (01, 08, 09) were authored honestly with every weakly backed claim labeled in text.
- Notable research findings recorded in the docs: IBM has released a Cost of a Data Breach Report 2026 edition (the register's 2025 citation is already one edition behind); NIST SP 800-63B 2020 edition (upd2) is marked Withdrawn with revision 4 current; 2025 hardware key market value estimates span 1.18 to 2.48 billion USD across vendors, confirming the register's 2-3x vendor variance caveat.

Preflight 2026-10-05: searXNG 44 results on probe query, healthy; /api/decide (clef) 200.
