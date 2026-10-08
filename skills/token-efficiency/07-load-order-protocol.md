# 07 - Load-Order Protocol Before External API Calls

Scope: read the domain skill once before touching an external API, because one schema read is cheaper than the retries a wrong-shaped query costs.

## The protocol

The source doc (yubi-OS/yubiOS `skills/token-efficiency/SKILL.md`, Load-order protocol) prescribes a fixed 3-step load order before any external API call (Linear GraphQL, GitHub REST/Contents/Git Data API, MCP servers, browser sessions):

1. `using-agent-skills` - read once if not already in context, to know what is available.
2. `token-efficiency` (the skill itself) plus `context-isolation` - the always-on pair.
3. The relevant domain skill - `linear` for Linear queries, `github-api` for GitHub REST and Git Data, `github-actions` for workflow YAML, and so on.

The rationale is stated in the source doc: external APIs have type-shape surprises, listed as GraphQL nullability (`ID!` versus `String!`), blob/tree/commit/ref ordering in the GitHub Git Data API, and MCP tool namespaces. The domain skill's SKILL.md already documents those shapes, so reading it once saves the roughly 5 tool turns of debugging a query with the wrong shape (source doc, Load-order protocol).

## The cost of skipping

The source doc quantifies the skip: 2-3 wasted tool turns on GraphQL validation errors, MCP "tool not found" errors, or the GitHub Contents API DELETE-body-drop bug, which the source doc says is documented in PROJECT_RULES.md as broken through the proxy (source doc, Load-order protocol). Its named anti-pattern is the retry loop itself: retrying a failed query with the same payload instead of reading the schema first (source doc, Load-order protocol, Anti-pattern).

## What the dig found

This is the one subtopic where the dig returned no strong sources. The closest topical results are all weak: a post on reading API documentation in the right order (https://stackdevtools.com/how-to-read-api-documentation/, jev weight 0.13, weak), two API-mistakes listicles (https://stackdevtools.com/common-mistakes-developers-make-while-working-with-apis/, jev weight 0.15, weak; https://www.linkedin.com/pulse/15-api-integration-mistakes-how-avoid-them-vishal-singh-9ns7c, jev weight 0.14, weak), and a reflection on systems reading each other without documentation (https://www.linkedin.com/pulse/when-systems-read-each-other-without-documentation-michael-brinkley-34dvc, jev weight 0.16, weak). Per the weighting rule these carry weak backing and are cited only as direction.

The GraphQL.org documentation is authoritative but scored low on topical relevance: the validation guide (https://graphql.org/learn/validation/, jev weight 0.06) and the learn index (https://graphql.org/learn/, jev weight 0.04) describe schema validation as a request-processing stage, which grounds the mechanism behind the source doc's "GraphQL validation errors" example without supporting the efficiency claim itself.

The honest summary: this subtopic's claims rest on the source doc, and the source doc's own numbers (5 tool turns saved, 2-3 wasted turns when skipped) are its own operational estimates rather than external measurements.

## Why the protocol is token-efficient by construction

The protocol's economics follow from the source doc's own arithmetic (source doc):

- Reading a domain SKILL.md once costs a bounded number of tokens, once per session.
- Debugging a wrong-shaped query costs the failed call plus its full error context, repeated per attempt, typically across 2-5 turns.
- The always-on pairing with `context-isolation` (step 2) keeps the read disciplined: the domain skill is loaded once, not per call.

## Operational rules

1. Before the first external API call of a session, run the 3-step load order (source doc, Load-order protocol).
2. On a validation or tool-not-found error, read the schema or skill section, never resend the same payload (source doc, Load-order protocol).
3. Treat known-broken endpoints (per PROJECT_RULES.md) as documented constraints, not retry candidates (source doc, Load-order protocol).
4. Prefer one careful read over two blind attempts; the protocol exists to make that trade automatic.

## Sources

- Source doc: yubi-OS/yubiOS `skills/token-efficiency/SKILL.md` (Load-order protocol).
- https://graphql.org/learn/validation/ (jev weight 0.06, weak relevance).
- https://stackdevtools.com/how-to-read-api-documentation/ (jev weight 0.13, weak).
- https://www.linkedin.com/pulse/when-systems-read-each-other-without-documentation-michael-brinkley-34dvc (jev weight 0.16, weak).
