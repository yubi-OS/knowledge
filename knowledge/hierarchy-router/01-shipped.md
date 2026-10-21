# 01. Shipped: Worker Parts, Policy v7, and Multimodal Intake

**Scope:** Shipped: detailed analysis grounded in yubi-OS/yubiOS refs/hierarchy-router-2026-10-06.md.

Ground source: `yubi-OS/yubiOS refs/hierarchy-router-2026-10-06.md`. Dig context: `dig_context_01.json` (10 clef-weighted searXNG results).

## Context

The hierarchy-router build record (dated 2026-10-06) documents a **measurement-gated routing regime** on the steady-orbit worker. Its companion docs are a solo one-pager and a SPEC at `skills/jev-orchestrator/SPEC-ROUTER.md` (main 60b44eec). The build ran the parallel-build-lanes sequence: SPEC, then 3 lanes (general/smart), then advisor reconciliation, deploy, policy promote, and calibration.

The core idea: measure an artifact deterministically, map the measurement to a band, map the band to a lane, and let a fail-closed gate decide whether the lane action may run.

## What shipped on the worker

- **New part**: `jev-router.js`.
- **Patched parts**: jev-gate.js, jev-execute.js, jev-main.js, routes-jev.js, jev-decide.js, with Lane B modules inlined per their INLINE MODE.
- **Deploy etag**: `5e3447e5113c14fd`.
- **Part count**: 42 to **43 parts**.
- **Preserved**: crons and 14 bindings; `solar-rbs-entry.mjs` byte-identical.

Recording the byte-identical entry module and the preserved crons and bindings is a deploy-safety statement: the router was added without disturbing unrelated worker behavior.

## Policy v7

Promoted through an **audited promote** (learning `l_5e936507c9740b65`, actor jenny). It adds two things.

### routing.bands

| Band | Condition | Lane |
|---|---|---|
| hierarchy-image | D >= 1.45 | lane-draft |
| ordered-image | D in [1.0, 1.45) | lane-classify |
| sparse-image | D in [0, 1.0) | lane-classify |
| multimodal-probe | provisional | needs_approval |

### route.dispatch builtin

Hosts `jev.route`, methods `POST`, targets `lane-draft` and `lane-classify`.

On promotion, 1 v6-bound approval expired, which the record marks as expected. A changelog row was appended.

## How this compares with external routing designs

The dig surfaced several model-routing approaches, none at authoritative weight except one. An arXiv paper on dynamic model routing and cascading argues that static model deployment ignores query complexity and domain, leading to suboptimal performance and higher cost: [Dynamic Model Routing and Cascading for - arXiv.org](https://arxiv.org/html/2603.04445) (clef weight: 0.5218). Two GitHub projects describe deterministic routers: one compares a model's benchmark cost against a `max_cost_usd` and adjusts rule confidence [GitHub - tposchel/multi-ai-router: Deterministic, transparent, and ...](https://github.com/tposchel/multi-ai-router) (clef weight: 0.2826) (weak backing, clef weight < 0.5), another describes a deterministic, confidence-gated model router that spends frontier-model capacity where it changes the outcome [GitHub - BESINAPERICULOASA/confidence-router: Deterministic, confidence ...](https://github.com/BESINAPERICULOASA/confidence-router) (clef weight: 0.1685) (weak backing, clef weight < 0.5). A LinkedIn post argues multi-model routing improves voice-agent reliability [Multi-model routing for voice agents improves reliability / LinkedIn](https://www.linkedin.com/posts/neethumariamjoy_we-tell-companies-building-voice-agents-to-activity-7473399695264886784--6jp) (clef weight: 0.0763) (weak backing, clef weight < 0.5).

The hierarchy-router differs in the routing signal. Those systems route on query complexity, cost, or model confidence. This router routes on a **deterministic structural measurement** of the artifact (edge-standard D), and treats that measurement as a proposal subject to a policy gate rather than as a direct dispatch.

## Multimodal intake (operator revision)

- The route accepts image, text, or multimodal (any) input.
- The clef binding was verified live: `images: ["data:image/png;base64,..."]` accepted, with an 8 MiB cap.
- `askJev` was patched for `opts.images` passthrough.

The Cloudflare Workers AI catalog describes clef as a 27B multimodal decision model that turns a state and a schema of typed questions into decisions: [Workers AI Models · Cloudflare Workers AI docs](https://developers.cloudflare.com/workers-ai/models/) (clef weight: 0.4783) (weak backing, clef weight < 0.5) (just under the 0.5 line). The Llama 3 announcement [Meta Llama 3 available on Cloudflare Workers AI / Cloudflare…](https://blog.cloudflare.com/meta-llama-3-available-on-cloudflare-workers-ai/) (clef weight: 0.2838) (weak backing, clef weight < 0.5), the Workers AI speed and batch post [Workers AI gets a speed boost, batch workload support, more LoRAs, new ...](https://blog.cloudflare.com/workers-ai-improvements/) (clef weight: 0.2348) (weak backing, clef weight < 0.5), a community changelog [Workers AI - Workers AI for Developer Week - faster inference, new ...](https://community.cloudflare.com/t/workers-ai-workers-ai-for-developer-week-faster-inference-new-models-async-batch-api-expanded-lora-support/897183) (clef weight: 0.1110) (weak backing, clef weight < 0.5), and the product page [Cloudflare Workers AI - Edge AI Inference Platform](https://www.cloudflare.com/products/workers-ai/) (clef weight: 0.1500) (weak backing, clef weight < 0.5) give platform context at weak weight. The record names the lane-draft model as a 70b model; it does not tie that to a specific catalog entry, so neither does this doc.

## Off-topic result

A dictionary page for "multimodal" [MULTIMODAL Definition & Meaning - Merriam-Webster](https://www.merriam-webster.com/dictionary/multimodal) (clef weight: 0.0479) (weak backing, clef weight < 0.5) backs nothing.

## Summary of the shipped surface

| Layer | Artifact |
|---|---|
| Code | jev-router.js + 6 patched parts, 43 parts total, etag 5e3447e5113c14fd |
| Policy | v7: 4 routing bands + route.dispatch builtin |
| Intake | image / text / multimodal; clef images path, 8 MiB cap |
| Audit | learning l_5e936507c9740b65; changelog row; run rows kind `router` |

## Takeaway

The ship is small in code (one new part, targeted patches) and explicit in policy (four bands, one builtin). The interesting decision is the routing signal: deterministic D bands for images, with the multimodal lane held provisional and approval-gated until calibrated.

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | GitHub - tposchel/multi-ai-router: Deterministic, transparent, and ... | https://github.com/tposchel/multi-ai-router | 0.2826 | weak backing, clef weight < 0.5 |
| 2 | GitHub - BESINAPERICULOASA/confidence-router: Deterministic, confidence ... | https://github.com/BESINAPERICULOASA/confidence-router | 0.1685 | weak backing, clef weight < 0.5 |
| 3 | MULTIMODAL Definition & Meaning - Merriam-Webster | https://www.merriam-webster.com/dictionary/multimodal | 0.0479 | weak backing, clef weight < 0.5 |
| 4 | Multi-model routing for voice agents improves reliability / LinkedIn | https://www.linkedin.com/posts/neethumariamjoy_we-tell-companies-building-voice-agents-to-activity-7473399695264886784--6jp | 0.0763 | weak backing, clef weight < 0.5 |
| 5 | Dynamic Model Routing and Cascading for - arXiv.org | https://arxiv.org/html/2603.04445 | 0.5218 | authoritative (>= 0.5) |
| 6 | Workers AI Models · Cloudflare Workers AI docs | https://developers.cloudflare.com/workers-ai/models/ | 0.4783 | weak backing, clef weight < 0.5 |
| 7 | Meta Llama 3 available on Cloudflare Workers AI / Cloudflare… | https://blog.cloudflare.com/meta-llama-3-available-on-cloudflare-workers-ai/ | 0.2838 | weak backing, clef weight < 0.5 |
| 8 | Workers AI gets a speed boost, batch workload support, more LoRAs, new ... | https://blog.cloudflare.com/workers-ai-improvements/ | 0.2348 | weak backing, clef weight < 0.5 |
| 9 | Workers AI - Workers AI for Developer Week - faster inference, new ... | https://community.cloudflare.com/t/workers-ai-workers-ai-for-developer-week-faster-inference-new-models-async-batch-api-expanded-lora-support/897183 | 0.1110 | weak backing, clef weight < 0.5 |
| 10 | Cloudflare Workers AI - Edge AI Inference Platform | https://www.cloudflare.com/products/workers-ai/ | 0.1500 | weak backing, clef weight < 0.5 |
