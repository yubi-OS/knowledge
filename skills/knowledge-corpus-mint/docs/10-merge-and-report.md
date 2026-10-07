# 10 - Merge via /merges and the final report

Scope: Phase 6 to 7: merging via POST /merges (why PATCH draft:false no-ops), merged=true verification, and the single final report shape.

Grounding spine: yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md (source doc), plus the dig results below.

## The merge path (source doc)

Phase 6 merges with POST /repos/{owner}/{repo}/merges (base main, head branch), NOT the PR merge endpoint. The documented reason: PATCH draft:false silently no-ops on this PAT (HTTP 200, but the draft flag stays true and the merge then 405s). After the merge, verify merged=true on the PR.

GitHub documents the branch-merge endpoint directly: "the Merge a branch endpoint" merges a head branch into a base branch (https://docs.github.com/v3/repos/merging, weight 0.85). GitHub's changelog records that the merge API became asynchronous and generally available on 2026-10-01 (https://github.blog/changelog/2026-10-01-github-async-merge-api-generally-available/, weight 0.76), meaning merge responses and resulting state may now settle asynchronously, which reinforces checking merged state rather than trusting the POST response alone. The pull-request endpoint docs cover the PR merge route that the skill deliberately avoids (https://docs.github.com/en/rest/pulls, weight 0.97; https://docs.github.com/rest/pulls/pulls, weight 0.97; https://github.com/github/docs/blob/main/content/rest/pulls/pulls.md, weight 0.91). Lower-grade hits on the merge endpoint were weakly backed (https://apicheats.dev/github/repos-merge, weight 0.14, weak; https://stackoverflow.com/questions/61823360/getting-a-list-of-merged-commits-through-github-rest-api-v3, weight 0.13, weak; https://github.com/, weight 0.36 and 0.40, weak marketing pages; https://www.copetti.org/writings/consoles/playstation-portable/, weight 0.28, weak, off-topic; https://github.com/repowise-dev/repowise/blob/main/docs/scale/WORKSPACES.md, weight 0.72, unrelated project doc).

## Why the draft gotcha is structural

The draft-to-merge sequence has two steps on a normal flow: undraft the PR, then merge it. On this PAT the first step silently fails while returning success, so the merge step then fails with a 405 whose cause is not obvious. Bypassing the PR endpoint entirely and merging the branch pair with /merges removes the draft state from the equation, which is why the source doc prescribes it. The no-op is recorded in the anti-patterns section as well, so a future maintainer who sees a 405 knows to check whether they merged a draft via the wrong endpoint.

## The final report (source doc)

Phase 7 is one report at the end (guideline 7: one report at the end with the full doc table), carrying:

- repo and ref path (for example, yubi-OS/knowledge knowledge/<ref>/)
- doc list with sizes
- research DB stats: results collected, quality-weight distribution, jev calls and total cost
- PR number
- merge SHA

The verification checklist that closes the skill requires: preflight passed and recorded; corpus directory contains README plus N docs plus research-db/; every doc's factual claims carry source URLs (spot-check 3); every result carries a jev weight and task_id lineage; merged=true verified; total jev spend logged in the run plan; and no network state changed (the searxng port stays internal-only).

The skills-variant brief adapts the report shape for a skills ground source and adds the resolved-PR-number rule: never trust an assumed PR number; resolve it by head-branch lookup (GET /pulls?head=yubi-OS:<branch>&state=all), which is the wave-27 countermeasure applied to the reporter itself.

## Spend envelope

The source doc's guideline 10 sets the target: total jev spend under $0.05 per minted corpus. The worked example budgets 14 searXNG queries, roughly 84 results, and 17 weighting requests at about $0.005. The skills-variant speed optimizations tighten this further by batching 10 to 15 questions per weighting request against DefAPI direct, keeping the whole mint inside a handful of requests.

## Sources considered

| url | weight |
| --- | --- |
| https://docs.github.com/en/rest/pulls | 0.97 |
| https://docs.github.com/rest/pulls/pulls | 0.97 |
| https://docs.github.com/v3/repos/merging | 0.85 |
| https://github.com/github/docs/blob/main/content/rest/pulls/pulls.md | 0.91 |
| https://github.blog/changelog/2026-10-01-github-async-merge-api-generally-available/ | 0.76 |
| https://github.com/repowise-dev/repowise/blob/main/docs/scale/WORKSPACES.md | 0.72 (weak, unrelated) |
| https://github.com/ | 0.40 (weak, marketing) |
| https://github.com/ | 0.36 (weak, marketing) |
| https://www.copetti.org/writings/consoles/playstation-portable/ | 0.28 (weak, off-topic) |
| https://apicheats.dev/github/repos-merge | 0.14 (weak) |
| https://stackoverflow.com/questions/61823360/getting-a-list-of-merged-commits-through-github-rest-api-v3 | 0.13 (weak) |
