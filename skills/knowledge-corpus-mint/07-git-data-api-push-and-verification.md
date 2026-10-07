# Git Data API push and post-push verification: Phase 5

Scope: the one-chain push of the corpus to yubi-OS/knowledge through the Git Data API, the empty-repo bootstrap, and the REQUIRED post-push verification that turns a self-report into evidence.

## The push chain

Phase 5 of the source doc (yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md) lands the corpus in ONE Git Data API chain in ONE bash call, because the sandbox /tmp wipes between calls. The chain is: read refs/heads/main, take the commit's tree, POST blobs, POST a tree with base_tree, POST a commit with the new tree, POST the branch ref, then POST a draft pull request (source doc). Branch names must NOT start with refs/, which GitHub rejects (source doc).

The GitHub REST API documentation defines exactly these building blocks: REST endpoints for the Git database covering blobs, trees, commits, and refs (https://docs.github.com/en/rest/git, weight 0.84), and the guide to using the REST API to interact with your Git database, which describes the blob, then tree, then commit, then ref flow as the way to build commits programmatically without a git client (https://docs.github.com/en/rest/guides/getting-started-with-the-git-database-api, weight 0.78). The pull request creation endpoint is POST /repos/{owner}/{repo}/pulls with head and base and a draft parameter, documented on the REST pulls reference (https://docs.github.com/en/rest/pulls/pulls, weight 0.70; https://docs.github.com/en/rest/pulls, weight 0.64). Every call carries the MASTER GIT SU connection plus User-Agent and Content-Type headers (source doc).

Blobs are pushed with encoding utf-8 and plain text, NEVER base64; the changelog records why: on 2026-10-05 PR #21's whole research-db landed as base64 (source doc).

## The empty-repo bootstrap

Phase 3 is idempotent repo bootstrap: GET /repos/yubi-OS/knowledge; a 404 means create it. A fresh repo is EMPTY and the Git Data API returns 409 on it, so the run seeds one Contents-API commit first, a top-level README.md explaining the repo convention, and only then uses the Git Data API for everything else (source doc). The anti-pattern list names the failure of skipping this: Git Data API 409s on a fresh repo (source doc).

## The REQUIRED verification

Post-push verification is REQUIRED before reporting success (source doc). It has three parts:

1. GET /repos/yubi-OS/knowledge/pulls/<n>/files with per_page 100: the research-db files MUST be in the PR diff; a mint whose research-db is missing from the PR is a FAILED mint (source doc). This bit a live run on 2026-10-05, PR #12 (source doc).
2. Re-fetch each research-db .json and parse it: every file must parse and every archive entry must carry a non-null weight (source doc).
3. Report the verification line in the fixed form: VERIFIED: files N, research-db M parse, weights K/K (source doc).

The skills-variant speed optimization sharpens step 2: verify each pushed .json through the Git blobs API, GET /repos/yubi-OS/knowledge/git/blobs/<sha> using the sha from the push's own tree response, base64-decode and parse it. The sha from your own tree response is authoritative (skills-variant brief, 2026-10-06). The brief forbids raw.githubusercontent for this check because CDN lag produced stale 404s and even mismatched content during the 2026-10-06 campaign run (skills-variant brief, 2026-10-06); the source doc's raw-fetch check remains the documented baseline this variant supersedes in mechanism, not in intent.

## Resolving the PR number

The orchestrator must resolve the actual PR number by head-branch lookup, GET /repos/yubi-OS/knowledge/pulls?head=yubi-OS:<branch>&state=all, and NEVER trust a PR number from its own assumption or a subagent's report (source doc, task brief). The anti-pattern entry records the concrete failure: a 5-agent wave on 2026-10-05 returned confident VERIFIED reports citing PRs #137 to #141, which were the previous wave's actual numbers; no branches, PRs, or corpus dirs existed (source doc).

## Sources

- yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md (source doc, fetched 2026-10-07)
- https://docs.github.com/en/rest/git (weight 0.84)
- https://docs.github.com/en/rest/guides/getting-started-with-the-git-database-api (weight 0.78)
- https://docs.github.com/en/rest (weight 0.79)
- https://docs.github.com/en/rest/pulls/pulls (weight 0.70)
- https://docs.github.com/en/rest/pulls (weight 0.64)
