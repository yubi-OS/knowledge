# 02 - The Three Endpoints and the Preflight Gate

Scope: the 3 backing endpoints a sweep depends on, the Phase 0 health gate that must pass before any phase runs, and the known blind spot in how SearXNG reports dead engines.

Grounding spine: `yubi-OS/yubiOS skills/refs-refresh-sweep/SKILL.md` (source doc), plus searXNG and n8n official documentation via dig.

## Endpoint 1: the decision model

The source doc pins the decision endpoint as `POST https://steady-orbit.systems-a.workers.dev/api/decide` with a `{"state": {...}, "questions": {...}}` body. The model `typesafe/jev-1.13` is pinned server-side; the caller needs no key because a Cloudflare Secrets Store binding holds it. The source doc records a hard cap of 15 requests per minute per IP and a cost of roughly $0.00003 to $0.0004 per request depending on state size.

The dig confirms the decision-model family behind it. TypeSafe's documentation describes Jev as its flagship model, "the first System One model", taking state and typed questions and returning structured answers code can use directly (https://docs.typesafe.ai/, jev weight 0.57). The product page for the model exists at https://defapi.org/model/typesafe/jev-1.13, but it carries only weak backing in this corpus's dig (weight 0.15), so treat the docs site as the better citation.

## Endpoint 2: search via the searXNG proxy

The source doc pins the search endpoint as `GET https://p01--n8n-service--mcx7zcrbvdyt.code.run/webhook/searxng` proxying to an internal Northflank searxng instance on port 8080 over cluster DNS. The searXNG service's own port is `public:false` and must stay that way.

Dated operational correction (2026-10-06): the webhook now requires the two-parameter form `?endpoint=search&qs=q%3D<urlencoded-query>`; the bare `?q=` form documented in the source doc returns HTTP 500. This correction comes from the 2026-10-06 mint campaign operating notes, not from a dig result.

The dig grounds what searXNG itself is and returns. The SearXNG documentation describes a free internet metasearch engine that aggregates results from up to 261 search services without tracking or profiling users (https://docs.searxng.org/, weight 0.89). Its search API accepts a `format` parameter of json, csv, or rss, where the chosen format must be activated in the instance's `search:` settings (https://docs.searxng.org/dev/search_api.html, weight 0.90; same content at https://github.com/searxng/searxng/blob/master/docs/dev/search_api.rst, weight 0.89). Results come back as a `results[]` array with title, url, engines, and content fields. The proxy hop exists because n8n's Webhook node is the documented way to expose an n8n workflow over HTTP (https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook, weight 0.92); n8n itself is a workflow automation platform combining AI capabilities with business process automation (https://n8n.io/, weight 0.56). Community forum threads about webhook query-parameter handling exist but carry weak weight in this dig (0.07 to 0.13) and should not be relied on.

## Endpoint 3: repo writes

All GitHub writes go through the MASTER GIT SU connection (`conn_3h7rj41VF6hs`). Every GitHub API call needs a `User-Agent` header plus the connection passed in the tool's `connections` parameter and the `X-Sauna-Connection-Id` header (source doc). The Git Data API chain used for writes is covered in doc 08.

## Phase 0: the preflight gate

Both backing endpoints must be verified healthy before any later phase runs. If either fails, STOP and surface to the user; do not silently degrade into a weakened run. The source doc records why: the first yubios corpus mint ran while searXNG engines were suspended for 5 of 6 docs, shipped research-db entries with zero dig results, and had to be re-minted.

The two probes:

1. searXNG. A probe query must return HTTP 200 with at least 1 result and no `Suspended:` entries in `unresponsive_engines`.
2. jev. A one-question noul smoke probe must return HTTP 200 with an `answers` object.

Record both probe results (timestamp, result counts, cost) under a `preflight` key in the run's research DB.

## The unresponsive-engines blind spot

The source doc names a known blind spot: engines whose errors land after the response closes are NOT reported, per the searXNG issue known as `add_unresponsive_engine after close`. If a probe returns 0 results with a suspiciously short unresponsive list, grep the Northflank service logs for `ERROR:searx.engines` before concluding anything about health.

Doc 05 carries the complementary fact from the dig: SearXNG itself suspends engines for a default of 3660 seconds (1 hour) after too-many-requests errors (https://docs.searxng.org/src/searx.exceptions.html, weight 0.87), which is the mechanism behind most suspension surprises.

## Operational notes

- Every HTTP call to either endpoint carries a User-Agent string; without one, Cloudflare returns error 1010 (source doc; mechanism grounded in doc 09).
- Preflight is a gate, not a formality: the source doc's verification checklist requires that preflight passed before any dig ran.
