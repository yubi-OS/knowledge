# Steady Orbit Systems - Knowledge Corpus

Minted 2026-10-06 into `knowledge/steady-orbit-systems/`. The corpus documents Steady Orbit Systems, the SMB AI-automation consultancy: its positioning and offerings, the technical systems behind it (the single steady-orbit Cloudflare Worker), the brand system, and the SMB automation market context it operates in.

Source grounding is the company's own public surfaces (the workers.dev marketing site, AGENT.md, llms.txt, steadyorbitsystems.com and its pages) plus already-public org docs on yubi-OS/yubiOS (the jev-orchestrator skill, refs/jev-orchestrator-2026-10-01.md, refs/jev-automations-2026-10-01.md, the knowledge-corpus-mint skill), fetched directly per the corpus directive; searXNG digs supply the market/technology context (docs 02 and 08). Privacy guardrails held: no customer names, no lead data, no private business details; only what the public surfaces state.

## Documents

| NN | doc | scope |
|---|---|---|
| 01 | [01-company-overview.md](01-company-overview.md) | Positioning, services, design-build-launch-handoff delivery model, founders, contact and pricing posture |
| 02 | [02-worker-architecture.md](02-worker-architecture.md) | The single steady-orbit Cloudflare Worker: site serving, relays, point-map wayfinder, /api/decide, jev orchestrator, automations, corpus engine, evolution, taste engine |
| 03 | [03-gated-automations.md](03-gated-automations.md) | The jev orchestrator: fail-closed gate, approval bindings, six terminal states, stage automations, the lead machine and refuse-to-claim |
| 04 | [04-decision-endpoint.md](04-decision-endpoint.md) | /api/decide as a product surface: jev-1.13/clef routes, GET form, question types, CORS, 15/min per IP rate limit |
| 05 | [05-sos-agent-fits.md](05-sos-agent-fits.md) | The SOS Agent: /sos voice UI, ElevenLabs relays, legacy FIT assessments with population comparison, Systems Lab demos |
| 06 | [06-brand-system.md](06-brand-system.md) | Orbital naming vocabulary, voice and copy patterns, visual identity markers on the public pages |
| 07 | [07-web-presence.md](07-web-presence.md) | steadyorbitsystems.com and .ai, the workers.dev origin, the 10-page sitemap, answer-engine surfaces, legal pages |
| 08 | [08-market-context.md](08-market-context.md) | SMB AI-automation market: service shapes, pricing models, delivery risks, Cloudflare Workers as delivery platform |

## Research summary

- Results collected: 41 (24 from 4 searXNG dig queries across docs 02 and 08; 17 direct grounding fetches weighted through the same noul metric).
- Weight split: 14 at weight >= 0.5 (Cloudflare developer docs and blog, the org's public skills/refs docs, the privacy and founders pages), 27 below 0.5 (the company's marketing surfaces, scored low by the noul model by design, plus vendor blogs and agency-network listicles in doc 08). Every weak-backed claim is labeled in text.
- Jev requests: 10 (1 outline score validation, 9 noul weighting batches of up to 5 questions), usage 7,908 input tokens / 0 output tokens recorded.
- Redos: 0 dig redos, 0 decide redos (all 10 requests succeeded on first attempt).
- Skipped docs: none. All 8 subtopics scored load-bearing (1.57-1.92 on the 0-2 scale) and were kept.

## Gaps

- Doc 06: no staged product-naming ladder (launch-phase terms) appears on any public surface fetched for this corpus; per the guardrails it is not asserted, and the doc records the observable orbital vocabulary instead.
- Doc 05: the FIT scoring rubric internals are not published; the doc describes the public storage and population-comparison contract only.
- Doc 08: SMB market-size figures surfaced only on aggregator-grade sources (weights 0.06-0.11) and were deliberately not quoted.

## Method

- Preflight 2026-10-06: searXNG 85 results healthy (probe counts 60/63/101/63 across the 4 dig queries, no unresponsive engines); /api/decide (clef) 200.
- Outline: 8 subtopics decomposed by the company's own joints, validated in one jev score request (criteria lowest-first: padding: drop / marginal: keep only if the dig comes back strong / load-bearing: core subtopic). All 8 kept; none dropped.
- Weighting: every collected result noul-weighted via POST /api/decide, batched 5 per request, paced >= 1s. Weight >= 0.5 is treated as authoritative backing; below 0.5 is weak backing and is labeled in text. The company's own public surfaces are the directive-designated grounding layer for company facts, and their measured (low) weights are reported as scored, not overridden.
- Research DB: schema v2 under research-db/ (preflight.json, outline.json, archive.json, digs/, jev-log.json, db.ts).

## Provenance

- Decision model: clef via https://steady-orbit.systems-a.workers.dev/api/decide (score for outline validation, noul for source weighting).
- Search: n8n searxng-proxy webhook (https://p01--n8n-service--mcx7zcrbvdyt.code.run/webhook/searxng), User-Agent omni-agent/1.0.
- Shipped on branch mint/steady-orbit-systems-2026-10-06 as a draft PR against yubi-OS/knowledge main.
