# 02 Head Comparison: Counting Commits Between Pin and Upstream

Scope: GitHub API mechanics for comparing fork HEAD against upstream HEAD: the compare endpoint, listing commits since a SHA, and counting commits between pins.

## The compare surface

GitHub exposes commit comparison at the repository level by appending /compare to the repo URL, and comparisons work across forks, not just within one repository (docs.github.com comparing commits, weight 0.79). The URL form is what a human uses during triage; the drift check needs the API form.

## The REST commits endpoints

The REST API endpoints for commits support listing commits on a repository, with token support including fine-grained access tokens for the list commits endpoint (docs.github.com rest commits/commits, weights 0.80, 0.90, 0.94 across duplicate catalog entries of the same doc). A second REST surface, the Git commits endpoints, interacts with commit objects directly in the Git database on GitHub (docs.github.com rest git/commits, weight 0.93). For a drift check the list commits endpoint is the workhorse: it takes a ref and pagination, so a script can walk commits on the upstream branch until it reaches the pinned SHA.

## Counting commits behind

Two implementation strategies exist, and they fail differently:

1. Single compare call. Request the comparison between pinned SHA and upstream HEAD and read the commit list from the response. This is one API call per fork and is exact while the range is small.
2. Paginated enumeration. For larger commit ranges, use the commit list API to enumerate all commits in the range instead of relying on a single compare, because the compare response truncates or degrades for extremely large diffs (Stack Overflow, weight 0.04, weak backing).

A drift check that only implements strategy 1 will silently undercount exactly the forks that have drifted the most, which is the population the check exists to catch. The robust pattern is compare first, and if the range looks large, fall back to paginated enumeration of commits since the pinned SHA.

## The GraphQL caveat

A community discussion reports that comparing commits through the GitHub GraphQL API can return an empty response for branches whose changes have been merged, defeating merge-base comparison (github.com/orgs/community discussion, weight 0.08, weak backing). The weak weight matches the source class, but the failure mode it describes is the kind that produces a false "synced" verdict. Prefer the REST endpoints for the automated path and keep GraphQL out of the detection loop.

## Mapping to the drift check algorithm

The daily check runs two comparisons per fork:

1. HEAD equality. Fetch the upstream branch's latest SHA. If it equals the pinned SHA, the fork is synced and no further call is needed. This is the cheap path that most forks hit most days.
2. Behind count. If the SHAs differ, count commits reachable from the upstream HEAD but not from the pinned SHA, using the compare endpoint for small ranges and paginated commit listing for large ones.

Both branches rest on the same two REST surfaces cited above (weights 0.79 to 0.94). The count feeds the verdict classifier (synced, minor-lag, drifted at a threshold), which is documented in its own doc in this corpus.

## Rate and scale notes

The check is 8 forks on the documented schedule, so 8 to 16 API calls per run. The pagination caveat matters more than rate limits at that scale: the failure to design for is one fork drifting by hundreds of commits, where the compare-based count is wrong or truncated and the check must degrade gracefully to the enumerated count (Stack Overflow, weight 0.04, weak backing). A per-fork timeout and a null behind-count with an "unmeasured" verdict is a safer failure mode than reporting a truncated number as if it were exact.
