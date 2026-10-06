# Public Relays and the SEO Dig Proxy

Scope: the CORS-open public relay endpoints (tts, stt, contact, chat, decide, site-assistant, brain preview) and the searxng dig proxy, with their rate limits, caps and the 503-with-named-error contract.

Source of record: yubi-OS/yubiOS docs/ENDPOINTS.md (source doc, weight 0.62). All claims below are from that document unless a dig source is named.

## The relays

Small CORS-open relay endpoints ported from the standalone relay worker into this worker for the Steady Orbit website and agent clients (source doc, weight 0.62). All are rate-limited through the WEBSITE_RATE_LIMIT binding and unauthenticated apart from rate limits:

- GET|OPTIONS /api/tts - text-to-speech relay to ElevenLabs, model eleven_turbo_v2_5. Rate-limited at 15 per minute. Text is capped at 4000 chars on POST and 900 chars on GET (source doc, weight 0.62).
- OPTIONS|POST /api/stt - speech-to-text relay to ElevenLabs scribe_v1, uploads capped at 10 MB (413 over the cap), rate-limited at 15 per minute (source doc, weight 0.62). The ElevenLabs speech-to-text API documentation confirms the scribe transcription API surface (https://elevenlabs.io/speech-to-text-api, weight 0.80; https://join.elevenlabs.io/api/speech-to-text, weight 0.75).
- OPTIONS|POST /api/contact - the website contact form relayed through Resend email to the fixed site inbox. Rate-limited at 5 per minute (source doc, weight 0.62). Contact mail is composed server-side (name/company/email/message plus source), HTML-escaped, and sent with reply_to (source doc, weight 0.62). Resend documents the transactional send API this relay uses (https://resend.com/docs/email-types, weight 0.79).
- POST /api/chat - the legacy site assistant relay (Workers AI llama-3.3-70b-instruct-fp8-fast, pinned SOS system prompt). Marked legacy and superseded by /api/site-assistant (source doc, weight 0.62).
- GET|OPTIONS /api/decide - the DefAPI typesafe/jev-1.13 decision relay; the clef path routes through Workers AI when selected. Rate-limited (source doc, weight 0.62).
- POST /api/site-assistant - the Steady Orbit site chat assistant (entry module), grounded on KV llms.txt. Same-origin enforced: the Origin host must match or the request is a 403 CROSS_ORIGIN. POST-only (405 otherwise). Rate-limited via WEBSITE_RATE_LIMIT keyed by cf-connecting-ip; limiter failure allows the request (source doc, weight 0.62).
- POST /api/brain/preview - the brain demo chat endpoint, an identical handler to /api/site-assistant; rate-limited (source doc, weight 0.62).

Error contract: a 503 with a named error is returned when the backing secret is not configured - never a silent fallback (source doc, weight 0.62). CORS preflight OPTIONS is handled explicitly per relay endpoint (source doc, weight 0.62). Module parts: index.js relay block (tts/stt/contact/decide/chat, relayRateLimited, RELAY_CORS) plus solar-rbs-entry.mjs for the two assistants. Bindings: ELEVENLABS_API_KEY, RESEND_API_KEY, DEFAPI_API_KEY, AI, WEBSITE_RATE_LIMIT (source doc, weight 0.62).

## The SEO dig proxy

GET|OPTIONS /api/searxng - a single GET endpoint that forwards a searXNG endpoint plus urlencoded query string to the n8n searxng-proxy webhook running on Northflank, with open CORS, no rate limiting and a 20-second timeout (source doc, weight 0.62). It is the web-search dig path that the refs-refresh sweep and knowledge-corpus minting use to collect source results (source doc, weight 0.62).

Invariants (source doc, weight 0.62): stateless passthrough - endpoint and qs are forwarded verbatim to the upstream webhook; upstream failures surface as 502 searxng_proxy_failed with detail, never a fabricated result; CORS open with Access-Control-Allow-Origin: *, an explicit OPTIONS preflight, and no rate limiting by design. Module part: index.js searxng proxy block. Binding: NORTHFLANK_API_KEY (reserved for future direct Northflank access; the current proxy goes through the public n8n webhook, corrected in the R1 refresh).

## Rate limit summary

The rate limits and notes section records (source doc, weight 0.62): /api/tts rate-limited with the 4000/900 char caps; /api/stt rate-limited with the 10 MB upload cap; /api/contact rate-limited at 5; /api/site-assistant and /api/brain/preview same-origin enforced and POST-only with rate limits keyed by cf-connecting-ip; /api/searxng no rate limiting, CORS *, 20s timeout.

## Composition

The relays compose with the Jev Orchestrator and jev-quality (the /api/decide relay exposes the same jev-1.13 decision model the gate and scorer use), Repo Assessment (narrate and chat share the Workers AI model route), and the orchestrator execute stage (resend.send actions use the same Resend credential). The dig proxy composes with the automations tool stage (which can call it under policy) and with the external research pipelines - refs-refresh-sweep and knowledge-corpus-mint sessions use it as their dig endpoint (source doc, weight 0.62).
