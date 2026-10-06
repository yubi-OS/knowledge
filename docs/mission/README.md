# yubiOS Mission Knowledge Corpus (docs/mission)

Knowledge corpus minted from the yubiOS mission document. Ground source of record: [yubi-OS/yubiOS docs/MISSION.md](https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/MISSION.md) (5997 B fetched 2026-10-06). The corpus explicates and deepens the doc; it does not replace it.

## Docs

| NN | doc | scope |
| --- | --- | --- |
| 01 | [01-mission-statement.md](01-mission-statement.md) | The mission statement, the builder-tool paradox, and structural not procedural trust |
| 02 | [02-supply-chain-gate-attestations.md](02-supply-chain-gate-attestations.md) | The OPA/Rego supply-chain gate, SLSA provenance, and SBOM attestations |
| 03 | [03-runtime-integrity.md](03-runtime-integrity.md) | dm-verity read-time validation of /usr and the signed UKI |
| 04 | [04-security-default-for-everyone.md](04-security-default-for-everyone.md) | Security as the default for everyone; the 25-70 dollar YubiKey bet |
| 05 | [05-owner-held-power.md](05-owner-held-power.md) | Concentrated power, owner-only keys, and irreversible operations |
| 06 | [06-transparency-dual-use.md](06-transparency-dual-use.md) | Publishing threat models, mitigations, and gaps; the dual-use stance |
| 07 | [07-arm64-strategic-stance.md](07-arm64-strategic-stance.md) | ARM64 as the primary platform: the owner-controllable trust chain below the UKI |
| 08 | [08-non-negotiables-success.md](08-non-negotiables-success.md) | The six non-negotiables and the four success outcomes (internal-record, no dig) |
| 09 | [09-planning-discipline-drift.md](09-planning-discipline-drift.md) | Planning discipline, coverage declarations, and the drift check (internal-record, no dig) |
| 10 | [10-claims-to-mechanisms.md](10-claims-to-mechanisms.md) | The claim-to-mechanism map and the design philosophy (internal-record, no dig) |

## Research summary

- Results collected and weighted: 56 (7 web-shaped subtopics x up to 8 kept; second seed query per subtopic fetched but discarded by the 8-per-subtopic collection cap, recorded per dig).
- Weight split: high (>= 0.5) 0 / low (< 0.5) 56. Every external claim in the docs is therefore labeled weak backing; the source doc carries the normative spine of every doc.
- Docs kept/skipped: 10 / 0. Subtopic t03 (standalone digest pinning) was dropped by outline validation (score 0.44, nearest bucket 0); pinning is covered inside doc 02 and the claim-to-mechanism map (doc 10).
- Digs skipped by design: 3 internal-record subtopics (08, 09, 10), no dig per the docs-mint variant speed optimization 4.
- jev requests: 10 (1 outline validation, 1 response-shape probe, 4 first-pass weighting batches discarded to a client parse bug, 4 final weighting batches). Usage: input 14661 / output 2270 tokens.
- Redos: 0 (no dig fell below the thin-dig floor; the first weighting pass was fully re-run and its discarded answers logged).
- Recorded gaps: UKI-signing specifics and fTPM sourcing were not grounded by this dig set (source-doc-only claims in docs 03 and 07); a direct TPM-ownership-versus-key-ownership comparison was not returned (doc 04); SBOM sourcing is a single weak result (doc 02); the dual-use dig skewed toward research-ethics governance (doc 06).

## Research DB

`research-db/` contains preflight.json, outline.json, archive.json (56 weighted results with full decision records), jev-log.json (one entry per jev HTTP request), db.ts (schema v2 interfaces), and digs/ (one record per subtopic, 10 files).

Preflight 2026-10-06: campaign preflight healthy (orchestrator); agent-side probe skipped for speed (docs-mint variant). Decisions via clef (typesafe/jev-1.13) on api.defapi.org, DefAPI direct per the docs-mint speed optimizations; worker relay fallback not needed.
