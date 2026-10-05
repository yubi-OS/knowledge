# Wayfinder rounds 7-12 audit: wins, debug items, durable lessons

A minted knowledge corpus distilled from the wayfinder rounds 7 to 12 audit (yubi-OS/yubiOS `refs/wayfinder-rounds-7-12-audit-2026-09-18.md`): what the rounds won, what broke and how it was fixed, and the reusable lessons the campaign added to AGENT.md (lessons 23 through 27).

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-rung-driven-improvement-records.md](01-rung-driven-improvement-records.md) | Pre-registered rung-driven records: honest missed-pattern disclosure, declined rungs, chained baselines keep a campaign verifiable. |
| 02 | [02-drift-checks-live-findings.md](02-drift-checks-live-findings.md) | Drift checks as sensors: stale digest 404, stale retirement register, unblocked version floor, moved counts. |
| 03 | [03-checker-versioning-disclosure.md](03-checker-versioning-disclosure.md) | Versioned, disclosed checker amendments (taskcheck v1.1); sample failures before freezing. |
| 04 | [04-instrument-bugs-stale-state.md](04-instrument-bugs-stale-state.md) | Stale in-memory state versus committed ground truth; transition guards, 409 persisted:false, corpus-dir hygiene. |
| 05 | [05-ledger-frames-querying.md](05-ledger-frames-querying.md) | Reading outcome ledgers by frame_id across chained baselines; event-sourcing and correlation-id parallels. |
| 06 | [06-placement-normative-vs-receipts.md](06-placement-normative-vs-receipts.md) | Placement discipline: normative docs in docs/, receipts in refs/; drift checks produce dated records, not appended paragraphs. |
| 07 | [07-format-compliance-sweeps.md](07-format-compliance-sweeps.md) | Format sweeps driven by the corpus's own spec as the frozen check: 9/112 to 112/112 SKILL.md-compliant. |
| 08 | [08-campaign-budgeting-completion.md](08-campaign-budgeting-completion.md) | Budget by failing files, not fixed cycles; keep post-round fixups visible on the round PR. |

## Research summary

- Results collected: 132 (96 from 16 seed queries, 36 from the redo pass for docs 02, 07, 08)
- Weight split (jev noul, clef): 38 at weight >= 0.5 (authoritative backing), 94 at weight < 0.5
- Jev requests: 30 (1 preflight probe, 1 outline score validation, 22 noul weighting batches of 5, 6 noul redo weighting batches), usage 22536 input tokens / 0 output tokens
- Redos: docs 02, 07, 08 each redug once with different queries after their first dig returned thin high-weight backing; the first redo pass was interrupted by a container restart and re-run (logged as attempt 3 in each redo_log)
- Skipped docs: none; every doc had at least 2 results at weight >= 0.5 or an explicitly labeled weak backing
- One result (a bank homepage at weight 0.68 in the doc 03 archive) was off-topic despite its weight and was excluded from all claims; it remains in archive.json

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
