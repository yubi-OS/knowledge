# 05 The Refreshable Property: Incremental Refresh and the 7-Day Cache

Scope: how the archive stays current: the incremental --since refresh, the session cache file with last_run_timestamp, the 7-day TTL and forced full refresh, the refresh cadence, and the operating modes that consume it. Source doc: yubi-OS/yubiOS skills/repo-refs-skill/SKILL.md.

## The incremental mechanism

The source doc makes the archive incremental. A subsequent run with --since <iso_date> fetches only the diff since the last archive timestamp: GET /repos/{r}/commits?path=refs&since=<iso_date> identifies changed files, those are pulled via the Contents API, merged into the cached archive, and the curve is re-fit (source doc, "The Refreshable Property").

GitHub's commits API documentation confirms the parameters: the List commits endpoint accepts since and until ISO 8601 timestamps and a path parameter to filter commits to a directory, and it requires Contents (read) permission on fine-grained tokens (weight 0.41, weak, docs.github.com/en/rest/commits/commits; weight 0.44, weak, docs.github.com/en/rest/commits). A Stack Overflow thread on gh api date filters shows the same query-parameter mechanics in practice (weight 0.08, weak, stackoverflow.com/questions/70331141).

## The cache file

The cache lives at session/repo-refs-archive-<repo>-<date>.json and tracks last_run_timestamp as a top-level key. It is the corpus snapshot: cached refs/ docs plus 9-D coverage, (u,v) coordinates, S2 point per item, d_pre per item, and the timestamp. It is session-local, roughly 50 to 200 KB per the source doc's output-shape table. Two hard rules attach to it:

1. If the cache is older than 7 days, the skill warns and re-fetches everything. The warning is mandatory, not silent: the cached last_run_timestamp might miss squash-merged refs/ additions, and a date-skip check exists for exactly this (if the cache says 2026-08-04 but a refs/*-2026-08-04.md doc was added in the window, force a full refresh).
2. Running RSI on the cached archive without first refreshing is an anti-pattern. The cache is a snapshot; the cycle's first step is always refresh (source doc, Anti-patterns).

General cache-invalidation practice corroborates the design shape: timestamp-based invalidation with an explicit staleness check is a standard pattern, and recomputing only derived artifacts whose inputs changed is the stated goal of incremental recomputation (weight 0.07, weak, softwarepatternslexicon.com/caching-patterns-and-invalidation/; weight 0.13, weak, github.com/jadenfix/beater/issues/319).

## The refresh cadence and use case

The lifecycle section sets re-fit cadence: re-fit when the corpus grows by at least 25% or on explicit user request, per hyperspherical-harmonic-curve. Cache TTL is 7 days; push cadence is per cycle, documented in session/repo-refs-changelog-<repo>-<date>.md.

The source doc's stated use case: a self-mode loop fires every Sunday at 9 AM Pacific via the self-archaeology cadence; each fire refreshes the refs/ archive, fits the curve, and posts the diff to the canonical refs/repo-refs-coverage-map-<repo>-<date>.md. After 4 weeks the refs/ corpus's structural shape is a single page that fits on screen, which the doc describes as dissolving the cold-start problem.

## How the modes consume refresh

Mode A (cold-start) has no cache: pull the full listing, fetch every body, fit, save. Mode B (incremental) is the cache consumer: read the cache, pull deltas since last_run_timestamp, merge, re-fit, run Stage 4, save and push. Mode C (deep-research cycle) runs A or B first, because the deep-research dispatch needs a current archive to detect whether the new topic's coverage is structurally unique. Mode D (target-file RSI) reads the cached archive and isolates one file; it is the only mode where operating on the snapshot without a full re-fit is sanctioned, and even it defers to Stage 3 of the full fit when the atomic edit shows no geodesic gain.

## Failure surfaces

The red-flag list covers the refresh path: if the cache file is over 7 days old AND the refresh fails, the cache is the only honest state; surface the failure to the user, do not silently fall back to partial refresh. And a skipped date in last_run_timestamp (cache says 2026-08-04 but a 2026-08-04 doc exists) means the incremental window missed an addition; force a full refresh. The verification checklist requires last_run_timestamp to be updated in the cache after every run.

Source-quality note: the two commits-API doc results weighted 0.41 and 0.44, just under the 0.5 authoritative threshold, and are labeled weak; all other dig results for this subtopic weighted 0.03 to 0.13. The mechanism itself is grounded in the source doc.
