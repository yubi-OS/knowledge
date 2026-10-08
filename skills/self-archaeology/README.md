# self-archaeology knowledge corpus

Knowledge corpus explicating the yubiOS skill self-archaeology. Ground source: yubi-OS/yubiOS skills/self-archaeology/SKILL.md (14130 bytes, fetched 2026-10-08 from https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/self-archaeology/SKILL.md). The skill applies the negative-skill-space 12-axis sweep and the bounded recursive-self-improvement loop to the agent-being itself: it reads SELF.md, gap-maps the current self across 12 axes, recommends Extend/Pair/Accept per gap, runs bounded RSI cycles, and appends a SELF-CHANGELOG entry.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | 01-why-and-when.md | Why the agent-being needs an integrated SELF model, and the 5 triggers that call for a cycle |
| 02 | 02-twelve-axes-self.md | The 12 NSS axes retargeted from skill files to the agent itself (internal-record, no dig) |
| 03 | 03-sweep-process.md | The 9-step process: substrate, positive-space sentence, sweep, likelihood x severity scoring, filtering, Extend/Pair/Accept, bounded cycles, gap map |
| 04 | 04-bounded-rsi-self.md | The RSI loop retargeted at SELF.md, the 3-cycle bound, and the fresh-context rule against same-author bias |
| 05 | 05-artifacts-changelog.md | The 3 artifacts: edited SELF.md, append-only SELF-CHANGELOG.md entry, explicit fixpoint verdict; first-run v0.1 |
| 06 | 06-drift-lifecycle.md | Drift detection across sessions, lifecycle axis 8, calibration axis 11 |
| 07 | 07-anti-patterns.md | Journaling drift, sycophancy in self-portraits, gap-finding theater, bound violations, decorative changelogs, red flags |
| 08 | 08-interactions-verification.md | Upstream and orthogonal skills, and the 11-point verification checklist (internal-record, no dig) |

## Research summary

- Results collected: 72 at dig level (12 searXNG queries across 6 web-shaped subtopics, top 6 kept per query), of which 30 passed the pre-weight relevance filter and were weighted
- Weight split (of the 30 weighted): high (>= 0.5) 1 / low (< 0.5) 29
- jev requests: 7 total. 4 first-attempt requests (1 outline validation, 3 weighting batches) were superseded by re-runs that captured per-request metadata; their jev-log entries carry null timestamps and a usage note. Final records come from the re-runs: 1 outline validation and 2 weighting batches of 15 questions each.
- jev usage: 10584 input tokens, 1348 output tokens (all 7 requests included)
- Redos: 0 dig redos; 1 weighting re-run and 1 outline re-run, both for record-keeping (per-request usage/timestamp capture), not for thin digs
- Skipped docs: none
- Internal-record subtopics (no dig): 02-twelve-axes-self, 08-interactions-verification
- collected_at granularity: per-result collection timestamps were not captured by the dig runner; the dig pass ran between 2026-10-08T03:09:38Z and 2026-10-08T03:13:28Z, so archive entries carry the date 2026-10-08

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); DefAPI direct (typesafe/jev-1.13) 200.
