# readme: the yubiOS playbooks/ Directory Index

A knowledge corpus explicating [yubi-OS/yubiOS `playbooks/README.md`](https://github.com/yubi-OS/yubiOS/blob/main/playbooks/README.md) (the ground source, 3641 B): what the playbook collection covers, the format spec it defines, and how the playbooks compose as a body of operational knowledge. The source doc is the primary source of record; this corpus explicates it, it does not replace it.

## Corpus index

| Doc | One-line scope |
|---|---|
| [01-purpose-and-scope.md](01-purpose-and-scope.md) | What playbooks/ is: operator-view runbooks, one per recurring failure mode, and the refs/ vs BLOCKERS.md vs playbooks/ split |
| [02-playbook-index.md](02-playbook-index.md) | The 7 indexed playbooks, their read-when triggers (symptom-string, task, state), and the provenance each cites |
| [03-usage-protocol.md](03-usage-protocol.md) | The 4-step how-to-use sequence: match on failure mode, read Context first, run Mechanism verbatim, re-verify stale evidence |
| [04-coverage-boundaries.md](04-coverage-boundaries.md) | What the collection covers (failure modes fired >= 2 times, verify-before-claim doctrine) and its 5 explicit exclusions |
| [05-format-spec.md](05-format-spec.md) | The required Context/Decision/Mechanism/Verified working/Cross-references skeleton, 3 optional sections, filename rule, and the 2 hard citation rules |
| [06-relationship-and-maintenance.md](06-relationship-and-maintenance.md) | The BLOCKERS.md register relationship, the two-fire threshold, agents-draft/Jenny-merges workflow, and the not-here escalation path |

## Research summary

- Topic decomposition: 6 subtopics, all validated load-bearing or marginal-kept by jev score (1 outline request). 2 subtopics (02, 04) are internal-record and used no dig, citing the source doc only.
- Results collected: 48 across 8 searXNG queries (4 web-shaped subtopics, 2 queries each); 36 unique after URL dedupe; all 36 weighted.
- Weight split: high (>= 0.5) 0, low (< 0.5) 36. Every dig-backed claim in the docs is therefore labeled weak; the source doc carries the grounding spine throughout. This is recorded honestly rather than padded.
- jev: 4 requests total (1 outline score + 3 noul weighting batches of 12), via DefAPI direct (https://api.defapi.org/api/v1/decisions), zero 429s. Usage: 5331 input / 754 output tokens.
- Redos: 0. Skipped docs: 0.
- Post-push verification: each pushed research-db .json re-fetched via the Git blobs API from the pushed tree SHAs, base64-decoded, and JSON-parsed; every archive entry carries a non-null weight.

## Preflight

2026-10-06: searXNG healthy (campaign preflight run orchestrator-side); jev decide via DefAPI direct, model typesafe/jev-1.13 (agent-side probe skipped for speed per mint brief).
