# test-driven-development knowledge corpus

Knowledge corpus minted from the ground source yubi-OS/yubiOS skills/test-driven-development/SKILL.md (21023 bytes fetched 2026-10-08). Topic: driving development with tests: red-green-refactor discipline, proving code works before shipping, bug-report-driven testing, behavior-change workflows.

## Docs

| NN | slug | scope |
|---|---|---|
| 01 | 01-tdd-cycle.md | The RED-GREEN-REFACTOR cycle: failing test first, minimal code to pass, cleanup under green |
| 02 | 02-prove-it-pattern.md | The Prove-It Pattern: reproduce the bug with a failing test before fixing, full suite after |
| 03 | 03-test-pyramid-sizes.md | The test pyramid shape, the small/medium/large resource model, and the level decision guide |
| 04 | 04-writing-good-tests.md | Test-writing craft: state over interaction, DAMP over DRY, Arrange-Act-Assert, one concept per test |
| 05 | 05-test-doubles.md | Test doubles: real > fake > stub > mock, and when mocks are legitimate |
| 06 | 06-anti-patterns.md | The six anti-patterns: implementation details, flaky, framework, snapshots, isolation, over-mocking |
| 07 | 07-browser-devtools-testing.md | Browser runtime verification with Chrome DevTools and untrusted browser content |
| 08 | 08-verification-discipline.md | Rationalizations, red flags, the Beyonce rule, the verification checklist |
| 09 | 09-subagent-repro-test.md | Blind reproduction tests via a fresh subagent (internal-record subtopic, no dig) |

## Research summary

- Results collected: 96 (2 searXNG queries per web-shaped subtopic, top 6 kept per query; subtopic 09 is internal-record, no dig)
- Weight split: 23 high (jev weight >= 0.5) / 73 low (< 0.5) of 96 weighted; 0 unshipped
- Jev: 8 requests (1 outline validation via DefAPI direct, 7 noul weighting batches of 14), usage 10387 input / 1991 output tokens
- Redos: 0 (all 16 dig queries returned HTTP 200 on the first attempt; all 7 weighting batches returned HTTP 200 on the first attempt)
- Skipped docs: none. Subtopic 07 scored 0.56 (marginal) in outline validation and was kept because its dig came back strong (5 primary Chrome developer docs results above 0.5)
- Research-db: research-db/preflight.json, outline.json, archive.json, digs/ (9 records), jev-log.json, db.ts (schema v2)

Per-doc kept/primary counts: 01: 12/1, 02: 12/1, 03: 12/2, 04: 12/7, 05: 12/4, 06: 12/1, 07: 12/5, 08: 12/2, 09: 0/0 (no dig).

Weak-weight citations (< 0.5) are labeled as weak in the doc text and carry only corroboration weight; the authoritative spine of every doc is the source SKILL.md plus the primary dig sources (martinfowler.com, testing.googleblog.com, developer.chrome.com, docs.pytest.org, learn.microsoft.com, abseil.io).

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator-side, agent probe skipped for speed); weighting ran DefAPI direct (api.defapi.org, typesafe/jev-1.13), 7/7 batches HTTP 200, 0 null weights.
