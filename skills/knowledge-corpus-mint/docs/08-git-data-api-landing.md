# 08 - Landing the corpus via the Git Data API

Scope: Phase 5 landing chain: blobs (utf-8, never base64), trees with base_tree, commits, refs, draft PR; the empty-repo 409 seed; and the two post-push verification checks.

Grounding spine: yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md (source doc), plus the dig results below.

## The chain (source doc)

Phase 5 lands the corpus with ONE Git Data API chain executed in ONE bash call (the sandbox /tmp wipes between calls, so nothing may be split across calls):

1. Read refs/heads/main to get the head SHA, then read that commit to get the base tree SHA.
2. Create one blob per file with POST /git/blobs, passing the file text with encoding "utf-8". NEVER base64.
3. Create a tree with POST /git/trees, passing base_tree and one entry per file (path, mode 100644, type blob, sha).
4. Create a commit with POST /git/commits (message, tree, parents with the head SHA).
5. Create the branch with POST /git/refs, for example refs/heads/mint/<ref>-<date>. Branch names must NOT start with refs/ when named in the API call.
6. Open the draft PR with POST /pulls (title, head, base, body, draft: true).

GitHub's own documentation describes these endpoints: the Git database API covers blobs, trees, commits, and refs (https://docs.github.com/en/rest/git, weight 0.96), with dedicated endpoint references for blobs (https://docs.github.com/en/rest/git/blobs, weight 0.97) and pull requests (https://docs.github.com/en/rest/pulls, weight 0.97; https://docs.github.com/rest/pulls/pulls, weight 0.97). The source files behind those docs confirm the parameter shapes (https://github.com/github/docs/blob/main/content/rest/git/blobs.md, weight 0.90; https://github.com/github/docs/blob/main/content/rest/pulls/pulls.md, weight 0.90). A Stack Overflow answer on creating commits via API v3 describes the same blob-tree-commit chain but carries weak backing here (https://stackoverflow.com/questions/11801983/how-to-create-a-commit-and-push-into-repo-with-github-api-v3, weight 0.12, weak backing). Other dig hits were off-topic or low-grade (https://handwiki.org/wiki/Software:Linux_kernel, weight 0.31, weak; https://github.com/, weight 0.35 and 0.39, weak marketing pages; https://apple-tree.life/~michael/blog/2011/, weight 0.22, weak).

## The empty-repo seed (source doc)

Phase 3 defines the preconditions: a fresh repo is EMPTY and the Git Data API returns 409 on it, so the run seeds one Contents-API commit first (a top-level README.md explaining the repo convention), and only then uses the Git Data API for everything else. Skipping this seed is a listed anti-pattern.

## Body-size handling

PR and commit bodies larger than 100KB go via stdin (curl -d @-), never as shell arguments (parent-brief push mechanics).

## Post-push verification (source doc, REQUIRED)

1. GET /pulls/<n>/files?per_page=100 and confirm the research-db files are in the PR diff. A mint whose research-db is missing from the PR is a FAILED mint; the source doc records this biting a live run on 2026-10-05 (PR #12).
2. Re-fetch each research-db .json and json.loads it; every file must parse and every archive entry must carry a non-null weight. The changelog ties this check to PRs #16 and #21, where unweighted archives and base64-encoded JSON shipped (source doc).
3. Report the verification line: VERIFIED: files <n>, research-db <m> parse, weights <k>/<k>.

The skills-variant brief adds a stronger form of check 2: verify by the Git blobs API using the sha returned from your own tree response (GET /repos/<owner>/<repo>/git/blobs/<sha> plus base64-decode), never raw.githubusercontent, because CDN lag produced stale 404s and mismatched content during the 147-mint run (skills-variant brief, speed optimizations).

## Why one chain, one call

The single-call rule is not style: atomicity is the audit property. If blobs, tree, commit, and ref land in separate sessions, a killed process between steps leaves a partial tree with no branch pointing at it, and the PR files list becomes the only reliable record of what actually landed. That is exactly the failure mode the verification phase is built to detect.

## Sources considered

| url | weight |
| --- | --- |
| https://docs.github.com/en/rest/git/blobs | 0.97 |
| https://docs.github.com/en/rest/pulls | 0.97 |
| https://docs.github.com/rest/pulls/pulls | 0.97 |
| https://docs.github.com/en/rest/git | 0.96 |
| https://github.com/github/docs/blob/main/content/rest/git/blobs.md | 0.90 |
| https://github.com/github/docs/blob/main/content/rest/pulls/pulls.md | 0.90 |
| https://github.com/ | 0.39 (weak, marketing) |
| https://handwiki.org/wiki/Software:Linux_kernel | 0.31 (weak, off-topic) |
| https://github.com/ | 0.35 (weak, marketing) |
| https://apple-tree.life/~michael/blog/2011/ | 0.22 (weak, off-topic) |
| https://stackoverflow.com/questions/11801983/how-to-create-a-commit-and-push-into-repo-with-github-api-v3 | 0.12 (weak) |
