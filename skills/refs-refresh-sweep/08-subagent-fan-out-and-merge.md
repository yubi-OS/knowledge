# 08 - Phase 6: Parallel Subagent Fan-Out and Merge Orchestration

Scope: how one refresh run fans out to parallel subagents, what each subagent's contract is, and the merge orchestration that lands one-file PRs sequentially.

Grounding spine: `yubi-OS/yubiOS skills/refs-refresh-sweep/SKILL.md` (source doc), plus GitHub pull-request API documentation via dig.

## The dispatch contract

Phase 6 dispatches one `task` subagent per top-ranked doc, type `general`, model preset `smart`, ALL in one turn for parallelism (source doc). Two dispatch rules are hard:

1. Each subagent prompt must be fully self-contained: subagents see nothing from the orchestrating session. The source doc's template enumerates what must be in the prompt: the doc path, its 2 dig queries, the endpoint URLs, the rate-limit sharing warning, the Git Data API chain, the branch and PR spec, and the report format.
2. Dedupe the brief list before dispatch; two agents picking the same doc is a listed red flag.

Each subagent's inner loop: fetch the doc (raw URL with User-Agent), dig (2 queries plus one discretionary), jev-weight results in 1 to 2 batched calls with 30s backoff on 429 and a max of 3 retries, then edit, then push one draft PR on branch `refresh/<topic-slug>-<date>` (or `refresh-<topic-slug>-<date>`; branch names must NOT start with `refs/`).

## The edit contract: append-only

The corpus is an audit trail: subagents append a dated `## Refresh: <DATE>` section with finding lines that carry source URL and jev weight plus a full "Sources considered" table, update facts in place ONLY with direct citable evidence, and never delete existing analysis (source doc). "Rewriting docs instead of appending" is a listed anti-pattern. Two more red flags protect the same invariant: a refresh PR claiming upstream changes with no source URL is rejected, and an honest "no material change found" verdict is a SUCCESS; 4 of the 14 validating PRs were no-change verdicts.

When searXNG engines are suspended, the subagent's sanctioned fallback is direct primary-source verification (GitHub releases API, kernel.org, upstream NEWS files), and the requirement must be in the prompt so a zero-result dig never becomes an invented summary (source doc; suspension mechanics in doc 05).

The red-flag list also covers subagent health: a subagent returning under 200 characters or no PR number is re-dispatched immediately with the failure mode explicitly forbidden (a known subagent failure pattern).

## Dig grounding: the GitHub PR API surface

GitHub's REST documentation is the authority for the endpoints the fan-out writes through (https://docs.github.com/en/rest/pulls, weight 0.95; https://docs.github.com/rest/pulls/pulls, weight 0.95; pinned API version view at https://docs.github.com/en/rest/pulls/pulls?apiVersion=2026-03-10, weight 0.92). Draft pull requests are available in public repositories on GitHub Free plans and in public and private repositories on Team and Enterprise plans (https://docs.github.com/rest/pulls/pulls, weight 0.95). One structural distinction matters for merge orchestration: certain PR fields are managed through the issues API endpoints rather than the pulls endpoints (https://github.com/github/docs/blob/main/content/rest/pulls/pulls.md, weight 0.89). A community discussion on creating draft PRs via the API surfaced in the dig but carries weak weight (0.10); official docs supersede it.

The orchestration-pattern blog posts that surfaced in the dig (fan-out, pipeline, subagent orchestration) all carry weak weight (0.09 to 0.15) and are cited only as weak, non-authoritative corroboration that fan-out is a recognized multi-agent pattern; the skill's operative rules come from the source doc.

## Merge orchestration

Per the source doc:

- Merge each PR via `POST /repos/{repo}/merges` (base main, head branch), NOT the PR merge endpoint. Reason, learned the hard way in the validating run: `PATCH draft:false` silently no-ops on this PAT (returns 200 while the PR stays a draft, so the subsequent merge 405s). The merges endpoint lands the merge and GitHub flips the PR to `merged` itself.
- Merge sequentially, 1s apart; disjoint one-file PRs never conflict.
- Verify all PRs report `merged=true` and main moved to the last merge SHA.

"One giant refresh PR" is a listed anti-pattern: unreviewable. One doc per PR is the rule, which is also what makes sequential merges safe.

## Report contract

Each subagent reports once at the end: PR number and URL, branch, files changed, a 2 to 4 sentence dig summary, jev call count and cost, and failures (source doc template). The orchestrator assembles the full PR table and reports once, per the operator's check-in preference.
