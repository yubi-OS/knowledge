# Scale and risks for a repo history archive

Scope: operational limits and failure modes: API rate caps, curve fit cost at 100k+ commits, asymmetric joins, body truncation, and empty-join sparse cells.

## Rate limits: the numbers that shape the refresh design

The tracker side sets the tightest budget. Linear's documented rate limiting gives API-key-authenticated requests up to 3,000,000 points per hour, with requests associated with the authenticated user so all requests by the same user share one quota even across different API keys (https://linear.app/developers/rate-limiting, noul 0.8676). Third-party limit trackers describe Linear as tracking request count and GraphQL complexity independently, with additional lower limits on some endpoints (https://throttle.com/api-limits/linear/, noul 0.1148, weak backing). The shared-quota rule is the operationally important part: a scheduled archive refresh competes with every other automation under the same user, so the refresh should issue a bounded number of batched queries (a 6-project sweep at a 200-item page size is roughly 12 calls) rather than per-item polling. Other platforms document the same per-account pattern, confirming that the quota, not the call, is the unit to budget (https://docs.prolific.com/api-reference/introduction/rate-limits-and-api-status, noul 0.8596; https://docs.lnmarkets.com/pt/api/, noul 0.7875).

The git side's constraint is different: it is pagination and caps rather than rate. GitHub documents repository guidance limits, recommending staying within about 10 GB of on-disk repository size (https://docs.github.com/en/repositories/creating-and-managing-repositories/repository-limits, noul 0.9592). Search endpoints silently cap result sets at 1,000 entries, which is a documented design property protecting the underlying machinery rather than a rate limit (https://dev.to/mayank7924/why-github-silently-caps-your-search-at-1000-results-and-whats-actually-happening-underneath-1oik, noul 0.5686). An archive that needs complete enumerations should paginate list endpoints rather than search, because search caps truncate silently while list pagination is explicit.

## Curve fit cost at scale

A corpus of 1,387 commits fits in seconds on a workstation. At 100,000 commits or more the fit needs sampling: a `--sample N` flag that fits on a uniform random sample and reports the sample size alongside the metrics keeps the fit honest while bounding cost. The right default is to fit on the full corpus below a threshold (around 10,000 items) and sample above it, recording which mode ran in the fit artifact so the metrics are interpretable. Coverage passes stay linear in corpus size, which is why the primitive basis should stay at 9 to 12 bits rather than growing into the hundreds.

## Asymmetric joins

The commit-to-pull-request join is many to one and not invertible: a pull request carries many commits, and merge_commit_sha names only the synthesized merge tip. Consequences for the archive:

1. Counting joins by commits overcounts PR-linked events. Count by pull request, and store the commit list separately.
2. A commit referenced by multiple pull requests (cherry-picks, backports) needs a one-to-many map on the other side, or those items show up as isolated points that are actually joined.

The archive should record the asymmetry as data (join cardinality per corpus pair) rather than hiding it in the fit.

## Body truncation in list endpoints

List endpoints truncate long text fields. A pull request body that carries the tracker reference in its last 200 characters will lose the join key if the archive ingests only the list payload. The fix is architectural: for items whose joins matter, fetch the full object (the single-pull-request endpoint) before running the reference regexes (https://docs.github.com/en/rest/pulls, noul 0.7799). The failure mode is silent: the join simply does not happen, and the item looks naturally unjoined in the coverage curve. A detection pass that compares join rates between list-ingested and full-ingested items exposes it.

## Empty joins and sparse cells

A dual-repo archive meets repositories where one side is nearly empty. When tracker data is sparse for a repo, the has_cross_corpus_link primitive collapses toward 0 for that repo's items, and the fit reads it as a structural gap even though the honest reading is "no links exist to find". The archive should distinguish measured sparsity (links searched for and not found) from coverage sparsity (links never searched for because the item was list-truncated), and treat the first as a fact and the second as a bug.

## Cache staleness and partial failures

Two refresh-level risks close the list:

1. Stale caches: a cache older than the staleness window (7 days default) must trigger a full refetch, because long delta windows accumulate missed mutations silently.
2. Partial failure mid-refresh: fetch, merge, write cache, advance checkpoint, in that order, so a crash re-runs the same window. Checkpoint advancement is the last write, always.

## Design summary

1. Budget the tracker side in shared per-user quota terms, batching queries (https://linear.app/developers/rate-limiting, noul 0.8676).
2. Enumerate with list pagination, not search, to avoid silent 1,000-result caps (https://dev.to/mayank7924/why-github-silently-caps-your-search-at-1000-results-and-whats-actually-happening-underneath-1oik, noul 0.5686).
3. Sample the curve fit above roughly 10,000 items and record the mode (https://docs.github.com/en/repositories/creating-and-managing-repositories/repository-limits, noul 0.9592).
4. Fetch full bodies before regex joins; distinguish measured sparsity from ingestion sparsity (https://docs.github.com/en/rest/pulls, noul 0.7799).
