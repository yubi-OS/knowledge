# 04 - The Decision Endpoint

Scope: /api/decide as a public product surface on the steady-orbit worker: its model routes (DefAPI typesafe/jev-1.13 and clef/clef-flash via Workers AI), request shapes, question types, CORS behavior, and rate limits.

Source-class note: AGENT.md is the contract source (weak noul backing, 0.28); the knowledge-corpus-mint skill and refs docs are internal-record claims (0.42-0.70).

## Endpoint contract

GET/POST /api/decide is one of the worker's four public relays. The contract as published in AGENT.md: a browser-friendly decision relay running DefAPI typesafe/jev-1.13, or clef / clef-flash via Cloudflare Workers AI when the route selects them. The POST body is {state, questions, session_id?, user?}; the GET form takes ?state&questions (urlencoded JSON) plus optional &session_id&user, so a plain browser can call it. Question types choice, score, and noul are validated server-side. The route is backed by a DEFAPI_API_KEY binding (plus the AI binding for the clef path) and is rate-limited at 15/min per IP (source: https://steady-orbit.systems-a.workers.dev/AGENT.md, weak backing, w 0.28).

## Relay family behavior

/api/decide shares the public-relay family properties: CORS open (Access-Control-Allow-Origin: *), per-IP rate limiting via the relay limiter, 503 when the backing key binding is absent, and 502 on upstream failure. An OPTIONS preflight on /api/decide returns 204 with the open CORS origin, which is what makes the GET form usable from a browser page (source: https://steady-orbit.systems-a.workers.dev/AGENT.md, weak backing, w 0.28).

## The three question types

The endpoint exposes three decision metrics, each answering a different shape of question (source: https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/knowledge-corpus-mint/SKILL.md, weak backing, w 0.42; internal-record claim, and this corpus's own outline validation request as a live observation):

- score: a ranked choice over named criteria (lowest-first, 0 to 2), used for load-bearing judgments such as outline validation.
- noul: a yes/no decision returned as a probability; true means the item is a primary/official source worth citing, false means aggregator, forum, marketing page, dead link, or off-topic. The probability itself is the source-quality weight.
- choice: an either-or selection over described options.

The mint skill pins the operating discipline around the endpoint: batch 5 results per request, pace requests at least 1 second apart, and treat any /api/decide failure as a REDO rather than a degrade; on 429/5xx, sleep 30 seconds and re-send up to 3 attempts, splitting into smaller batches on retry; never ship results unweighted (source: https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/knowledge-corpus-mint/SKILL.md, w 0.42).

## Role in the larger system

The orchestrator uses /api/decide as its Understand/Decide layer: Under the jev v2 design, DefAPI typesafe/jev-1.13 via the worker's existing /api/decide relay supplies intent category, an actionable noul, and a risk score, plus proposed actions, and those outputs are advisory only; the deterministic gate, not the model, authorizes dispatch (source: https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/jev-orchestrator-2026-10-01.md, w 0.70; internal-record claim).

The corpus scorer uses the same model family differently: /api/jev/corpus/scorer/score combines deterministic per-axis evidence extraction with one batched jev-1.13 request of 12 noul questions at a p >= 0.5 threshold, at a stated cost of about $0.0002 per call, with hysteresis (flip only if p >= 0.55 or p <= 0.45, else carry the previous row) to remove threshold jitter (source: https://steady-orbit.systems-a.workers.dev/AGENT.md, weak backing, w 0.28).

## Observed operation

Two operational characteristics are observable from the public endpoint without credentials. First, the model name is returned in each response (clef in the requests made while minting this corpus). Second, a batched request returns one answer object per question under answers.<question-name>, with each score or noul answer carrying its value, probabilities, confidence, and a legend that restates the criteria (source: observation of POST https://steady-orbit.systems-a.workers.dev/api/decide during this corpus's mint, 2026-10-06; the outline validation request returned score answers with probabilities and confidence for all 8 subtopics in one request).

The pricing posture is public in the org's skill docs: jev-1.13 decisions run at about $0.00003 per decision (source: https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/knowledge-corpus-mint/SKILL.md, weak backing, w 0.42). That price point is the stated reason the mint flow can afford to weight every collected search result individually rather than sampling.

## Why it matters as a product surface

/api/decide is the piece that lets non-infrastructural callers, including browser pages, get structured, calibrated decisions instead of free text. It is deliberately not a chat endpoint: its output vocabulary is bounded (a score over named criteria, a probability, or a chosen option), which is what makes it composable as the gate-adjacent advisory layer for the orchestrator and as the weighting layer for corpus tooling.
