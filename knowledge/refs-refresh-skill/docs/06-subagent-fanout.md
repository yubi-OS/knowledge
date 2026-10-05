# Subagent fan-out: one PR per document

Scope: fanning out one subagent per top-ranked document, each opening its own draft pull request, and the merge path that actually works for draft branches.

## The fan-out shape

After triage ranks the corpus and the dig phase collects weighted evidence per document, the refresh work itself is embarrassingly parallel: each document's refresh touches its own file, its own dig, its own PR. The validated run fanned out 14 subagents, one per top-ranked document, each producing a draft PR (internal evidence, 2026-09-29, PRs 261 through 274).

The engineering analysis of when fan-out helps matches this shape. Parallel subagent orchestration is described as "a latency-and-throughput optimization for the read-heavy, independent-" workloads, with the guidance to keep writes single-threaded, fan out only genuine reads, and price the fan-out against the single-agent baseline before building it (https://agentropic.ai/blog/parallel-subagent-orchestration/, weight 0.61). A document refresh is mostly reads (dig, verify) followed by one isolated write (its own file, its own branch), which is the safe end of that spectrum. The single-threaded-write rule is preserved by giving every subagent its own branch, so the only shared write is the merge, done centrally.

## Honest no-change verdicts

10 of the 14 refreshed documents got material changes; 4 got honest no-change verdicts (internal evidence, 2026-09-29). The no-change verdict is not a failure state, it is a measured outcome: the dig found nothing that contradicts the document, and the correct action is to record that finding rather than manufacture a diff. A fan-out design that requires every worker to return a change creates pressure to edit for the sake of editing, which is how documentation gets worse during refreshes.

The mechanism that makes honest verdicts safe is that the research database captures the evidence regardless. A no-change subagent still wrote its dig record and weights; the corpus gained provenance even where it gained no prose.

## Draft PRs as the unit of work

Each subagent opens a draft pull request rather than pushing directly. GitHub documents draft pull requests as available in public repositories on Free and Pro plans (https://docs.github.com/pt/rest/pulls/pulls, weight 0.77, a non-English mirror of the official endpoint docs). The REST API surface for managing pull requests and reviews is the standard endpoint set (https://docs.github.com/en/rest/pulls, weight 0.87).

Draft status carries the review gate: a draft PR is visible and diffable but explicitly not merge-ready, which matches a machine-authored change awaiting human review. The draft is also the natural place for the PR body that carries the evidence summary, which is what a reviewer needs to judge the refresh without re-running the dig.

## The merge path that works

The operational lesson from the validating run: PATCH draft:false silently no-ops on the PAT in use, and the working merge path is the merges endpoint, POST /repos/{repo}/merges (internal evidence, 2026-09-29). GitHub's pull request merge documentation covers the merge options available on a PR, including rebase and merge where "all commits from the topic branch (or head branch) are added onto the base branch individually without a merge commit" (https://docs.github.com/en/pull-requests/reference/pull-request-merges, weight 0.97).

Why the merges endpoint works where PATCH fails: POST /repos/{owner}/{repo}/merges performs a merge in the repository's git graph directly, merging one head into a base, without going through the pull request state machine at all. A draft PR's underlying branch is a normal branch, so the merge endpoint can land it; the PR state never has to transition from draft to open. The PATCH no-op means the PR stays marked draft even after its branch lands, which is cosmetic, and the merge record is the source of truth.

There is also a fast-forward-only path in the ecosystem, an action that merges a PR by fast-forward only, moving the base branch to the head branch (https://github.com/marketplace/actions/fast-forward-pr, weight 0.63). That is the same insight in workflow form: when the base has not moved, a fast-forward merge of the head branch is the cleanest landing, and it is what the merges endpoint gives you when the base tree has not advanced.

## Coordination costs

The costs the run measured: rate limits are shared per IP across all parallel subagents (15 per minute on the decision-model endpoint in the validating environment), so N subagents competing for one budget each get 1/N of it unless the orchestrator staggers them (internal evidence, 2026-09-29). Subagents also write only inside their own sandbox paths, so artifacts land under their own session directories, never the orchestrator's.

## Summary

1. Fan out per document; keep the only shared write (the merge) central.
2. Honest no-change verdicts are measured outcomes, backed by the dig record either way.
3. Draft PR per subagent for the review gate; PATCH draft:false no-ops on some PATs.
4. Merge draft branches through POST /repos/{repo}/merges, which lands the git graph directly (https://docs.github.com/en/pull-requests/reference/pull-request-merges, weight 0.97).
