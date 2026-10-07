# Merge, report, and anti-patterns: Phases 6 and 7

Scope: how a minted corpus is merged (through the /merges endpoint, not the PR merge endpoint), what the single end-of-run report must contain, and the recorded anti-patterns and red flags the skill has accumulated from live failures. This is an internal-record subtopic grounded in yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md (source doc); no dig was run because these disciplines are defined by the skill itself, not by external mechanisms.

## Merging: the /merges endpoint

Phase 6 says to merge through POST /repos/yubi-OS/knowledge/merges with the base and head branches, NOT the PR merge endpoint (source doc). The reason is a PAT quirk recorded in the source doc: PATCH draft:false on a PR silently no-ops here, returning 200 while the PR stays a draft, and the merge through the PR endpoint then 405s. After the merge call, verify merged=true on the PR (source doc).

Phase 6 does not appear in the skills-variant's report obligations; the variant opens ONE draft PR and stops there, with merge handled by the campaign orchestrator (skills-variant brief, 2026-10-06).

## The single end-of-run report

Phase 7 is one report at the end, not per-phase chatter: the repo and ref path, the doc list with sizes, the research DB stats (results collected, quality-weight distribution, jev calls and total cost), the PR number, and the merge SHA (source doc). Guideline 7 states the same as a rule: one report at the end with the full doc table (source doc). The final report includes the verification line from the post-push check, so the report is the last thing produced and cannot precede its own evidence (source doc; parent brief, 2026-10-05).

## Anti-patterns accumulated from live runs

The source doc's anti-patterns list is the runbook of past failures, each tied to a dated incident:

1. Padding thin docs. A "cannot author" verdict is worth more than a confident mush of aggregator paraphrases (source doc).
2. Subagents pushing to the repo themselves. N agents racing one branch is how trees get clobbered; agents return markdown, the orchestrator commits (source doc).
3. Unbatched jev calls and missing User-Agent: 5 questions per request, UA on every HTTP call (source doc).
4. Inventing the outline. Decompose by the domain's own joints; if a doc's scope cannot be stated in one line, the decomposition is wrong (source doc).
5. Skipping the empty-repo seed; the Git Data API 409s on a fresh repo (source doc).
6. Naming the branch with a refs/ prefix, which GitHub rejects, or merging a draft via the PR endpoint (source doc).
7. Shipping unweighted results. A failed decide call is a REDO, never a silent degrade to unweighted (source doc).
8. Pushing base64-encoded text as blob content; use encoding utf-8 with plain text and verify by re-fetching and parsing after push (source doc, 2026-10-05, PR #21).
9. Reporting success without the post-push verification; the PR files list is the truth, and a subagent's self-report once claimed 23 paths pushed for a PR that contained 10 (source doc, 2026-10-05, PR #12).
10. Trusting subagent-reported PR numbers: a 5-agent wave on 2026-10-05 returned confident VERIFIED reports citing PRs #137 to #141, which were the previous wave's actual numbers; no branches, PRs, or corpus dirs existed. Every PR number is resolved by head-branch lookup and verified against the PR files list plus blob re-fetch before merging (source doc).

## Red flags

Four red flags sit above the anti-patterns as stop-and-surface conditions (source doc):

- Outline collapses below 4 load-bearing docs: probably a single research question, route to parallel-deep-research.
- A jev 429 storm after fan-out: serialize the weighting phase instead of parallelizing it; weighting is the cheap phase, authoring is where parallelism pays.
- The repo exists but with unexpected contents: stop and surface; never clobber an existing corpus dir.
- A doc's research-db digs file shows zero results: the doc either carries the direct-verification story or does not ship.

## Guidelines that close the loop

The source doc's guidelines repeat the disciplines at the operator level: never skip outline validation, UA on every call, orchestrator owns repo writes, honest gaps are deliverables, verify every claim or it does not ship, keep the DB typed and complete, and keep total jev spend under $0.05 per minted corpus (source doc, guidelines 1 to 10).

## Sources

- yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md (source doc, fetched 2026-10-07)
- session/refs-mint/MINT-BRIEF-SKILLS.md (skills-variant brief, 2026-10-06)
- Internal-record subtopic, no dig.
