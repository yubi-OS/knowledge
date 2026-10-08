# resend-connection knowledge corpus

Minted 2026-10-08 from the ground source yubi-OS/yubiOS skills/resend-connection/SKILL.md (fetched from raw.githubusercontent.com with User-Agent omni-agent/1.0). Landing: skills/resend-connection/ in yubi-OS/knowledge, branch mint/skills-resend-connection-2026-10-06, one draft PR. The SKILL.md is the primary source of record; every doc below explicates it, cites it as the grounding spine, and carries searXNG dig sources with jev weights for the external mechanisms it references.

## Docs

| Doc | Scope |
| --- | --- |
| 01-connection-identity.md | The conn_YBJp6OTaZ8ZX row, what a send-only Resend connection is, the Stable Orbit use case, and why the restriction defines the operating envelope |
| 02-restricted-api-key-error.md | The exact 401 restricted_api_key body on read endpoints, which endpoints trigger it, and official corroboration of the signature |
| 03-401-health-check.md | Why restricted_api_key proves the proxy injected the credential and Resend authenticated it, versus genuinely bad key errors, and how to use it as a probe |
| 04-post-emails-shape.md | POST https://api.resend.com/emails: the four core JSON fields, to as string or array, the id-on-success response, and idempotency keys |
| 05-from-domain-verification.md | Why the from address cannot be self-verified on this key, how the failure surfaces, and the human confirmation step before the first send |
| 06-connection-passthrough.md | Passing connections [{id, name}] on every call so the proxy injects the credential, and the missing-key 401 that results when you forget |
| 07-no-read-surface.md | Why this connection is not a connection-sweep surface: no inbox, no send history, no account state through the API |
| 08-error-signature-reference.md | Consolidated table: restricted_api_key, missing key, domain verification failure, and 429 rate limit, each with the correct response |

## Research summary

- Results collected: 26 unique results from 12 searXNG queries (10 original + 2 redo), top 6 kept per query, duplicate URLs archived once under their first query.
- Weight split: 14 results with weight >= 0.5 (authoritative backing), 12 results with weight < 0.5 (weak, cited only as labeled corroboration or recorded unweighted in the archive).
- Subtopics 01, 06, and 07 are internal-record subtopics (connection row, workspace passthrough mechanics, sweep exclusion): no dig, grounded in the source doc, per the mint speed optimizations.
- Redos: 1. Doc 03 scored marginal (0.53) at outline validation and its first dig was thin, so the dig was redone with different queries per the REDO rule; the redo returned strong sources (the Resend llms-full docs export and a missing-key error taxonomy) and the doc was authored.
- Skipped docs: none.
- Jev budget: 3 requests total (1 outline validation request with 8 score questions, 2 noul weighting batches of 13), usage 3691 input / 600 output tokens, all via DefAPI direct (https://api.defapi.org/api/v1/decisions, model typesafe/jev-1.13-20260917), zero 429s, no fallback to the worker relay.

## Preflight

Preflight 2026-10-06: campaign preflight healthy (searXNG and decide probed orchestrator-side); agent-side probe skipped for speed per the skills-variant mint brief. In-run health: both searXNG dig rounds returned parseable JSON result arrays, and all 3 DefAPI decisions returned 200 with well-formed answers.

## Verification

VERIFIED post-push: PR files list contains all 22 files; each research-db JSON re-fetched by blob sha, parsed, and every archive entry carries a non-null weight.
