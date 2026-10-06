# Cloudflare platform skill corpus

Knowledge corpus minted from yubi-OS/yubiOS skills/cloudflare/SKILL.md (the comprehensive Cloudflare platform skill: Workers, Pages, storage (KV, D1, R2), AI (Workers AI, Vectorize, Agents SDK), feature flags (Flagship), networking (Tunnel, Spectrum), security (WAF, DDoS), and infrastructure-as-code (Terraform, Pulumi)). The source doc's own sections dictate the outline: Retrieval Sources, the Quick Decision Trees, the Product Index, Calibration, and Recursion.

## Docs

1. [01-retrieval-first-stance.md](01-retrieval-first-stance.md) - the skill's core rule: retrieve live docs before citing numbers or API signatures; the four retrieval channels (Cloudflare docs, workers-types, wrangler config-schema.json, changelogs) and the docs-over-references resolution order.
2. [02-compute-product-routing.md](02-compute-product-routing.md) - the "I need to run code" tree: Workers, Pages, Durable Objects, Workflows, Containers, Workers for Platforms, cron triggers, snippets, tail workers, smart placement.
3. [03-storage-data-products.md](03-storage-data-products.md) - the "I need to store data" tree: KV, D1, Hyperdrive, R2, artifacts, queues, DO storage, secrets store, pipelines, R2 Data Catalog, R2 SQL, cache reserve, with doc-backed KV selection guidance and the Iceberg stack.
4. [04-ai-ml-products.md](04-ai-ml-products.md) - the "I need AI" tree: Workers AI, Vectorize, Agents SDK, AI Gateway, AI Search, and how they compose into one chain.
5. [05-networking-connectivity.md](05-networking-connectivity.md) - the "I need networking" tree: Tunnel, Spectrum, TURN, Network Interconnect, Argo Smart Routing, Workers VPC, with the Spectrum-and-Tunnel HTTP-only boundary.
6. [06-security-products.md](06-security-products.md) - the "I need security" tree: WAF managed rules and phase ordering, DDoS layers, bot management, API Shield, Turnstile.
7. [07-media-content-products.md](07-media-content-products.md) - the "I need media/content" tree: Images, Stream, Browser Rendering, Zaraz.
8. [08-analytics-observability.md](08-analytics-observability.md) - the "I need analytics" tree: GraphQL Analytics API, Analytics Engine, Web Analytics, Workers observability, R2 SQL, Logpush.
9. [09-iac-flags-calibration-recursion.md](09-iac-flags-calibration-recursion.md) - the IaC tree (Pulumi, Terraform, REST API, SDKs), Flagship feature flags via OpenFeature, and the source doc's Calibration and Recursion self-audit rules.

## Research summary

- Results collected: 108 searXNG results across 18 queries (2 per subtopic, top 6 kept per query).
- Weight split: 62 results at weight 0.5 or higher (authoritative backing), 46 results below 0.5 (cited only with an explicit weak label in the docs).
- jev requests: 10 total (1 outline validation with 9 score questions, 9 weighting batches of 12 noul questions each), usage 1211 + batch input tokens in, 139 + batch output tokens out (per-request usage recorded in research-db/jev-log.json).
- Redo counts: 0 dig redos; 0 weighting redos (all 108 results received a decision answer; weights were extracted from the stored raw answers after an initial parser miss, no re-requests needed).
- Skipped docs: none. All 9 subtopics validated as load-bearing or marginal-with-strong-dig and were authored. Coverage gaps noted inside docs: TURN and Network Interconnect rows in doc 05 and the Analytics Engine row in doc 08 have no high-weight dig source and rest on the ground source routing.
- Internal-record portions: the Calibration and Recursion rules in doc 09 cite the ground source only, no dig (internal-record subtopic).

## Weighting

Metric: noul via DefAPI direct (typesafe/jev-1.13), weight = the returned noul probability. Outline validation metric: score. Fallback relay (https://steady-orbit.systems-a.workers.dev/api/decide) was not needed; every request to https://api.defapi.org/api/v1/decisions succeeded on the first attempt.

## Ground source

yubi-OS/yubiOS skills/cloudflare/SKILL.md, fetched 2026-10-06 from https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/cloudflare/SKILL.md (11570 bytes, User-Agent omni-agent/1.0). Every doc cites the source doc as its grounding spine and attributes claims to it explicitly.

Preflight 2026-10-06: searXNG healthy (campaign preflight run orchestrator-side); decide healthy via DefAPI direct (campaign preflight orchestrator-side, agent probe skipped for speed per brief).
