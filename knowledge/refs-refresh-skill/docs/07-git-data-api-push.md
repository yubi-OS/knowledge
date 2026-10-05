# Git Data API push chain: one call, no clone

Scope: driving blob, tree, commit, ref, and draft PR creation through the REST API in a single shell call, and the platform quirks that force that shape.

## The chain

The canonical way to push files to GitHub without a git client is the Git Data API chain. GitHub's own guide spells it out: create blobs for file contents, create a tree referencing the blob SHAs, "create a new commit object with the current commit SHA as the parent and the new tree SHA, getting a commit SHA back", then "update the reference of your branch to point to the new commit SHA" (https://github.com/github/docs/blob/main/content/rest/guides/using-the-rest-api-to-interact-with-your-git-database.md, weight 0.65). The guide closes with the honest assessment: "It might seem complex, but it's actually pretty simple when you understand the model".

The full chain used by a corpus mint adds 2 steps:

1. GET the head commit sha of the base branch, then GET the commit to obtain its base tree sha.
2. POST the tree with base_tree set to that sha, so the new tree inherits everything not explicitly overridden, then POST the commit with the new tree and the head as parent, then POST the ref for the new branch, then POST the draft PR (https://docs.github.com/en/rest/pulls, weight 0.92).

Every step consumes the previous step's sha. That dependency chain is what makes the operation atomic in practice: either all 6 calls land or the branch never exists.

## Why one shell call

The environment the mint runs in wipes /tmp between shell calls (internal evidence, 2026-09-29). The chain's intermediate state, head sha, base tree sha, and one blob sha per file, cannot survive to a second call. The design consequence is to run the entire chain in ONE bash invocation: fetch head, create all blobs, create the tree, create the commit, create the ref, create the PR, all in one process with the shas held in shell variables or a small script's memory.

This is the same checkpointing problem as any long pipeline, with a twist: the platform deletes the checkpoints. When the environment destroys intermediate state, the only robust design is to shrink the stateful window until it fits inside one atomic operation.

## Blob encoding

File contents go to POST /git/blobs with encoding utf-8 for text. The rule the run settled on: plain UTF-8 text only, never base64-encoded text as file content. Base64-wrapped JSON in a blob produces a file that fails JSON parsing on re-fetch, which breaks the post-push verification step. Bodies larger than about 100KB go through stdin (curl -d @-) rather than as shell arguments, because argument size limits are a silent failure mode that corrupts a blob mid-chain.

## Branch naming

Branch names must not start with refs/ (internal evidence, 2026-09-29). This is easy to hit accidentally: a corpus named "refs-refresh" invites a branch like refs/refresh-skill, which the API rejects or silently misinterprets because refs/ is the ref namespace prefix. The working pattern prefixes with mint/ or a date instead.

## Rate limits during the chain

The chain is 6 or more API calls in quick succession, so the REST rate limit budget matters. GitHub documents primary rate limits as a cap on REST API requests within a time window, with some endpoints like search more restrictive (https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api, weight 0.92). Git LFS transfers count against a separate bucket of 300 requests per minute unauthenticated and 3,000 authenticated (https://github.com/github/docs/blob/main/content/rest/using-the-rest-api/rate-limits-for-the-rest-api.md, weight 0.95), which matters only if the mint touches LFS content, but the general point stands: know which bucket each call consumes before batching.

A draft PR on a public repository is available on Free and Free-for-organizations plans (https://docs.github.com/pt/rest/pulls/pulls, weight 0.77, non-English official mirror), so the final POST /pulls with draft:true needs no special plan on an open-source target repo.

## The post-push verification habit

Because the chain has no local clone, the only way to know it worked is to read back. The verification pass after the push: fetch the PR's file list to confirm the expected paths appear in the diff, then re-fetch each pushed JSON file from raw content URLs and parse it. A mint whose research-db files fail to parse on read-back is a failed mint even though every API call returned 2xx, because a 2xx from blob creation only means GitHub stored the bytes you sent, not that the bytes were the ones you meant to send.

## Summary

1. Blob, tree, commit, ref, PR: 6 calls, each consuming the previous sha (https://github.com/github/docs/blob/main/content/rest/guides/using-the-rest-api-to-interact-with-your-git-database.md, weight 0.65).
2. Run the whole chain in one shell call because the platform wipes /tmp between calls (internal evidence, 2026-09-29).
3. UTF-8 blobs only, never base64 as content; large bodies via stdin.
4. Never start a branch name with refs/.
5. Verify by reading back, because a 2xx is not a parse check.
