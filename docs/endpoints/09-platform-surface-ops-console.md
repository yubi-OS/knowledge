# Platform Surface and Ops Console

Scope: the platform surface - health, AGENT.md, llms.txt, the /jev ops console, the v19 site routes, KV-backed assets, and the cron-driven scheduled entrypoint.

Source of record: yubi-OS/yubiOS docs/ENDPOINTS.md (source doc, weight 0.62). All claims below are from that document unless a dig source is named.

## The operator and answer-engine surface

The domain hosts the endpoints operators and answer engines face (source doc, weight 0.62):

- GET /api/health - worker version info including diagnostic module versions; no auth.
- GET /AGENT.md (also /agent.md) - the agent guide document served no-cache from KV SITE. AGENT.md is the source of truth for the instrument contract; the homepage Copy agent guide button references it.
- GET /llms.txt - the business summary for answer engines from KV, with an inline fallback prompt listing the legacy core API when not uploaded.
- GET /jev and /jev/ - the jev ops console HTML from KV (jev-index.html). Console auth is bearer JEV_API_KEY on every route except /api/jev/health; the key is entered once and kept in sessionStorage, never persisted (source doc, weight 0.62).
- The scheduled entrypoint - the worker's scheduled handler dispatches automations and the evolution cycle by cron expression: the evolution cron runs the evolution cycle, any other cron keeps the automations scheduler tick (source doc, weight 0.62).

The Cloudflare substrate these ride on is documented publicly: Workers KV stores and serves values from the edge, with a documented pattern for serving static assets directly from KV keys (https://developers.cloudflare.com/kv/examples/workers-kv-to-serve-assets/, weight 0.60), and Workers AI provides the model catalog behind the relay and console model routes (https://developers.cloudflare.com/workers-ai/, weight 0.76; https://developers.cloudflare.com/workers-ai/models/, weight 0.75).

## The site routes

16 routes live in solar-rbs-entry.mjs, the site adapter plus entry API (source doc, weight 0.62):

- POST /api/site-assistant and POST /api/brain/preview - the chat assistants (covered in doc 08 of this corpus).
- GET / - the KV-served site landing page (website-v19/index.html); also /index.html.
- GET /revenue-blind-spot[/] - the Revenue Blind Spot landing page (website-v19/revenue-blind-spot.html); /RBS, /RBS/, /rbs and /rbs/ alias to the same page.
- GET /systems-lab[/] - the Systems Lab page (lab.html) with Lumina embeds.
- GET /contact[/], /founders[/], /terms[/], /privacy[/], /brain[/], /audit[/], /results[/], /booking[/] - the site pages (contact.html, founders.html, terms.html, privacy.html, brain.html, audit.html, results.html, booking.html).
- GET /sitemap.xml and GET /robots.txt - served from KV.
- GET /website-vN/<file> - the generic asset pass-through: /website-v<digits>/<[A-Za-z0-9._-]+> served from KV key website-vN/<file> (source doc, weight 0.62).

The site adapter passes every /website-vN/* asset through from KV generically and delegates everything else unchanged (source doc, weight 0.62).

## KV-backed UI assets in index.js

The legacy API module also serves UI surfaces from KV (source doc, weight 0.62):

- GET /map[/] - the Wayfinder map browser UI (KV map-index.html), with GET /map/app.js (map-app.js) and GET /map/pointmap.js (pointmap.js), the dependency-free numeric pointmap core.
- GET /sos[/]|/sos/index.html - the SOS voice-agent UI (KV sos-index.html), with GET /sos/client.js (KV sos-client.js).
- GET /[index.html] - the legacy site index from KV, shadowed by the solar-rbs-entry.mjs page table when a KV page exists.
- GET /audio/reply-1|2|3.mp3 - three hardcoded voice reply audio files from KV (audio/reply-N.mp3).

## Scheduled dispatch

The scheduled handler is the single cron entrypoint (source doc, weight 0.62): dispatch is by cron expression, the evolution cron runs the machine cycle, and other crons run the automation scheduler tick with compare-and-set on last_fired_at so double-fire is impossible. The scheduled pass can also be triggered on demand via POST /api/jev/evolution/cycle/run, which runs one cycle plus enqueue plus queue drain (source doc, weight 0.62). This matches the Workers scheduled-handler contract, where each cron trigger fires the handler with its scheduled event (https://developers.cloudflare.com/workers/runtime-apis/handlers/scheduled/, weight 0.85).

## Composition

The console is the human surface for the Jev Orchestrator's tasks, approvals, pause and the summary/cost rollup (source doc, weight 0.62). The scheduled handler composes with Automations and Evolution: it dispatches runJevScheduled by cron expression. Module parts: index.js (health/AGENT/llms/console routes plus the scheduled handler), solar-rbs-entry.mjs (site pages plus /website-vN assets), jev-main.js (console wiring). Bindings: SITE, DB (source doc, weight 0.62).
