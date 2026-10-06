# skills/debugging-and-error-recovery

Knowledge corpus explicating the yubiOS skill `debugging-and-error-recovery` (source of record: `yubi-OS/yubiOS skills/debugging-and-error-recovery/SKILL.md`, fetched 2026-10-06, 18842 bytes). The corpus deepens the skill's own structure: systematic root-cause debugging, the debugging methodology, error recovery patterns, and the hypothesis-testing discipline the skill teaches.

## Docs

| NN | file | scope |
|---|---|---|
| 01 | 01-stop-the-line-rule.md | The STOP / PRESERVE / DIAGNOSE / FIX / GUARD / RESUME discipline and why errors compound when you push past a broken state |
| 02 | 02-reproduce-discipline.md | Step 1: making failures reliable and the 4-way non-reproducible decision tree (timing, environment, state, random) |
| 03 | 03-localize-and-bisect.md | Step 2: the 6-layer localization tree and git bisect for regressions |
| 04 | 04-reduce-and-root-cause.md | Steps 3-4: the minimal failing case and fixing causes, not symptoms |
| 05 | 05-guard-and-verify.md | Steps 5-6: regression tests that fail without the fix and the 6-item verification gate |
| 06 | 06-error-specific-triage.md | The test-failure, build-failure, and runtime-error triage trees |
| 07 | 07-safe-fallbacks-and-instrumentation.md | Safe defaults, graceful degradation, and the instrumentation add/remove/keep lifecycle |
| 08 | 08-rationalizations-and-red-flags.md | The rationalization table, its unvalidated 70% prior, and the red-flag list |
| 09 | 09-untrusted-error-output.md | Treating error output as untrusted data, log injection (CWE-117), and prompt injection |

## Research summary

- Results collected: 240 search results across 9 subtopics (2 seed queries per subtopic, plus redo attempts on thin digs). Results are archived with per-result jev noul weights in `research-db/archive.json`.
- Weight split: 17 results with weight >= 0.5 (authoritative backing), 223 with weight < 0.5. Weak-backed claims are labeled in the docs; the grounding spine of every doc is the source SKILL.md itself.
- The initial dig pass was heavily contaminated with off-topic results (retail and dictionary spam), which the noul weighting flagged correctly; 9 subtopics got at least one redo with different queries (2 subtopics needed the full 2 redos).
- jev requests: 27 HTTP requests to api.defapi.org (1 outline score request with 10 questions; 26 noul weighting requests over batches of up to 15). Usage tokens: input 45715, output 6936.
- Redo counts: 13 redo query-batches total (9 subtopics redone at attempt 2; 01, 06, 09 additionally redone at attempt 3).
- Skipped docs: none. Subtopic 10 (primitive placement) was dropped at outline validation with score 0.33 (padding) before any dig; its content remains in the source doc's own coverage sections.

## Preflight

2026-10-06: searXNG healthy (campaign preflight run orchestrator-side; agent-side probe skipped for speed per mint brief); /api/decide via api.defapi.org (typesafe/jev-1.13) 200.
