# 05 - Dig mechanics and noul weighting

Scope: Phase 2 mechanics: searXNG query shape and pacing, top-6 keeping, noul source-quality weighting, batching, and the decide-failure-means-REDO rule.

Grounding spine: yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md (source doc), plus the dig results below.

## The dig phase (source doc)

Per subtopic, the pipeline runs 2 searXNG queries (the seeds chosen at Phase 1), keeps the top 6 results each, and always sends a User-Agent header. Pacing is at least 1 second between jev requests and between searXNG queries, with no published rate limit (courtesy pacing only, per the v2 changelog correction). Every request and its usage tokens append to jev-log.json.

Query shape matters at the proxy: the searxng-proxy webhook accepts a query with format=json to get structured results. SearXNG documents its JSON search API (https://docs.searxng.org/dev/search_api.html, weight 0.86) and its JSON engine internals (https://docs.searxng.org/dev/engines/json_engine.html, weight 0.89; https://docs.searxng.org/_modules/searx/engines/json_engine.html, weight 0.79), and the searxng repository confirms it is the free metasearch engine behind the proxy (https://github.com/searxng/searxng, weight 0.77). Search configuration for consumers of a SearXNG instance is documented by the mcp-searxng project (https://github.com/ihor-sokoliuk/mcp-searxng/blob/main/docs/search-configuration.md, weight 0.75). A community discussion on getting JSON output exists but carries weak backing (https://github.com/searxng/searxng/discussions/1789, weight 0.17, weak backing).

## The noul weighting metric (source doc)

Every collected result is jev-weighted as it lands using the noul metric: true means the result is a primary or official source worth citing; false means it is an aggregator, forum, marketing page, dead link, or off-topic. The weight used downstream is the probability. Results are batched 5 per request in the source doc's phrasing, and the full decision record (type, instructions, raw answer object, model, usage tokens, timestamp) is stored for every decision.

The weighting step is a source-quality judgment, analogous to citation-quality assessment in bibliometrics: large-scale citation analyses treat source quality as a measurable, distribution-level property rather than a binary one (https://www.sciencedirect.com/science/article/pii/S1751157726000088, weight 0.68; https://journals.sagepub.com/doi/10.1177/2158244019829575, weight 0.67). What "primary source" means is definitional (https://www.merriam-webster.com/dictionary/source, weight 0.86). Lower-quality proxies for this judgment, like checklist approaches, exist but carry weak backing here (https://myjotbot.com/blog/crap-test-for-sources, weight 0.17, weak backing), and off-topic or aggregator hits score low exactly as the metric intends (https://www.researchgate.net/publication/369452277_An_Overview_of_Citations_Citation_Indicators_and_Research_Quality_A_Overview_of_the_Literature, weight 0.30, weak backing; https://mdwiki.org/wiki/Water_quality, weight 0.38, weak backing, off-topic).

## The REDO rule (source doc)

This is the hard rule of Phase 2: a /api/decide failure is a REDO, not a degrade. On 429 or 5xx or any failed request, sleep 30 seconds and re-send, up to 3 attempts, splitting into smaller batches on retry. NEVER ship results unweighted: a decision-model failure is treated exactly like a thin dig, the affected results get redone, and results that still cannot be scored mean the affected docs are SKIPPED and recorded as gaps. The anti-patterns section repeats it as "shipping unweighted results", and the v2 changelog records that this rule was formalized after the first live multi-wave run.

The symmetric rule governs thin digs: if a subtopic's dig is too thin to author honestly, REDO the dig with DIFFERENT queries (up to 2 redos), logging each redo in the dig record. NEVER fall back to fetching primary sources directly to fill a thin dig. If still thin after redos, skip the doc and record it as a gap. Never pad.

## Why weighting is the load-bearing control

The downstream contract only works because weights exist: an authored claim carries its source URL and the jev weight that backed it, with weight >= 0.5 counted as authoritative backing and < 0.5 labeled as weak in the doc text (source doc). If a decision-model outage silently degraded to unweighted shipping, every downstream claim would lose its provenance at once, which is why the failure path is redo-or-skip rather than degrade.

## Sources considered

| url | weight |
| --- | --- |
| https://docs.searxng.org/dev/engines/json_engine.html | 0.89 |
| https://docs.searxng.org/dev/search_api.html | 0.86 |
| https://www.merriam-webster.com/dictionary/source | 0.86 |
| https://docs.searxng.org/_modules/searx/engines/json_engine.html | 0.79 |
| https://github.com/searxng/searxng | 0.77 |
| https://github.com/ihor-sokoliuk/mcp-searxng/blob/main/docs/search-configuration.md | 0.75 |
| https://www.sciencedirect.com/science/article/pii/S1751157726000088 | 0.68 |
| https://journals.sagepub.com/doi/10.1177/2158244019829575 | 0.67 |
| https://mdwiki.org/wiki/Water_quality | 0.38 (weak, off-topic) |
| https://www.researchgate.net/publication/369452277_An_Overview_of_Citations_Citation_Indicators_and_Research_Q | 0.30 (weak) |
| https://github.com/searxng/searxng/discussions/1789 | 0.17 (weak) |
| https://myjotbot.com/blog/crap-test-for-sources | 0.17 (weak) |
