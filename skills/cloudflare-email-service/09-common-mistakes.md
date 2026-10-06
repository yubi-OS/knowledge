# Common Mistakes and Anti-Patterns

Scope: the source doc's own mistakes table, restated and organized as an internal-record subtopic. This is an internal-record subtopic, no dig was run; every claim cites the source doc.

## Provenance

The source doc (yubi-OS/yubiOS skills/cloudflare-email-service/SKILL.md) carries an 11-row "Common Mistakes" table with a fixed 3-column structure: the mistake, why it happens, and the fix. Because this table is the skill's own distilled failure catalog rather than a web-researchable topic, the corpus records it verbatim in structure and adds only the organization and cross-references to the other docs in this corpus. No searXNG dig was run for this subtopic (internal-record subtopic, no dig), and no claim below extends beyond what the source doc says.

## Configuration-class mistakes

1. Forgetting the `send_email` binding in wrangler config. Why it happens: "Email Service uses a binding, not an API key". Fix: add `"send_email": [{ "name": "EMAIL" }]` to wrangler.jsonc. Cross-reference: the prerequisites doc in this corpus makes this check 2 of the 3 prerequisite checks.
2. Sending from an unverified domain. Why: "Domain must be onboarded onto Email Sending before first send". Fix: run `wrangler email sending enable yourdomain.com` or onboard in Dashboard. Cross-reference: the prerequisites doc covers what onboarding provisions, including bounce-routing MX records.
3. Ignoring the `from` domain requirement. Why: "The `from` address must use a domain onboarded to Email Service". Fix: "Verify the domain first, then send from `anything@that-domain.com`". Note the shape of the fix: any local part is fine once the domain is onboarded; the domain is the constraint.

## Field-name mistakes between the two send paths

4. Using the `email` key in the REST API `from` object. Why: "REST API uses `address` not `email` for `from` object". Fix: use `{ "address": "...", "name": "..." }` for REST, `{ "email": "...", "name": "..." }` for Workers.
5. Using `replyTo` in the REST API. Why: "REST API uses snake_case field names". Fix: `reply_to` for REST API, `replyTo` for Workers binding.

These 2 rows are a pair, and they are the most mechanical translation errors in the whole skill: any code path that serves both surfaces (a helper that switches between binding and REST) must carry 2 field maps. The REST API doc in this corpus details both differences.

## Receiving-path mistakes

6. Reading `message.raw` twice in an email handler. Why: "The raw stream is single-use — second read returns empty". Fix: "Buffer first: `const raw = await new Response(message.raw).arrayBuffer()`". Cross-reference: the routing doc in this corpus explains why this fails silently (the second consumer gets an empty body, not an exception).

7. Forwarding to unverified destinations. Why: "`message.forward()` only works with verified addresses". Fix: "Run `wrangler email routing addresses create user@gmail.com` or add in Dashboard".

## Content and policy mistakes

8. Missing `text` field (HTML only). Why: "Some email clients only show plain text; also helps spam scores". Fix: "Always include both `html` and `text` versions". Cross-reference: the deliverability doc in this corpus notes the API itself accepts either field, so this is a deliverability discipline, not a validation rule.

9. Using email for marketing or bulk sends. Why: "Email Service is for transactional email only". Fix: "Use a dedicated marketing email platform for newsletters and campaigns".

10. Testing with fake addresses. Why: "Bounces from non-existent addresses hurt sender reputation". Fix: "Use real addresses you control during development". This row interacts with the local-development testing loops (`wrangler dev` for both halves) recorded in the prerequisites doc: simulation is the reputation-safe phase, real addresses you control are the reputation-safe live phase.

## Credential mistakes

11. Hardcoding API tokens in source code. Why: "Tokens in code get committed and leaked". Fix: "Use environment variables or Cloudflare secrets". This is the only row that concerns the REST path specifically: the binding path needs no token, which is part of why the source doc recommends the binding for Workers (source doc, Quick Start section).

## How to use the table

The source doc's own structure suggests the usage pattern: the table is a checklist, not a tutorial. An agent should (source doc, adapted): run the 3 prerequisite checks before writing code, consult rows 4 and 5 whenever translating between the binding and REST shapes, treat rows 6 and 7 as receiving-path invariants to encode in code review, and treat rows 8, 9, 10, and 11 as standing policies for any sending application. Every row's fix is actionable without reading further, which is why the source doc keeps the table in its top-level file rather than a reference.
