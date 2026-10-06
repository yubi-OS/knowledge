# cloudflare-email-service Knowledge Corpus

A knowledge corpus explicating the yubi-OS skill `yubi-OS/yubiOS skills/cloudflare-email-service/SKILL.md`: sending and receiving transactional emails with Cloudflare Email Service (Email Sending plus Email Routing), Workers bindings, Agents SDK email handling, and the integration patterns the skill teaches. The SKILL.md is the primary source of record; each doc below cites it as the source doc and adds searXNG-dig evidence with jev noul weights.

## Docs

| NN | Doc | One-line scope |
|---|---|---|
| 01 | [01-retrieval-over-pretraining.md](01-retrieval-over-pretraining.md) | Why the skill mandates retrieval-first and the 4 retrieval sources it names. |
| 02 | [02-prerequisites-and-onboarding.md](02-prerequisites-and-onboarding.md) | The 3 prerequisite checks and how domain onboarding works. |
| 03 | [03-workers-binding-sending.md](03-workers-binding-sending.md) | Sending from a Worker via the send_email binding. |
| 04 | [04-rest-api-sending.md](04-rest-api-sending.md) | The REST API path and its field-name differences from the binding. |
| 05 | [05-agents-sdk-email.md](05-agents-sdk-email.md) | onEmail() and replyToEmail() in the Cloudflare Agents SDK. |
| 06 | [06-cli-mcp-for-coding-agents.md](06-cli-mcp-for-coding-agents.md) | Wrangler CLI and MCP paths for coding agents. |
| 07 | [07-email-routing-inbound.md](07-email-routing-inbound.md) | Inbound email: the email() handler, postal-mime, single-use message.raw. |
| 08 | [08-deliverability.md](08-deliverability.md) | SPF, DKIM, DMARC, bounces, suppression, transactional-only scope. |
| 09 | [09-common-mistakes.md](09-common-mistakes.md) | The source doc's 11-row mistakes table, internal-record subtopic. |

## Research summary

- Results collected: 96 (16 searXNG queries, 2 per web-shaped subtopic, top 6 kept per query).
- Weight split: 32 high (weight 0.5 or higher) / 64 low (below 0.5). Every result carries a non-null noul weight.
- jev requests: 9 total (1 outline score validation with 9 questions, 8 noul weighting batches of 12), via DefAPI direct (https://api.defapi.org/api/v1/decisions), zero failed requests. Usage: 11320 input tokens, 1995 output tokens.
- Redos: 0 (no dig was thin enough to require a redo; no /api/decide failures occurred).
- Skipped docs: none. All 9 subtopics were authored. Subtopics 01, 05, and 06 scored in the marginal band at outline validation and were kept because their digs returned strong results. Subtopic 09 is an internal-record subtopic (no dig, cites the source doc only).

## Preflight

2026-10-06: campaign preflight healthy (orchestrator); agent-side probe skipped for speed. Outline validation and weighting ran against https://api.defapi.org/api/v1/decisions with model typesafe/jev-1.13.
