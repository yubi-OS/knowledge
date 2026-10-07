# 08 history-and-branch-inspection

Scope: the read-side pattern the source doc gives for a file's commit history: the commits endpoint filtered by path, and what its pagination defaults mean.

## Ground spine

Source doc: `yubi-OS/yubiOS skills/github-api/SKILL.md`. External grounding from searXNG dig, weighted by jev-1.13 noul.

## The pattern

The source doc's history pattern is one call: `GET {base}/commits?path=AGENTS.md&per_page=5` (source doc). The `path` parameter scopes the commit list to changes touching one file, and `per_page=5` bounds the response. The example then reads three fields per commit: `sha.substring(0, 12)` for a short SHA, `commit.author.date` for the timestamp, and the first line of `commit.message` for the subject (source doc).

That output shape is a mini changelog: who changed the file, when, and the subject line. For the org's automation this is the cheapest way to answer "when did this file last change and why" without cloning the repo or running git locally.

## What the official docs add

GitHub's commits documentation carries one pagination caveat the source doc does not restate: "When calling this endpoint without any paging parameter (per_page or page), the returned list is limited to 250 commits, and the last commit in the list is the most recent of the entire comparison" (https://docs.github.com/en/rest/commits/commits, weight 0.97). Two implications follow:

1. The source doc's `per_page=5` is not just politeness; passing paging parameters switches the endpoint onto the explicit-paging path with its own cap behavior, versus the undocumented default cap of 250.
2. For a file with more than 250 relevant commits and no paging parameters, the tail of history is silently out of reach, so any history-audit script should always pass `per_page` explicitly.

The commits documentation also names the surface this endpoint belongs to: listing commits on a repository is part of the commits family (https://docs.github.com/en/rest/commits/commits, weight 0.97), which the source doc's References section also links (source doc).

## How it composes with the other patterns

The history read is the inverse number of the write chain in doc 02: after a script pushes a change through blobs, trees, commits, and refs, the commits-with-path call verifies what landed, when, and with which subject line. The short-SHA plus date plus subject output the source doc prints is exactly the triple a post-push verification wants (source doc).

It also pairs with the Contents API branch read from doc 03: the contents read answers "what does this file say on branch X" while the commits read answers "how did it get that way", and both run from the same base URL with the same header set (source doc).

## Dig surface

The dig for this subtopic was the noisiest in the corpus. The first query returned the authoritative commits documentation at 0.97 plus homepage and sign-in noise; the second query returned mostly off-topic results (an npm documentation repo, a FreshPorts page, an NTFS wiki article) weighted 0.01 to 0.06 and all rejected. The content of this doc rests on one authoritative source plus the source doc. That is sufficient because the endpoint is a single, stable read with one documented caveat, but the pattern illustrates why the weighting pass matters: without it, the NTFS and FreshPorts results would have looked like peers of the official documentation.
