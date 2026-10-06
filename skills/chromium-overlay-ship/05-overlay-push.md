# 05 - Overlay push via the Git Data API

Scope: how the validated patch lands in yubi-OS/chromium-provenance. The exact Git Data API chain (refs to tree to blobs to tree to commit to ref update), the required User-Agent, and the SERIES.md row discipline that makes the series self-documenting.

Source doc: yubi-OS/yubiOS skills/chromium-overlay-ship/SKILL.md (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/chromium-overlay-ship/SKILL.md).

## The chain, step by step

The push uses connection `conn_3h7rj41VF6hs` and the raw Git Data API, not a working copy (source doc). GitHub documents these endpoints under "REST API endpoints for Git database" (https://docs.github.com/en/rest/git, weight 0.9). The sequence from the source doc:

1. `GET git/refs/heads/main` on the overlay repo to get the head commit sha, then the tree sha (source doc).
2. `POST git/blobs` for the patch file (encoding base64) and a second blob for the new SERIES.md (source doc). The blobs endpoint creates git blob objects with an explicit encoding parameter (https://docs.github.com/en/rest/git/blobs, weight 0.89).
3. `POST git/trees` with `base_tree` set to the current tree, adding the two new blobs at their patch paths (source doc). The trees API takes a base_tree so unchanged entries carry over and only deltas are listed (https://docs.github.com/en/rest/git/trees, weight 0.9).
4. `POST git/commits` with `parents=[main sha]` and the new tree (source doc).
5. `PATCH git/refs/heads/main` with the new commit sha and `force=false` (source doc).

Two operational details the source doc calls out: a `User-Agent: sauna-agent` header is REQUIRED on these calls or GitHub 403s (source doc), and the ref update is a fast-forward (`force=false`), so a race with another writer fails loudly instead of clobbering (source doc).

The result is that the overlay repo advances atomically from one consistent tree to the next: patch and SERIES row land together or not at all. The chain in this corpus's own mint used the same API family, which is how it verified its own pushed files by blob sha.

## SERIES.md discipline

`patches/SERIES.md` is the overlay's ledger. The source doc specifies two row operations:

- **New member**: insert a new row of the form `| NNNN | \`patches/NNNN-name.patch\` ✅ AUTHORED (...) | paths | one-line effect |` immediately after the previous member's row, asserting exactly one occurrence of the anchor row first (source doc).
- **Regenerated member**: REPLACE the member's row in place rather than adding a new one (source doc).

The assert-count-1 check on the anchor row is the mechanical guard: if the previous member's row appears zero or two times, SERIES.md is already in a state the pipeline does not understand, and proceeding would corrupt the ledger (source doc).

The most important rule is about content: row text is the durable changelog, and the pipeline keeps it detailed, appending each fixup's story before the trailing columns (source doc). A one-word row loses the history of why the patch exists; a detailed row survives when memory does not.

## Why the Git Data API instead of git push

The pipeline has no local clone of the overlay on the box and does not need one. The blob/tree/commit/ref chain expresses the exact same object graph a push would, but from anywhere, with content supplied directly (https://docs.github.com/en/rest/git, weight 0.9). For the patch-plus-ledger case the API form is strictly more convenient: the two blobs are built in memory from the fetched patch text and the edited SERIES.md, and no checkout exists to drift.

## Failure posture

The chain is deliberately ordered so partial failure is visible: blobs first (no effect until referenced), tree next, commit next, ref update last (source doc). A failure before the ref update leaves the overlay untouched. The post-push verification habit (confirm the pushed blobs decode and parse) closes the loop; the source doc's CI step then treats the NEW head sha as the only acceptable verification target (doc 06).

## Summary

Five API calls and one ledger edit turn a validated patch into a durable overlay member: refs, blobs (patch + SERIES.md), tree with base_tree, commit with parent, fast-forward ref update, all under the required User-Agent (source doc; endpoint reference https://docs.github.com/en/rest/git, weight 0.9). The SERIES row written in the same commit is not decoration; it is the changelog the whole discipline leans on (source doc).
