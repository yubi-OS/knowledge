# skills/nss-outputs knowledge corpus

Knowledge corpus explicating the yubiOS skill `skills/nss-outputs/SKILL.md` (ground source, fetched 2026-10-06, 28553 bytes): the NSS Outputs axis, what each file produces, and the seven-channel contract a caller can rely on.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-seven-channel-taxonomy.md](01-seven-channel-taxonomy.md) | The seven channels (exit, stdout, stderr, log, file, side-effect, response) and the per-output record fields |
| 02 | [02-sysexits-exit-codes.md](02-sysexits-exit-codes.md) | Exit-code vocabulary from EX_OK to EX_CONFIG and the failure routing it enables |
| 03 | [03-stream-ownership.md](03-stream-ownership.md) | stdout and stderr ownership: result vs diagnostics vs logs |
| 04 | [04-partial-output-policy.md](04-partial-output-policy.md) | forbidden / valid_and_marked / resumable and their implementations |
| 05 | [05-structured-logs.md](05-structured-logs.md) | JSONL framing, RFC 5424, severity, run_id, redaction |
| 07 | [07-determinism-reproducible.md](07-determinism-reproducible.md) | Determinism classes, SOURCE_DATE_EPOCH, canonicalization, two-clean-build verification |
| 08 | [08-yubios-file-type-surfaces.md](08-yubios-file-type-surfaces.md) | Scripts, systemd units, GitHub Actions, Containerfiles, mkosi, refs/notes |
| 09 | [09-verification-and-rubric.md](09-verification-and-rubric.md) | Anti-patterns, red flags, and the 9-point cycle-10 verification checklist |

The ground source is the primary source of record; every doc cites it explicitly, and dig-sourced claims carry their URL plus jev weight (weights below 0.5 are labeled weak backing in text).

## Research summary

- Results collected: 120 (96 from 8 subtopics' original digs + 24 from 2 redo digs), kept top 6 per query
- Weight split: high (>= 0.5) 11 / low (< 0.5) 109
- jev requests: 11 (1 outline score validation, 8 main weighting batches, 2 redo weighting batches), usage in 15262 tokens / out 2339 tokens, endpoint https://api.defapi.org/api/v1/decisions, model typesafe/jev-1.13
- Redos: 2 dig redos with different queries (subtopics 02 and 06; 02 recovered, 06 did not)
- Skipped docs: 06 idempotency-contract, marginal outline score (0.35) plus weak dig after redo (0 high-weight results in 24; best 0.41)
- research-db: schema v2 under [research-db/](research-db/) (preflight, outline, archive, 9 dig records, jev-log, db.ts)

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); DefAPI decide (typesafe/jev-1.13) 200 via api.defapi.org.

## Gaps

- **06 idempotency-contract**: skipped. The dig surfaced mostly aggregator and off-topic results and did not strengthen after a redo with different queries; per the mint rules no unweighted or padded doc was shipped. The ground source's own idempotency guidance (guideline 6, example 4, anti-pattern 7, red-flag row on Idempotency-Key) remains the authoritative reference.
