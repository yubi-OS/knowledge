# skills/linkedin-browser-outreach knowledge corpus

Knowledge corpus for the yubiOS skill `linkedin-browser-outreach`: sending and reading LinkedIn messages via a live cloud browser session (browser_use) instead of Beeper or the LinkedIn API; credential-safe login flow, thread replying, draft-then-approve rules, human-speed rate limiting.

Ground source (primary source of record): yubi-OS/yubiOS skills/linkedin-browser-outreach/SKILL.md.

## Documents

| NN | doc | scope |
| --- | --- | --- |
| 01 | 01-routing-vs-beeper-connector.md | When to route outreach through a live browser session instead of the beeper bridge or the LinkedIn connector, and the tradeoffs of each path. |
| 02 | 02-credential-safe-login-flow.md | The only safe login flow: agent types only the email, the human types their own password and 2FA in the live browser view; cookies persist for the session lifetime. |
| 03 | 03-read-only-network-recon.md | Read-only reconnaissance of My Network and the Messaging inbox in list view, and why the full connections graph still needs a LinkedIn data export. |
| 04 | 04-thread-reply-flow.md | Locating an existing thread by recipient search, composing and sending a reply, and verifying by re-reading the thread. |
| 05 | 05-one-sided-thread-limit.md | The hard LinkedIn UI constraint that hides the compose box until the other party replies, and how to handle it operationally. |
| 06 | 06-human-speed-rate-limiting.md | One message per browser call, confirm each success, spread batches across sessions. |
| 07 | 07-tos-risk-disclosure.md | Stating the ToS risk plainly before any batch, with the policy pages behind it. |
| 08 | 08-precedent-and-boundaries.md | The 2026-07-24 first-run precedent and the hard boundaries (no connection discovery, no connection requests, no bulk scraping, not a Beeper replacement). |

## Research summary

- Results collected: 120 (7 web-shaped subtopics, 2 queries each, top 6 per query; plus 2 redo rounds for subtopics 02 and 05; subtopic 08 is internal-record, no dig).
- Weight split: 8 results at jev weight >= 0.5 (authoritative backing), 112 at < 0.5 (weak backing, labeled in the docs).
- jev requests: 10 (1 outline score validation, 9 noul weighting batches), usage 15130 input / 2320 output tokens. All via DefAPI direct (https://api.defapi.org/api/v1/decisions), model typesafe/jev-1.13; zero 429/5xx, no fallback to the worker relay needed.
- Redos: 3 dig attempts total across 2 subtopics (02: 2 redos; 05: 1 redo).
- Skipped docs: none.

## Gaps

- Subtopic 02 (credential-safe login flow) scored marginal in outline validation (1.34) and its dig stayed weak after the 2 allowed redos (best noul 0.47). The doc is authored from the source doc, which is the authoritative record for the flow, with the dig results cited only as weak-backed corroboration and labeled as such.

## Research-db

schema v2 under research-db/: preflight.json, outline.json, archive.json (one entry per collected result with full decision records), digs/*.json (one per subtopic), jev-log.json (one entry per jev HTTP request), db.ts (TypeScript interfaces).

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); /api/decide (typesafe/jev-1.13, DefAPI direct) 200.
