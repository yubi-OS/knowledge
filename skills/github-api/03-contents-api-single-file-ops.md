# 03 contents-api-single-file-ops

Scope: reading and writing one file at a time through the Contents API: the base64 round trip, the blob SHA requirement for updates, branch-scoped reads, and the branch parameter on writes.

## Ground spine

Source doc: `yubi-OS/yubiOS skills/github-api/SKILL.md`. Mechanism grounding from searXNG dig, weighted by jev-1.13 noul.

## Reading a file

The source doc's read pattern is `GET {base}/contents/<path>` with the standard header set, then two extractions from the JSON response: `Buffer.from(d.content, "base64").toString("utf-8")` for the content and `d.sha` for the blob SHA (source doc). The response's `content` field is base64, so every read is a decode step; the `sha` field is not metadata to discard, it is the required input for the matching write.

GitHub's contents documentation states the endpoint's coverage: "Use the REST API to create, modify, and delete Base64 encoded content in a repository" (https://docs.github.com/en/rest/repos/contents, weight 0.97). The same endpoint family also serves directory listings: "Gets the contents of a file or directory in a repository. Specify the file path or directory with the path parameter. If you omit the path parameter, you will receive the contents of the repository's root directory" (same URL, weight 0.97). The collision check that gates this corpus (GET `skills/github-api` must return 404 on main) is an instance of exactly that: a path probe against the contents endpoint where 404 means free.

## Writing a file

The write is a `PUT` to the same path with a JSON body carrying: the commit `message`, the new `content` as base64, the current file's `sha` (omitted when creating a new file), and an optional `branch` that defaults to the repo's default branch (source doc). The blob SHA from the read is what makes the PUT an update rather than a create; sending a stale or wrong SHA is what produces the 409 conflict the source doc's error table describes (source doc; see doc 09).

The one-file-per-call shape is worth stating plainly because it is the axis of the Contents-vs-Git-Data decision (doc 04): each PUT is its own commit. Two PUTs are two commits, not one atomic change.

## Branch-scoped reads

The source doc's Pattern 7 shows the same GET with a query parameter: `${base}/contents/<path>?ref=feat/v261-measured-os` (source doc). The `ref` accepts a branch name, so a script can read a file as it exists on a feature branch without checking out anything. This is how the corpus pipeline read the ground-source SKILL.md at `main` and how post-push verification will re-fetch pushed JSON blobs.

## When this pattern is the right tool

The source doc positions Contents API for "1 or 2 files, simple edits" and notes it is "clean, but limited to one file per call" (source doc). Concretely, that covers most maintenance work in the org: bumping a digest string in one Containerfile, toggling a flag in one config file, checking whether a directory exists. The pattern's cost is structural (one commit per file), not incidental, so no amount of batching inside a single PUT escapes it.

## Practical cautions

Three cautions fall out of the mechanics above, all anchored in the source doc or the weighted dig:

1. Always decode the response content before diffing or editing; the base64 payload is not usable text (source doc).
2. Never reuse a blob SHA across a later PUT without re-reading; another writer may have moved the file and the PUT will conflict (source doc error table).
3. When reading from a non-default branch, pass `ref` explicitly; the default is the repo's default branch (source doc).

The dig surface for this subtopic was cleaner than most: the official contents documentation appeared twice across the 2 queries at weight 0.97, and the remaining results were homepage and social noise correctly weighted down.
