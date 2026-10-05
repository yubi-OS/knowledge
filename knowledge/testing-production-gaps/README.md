# testing-production-gaps

Knowledge corpus minted 2026-10-05 from yubi-OS/yubiOS refs/testing-production-gaps-2026-08-01. Topic: testing and production gaps for an immutable OS, the systematic gap audit (VM test coverage, bootc lifecycle tests, supply chain, CI tooling), each gap mapped to severity, cost, and a concrete fix.

## Docs

| NN | slug | scope |
|---|---|---|
| 01 | sealed-uki-secure-boot-testing | Proving signed UKI and Secure Boot with negative tamper evidence: the sealed-UKI VM lane, OVMF/swtpm limits, PCR golden values, and the three unproven tamper assertions. |
| 02 | arm64-hardware-proof | Real-board ARM64 evidence: RK3588 TPL/DDR boot, ROTPK fuse provisioning, RPMB, and owner root-of-trust custody that QEMU cannot prove. |
| 03 | yubikey-physical-testing | Physical-YubiKey production-confidence runs: why software-only FIDO2 CI proves function but not physical presence, firmware ownership, or RPMB freshness. |
| 04 | bootc-lifecycle-testing | bootc upgrade/rollback, A/B boot-counter behavior, sysext activation against immutable /usr, and portable-service lifecycle: the missing CI assertions. |
| 05 | supply-chain-evidence | SBOM, SLSA provenance, cosign signing, and OCI channel binding for production images: the 0/25 SBOM and 2/25 provenance gaps and their fixes. |
| 06 | ci-governance-tooling | CI tooling governance: input-shape doctrine, workflow group reachability, token-scope audits, concurrency declarations, and fork upstream-sync drift. |
| 07 | runtime-hardening-verification | Runtime hardening evidence: static audits vs booted-image verification with systemd-analyze security and live RestrictFileSystems assertions. |
| 08 | negative-path-testing | Negative-path test design for security-critical primitives: fail-closed tests, tamper rejection, policy rejection, and wrong-credential tests that green-only suites miss. |

## Research summary

- Results collected: 96 (16 searXNG queries, 2 per subtopic, top 6 kept per query, 93 unique URLs).
- Weight split: 40 results with weight >= 0.5 (primary backing), 56 with weight < 0.5 (weak backing, labeled in text), 0 unweighted.
- Jev requests: 21 successful requests to /api/decide via clef (1 probe, 1 outline validation with 8 score questions, 19 noul weighting batches of 5) plus 5 rate-limit retries that were re-sent after 30s backoff. Usage: 16111 input tokens, 0 output tokens.
- Redo counts: 0 dig redos (all 16 queries returned 6 results on attempt 1); 5 jev request retries (HTTP 429 backoff, all recovered).
- Skipped docs: none. All 8 subtopics passed outline validation (score range 1.12 to 1.90, none dropped) and all 8 were authored.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

## Research-db

- `research-db/preflight.json`: preflight probes (searXNG 132 results on probe query; /api/decide 200).
- `research-db/outline.json`: 8 subtopics with scope, seed queries, and full jev score validation answers.
- `research-db/archive.json`: 96 collected result entries, each with query, title, url, snippet, collected_at, weight, and the full noul decision record.
- `research-db/digs/<NN>-<slug>.json`: per-doc dig records (queries attempted, redo log, results kept, outcome).
- `research-db/jev-log.json`: one entry per jev HTTP request with usage tokens.
- `research-db/db.ts`: TypeScript interfaces for all shapes above.
