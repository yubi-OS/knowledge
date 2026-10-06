# 02 - Worker Architecture

Scope: the single steady-orbit Cloudflare Worker that carries Steady Orbit Systems' entire public footprint and instrumentation stack: marketing site serving, public relays, the SOS Agent surfaces, the point-map wayfinder instrument, /api/decide, the jev orchestrator, jev automations, the corpus math engine, the evolution loop, and the taste engine.

Source-class note: this doc mixes three source classes. The company's own AGENT.md is the primary contract (weak noul backing, 0.28, because the model scores vendor surfaces low); the yubi-OS org's public skills and refs docs are internal-record claims with higher weights (0.59-0.70); Cloudflare's own documentation supplies the platform context (0.52-0.95).

## One worker, many products

Everything the company exposes publicly runs on one Cloudflare Worker at https://steady-orbit.systems-a.workers.dev. AGENT.md, served from KV at both /AGENT.md and /agent.md spellings, is the machine-readable contract for the whole host, and llms.txt is "the maintained business summary" that answer engines are told to read for marketing-facing questions (source: https://steady-orbit.systems-a.workers.dev/AGENT.md, weak backing, w 0.28; https://steady-orbit.systems-a.workers.dev/llms.txt, weak backing, w 0.16). The privacy policy confirms the infrastructure owner: "The website and its demos run on infrastructure operated by us on Cloudflare, Inc." (source: https://steady-orbit.systems-a.workers.dev/privacy/, w 0.80).

## Platform layer (Cloudflare)

The worker sits on Cloudflare Workers, the serverless edge-compute platform that runs code on Cloudflare's global network (source: https://blog.cloudflare.com/workers-ai/, w 0.84). Three platform primitives the system leans on are publicly documented:

- Durable Objects, Cloudflare's stateful serverless primitive, give each object a single strongly consistent location with storage; they exist for "coordinating stateful, real-time, collaborative" workloads (source: https://developers.cloudflare.com/durable-objects/concepts/what-are-durable-objects/, w 0.95; overview: https://developers.cloudflare.com/durable-objects/, w 0.94; product page, w 0.52).
- Workers AI provides model inference through bindings, including Meta Llama models (source: https://developers.cloudflare.com/workers-ai/configuration/bindings/, w 0.94; https://developers.cloudflare.com/workers-ai/, w 0.92; Llama 3 announcement: https://blog.cloudflare.com/meta-llama-3-available-on-cloudflare-workers-ai/, w 0.87).
- Cloudflare KV storage serves the site's static artifacts from the edge (the AGENT.md contract names KV keys for every page asset; source: https://steady-orbit.systems-a.workers.dev/AGENT.md, w 0.28).

## Site serving and the site assistant

The entry module serves the marketing site with page tables shadowed by KV-stored pages: /index.html legacy site index from KV, /sitemap.xml and /robots.txt from KV, and /audio/reply-1|2|3.mp3 as three pre-baked voice reply files. The same-origin site assistant at POST /api/site-assistant takes a {message} body (1500 characters max, 10KB body cap), rejects cross-origin requests with 403 CROSS_ORIGIN, is POST-only (405 otherwise), grounds its answers on the KV llms.txt, and is gated by the AI binding plus a WEBSITE_RATE_LIMIT where a limiter failure allows the request (fail-open). /api/brain/preview is the identical handler under a different route (source: https://steady-orbit.systems-a.workers.dev/AGENT.md, weak backing, w 0.28).

## Public relays

Four public relays are CORS-open with Access-Control-Allow-Origin: *, per-IP rate limited, and fail with 503 when the backing key binding is absent and 502 on upstream failure:

- /api/tts: ElevenLabs text-to-speech relay (eleven_turbo_v2_5), POST text up to 4000 chars or GET text up to 900 chars, returns audio/mpeg, rate-limited 15/min per IP.
- /api/stt: speech-to-text via ElevenLabs scribe_v1, multipart file up to 10MB, returns {text, language_code}, 15/min per IP.
- /api/contact: contact form to Resend email (from site@axel.steadyorbitsystems.ai to mike@steadyorbitsystems.com), stricter 5/min per IP limit.
- /api/decide: the browser-friendly decision relay (covered in doc 04), 15/min per IP.

OPTIONS preflights are answered on /api/jev/*, /api/searxng, and the relay family with 204 and the open CORS origin (all from https://steady-orbit.systems-a.workers.dev/AGENT.md, weak backing, w 0.28).

## The point-map wayfinder instrument

The instrument layer maps full documents or numeric vectors onto a frozen binary/PCA/sphere frame: /api/repo-items ingests a GitHub repo's files, /api/embed returns 768-D document vectors (chunked/v1 ingestion on @cf/baai/bge-base-en-v1.5 with explicit mean pooling and SHA256 content-hash caching), /api/map places texts or vectors on the frame, /api/maps stores and compares maps, /api/map/control runs a CutPaste-style positive control, and /api/outcomes is the append-only pre-registration ledger. The frozen-baseline loop freezes PCA means/axes/thresholds and placement parameters so unchanged vectors keep exactly unchanged positions; a frame/instrument conflict stops comparison rather than fabricating one (source: https://steady-orbit.systems-a.workers.dev/AGENT.md, weak backing, w 0.28). The stated instrument philosophy: "Geometry diagnoses movement. Use an independent task verifier to decide usefulness. The API never awards itself a quality score" (same source).

## Jev orchestrator, automations, evolution

The same worker serves the Jev v2 gated-approval orchestration API: 21 routes under /api/jev/* plus an ops console at /jev/, state in D1 tables (jev_tasks, jev_actions, append-only jev_events, jev_approvals, jev_learnings), and policy in KV jev-policy.json with every gate decision stamping the version it enforced (source: https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/jev-orchestrator-2026-10-01.md, w 0.70; internal-record claim). Detail is in doc 03.

Jev Automations add versioned automation definitions in D1 with stage pipelines (tool, llm, builtin, guard, propose_actions), a cron scheduler firing every 5 minutes with compare-and-set semantics, and three-tier model routing: classify on llama-3.1-8b, draft on llama-3.3-70b, guard on llama-guard-3-8b, with a raw: pin for anything else (source: https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/jev-automations-2026-10-01.md, w 0.59; AGENT.md, w 0.28).

The evolution loop runs hourly: /api/jev/evolution/sweep ingests structured reports, findings become directives with fail-closed kinds (record_learning and note auto-execute; memory_edit, skill_push, schedule_change, repo_push, worker_change, ops_fix and external_comms need approval), and the cycle measures worker state and corpus metrics only once 5 completed cycles of history accumulate, "before that it records an honest corpus error instead of fabricating" (source: https://steady-orbit.systems-a.workers.dev/AGENT.md, weak backing, w 0.28).

## Corpus math and taste engine

/api/jev/corpus/* exposes the corpus-math engine: audit (V2, z, dBc, idempotent per input sha256, multipass Decision-B mode), lens (candidate proposal), atom (dry-run flip plans with the Delta >= 0 invariant asserted), classify (tautology/falsifiable/paradox/undecidable), placements, selftests, and the visco instruments (persistence, hysteresis rollup, Prony relaxation fit, snapback verdicts). AGENT.md states the discipline: "The math is a port, never a re-derivation: the system of record is papers/data/lean/verify_claims.py... Every deploy is verified with /selftest before results are trusted; on any fixture mismatch the JavaScript is wrong until proven otherwise" (source: https://steady-orbit.systems-a.workers.dev/AGENT.md, weak backing, w 0.28). The knowledge-corpus-mint skill documents this engine as the worker's corpus layer, with /api/decide as its decision endpoint and the searxng-proxy webhook as its search layer (source: https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/knowledge-corpus-mint/SKILL.md, weak backing, w 0.42; internal-record claim). The taste engine (/api/jev/corpus/taste/*) adds a nature-based instrument: deterministic extraction (box-counting D, mirror symmetry, scale coherence) plus one batched clef call over 8 nature-law axes, with hysteresis and order_seed permutation for position-bias control (source: https://steady-orbit.systems-a.workers.dev/AGENT.md, w 0.28).

## The shape of the thing

The architecture is one worker as the company's entire stack: marketing site, answer-engine surface, AI product demos, public API relays, a research instrument, an automation control plane, and a self-measuring corpus engine, all sharing one edge runtime, one KV namespace, and one D1 database.
