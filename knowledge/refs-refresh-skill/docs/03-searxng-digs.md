# Metasearch digs: searXNG behind a proxy webhook

Scope: running the dig phase through a self-hosted searXNG metasearch engine fronted by a proxy webhook, and what breaks when a dig fan-out gets aggressive.

## Why a self-hosted metasearch engine

The dig phase needs many small, cheap, independent web queries: 2 seed queries per subtopic, kept to the top 6 results each. Commercial search APIs price this badly and meter it aggressively. SearXNG is a free internet metasearch engine which aggregates results from up to 261 search services, does not track or profile users, and can be self-hosted (https://docs.searxng.org/, weight 0.97). The upstream repository states the same contract: aggregate results from various search services and databases, users neither tracked nor profiled (https://github.com/searxng/searxng, weight 0.93).

Self-hosting is the load-bearing choice. A public instance rate-limits anonymous clients and can disappear between runs; a self-hosted instance belongs to the pipeline operator and accepts whatever query volume the limiter allows.

## The JSON API contract

SearXNG exposes results as HTML by default and as JSON, CSV, or RSS when the format parameter is set, with supported formats defined in settings.yml under the search section; requesting an unset format returns 403 Forbidden (https://docs.searxng.org/dev/search_api.html, weight 0.93). Two operational consequences:

1. The instance operator must enable the json format in settings.yml before any programmatic dig works. A 403 on a first dig is almost always this.
2. The response shape is stable enough to parse generically: a results array of title, url, content objects. The sweep keeps the top 6 per query and stores the raw response so later re-weights never need a re-query.

Third-party integration docs confirm the same shape and note that SearXNG returns a fixed number of results per page (https://docs.litellm.ai/docs/search/searxng, weight 0.53). Community mirrors restate the privacy property: aggregate results from multiple search engines without storing or sharing query data (https://github.com/arssnndr/searxng, weight 0.60).

## Fronting it with a proxy webhook

The validated sweep does not call searXNG directly from agent runtimes. It goes through an n8n webhook that proxies to the instance. This indirection earns its keep 3 ways:

1. Credential boundary: the agent never holds the instance URL or any auth.
2. Retry point: the proxy can buffer retries during engine suspension instead of the agent burning its own loop budget.
3. Observability: one place to log every dig query for the research database.

The cost is one more moving part. The validated run's preflight probes the webhook before any dig starts, because a dead proxy discovered mid-sweep loses the whole fan-out batch.

## Engine suspension under parallel load

The documented failure mode is on the engine side, not the client side. SearXNG's limiter exists because "SearXNG passes through requests from bots and is thus classified as a bot itself. As a result, the SearXNG engine then receives a CAPTCHA or is blocked by the search engine" (https://docs.searxng.org/admin/searx.limiter.html, weight 0.96). The limiter's intent is to limit suspicious requests from an IP before the upstream search engines retaliate.

In the validating run, searXNG engines suspended under parallel fan-out (internal evidence, 2026-09-29). The documented fallback in the skill is direct primary-source verification through official channels such as GitHub releases APIs and upstream NEWS files, never invention. This fallback has a different evidence class than a dig: it is stronger per fact but narrower, so it rescues a specific claim, not a whole subtopic's dig.

## Pacing rules that held

The run's pacing rules, all forced by the limiter's existence: space queries at least 1 second apart; keep dig fan-out per agent small when many agents run concurrently; treat a burst of empty results as engine suspension, not as "the topic has no sources". The third rule is the one that prevents silent data loss: an aggressive fan-out that gets throttled looks identical to a thin dig unless you check whether the empty responses correlate in time.

## Summary

1. Self-hosted SearXNG gives bulk, cheap, private queries: up to 261 aggregated services (https://docs.searxng.org/, weight 0.97).
2. JSON output must be enabled server-side; 403 on format=json means settings.yml, not the client.
3. Engines suspend under load because SearXNG itself looks like a bot to upstream engines (https://docs.searxng.org/admin/searx.limiter.html, weight 0.96).
4. The fallback for a specific dead claim is primary-source verification, never synthesis.
