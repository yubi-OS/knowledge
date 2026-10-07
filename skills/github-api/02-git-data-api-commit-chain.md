# 02 git-data-api-commit-chain

Scope: the five-step Git Data API chain the source doc calls the most-used pattern in the project: get the tree SHA, create blobs, create a tree, create a commit, update the branch ref.

## Ground spine

Source doc: `yubi-OS/yubiOS skills/github-api/SKILL.md`. External mechanism docs were collected by searXNG dig and weighted by jev-1.13 noul.

## The chain

The source doc names the five steps in order: get current tree SHA, create blobs, create new tree, create commit, update branch ref (source doc). The sequence mirrors how git itself represents a change, which is why the pattern works for any number of files in one atomic commit.

Step 0 resolves the branch tip twice: `GET /git/ref/heads/main` returns the head SHA, and `GET /git/commits/<sha>` resolves that commit to its tree SHA (source doc). The tree SHA, not the commit SHA, is what the next step builds on.

Step 1 creates one blob per changed file via `POST /git/blobs` with `{content, encoding: "utf-8"}` and reads back the blob SHA (source doc). The response SHA is content-addressed, so the same file content always yields the same blob SHA.

Step 2 creates the tree with `POST /git/trees`, passing `base_tree: <existing tree SHA>` plus one entry per file: `{path, mode: "100644", type: "blob", sha: <blob SHA>}` (source doc). The `base_tree` field is what makes this an edit of the current tree rather than an orphan tree: entries replace or add paths on top of it.

Step 3 creates the commit with `POST /git/commits` carrying a message, the new tree SHA, and `parents: [<main SHA>]` (source doc). Step 4 moves the branch: `PATCH /git/refs/heads/main` with `{sha: newCommit.sha, force: false}` (source doc). The `force: false` flag is the safety property: the ref update is fast-forward only, so a push built on a stale base fails instead of silently overwriting a commit that landed in between.

Step 5 in the source doc shows branch creation rather than update: `POST /git/refs` with `{ref: "refs/heads/feat/v261-base-image", sha: mainSHA}`, then a later PATCH to move that branch to a new commit (source doc). This is how the mint flow itself works: create the branch at main's head, then fast-forward it onto the corpus commit.

## What the official docs add

GitHub's Git database documentation describes the surface as a whole: "Use the REST API to interact with raw Git objects in your Git database on GitHub and to list and update Git references (branch heads and tags)" (https://docs.github.com/en/rest/git, weight 0.96). That sentence covers all four sub-resources the chain touches: blobs, trees, commits, refs.

The trees endpoint documentation adds a behavior the source doc's happy path does not exercise: "The tree creation API accepts nested entries. If you specify both a tree and a nested path modifying that tree, this endpoint will overwrite the contents of the tree with the new path contents, and create a new tree structure" (https://docs.github.com/en/rest/git/trees, weight 0.97). For the flat, one-directory-per-entry style the source doc uses this is a non-issue, but it warns against mixing parent-directory entries with nested-path entries in the same tree call.

## Why the pattern matters for this corpus

The mint pipeline that produced this corpus used exactly this chain: blobs for 17 plain UTF-8 files, one tree with `base_tree`, one commit, one ref creation, then a draft PR. The skill's claim that this is "the most-used pattern in the project" (source doc) is structural: every multi-file, multi-repo write in the org's automation depends on it, and its atomicity property (one commit, all files) is what keeps mirrors and mints consistent.

## Failure modes

The source doc's rate-limit section notes that Git Data API calls (blobs, trees, commits) count against the standard authenticated limit (source doc; see doc 09 for the numbers). A large mint is therefore a burst of small POSTs, and the source doc's own guidance is to pace batch calls at 200 ms intervals to avoid 429s (source doc).
