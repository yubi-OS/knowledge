# 05 - The SOS Agent and FIT Assessments

Scope: the SOS Agent surfaces on the steady-orbit worker: the /sos voice-agent UI, the voice relays behind it, the legacy FIT-assessment API (stored repository FIT assessments and their population comparison), and the Systems Lab product demos that carry the agent experience to the public.

Source-class note: AGENT.md is the contract source (weak noul backing, 0.28); the Systems Lab page carries 0.43; the privacy policy carries 0.80.

## The voice agent UI

The worker serves a dedicated voice-agent interface at /sos (with /sos/ and /sos/index.html variants) built from KV artifacts: sos-index.html for the page and sos-client.js for the client script. Behind it sit three pre-baked voice reply audio files at /audio/reply-1|2|3.mp3, served as audio/mpeg from KV and returning 404 when the KV key is missing (source: https://steady-orbit.systems-a.workers.dev/AGENT.md, weak backing, w 0.28).

Two Cloudflare relays give the UI its voice. /api/tts is an ElevenLabs text-to-speech relay on the eleven_turbo_v2_5 model: POST {text (4000 chars max), voice_id?} or GET ?text (900 chars max) &voice_id, returning an audio/mpeg stream, rate-limited at 15/min per IP. /api/stt is speech-to-text via ElevenLabs scribe_v1: a multipart file upload (10MB cap, 413 over) with an optional language_code, returning {text, language_code} (source: https://steady-orbit.systems-a.workers.dev/AGENT.md, w 0.28). The privacy policy discloses the same data path to users: "if you press a speaker button, your reply text is read aloud through ElevenLabs, Inc." (source: https://steady-orbit.systems-a.workers.dev/privacy/, w 0.80).

## The FIT pipeline

The FIT (repository fit assessment) pipeline is documented as a legacy surface. Its API is three routes (source: https://steady-orbit.systems-a.workers.dev/AGENT.md, weak backing, w 0.28):

- GET /api/fits: list stored repository FIT assessments, the population, returning {fits:[...]}.
- GET /api/fits/:id: one stored FIT with its full fit_json and a population comparison; 404 when missing.
- DELETE /api/fits/:id: delete a stored FIT row, bearer-auth required (JEV_API_KEY). AGENT.md candidly notes a discrepancy: the earlier "explicit user authorization required" wording is not enforced, and any caller can remove rows.

The shape implied by the contract is: assess a repository, store the assessment as a FIT row, and then read any single FIT against the stored population. AGENT.md groups /api/fits with /api/assess and /api/narrate as "legacy" endpoints that "remain separate APIs," and states "The Sauna-hosted mirror has not received this Cloudflare release," meaning the public worker is the current home of these surfaces and a mirror elsewhere has diverged (same source).

The doc corpus available publicly does not publish the FIT scoring rubric itself; what is public is the storage contract (fit_json), the population concept, and the population-comparison read path. That boundary is respected here: this doc describes the surfaces, not the internals.

## The legacy chat assistant

The original agent chat endpoint still exists: POST /api/chat runs Workers AI llama-3.3-70b-instruct-fp8-fast with a pinned SOS system prompt, taking {message} (1000 chars max) and returning {reply}. AGENT.md marks it superseded on the live site by /api/site-assistant, the same-origin assistant grounded on the KV llms.txt with cross-origin requests rejected at 403 CROSS_ORIGIN (source: https://steady-orbit.systems-a.workers.dev/AGENT.md, w 0.28). The privacy policy describes the chat path for users: "when you use a chat demo, your typed question is processed by Cloudflare Workers AI to generate the reply," and commits that chat conversations are not stored after the demo session ends (source: https://steady-orbit.systems-a.workers.dev/privacy/, w 0.80).

## Systems Lab: the public face of the agent

The Systems Lab page (https://steady-orbit.systems-a.workers.dev/systems-lab/) is the productized, customer-facing version of the agent experience (weak backing, w 0.43). Its stated contract is on the page itself: "Sample workspace: nothing is sent, booked, or published." The lab is organized as:

- Wing 01, SOS Brain: "the conversational core of the facility," a chat console with starter prompts ("What is SOS Brain?", "How does pricing work?", "What can you automate?", "Who is behind SOS?") that route a chosen chip's question straight into the Brain panel.
- Live AI demos: three scenario demos, "Barber Shop Demo," "Auto Shop Demo," and "Car Wash Demo," each a working AI assistant "built for any style business," matching llms.txt's description of the lab's AI receptionists (source: https://steady-orbit.systems-a.workers.dev/llms.txt, weak backing, w 0.16).
- A staged demo pipeline labeled Understand, Think, Guide Action, Review: the Understand stage shows Goal, Question, Guardrails, and source documents "to read the exact sample text the agent may cite"; the Think stage states that Cloudflare Workers AI processes the question with selected fictional sources; Guide Action shows a static implementation guide with build steps, suggested tests, and caveats; Review offers an editable draft with "Preview only. Nothing was published." (source: https://steady-orbit.systems-a.workers.dev/systems-lab/, w 0.43).

The lab page uses orbital vocabulary for its own components: "Orbital trace: One core, many systems in orbit," and "Signal path: Each starter prompt is a preset transmission" (same source).

## How the pieces fit

The SOS Agent story on public surfaces is therefore three layers. The live layer is the Systems Lab demos plus the site assistant, both explicitly sample-safe and grounded on llms.txt. The voice layer is the /sos UI with ElevenLabs-backed speech relays and pre-baked replies. The legacy layer is the FIT assessment API, whose population-comparison design is public but whose scoring internals are not published. AGENT.md is the single contract that ties the three together, and it is honest about the seams, including the unenforced authorization note on FIT deletion and the superseded /api/chat.
