# playbooks/dispatch-chain-verification

Knowledge corpus explicating the yubiOS playbook **dispatch-chain-verification.md** (ground source: yubi-OS/yubiOS playbooks/dispatch-chain-verification.md, fetched 2026-10-06). The playbook records the CI discipline for dispatch chains: outer run conclusions prove nothing about inner runs, every claim needs a fresh API read, and the recorded PR #150 failure cycle is the evidence base.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | 01-dispatch-router-semantics.md | ci.yml is a group router; outer conclusion=success covers only its dispatch job |
| 02 | 02-verify-before-claiming-rules.md | The 5 Decision rules plus the patch-is-ground-truth corollary (internal-record, no dig) |
| 03 | 03-dispatch-and-duplicate-detection.md | Dispatch once, list immediately, cancel duplicates with 202 |
| 04 | 04-inner-run-identity-and-jobs.md | Per-run identity plus jobs reads, the total_count 0 parse-failure trap, and the reporting template |
| 06 | 06-log-expiry-and-listing-traps.md | Logs expire at 15-30 min; run listings mislead; report name and path |
| 07 | 07-merge-verification-readonly.md | Never merge; verify merged:true and read the patch |
| 08 | 08-recorded-failure-evidence.md | PR #150 cycle, PR #147 patch-vs-title proof, runs #48/#49 proof (internal-record, no dig) |
| 09 | 09-operational-dispatch-discipline.md | One dispatch per intent, group=all ban, fetch-workflow commit hazard, connection discipline (internal-record, no dig) |

NN 05 (yaml-parse-failure-trap) was dropped at outline validation (score 0.33, 0.74 drop probability, weak dig); its content is folded into 04.

## Research summary

- Results collected: 23 archive entries (20 unique URLs), 20 from seed queries, 3 from redo queries.
- Weight split: 17 high (>= 0.5) / 6 low (< 0.5).
- Jev requests: 3 (1 outline score validation, 2 noul weighting batches), usage 3194 input / 507 output tokens. All via api.defapi.org direct (DefAPI connection); the worker relay fallback was not needed.
- Redos: 5 redo queries across 4 digs (01, 03, 04, 06, 07) after seed queries returned homepage noise.
- Skipped docs: 05-yaml-parse-failure-trap (dropped at validation, content folded into 04).

Preflight 2026-10-06: searXNG healthy (campaign preflight, orchestrator); /api/decide (typesafe/jev-1.13) via api.defapi.org direct, agent-side probe skipped for speed.

## Source doc

All procedure claims are grounded in the source doc, yubi-OS/yubiOS playbooks/dispatch-chain-verification.md (2026-08-01), fetched from https://raw.githubusercontent.com/yubi-OS/yubiOS/main/playbooks/dispatch-chain-verification.md with User-Agent omni-agent/1.0. Digs cover only the external mechanisms the playbook references (GitHub Actions REST API, workflow dispatch and cancellation, workflow run logs, pull request verification).
