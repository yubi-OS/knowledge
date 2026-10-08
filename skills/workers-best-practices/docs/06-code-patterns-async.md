# 06 Code patterns: async and global state

Scope: the two code-pattern rules from the source doc: no request-scoped data in module-level variables, and every Promise awaited, returned, voided, or passed to `ctx.waitUntil()`.

Grounding spine: source doc `yubi-OS/yubiOS skills/workers-best-practices/SKILL.md`.

## No global request state

The source doc rule: never store request-scoped data in module-level variables (source doc). The anti-pattern table lists the consequences precisely: cross-request data leaks, stale state, and I/O errors (source doc). The reason the pattern is tempting is that module scope looks like a free cache, and the reason it is not is the execution model: each invocation is handled independently and has its own execution context (https://developers.cloudflare.com/workers/observability/errors/, jev weight 0.92). Module-level variables persist across invocations of the same isolate, so anything written there during one request is readable by an unrelated later request. That is a correctness bug first and a security bug second.

The Workers execution model documentation frames the same fact from the platform side: Workers run serverless applications across Cloudflare's global network, with isolations managed by the runtime (https://developers.cloudflare.com/workers/, jev weight 0.92). Module state is the one shared surface across those invocations, which is exactly why the source doc fences it off.

The review signal: any `let` or mutable object at module top level that is assigned during a request is a finding. Module-level constants, type definitions, and bindings are fine; the finding is request-scoped writes.

## Floating promises

The source doc rule: every Promise must be `await`ed, `return`ed, `void`ed, or passed to `ctx.waitUntil()` (source doc). The anti-pattern table names the failure mode for a bare `fetch()` without `await` or `waitUntil`: dropped result, swallowed error (source doc). The runtime docs make the stakes concrete: floating promises, meaning promises that are neither awaited, returned, nor passed to `ctx.waitUntil()`, may be canceled when the Worker invocation completes (https://developers.cloudflare.com/workers/observability/errors/, jev weight 0.93). So the bare-`fetch()` pattern is worse than an unhandled rejection: the work may simply never happen, silently.

The four sanctioned dispositions from the source doc map to reviewer-verifiable forms:

1. `await p` when the result is needed on the response path.
2. `return p` when the promise is the response or bubbles to a caller.
3. `void p` when the work is intentionally fire-and-forget and the author has accepted cancellation risk (this documents intent for the typechecker).
4. `ctx.waitUntil(p)` when the work should outlive the response (doc 03).

Anything else is a finding.

## Why this is not lint pedantry

The best-practices page groups both rules under code patterns and configuration guidance for building fast, reliable, observable, and secure Workers (https://developers.cloudflare.com/workers/best-practices/workers-best-practices/, jev weight 0.92). Reliability is the operative word: a floating promise is a reliability defect that appears only under cancellation timing, which is the hardest class of bug to reproduce in review. The deterministic tooling fix is in doc 08: the `no-floating-promises` lint rule exists because a floating Promise is one created without any code set up to handle the errors it might throw, causing improperly sequenced operations and ignored rejections (https://typescript-eslint.io/rules/no-floating-promises/, jev weight 0.51).

## Related anti-patterns on the same review pass

The source doc's anti-pattern table places three more entries in this territory, and a reviewer checking patterns should check them in the same pass (source doc):

- `as unknown as T` double-cast: hides real type incompatibilities; fix the design instead.
- `any` on `Env` or handler params: defeats type safety for all binding access.
- Direct string comparison for secret values: timing side-channel; use `crypto.subtle.timingSafeEqual` (detailed in doc 07).

## Source line

- Source doc: `yubi-OS/yubiOS skills/workers-best-practices/SKILL.md` (Code Patterns table, anti-patterns table).
- Digs: 2 queries, 12 results weighted, 5 kept at weight 0.4 or higher.
