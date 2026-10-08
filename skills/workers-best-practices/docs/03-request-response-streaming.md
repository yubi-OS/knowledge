# 03 Request and response handling

Scope: streaming large or unbounded payloads, the 128 MB memory consequence of buffering, `ctx.waitUntil()` for post-response work, and why destructuring `ctx` throws at runtime.

Grounding spine: source doc `yubi-OS/yubiOS skills/workers-best-practices/SKILL.md`.

## Streaming is the rule, buffering the exception

The source doc rule: stream large or unknown payloads; never `await response.text()` on unbounded data (source doc). The best-practices page shows the exact anti-pattern in code: a handler that fetches a large dataset and buffers the entire response body in memory is labeled Bad (https://developers.cloudflare.com/workers/best-practices/workers-best-practices/, jev weight 0.92). The source doc's anti-pattern table names the consequence: memory exhaustion against the 128 MB limit (source doc). The platform limits page documents the runtime limits regime, including limits that apply per request (https://developers.cloudflare.com/workers/platform/limits/, jev weight 0.91); treat the specific 128 MB figure as the source doc's number and verify the current published limit when it matters, per the retrieval-first rule in doc 01.

The review signal is mechanical: any `await response.text()`, `await response.json()`, or `await response.blob()` on a response whose size the code does not control is a finding. The fix is to pass the response body stream through, or to enforce a bounded read where a buffer is genuinely required.

## ctx.waitUntil for post-response work

The source doc rule: use `ctx.waitUntil()` for post-response work and do not destructure `ctx` (source doc). The context docs define the purpose precisely: `ctx.waitUntil()` is for work that can run after the response is sent, such as logging, analytics, or cache writes, as long as the work can finish within the `waitUntil()` time limit (https://developers.cloudflare.com/workers/runtime-apis/context/, jev weight 0.83). The same page notes that if the client is still receiving the response, including a streamed response body, the execution context stays alive for that duration (https://developers.cloudflare.com/workers/runtime-apis/context/, jev weight 0.83).

This connects to the floating-promise rule (doc 06): the errors docs warn that floating promises, meaning promises that are neither awaited, returned, nor passed to `ctx.waitUntil()`, may be canceled when the Worker invocation completes (https://developers.cloudflare.com/workers/observability/errors/, jev weight 0.93). So post-response work has exactly one sanctioned home, and it is `ctx.waitUntil()`.

## Destructuring ctx is a runtime failure, not a style issue

The source doc anti-pattern: `const { waitUntil } = ctx` loses the `this` binding and throws "Illegal invocation" at runtime (source doc). This is the rare anti-pattern where the failure is immediate and deterministic rather than probabilistic, which makes it a cheap check in review: any destructuring of the context object is a finding regardless of how the code tests locally, because the thrown error surfaces only against the runtime's native context object.

## How the three rules compose

A correct response path does all of the following at once:

1. Streams the body when the payload is large or its size is unknown (source doc; https://developers.cloudflare.com/workers/best-practices/workers-best-practices/, jev weight 0.92).
2. Keeps the invocation alive past the response only via `ctx.waitUntil()`, which is also what protects in-flight post-response promises from cancellation (https://developers.cloudflare.com/workers/observability/errors/, jev weight 0.93; https://developers.cloudflare.com/workers/runtime-apis/context/, jev weight 0.83).
3. Passes `ctx` whole into helper functions instead of destructuring it (source doc).

## What the general docs add

The Workers overview and product pages frame the execution model this sits on: serverless applications deployed across Cloudflare's global network (https://developers.cloudflare.com/workers/, jev weight 0.92; https://www.cloudflare.com/products/workers/, jev weight 0.69). The product page's weight is below 0.5, so it is weak backing and is cited only for the framing sentence. The limits page remains the reference for the per-request budget that makes streaming mandatory (https://developers.cloudflare.com/workers/platform/limits/, jev weight 0.91).

## Source line

- Source doc: `yubi-OS/yubiOS skills/workers-best-practices/SKILL.md` (Request and Response Handling table, anti-patterns table).
- Digs: 2 queries, 12 results weighted, 4 kept at weight 0.4 or higher.
