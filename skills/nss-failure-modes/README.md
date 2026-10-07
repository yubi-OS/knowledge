# nss-failure-modes knowledge corpus

Knowledge corpus explicating the yubiOS skill `nss-failure-modes` (source doc: yubi-OS/yubiOS skills/nss-failure-modes/SKILL.md, 41274 bytes, fetched 2026-10-07). The corpus explains the NSS Failure-modes axis: what can go wrong per file, how it is detected, and how it is recovered.

## Docs

| NN | file | scope |
|---|---|---|
| 01 | 01-failure-taxonomy.md | The fourteen-channel failure taxonomy (Boundary through Security) |
| 02 | 02-failure-record-schema.md | The 11-field failure-mode record and the raw-to-classified-to-contract pipeline |
| 03 | 03-severity-probability-scales.md | Local severity and probability scales, AIAG-VDA Action Priority vs RPN |
| 04 | 04-python-script-failure-modes.md | Python script failure modes: swallowed stderr, silent except, traversal, retry duplicates, secret leakage |
| 05 | 05-error-contract-catalogs.md | sysexits.h, errno, and preserving native signals over exit 1 |
| 06 | 06-fault-injection-testing.md | Fault injection and negative testing, Chaos Monkey and Jepsen, idempotency semantics |
| 07 | 07-blameless-postmortems.md | Blameless postmortem discipline: Google SRE, Etsy Debriefing, evidence-cited tone |
| 08 | 08-nss-composition-verification.md | NSS composition and the 8-point cycle-14 verification checklist |

## Research summary

- Results collected and weighted: 90 (high >= 0.5: 23, low < 0.5: 67)
- jev requests: 6 (usage: 8464 input / 1644 output tokens), model typesafe/jev-1.13 via DefAPI direct
- Redos: 4 dig redos (subtopics 03 and 06; log per record under research-db/digs/)
- Skipped docs: none. 3 of 11 outline subtopics were dropped at validation (t04 container patterns, t05 systemd units, t06 GitHub Actions), scored near 0 by the decision model as yubiOS-internal pattern records; the remaining 8 were authored.
- Subtopics 01, 02, and 08 are internal-record subtopics with no dig; they cite the source doc only.

## Outline validation

score metric, 11 subtopics in one request. Dropped: 04, 05, 06 (scores 0.25, 0.24, 0.32). Kept: 01, 02, 03, 04, 05, 06, 07, 08 (renumbered).

Preflight 2026-10-06: searXNG healthy (campaign preflight, orchestrator); DefAPI typesafe/jev-1.13 200 (agent-side probe skipped for speed).
