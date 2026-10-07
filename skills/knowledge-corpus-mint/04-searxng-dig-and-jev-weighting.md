# searXNG dig and jev weighting: Phase 2

Scope: the dig mechanics (2 queries per doc, top 6 results, pacing) and the noul weighting of every result as it lands, with decide-failure treated as a REDO, never a degrade.

## The dig mechanics

Phase 2 of the source doc (yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md) specifies the dig shape per kept subtopic: 2 searXNG queries, the seed queries carried over from the outline, keeping the top 6 results from each query, with a User-Agent header on every request (source doc). Pacing is at least 1 second between searXNG queries and between jev requests; the doc notes searXNG has no published rate limit and the spacing is courtesy pacing only (source doc).

The dig goes through a webhook proxy in front of a self-hosted searXNG instance rather than hitting the metasearch engine directly (source doc). The n8n webhook node is the documented mechanism for exposing an HTTP endpoint that triggers a workflow and returns its result, which is exactly the shape of the proxy used here (https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook, weight 0.26, weak backing). Behind that proxy, searXNG is a free metasearch engine aggregating results from multiple upstream engines (https://github.com/searxng/searxng, weight 0.27), and its search API returns structured JSON results suited to programmatic consumption (https://docs.searxng.org/dev/search_api.html, weight 0.54; https://docs.searxng.org/, weight 0.55).

In this mint the dig ran at 2026-10-07 against 10 queries across 5 web-shaped subtopics and collected 60 results, 42 to 61 raw per query before the top-6 cut (research-db/digs).

## The REDO rule for thin digs

The REDO rule is hard per the source doc: if a subtopic's dig is too thin to author honestly, redo the dig with DIFFERENT queries, up to 2 redos, logging each redo in the dig record. Never fall back to fetching primary sources directly to fill a thin dig (source doc). If still thin after redos, the doc is skipped and recorded as a gap in the README; the corpus never pads (source doc). The task directive for this campaign strengthens the same rule on the decision-model side: if a dig fails outright, redo with different queries; a decided failure is a REDO (task brief, 2026-10-06).

A "cannot author" verdict after redos is treated as a success signal, not a failure: the corpus's honesty about gaps is a deliverable (source doc).

## Weighting every result as it lands

Every collected result gets an noul decision: true means a primary or official source worth citing, false means an aggregator, forum, marketing page, dead link, or off-topic result, and the weight is the returned probability (source doc, metric mapping). Results are batched, 5 per request in the source doc's pacing regime (source doc); this campaign weighted in batches of 12 through the DefAPI direct endpoint per the skills-variant speed optimization, 5 batches for 60 results (research-db/jev-log.json).

The failure policy is the core discipline: an /api/decide failure is a REDO, not a degrade. On 429 or 5xx, sleep 30 seconds and re-send, up to 3 attempts, splitting into smaller batches on retry. NEVER ship results unweighted; a decision-model failure is treated exactly like a thin dig, the affected results get redone, and results that still cannot be scored mean the affected docs are skipped and recorded as gaps (source doc).

This mint's weighting pass completed 60 of 60 results with non-null weights, 13 at weight 0.5 or above and 47 below 0.5, with zero retries needed (research-db/archive.json, research-db/jev-log.json).

## Why the weight travels with the claim

The authoring contract requires every factual claim to carry its source URL and the jev weight that backed it, with weight at 0.5 or above treated as authoritative backing and anything lower labeled as weak backing in the text (source doc). That is what makes the weight usable downstream instead of decorative: a reader of the corpus can see which claims rest on official documentation and which rest on aggregator paraphrase, and the archive.json entry keeps the raw decision object so the weighting itself is auditable months later (source doc).

## Sources

- yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md (source doc, fetched 2026-10-07)
- https://docs.searxng.org/ (weight 0.55)
- https://docs.searxng.org/dev/search_api.html (weight 0.54)
- https://github.com/searxng/searxng (weight 0.27)
- https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook (weight 0.26, weak backing)
