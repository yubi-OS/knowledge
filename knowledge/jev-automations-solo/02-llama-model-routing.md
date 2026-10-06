# 02 - Llama runtime: per-stage model routing on Workers AI

Scope: the Llama runtime layer in the Jev Automations framing log: model routed per stage between llama-3.1-8b-instruct-fp8, llama-3.3-70b-instruct-fp8-fast, and llama-guard-3-8b, with cost accounted per task.

## The routing decision

The framing log routes each automation stage to the cheapest model that fits the stage: llama-3.1-8b-instruct-fp8 for cheap classification and extraction, llama-3.3-70b-instruct-fp8-fast for drafting and complex generation, llama-guard-3-8b as a safety pass before any send (framing log, 2026-09-30). It keeps jev-1.13 for authorization, so Llama handles generation and safety classification, never the gate decision.

## What Workers AI actually offers

Cloudflare's Workers AI model catalog lists Meta Llama models including llama-3.3-70b-instruct-fp8-fast, and the platform supports OpenAI-compatible endpoints for /v1/chat/completions and /v1/embeddings (https://developers.cloudflare.com/workers-ai/models/llama-3.3-70b-instruct-fp8-fast/, jev weight 0.8981). The catalog itself is the authoritative index of available models (https://developers.cloudflare.com/workers-ai/models/, jev weight 0.8678). Meta publishes Llama 3.3 70B Instruct under the Llama 3.3 community license, with model weights and inference code distributed by Meta (https://huggingface.co/meta-llama/Llama-3.3-70B-Instruct, jev weight 0.9141). So all three model tiers named in the framing log exist on the target runtime, which was the first assumption to check.

## Routing as an engineering pattern

Intelligent LLM routing routes each request by cost, latency, and task fit, using mechanisms including static rules, weighted splits, latency-aware routing, semantic routing, and model cascades (https://www.truefoundry.com/blog/llm-routing-cost-quality-aware-model-selection, jev weight 0.6217). The framing log's routing is the static-rules end of that spectrum: the stage definition itself names the model, so routing is decided at registry-authoring time, not at request time.

The tiered landscape is explicit in production practice: small, fast, cheap models suit classification, extraction, and simple Q&A, while mid-tier models cover reasoning-light generation (https://blog.nepexgroup.com/ai/engineering/architecture/2026/07/02/llm-routing-intelligent-model-selection-pro, jev weight 0.4149, weak backing). The framing log's 8b-for-classification / 70b-for-drafting split matches that tiering.

## Cost claims need discounting

Blog sources claim large savings from routing: route each request to the cheapest model that can handle it, cutting bills 40 to 85 percent with no visible quality loss (https://www.digitalapplied.com/blog/llm-model-routing-2026-cost-quality-optimization-engineering-guide, jev weight 0.1798, weak backing); a similar guide claims up to 85 percent savings (https://baeseokjae.github.io/posts/multi-model-llm-routing-guide-2026/, jev weight 0.276, weak backing); another lists 60 to 90 percent combined savings across prompt compression, caching, routing, batching, and token budgeting (https://myengineeringpath.dev/genai-engineer/llm-cost-optimization/, jev weight 0.2817, weak backing). These are vendor-adjacent blog figures with weak weights; treat them as motivation, not evidence.

The framing log itself treats cost as the un-testable bet: Workers AI neuron pricing staying negligible at lead-machine volume should be validated with the first 100-task run (framing log, 2026-09-30). That is the right posture. The strong-weighted sources establish capability (the models exist and are callable); the weak-weighted sources only suggest the economics.

## Verdict

Per-stage routing is defensible because it is a static, versioned decision recorded in the registry, not a runtime heuristic. The capability claims rest on primary Cloudflare and Meta sources with weights near 0.9. The cost claims rest on weak sources and remain an open bet in the framing log itself, to be settled by measurement rather than citation.
