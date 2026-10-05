# fork-upstream-drift-detection-schedule

Knowledge corpus on scheduled drift detection between fork repos and their upstreams: cron-based HEAD comparison, catching forks that fall behind after upstream updates, and the on-miss playbook. Minted 2026-10-05 from yubi-OS/yubiOS `refs/fork-upstream-drift-detection-schedule-2026-08-04.md` (OMN-160).

## Docs

- [01-fork-pin-inventory.md](01-fork-pin-inventory.md) - Maintaining the fork inventory and PINNED.md as the source of truth for pinned SHAs, plus the fork-to-upstream map file that drives the drift check.
- [02-head-comparison-api.md](02-head-comparison-api.md) - GitHub API mechanics for comparing fork HEAD against upstream HEAD: the compare endpoint, listing commits since a SHA, and counting commits between pins.
- [03-verdicts-thresholds.md](03-verdicts-thresholds.md) - Verdict classification (synced / minor-lag / drifted) and choosing a commit-count threshold that balances noise against CVE risk.
- [04-cron-scheduling.md](04-cron-scheduling.md) - GitHub Actions scheduled workflows for a daily drift cron: cron timing, workflow_dispatch override, permissions, and artifact upload.
- [05-on-miss-issue-filing.md](05-on-miss-issue-filing.md) - Filing issues or comments when drift is detected: the GitHub issues API, deduplication against open issues, and linking to a tracking issue.
- [06-drift-report-formats.md](06-drift-report-formats.md) - Output formats for drift reports: human text, machine JSON, SARIF for code-scanning integration, plus artifact naming and retention.
- [07-on-miss-playbook.md](07-on-miss-playbook.md) - The response playbook when a fork has drifted: rebase or merge upstream, security urgency via CISA KEV, pin bump, and closing the loop on a synced verdict.
- [09-sibling-drift-patterns.md](09-sibling-drift-patterns.md) - The same drift-detection pattern applied to other pin types: container base image digests, pinned GitHub Action SHAs, and dependency lockfiles.

## Research summary

- Results collected: 132 (108 in dig attempt 1, 24 across 2 redos). All results weighted.
- Weight split: 40 high (>= 0.5), 92 low (< 0.5) of 132.
- Jev requests: 29 (1 probe, 1 outline validation, 26 weighting). Usage: 22925 input / 0 output tokens.
- Redos: 2. Subtopic 07 (on-miss-playbook) redo attempt 2 after an all-weak first dig (0 of 12 high); the redo recovered 6 high-weight sources. Subtopic 08 (threshold-tuning-lifecycle) redo attempt 2 after 1 of 12 high; the redo did not improve.
- Skipped docs: 08-threshold-tuning-lifecycle - marginal outline score (0.98, "keep only if the dig comes back strong") and the dig did not come back strong after 2 attempts: 1 of 24 results weighted >= 0.5, with heavy off-topic noise (recorded in research-db/digs/08-threshold-tuning-lifecycle.json).

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

## Outline validation

| NN | slug | score | verdict |
|---|---|---|---|
| 01 | fork-pin-inventory | 1.75 | kept (load-bearing) |
| 02 | head-comparison-api | 1.85 | kept (load-bearing) |
| 03 | verdicts-thresholds | 1.74 | kept (load-bearing) |
| 04 | cron-scheduling | 1.83 | kept (load-bearing) |
| 05 | on-miss-issue-filing | 1.68 | kept (load-bearing) |
| 06 | drift-report-formats | 1.01 | kept (marginal, dig strong) |
| 07 | on-miss-playbook | 1.93 | kept (load-bearing) |
| 08 | threshold-tuning-lifecycle | 0.98 | dropped (marginal, dig weak) |
| 09 | sibling-drift-patterns | 0.92 | kept (marginal, dig strong) |

## Per-doc sources

| doc | results kept | primary (>= 0.5) |
|---|---|---|
| 01-fork-pin-inventory | 12 | 6 |
| 02-head-comparison-api | 12 | 6 |
| 03-verdicts-thresholds | 12 | 3 |
| 04-cron-scheduling | 12 | 4 |
| 05-on-miss-issue-filing | 12 | 4 |
| 06-drift-report-formats | 12 | 7 |
| 07-on-miss-playbook | 24 | 6 |
| 09-sibling-drift-patterns | 12 | 3 |

## Gaps / skips

- 08-threshold-tuning-lifecycle: skipped. Marginal outline score with a weak dig after 2 attempts; per the mint rules a marginal subtopic stays only if the dig comes back strong.

## Research-db

`research-db/` carries the full audit trail: preflight.json, outline.json, archive.json (132 weighted results with per-result noul decision records), digs/ per-subtopic dig records (including the skipped 08), jev-log.json (one entry per jev HTTP request with usage tokens), and db.ts (TypeScript interfaces for all shapes).
