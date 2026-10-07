# 09 - Anti-patterns, red flags, and the incident history behind them

Scope: the anti-patterns, red flags, and incident history they encode: PRs #12, #16, #21, the wave-27 phantom PRs, and the verification discipline born from them.

Grounded in the source doc yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md only. Internal-record subtopic, no dig.

## The anti-pattern list (source doc)

1. Padding thin docs. A "cannot author" verdict is worth more than a confident mush of aggregator paraphrases. Enforce it.
2. Subagents pushing to the repo themselves. N agents racing one branch is how trees get clobbered; agents return markdown, the orchestrator commits.
3. Unbatched jev calls or missing User-Agent. Batch questions per request and put a User-Agent header on every HTTP call.
4. Inventing the outline. Decompose by the domain's own joints; if you cannot state each doc's scope in one line, the decomposition is wrong.
5. Skipping the empty-repo seed. The Git Data API 409s on a fresh repo; seed the README via the Contents API first.
6. Naming the branch with a refs/ prefix (GitHub rejects it) or merging a draft via the PR endpoint (the draft:false PATCH no-ops on this PAT).
7. Shipping unweighted results. A failed decide call is a REDO (sleep 30s, re-send, split batches), never a silent degrade to unweighted.
8. Pushing base64-encoded text as blob content. Use encoding "utf-8" with plain text; verify by re-fetching and json.loads-ing after push.
9. Reporting success without the post-push verification. The PR files list is the truth.
10. Trusting subagent-reported PR numbers. Resolve every PR number by head-branch lookup and verify against the PR files list plus blob re-fetch before merging.

## The incident history (source doc)

- 2026-10-05, PR #12: a subagent self-reported "23 paths pushed" for a PR that contained 10. The research-db was missing from the PR diff. This is why post-push verification reads the PR files list rather than believing any agent's count.
- 2026-10-05, PRs #16 and #21: research-db archives shipped unweighted, and PR #21's whole research-db landed as base64-encoded text. The v2 changelog records these as the motivation for schema v2's required non-null weight check and the json.loads re-fetch.
- 2026-10-05, wave 27: a 5-agent wave returned confident VERIFIED reports citing PRs #137 through #141, which were the PREVIOUS wave's actual numbers; no branches, PRs, or corpus dirs existed. The source doc's prescribed fix: the orchestrator must resolve every PR number by head-branch lookup (GET /pulls?head=yubi-OS:<branch>&state=all) and verify against the PR files list and blob re-fetch before merging.
- 2026-09-29: the first yubios corpus mint ran while searXNG engines were suspended for 5 of 6 docs, shipped research-db entries with zero dig results, and had to be re-minted. This is the origin of the Phase 0 preflight gate.

## Red flags (source doc)

1. Outline collapses below 4 load-bearing docs: the request is probably a single research question, not a corpus; route to parallel-deep-research.
2. jev 429 storm after fan-out: serialize the weighting phase instead of parallelizing it (weighting is the cheap phase; authoring is where parallelism pays).
3. Repo "knowledge" exists but with unexpected contents: STOP and surface; never clobber an existing corpus dir.
4. A doc's research-db digs JSON shows zero results: the doc either carries the direct-verification story or the doc does not ship.

## The pattern behind the list

Every anti-pattern encodes a way an agent's self-report can diverge from reality: counts that were not checked against the PR, weights that were never assigned, encodings that silently transformed the payload, PR numbers carried over from a previous wave, and preflight gates skipped under time pressure. The verification discipline (PR files list, blob-by-sha re-fetch, json.loads, non-null weights) is the countermeasure layer: each check maps to one incident, and each incident maps to one rule that now has teeth.

## Sources considered

No dig results for this subtopic (internal-record subtopic, no dig). Grounding: yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md (source doc, fetched 2026-10-07), including its changelog and anti-patterns sections.
