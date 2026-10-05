# Refreshable incremental archives

Scope: incremental refresh design for a cached archive of repo events: since/from/linear-since delta fetching, cache invalidation windows, and idempotent merges.

## Why incremental beats full refetch

A first archive run pulls everything. A refresh that pulls everything again wastes rate budget and time, and on a large history it is the difference between a refresh that runs hourly and one that never runs. The standard solution across API ecosystems is the delta query: fetch only records modified since a checkpoint. Microsoft Graph formalizes this as a delta query that lets clients discover additions, deletions, or updates through a series of delta requests without fetching the entire set and comparing (https://learn.microsoft.com/en-us/graph/delta-query-users, noul 0.6513). Elementary describes the same contract as two read modes per dataset: a full scan by default, plus incremental feeds that return only what changed, combined with upsert and delete feeds (https://docs.elementary-data.com/api/incremental-sync, noul 0.889). DealCloud states the goal plainly: delta sync fetches only records modified since the last sync (https://api.docs.dealcloud.com/sdk/python-1.X/data/delta-sync, noul 0.5349).

## Mapping the pattern onto repo event sources

A repo history archive has three upstreams, and each gets its own checkpoint parameter.

1. GitHub pull requests and issues: fetch with a since filter keyed on the last run timestamp, then merge into the cached archive. Pull requests are managed through the REST pulls endpoints (https://docs.github.com/en/rest/pulls, noul 0.7799).
2. Commits: fetch after a stored commit SHA. This maps naturally onto git's own DAG: everything reachable after a SHA is well defined, and the checkpoint is stable even if the run clock drifts.
3. Tracker items (Linear and friends): fetch items updated after a stored ISO date. Planning data mutates on a different clock than git, so its checkpoint is independent.

Design interviews describe the general shape as cursor-based incremental sync: the client stores a cursor, requests changes since the cursor, and advances it only after the batch is durably merged (https://www.techinterview.org/post/3233468501/lld-cursor-based-sync/, noul 0.1581, weak backing). The archive should follow that discipline: never advance the checkpoint until the fetched batch is merged, because a crash between fetch and merge must re-fetch the same window rather than skip it.

## Cache invalidation windows

Timestamps and cursors answer "what changed", but a cached archive can still go silently wrong when the upstream changes shape: a renamed label, a rewritten PR body, a force-pushed branch. Cache invalidation literature frames the tradeoff as TTL-based versus event-driven refresh, balancing freshness against call volume (https://beefed.ai/en/cache-invalidation-strategies, noul 0.3333, weak backing; https://www.geeksforgeeks.org/system-design/cache-invalidation-and-the-methods-to-invalidate-cache/, noul 0.231, weak backing). HTTP standardized a middle path, stale-while-revalidate, which serves the cached value while a revalidation is in flight (https://npmx.dev/package/swr, noul 0.3236, weak backing, referencing RFC 5861).

For an offline archive there is no stale-serving reader, so the practical rule is a staleness window with a downgrade: if the cache file's last run timestamp is older than 7 days, the refresh warns and falls back to a full refetch, because delta windows that long accumulate too many missed mutations to trust. Fresh caches fetch only the delta. This keeps the common case cheap while capping the error surface of the fast path.

## Idempotent merge semantics

Merging deltas must be idempotent: the same batch applied twice must not duplicate items. The merge key differs per corpus:

- Pull requests and issues: keyed by their numeric id, with updated_at deciding whether the cached copy is stale.
- Commits: keyed by the 40 character SHA, which is content derived and therefore naturally idempotent.
- Tracker items: keyed by the tracker's stable identifier, with the item's own updated timestamp as the conflict tiebreaker.

State progression is the field most sensitive to merge order. A pull request observed open in the cache and merged in the delta must end merged; a last-write-wins rule on the state field with monotonic progression (open, merged or closed) prevents regressions when an out-of-order batch arrives.

## Failure and redo discipline

A refresh that dies mid-run must leave the cache consistent and the checkpoint unchanged. The order of operations is: fetch the delta, merge it into an in-memory copy, write the new cache file, and only then advance the stored checkpoints. Writing the cache and advancing the checkpoint must be one atomic step in effect; if they are separate files, the checkpoint file is written last so a crash re-runs the same window. This mirrors the cursor discipline above and costs nothing.

## Design summary

1. One checkpoint per upstream: timestamp for pull requests and issues, SHA for commits, ISO date for tracker items (https://learn.microsoft.com/en-us/graph/delta-query-users, noul 0.6513).
2. Never advance a checkpoint before the batch is durably merged (https://www.techinterview.org/post/3233468501/lld-cursor-based-sync/, noul 0.1581, weak backing).
3. Downgrade to full refetch when the cache is older than the staleness window, 7 days by default (https://docs.elementary-data.com/api/incremental-sync, noul 0.889).
4. Idempotent merge keyed by natural identifiers, with monotonic state progression (https://api.docs.dealcloud.com/sdk/python-1.X/data/delta-sync, noul 0.5349).
