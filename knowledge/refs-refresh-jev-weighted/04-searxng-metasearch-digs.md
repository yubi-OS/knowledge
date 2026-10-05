# 04: Self-Hosted Metasearch Digs via Proxied searXNG

Scope: how the sweep executes its digs through a self-hosted searXNG instance reached over an n8n webhook proxy, including query design, top-N keeping, and the thin-dig redo rule.

## The transport decision

The reference sweep's searXNG runs on a Northflank instance with its port internal-only, deliberately not exposed publicly (flipping it public would be a network change requiring approval). The reach-in path is an n8n webhook: a GET to `https://p01--n8n-service--mcx7zcrbvdyt.code.run/webhook/searxng?endpoint=search&qs=q%3D<urlencoded-query>` returns the searXNG JSON response. This is the pattern n8n documents generally: a webhook URL is composed from `N8N_PROTOCOL`, `N8N_HOST`, and `N8N_PORT`, and sits in front of whatever the workflow routes to (https://docs.n8n.io/deploy/host-n8n/configure-n8n/basic-configuration/configuration-examples/configure-webhook-urls-with-reverse-proxy, weight 0.8376). n8n itself ships a "dynamic API gateway" workflow pattern: a universal webhook endpoint that routes incoming requests to different subflows (https://n8n.io/workflows/9165-create-dynamic-api-gateway-with-http-router-and-workflow-orchestration/, weight 0.5783). Community writeups describe the same gateway shape for exposing internal services behind stable public URLs with request validation (https://blog.dinhdobathi.com/n8n-webhook-gateway.html, weight 0.2293, weak backing).

The route is read-only (a public webhook GET to a search endpoint), changes no network state, and keeps the search port internal-only.

## What searXNG is

SearXNG is a free internet metasearch engine aggregating results from up to 261 search services without tracking or profiling users (https://docs.searxng.org/, weight 0.7888). Its search API supports `json`, `csv`, and `rss` output formats, with JSON needing to be activated in instance settings (https://docs.searxng.org/dev/search_api.html, weight 0.8563). The upstream repo is the canonical source (https://github.com/searxng/searxng, weight 0.9413).

Self-hosting it as a SERP API has known operational edges that the sweep must plan around: JSON output is off by default, one broken engine can 500 every query, and most upstream engines get CAPTCHA-blocked from a single IP (https://apiserpent.com/blog/searxng-self-hosted-serp-api-tested, weight 0.2265, weak backing). The 2026-10-05 preflight for this corpus showed exactly that shape: 63 healthy results on the probe query while 13 upstream engines were degraded or suspended (brave, duckduckgo, google, qwant among them). The lesson is to judge the aggregate, not the engine list: results healthy is the health signal.

## Dig mechanics

For each queued subtopic, the sweep runs 2 seed queries, keeps the top 6 results per query, and spaces queries at least 1 second apart. The shared n8n endpoint tolerates bursts but is shared with sibling agents, so pacing is a courtesy rule with real consequences (hammering it degrades everyone's digs).

Query design follows the subtopic's scope line: one query aimed at the current-state facts (releases, changelogs, status) and one aimed at the practice landscape (how-to, comparison). In the reference run, 24 queries across 12 docs produced 144 results, with per-doc dig quality averaging between 0.23 and 0.70 on the jev weight scale.

## The redo rule

A dig that comes back too thin to author honestly is redone with different queries, up to 2 redos, with each redo logged (attempt number, reason, new queries). Two hard rules apply:

1. **Never fall back to fetching primary sources directly to fill a thin dig.** The sweep's evidence discipline depends on the dig being the collection step; hand-picked sources bypass the weighting stage and the audit trail.
2. **Never pad.** If the dig is still thin after redos, the doc is skipped and recorded as a gap in the README. A skipped doc is recoverable by the next sweep; a padded doc poisons the corpus.

Thin is judged by substance, not count: 12 results that all echo one blog post are thinner than 6 results spanning a primary changelog, a maintainer blog, and a distro doc page.

## What a dig is for

The dig is the corpus's eyes. Its output feeds the weighting stage (doc 05), which decides which results are authoritative enough to back claims, and then the authoring stage (doc 07), which turns weighted results into cited doc updates. Every collected result carries its query, snippet, timestamp, and weight in the research DB, so any claim in any authored doc can be traced back to the exact query that surfaced it.
