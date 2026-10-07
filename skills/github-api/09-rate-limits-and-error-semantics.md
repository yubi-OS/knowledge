# 09 rate-limits-and-error-semantics

Scope: the two operational constraints the source doc attaches to every GitHub call: the rate budget (and its `/rate_limit` check), and the status-code table for 404, 409, and 422.

## Ground spine

Source doc: `yubi-OS/yubiOS skills/github-api/SKILL.md`. External grounding from searXNG dig, weighted by jev-1.13 noul.

## The rate budget

The source doc's rate-limit section shows the check: `GET https://api.github.com/rate_limit` and reading `resources.core.remaining` against `resources.core.limit` (source doc). It then states the budget: 5000 requests per hour for authenticated requests with a PAT, notes that Git Data API calls (blobs, trees, commits) count against it, and prescribes 200 ms delays between batch calls to avoid 429s (source doc).

GitHub's rate-limit documentation adds the context around those numbers, and one distinction worth having in view: "The rate limit for GITHUB_TOKEN is 1,000 requests per hour per repository. For requests to resources that belong to a GitHub Enterprise Cloud account, the limit is 15,000 requests per hour per repository" (https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api, weight 0.97). The 5000 per hour figure in the source doc is the standard authenticated-PAT limit; the 1000 per hour figure applies to the built-in Actions `GITHUB_TOKEN`, which the yubi-OS skill explicitly does not use (source doc doc 01), and the 15000 figure applies to Enterprise Cloud resources. For org automation the operative number is the PAT's 5000, and the `/rate_limit` endpoint is how a long mint watches its remaining budget in real time.

The dig also returned a monitoring-oriented writeup confirming the check endpoint: rate limits "can be retrieved through the /rate_limit endpoint" (https://sbulav.github.io/monitoring/monitoring-github-rate-limits/, weight 0.12, weak; the claim is also stated in the source doc, so it is not resting on the weak source).

## Error semantics

The source doc's error-handling section gives a three-status table:

- 404: file not found, as in the `GET /contents/DOES_NOT_EXIST` probe (source doc).
- 409: conflict. SHA mismatch on PUT; the prescription is to re-fetch the file first (source doc).
- 422: validation error; label already exists or another issue (source doc).

It then adds a shape check: if the parsed response has neither `sha` nor `commit`, the response is unexpected and should be logged (source doc). That guard catches the case where an endpoint returns 200 with a JSON error envelope or an unanticipated shape, rather than letting the script proceed on empty data.

For HTTP context, a low-weighted reference confirms the standard meanings: 409 Conflict signals a resource-state conflict, and 422 means the request body is syntactically valid but semantically invalid (https://http.dev/409, weight 0.11, weak). A Stack Overflow thread documents the same 409-on-PUT behavior in the wild: a 409 when adding or updating repository content (https://stackoverflow.com/questions/78876325/github-api-409-conflict-when-adding-or-updating-repository-content, weight 0.10, weak, forum). Both are labeled weak and are consistent with the source doc's table, which is the authoritative statement here.

## Reading the statuses operationally

Three of the statuses map directly onto the corpus's own flows:

1. The collision check that gated this mint (GET `skills/github-api` must 404) is a deliberate use of the 404 branch: absence is the success condition (source doc pattern, applied by this mint).
2. The 409 branch is the Contents API PUT's concurrency guard: a stale blob SHA means someone moved the file, and the fix is a fresh read before the retry (source doc).
3. The 422 branch doubles as idempotency for label creation: "422 = already exists, safe to ignore" (source doc, doc 05).

The 200 ms pacing guidance is the last piece: batch writes, especially Git Data chains, are the burstiest traffic the org's automation produces, and the rate limit is the shared budget that makes pacing a first-class part of the pattern rather than an afterthought (source doc).

## Dig surface

The initial dig returned the authoritative rate-limits documentation at 0.97 plus noise. A redo round (2 queries) added the REST API root documentation at 0.98 and an Enterprise Server getting-started page at 0.94. The 409 and 422 specific pages that exist outside docs.github.com are all low-weight (0.10 to 0.12), which is why this doc's error table leans on the source doc and labels the two supplementary references weak.
