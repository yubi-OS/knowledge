# 03 - Endpoints and the Phase 0 preflight gate

Scope: the three backing endpoints (decide model, searXNG proxy, MASTER GIT SU) and the Phase 0 health gate: probe shapes, failure modes, and the re-mint lesson.

Grounding spine: yubi-OS/yubiOS skills/knowledge-corpus-mint/SKILL.md (source doc), plus the searXNG dig results below.

## The three endpoints (source doc)

1. Decision model: POST to the steady-orbit decide endpoint running jev-1.13 (model pinned server-side). Every request carries a User-Agent header or Cloudflare rejects the call with error 1010 (source doc).
2. Search: a GET to the n8n searxng-proxy webhook, which fronts an internal Northflank searxng instance on port 8080. searxng's own port stays public:false behind a network rule and is never flipped (source doc).
3. Repo writes: the MASTER GIT SU connection (conn_3h7rj41VF6hs) on every GitHub call, passed both in the tool's connections parameter and as the X-Sauna-Connection-Id header plus User-Agent (source doc).

## What searXNG is

SearXNG is a free internet metasearch engine that aggregates results from multiple upstream search engines without tracking its users (https://github.com/searxng/searxng, weight 0.75; https://docs.searxng.org/, weight 0.87). That aggregation design is why a health probe must check per-engine state: a proxy can return HTTP 200 while individual engines inside it are suspended. A weaker secondary source describes self-hosted SearXNG deployment (https://www.bitdoze.com/searxng-self-host-privacy-search/, weight 0.18, weak backing) and a deploy template for hosted SearXNG exists (https://railway.com/deploy/searxng-search-api-private-metasearch-for-ai--searxng-valkey-ai-search, weight 0.20, weak backing); neither is needed for the preflight logic itself.

## The preflight probes (source doc)

1. searXNG probe: GET the proxy with the endpoint=search&qs=q%3D<query> form (the source doc's example uses q=systemd) and require HTTP 200 with at least 1 result and no "Suspended:" entries in unresponsive_engines.
2. decide probe: one-question noul smoke probe against the decide endpoint, requiring HTTP 200 with an answers object.

Both probe results (timestamp, result counts, cost) are recorded in the corpus research DB under a preflight key (source doc).

## Known blind spot (source doc)

Engines whose errors land after the response closes are NOT reported, because of a searxng bug (add_unresponsive_engine after close). If the probe returns 0 results with a suspiciously short unresponsive list, grep the Northflank service logs for "ERROR:searx.engines" before concluding anything about health. This is the documented way a green probe lies: the response closes cleanly while the engines behind it are failing.

## Why a decision-model smoke probe matters

The decide endpoint is an LLM-as-judge decision model: a structured evaluation where a model scores or classifies inputs against typed criteria rather than emitting free text. The LLM-as-judge pattern is well established in the evaluation literature (https://langfuse.com/docs/evaluation/evaluation-methods/llm-as-a-judge, weight 0.75; https://github.com/microsoft/llm-as-judge, weight 0.66; https://github.com/baaivision/JudgeLM, weight 0.73). JudgeLM specifically documents biases and calibration concerns in judge models (weight 0.73), which is the failure class the smoke probe cheaply detects: a judge that returns malformed answers or refuses produces the unweighted-shipping failure mode, so the probe must confirm an answers object before any outline validation runs. A practitioner guide on calibrating LLM-as-judge with human corrections exists but carries weak backing here (https://www.langchain.com/resources/llm-as-a-judge, weight 0.46, weak backing), and a 2026 techniques roundup is weaker still (https://deepeval.com/blog/llm-as-a-judge, weight 0.24, weak backing).

## The re-mint lesson (source doc)

The source doc's Phase 0 records the operational lesson: the first yubios corpus mint ran while searXNG engines were suspended for 5 of 6 docs, shipped research-db entries with zero dig results, and had to be re-minted. The gate exists because a mint that degrades quietly produces a corpus that looks shipped and cannot be trusted.

## Sources considered

| url | weight |
| --- | --- |
| https://docs.searxng.org/ | 0.87 |
| https://github.com/searxng/searxng | 0.75 |
| https://langfuse.com/docs/evaluation/evaluation-methods/llm-as-a-judge | 0.75 |
| https://github.com/baaivision/JudgeLM | 0.73 |
| https://github.com/microsoft/llm-as-judge | 0.66 |
| https://www.langchain.com/resources/llm-as-a-judge | 0.46 (weak) |
| https://seirdy.one/posts/2021/03/10/search-engines-with-own-indexes/ | 0.32 (weak) |
| https://deepeval.com/blog/llm-as-a-judge | 0.24 (weak) |
| https://railway.com/deploy/searxng-search-api-private-metasearch-for-ai--searxng-valkey-ai-search | 0.20 (weak) |
| https://github.com/arssnndr/searxng | 0.69 |
| https://www.bitdoze.com/searxng-self-host-privacy-search/ | 0.18 (weak) |
| https://tokspan.com/blog/llm-as-judge-how-to-build-an-automated-evaluation-framework-2026/ | 0.18 (weak) |
