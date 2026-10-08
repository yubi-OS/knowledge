# 07 Security: crypto and error handling

Scope: Web Crypto primitives over `Math.random`, timing-safe secret comparison, and explicit try/catch with structured error responses instead of `passThroughOnException`.

Grounding spine: source doc `yubi-OS/yubiOS skills/workers-best-practices/SKILL.md`.

## Randomness: Web Crypto only

The source doc rule: use `crypto.randomUUID()` and `crypto.getRandomValues()`; never `Math.random()` for security purposes (source doc). The anti-pattern table gives the reason: `Math.random()` output is predictable and not cryptographically secure (source doc). The Workers Web Crypto page documents both sanctioned methods on the runtime, including `crypto.randomUUID(): string` (https://developers.cloudflare.com/workers/runtime-apis/web-crypto/, jev weight 0.87). The MDN reference confirms the standard's semantics: `randomUUID()` generates a v4 UUID using a cryptographically secure random number generator, and `crypto.getRandomValues` is the source for arbitrary amounts of secure random bytes (https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID, jev weight 0.67).

The review signal is a one-line grep: any `Math.random()` feeding a token, identifier, nonce, or password-reset value is a finding, regardless of entropy arguments about seeding.

## Timing-safe comparison for secrets

The source doc rule: never compare secret values with a direct string comparison; use `crypto.subtle.timingSafeEqual` (source doc). The reason is the timing side-channel listed in the anti-pattern table (source doc). The Workers docs carry a worked example for exactly this: protect against timing attacks by safely comparing values using `timingSafeEqual` (https://developers.cloudflare.com/workers/examples/protect-against-timing-attacks/, jev weight 0.94). The Web Crypto page notes that `timingSafeEqual(a, b): bool` compares two buffers in a way that is resistant to timing attacks and is a non-standard extension to the Web Crypto API available on the runtime (https://developers.cloudflare.com/workers/runtime-apis/web-crypto/, jev weight 0.87). A reviewer sees the anti-pattern in any auth check shaped like `request.headers.get("Authorization") === env.API_SECRET`.

## Secret materialization

Two source-doc rules converge here. First, secrets must be managed with `wrangler secret put` and never hardcoded in source or config, because hardcoded secrets leak through version control (source doc). The secrets docs back the mechanism: secret values are not visible in Wrangler or the Cloudflare dashboard after definition (https://developers.cloudflare.com/workers/configuration/secrets/, jev weight 0.93; detailed in doc 02).

Second, comparison must be timing-safe, per the section above. Together they mean a secret's lifecycle is: created via `wrangler secret put`, injected as `env.<NAME>`, and compared only through `crypto.subtle.timingSafeEqual`.

## passThroughOnException is not error handling

The source doc rule: no `passThroughOnException`; use explicit try/catch with structured error responses (source doc). The anti-pattern table names the cost: hides bugs and makes debugging impossible (source doc). The docs describe what the method actually does: by using `passThroughOnException()`, a Workers application can forward requests to its origin if an exception is thrown during the Worker's execution (https://developers.cloudflare.com/workers/observability/errors/, jev weight 0.92). That is a routing fallback for Workers configured in front of an origin, not a general error strategy, and the source doc's rule stands because as an error strategy it converts unhandled exceptions into silent pass-throughs that no one can see.

The errors docs also establish the frame that makes explicit handling feasible: each invocation is handled independently and has its own execution context (https://developers.cloudflare.com/workers/observability/errors/, jev weight 0.92). A structured error response inside that invocation is observable (doc 05); an exception passed through is not.

## The security review pass

From the source doc's Security table and Review Workflow step 6 (source doc), with dig backing:

1. All randomness for tokens and IDs from `crypto.randomUUID()` or `crypto.getRandomValues()` (https://developers.cloudflare.com/workers/runtime-apis/web-crypto/, jev weight 0.87).
2. All secret comparisons through `crypto.subtle.timingSafeEqual` (https://developers.cloudflare.com/workers/examples/protect-against-timing-attacks/, jev weight 0.94).
3. No secrets in source or config; secrets via `wrangler secret put` (source doc).
4. No `passThroughOnException()` as error handling; explicit try/catch returning structured errors (source doc).

The Cloudflare skills repository's runtime-patterns reference for this same skill documents preferred patterns and common mistakes, with retrieve links for cases where an API, behavior, or limit is uncertain (https://github.com/cloudflare/skills/blob/main/skills/workers-best-practices/references/runtime-patterns.md, jev weight 0.72). Use it as a secondary index, not a substitute for the retrieval-first rule.

## Source line

- Source doc: `yubi-OS/yubiOS skills/workers-best-practices/SKILL.md` (Security table, anti-patterns table).
- Digs: 2 queries, 12 results weighted, 6 kept at weight 0.4 or higher.
