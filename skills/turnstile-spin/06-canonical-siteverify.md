# 06 Canonical siteverify

Scope: the canonical server-side siteverify call: endpoint and request format, the response fields the handler must check, fail-closed error handling, and why the browser never calls siteverify.

Ground spine: `yubi-OS/yubiOS skills/turnstile-spin/SKILL.md` (source doc), Step 9.

## Where the call lives

The source doc's Step 9 states the contract before touching code: "I'll embed the widget at each chosen surface and add a canonical siteverify call inside its existing handler. The handler will require `success === true`, the expected action, and an approved frontend hostname. The existing handler logic stays the same. The secret lives in your env as `TURNSTILE_SECRET`." The agent asks "yes" or "show"; on "show" it prints unified diffs and asks again, and it does not propose alternate behavior such as mail delivery or custom backends (source doc, Step 9).

Upstream makes the placement non-negotiable: server-side validation is mandatory, the client-side widget alone does not protect forms, and an implementation without Siteverify is incomplete (weight 0.95, https://developers.cloudflare.com/turnstile/get-started/server-side-validation/). Tokens can be forged: an attacker can submit any string to a form endpoint without completing a challenge (weight 0.95, https://developers.cloudflare.com/turnstile/get-started/server-side-validation/). The skill's "hard scope boundary" section restates the topology: the browser goes to the user's backend, and the user's backend calls siteverify. Never call siteverify from the browser (source doc, "Things you must NOT do"), because that would put the secret in client code, which upstream separately forbids (weight 0.95, https://developers.cloudflare.com/turnstile/get-started/).

## The endpoint and request

Canonical endpoint (source doc Step 9; upstream weight 0.95, https://developers.cloudflare.com/turnstile/get-started/server-side-validation/):

```
POST https://challenges.cloudflare.com/turnstile/v0/siteverify
```

The source doc's canonical idiom posts `application/x-www-form-urlencoded` with three parameters built from `URLSearchParams`: `secret` from `process.env.TURNSTILE_SECRET`, `response` holding the `cf-turnstile-response` token, and `remoteip` from the client IP (`X-Forwarded-For`, `req.ip`, or equivalent). It wraps the fetch in a 10-second timeout via `AbortSignal.timeout(10_000)` (source doc, Step 9).

Upstream confirms the contract and widens it slightly: the endpoint accepts both `application/x-www-form-urlencoded` and `application/json` requests and always returns JSON (weight 0.95, https://developers.cloudflare.com/turnstile/get-started/server-side-validation/). `secret` and `response` are required; `remoteip` is optional; and there is an optional `idempotency_key`, a UUID that makes retrying a validation request safe (weight 0.95, https://developers.cloudflare.com/turnstile/get-started/server-side-validation/). The skill's canonical idiom does not use the idempotency key because it treats a failed siteverify call as fatal for the request rather than retriable; upstream's retry-with-idempotency pattern (weight 0.95, https://developers.cloudflare.com/turnstile/llms-full.txt) is the alternative for handlers that need at-least-once validation.

## The response and what must be checked

Siteverify returns JSON. The response fields (weight 0.95, https://developers.cloudflare.com/turnstile/llms-full.txt):

| Field | Description |
| --- | --- |
| `success` | Boolean indicating whether validation succeeded |
| `challenge_ts` | ISO 8601 timestamp when the challenge was solved |
| `hostname` | Hostname where the challenge was served |
| `error-codes` | Array of error codes when validation failed |
| `action` | Custom action identifier from the client side |
| `cdata` | Custom data payload from the client side |
| `metadata.ephemeral_id` | Device fingerprint ID (Enterprise only) |

The source doc's handler checks four things, in order, and each failure returns 403:

1. Token shape: the token must be a non-empty string of at most 2048 characters (upstream confirms 2048 as the maximum token length, weight 0.95, https://developers.cloudflare.com/turnstile/get-started/server-side-validation/), and the expected-hostname set must be configured at all (`expectedHostnames.size === 0` fails closed).
2. Transport result: any network error, non-2xx status, or non-JSON body from siteverify is caught and rejected. The source doc's comment is the rule: fail closed (source doc, Step 9 code comment).
3. Verification result: `!result.success` rejects.
4. Binding checks: `result.action !== expectedAction` rejects, and `!expectedHostnames.has(result.hostname)` rejects.

Only after all four pass does the existing handler logic run, unchanged (source doc, Step 9). The action check enforces the stable action assigned in the insertion plan (doc 04); the hostname check enforces the deployment-specific allowlist from Step 5, where a production value must not include `localhost` or `127.0.0.1` (source doc, Step 9). Upstream documents exactly these two as the additional checks a serious implementation performs: validate the action and validate the hostname (weight 0.96, https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).

`TURNSTILE_HOSTNAMES` is the deployment-specific frontend hostname allowlist, read from the environment and split on commas (source doc, Step 9). This is what makes one widget with broad domains safe: the widget may accept tokens minted on localhost or production, but each backend deployment narrows the acceptance back down at verification time.

## Fail-closed semantics

The canonical idiom has no path that lets a request through when verification is uncertain: a fetch exception returns 403, a non-2xx response returns 403, and any binding mismatch returns 403. This is the deliberate inversion of a convenience-first integration, and it is what makes the dummy-probe validation of doc 08 meaningful: a probe that cannot reach siteverify must look identical to a rejected request, not silently pass.

## Platform notes

Two platform shapes the source doc calls out in its edge-case table. For a Cloudflare Workers backend, use the same canonical fetch idiom inside the Worker's request handler; `fetch` to `challenges.cloudflare.com` works the same way it does in Node (source doc, edge cases). For a Cloudflare Pages project, wire siteverify inside a Pages Function, and the Pages Plugin at developers.cloudflare.com/pages/functions/plugins/turnstile is a shortcut (source doc, edge cases). The plugin wraps the same siteverify call, extracts `cf-turnstile-response` from the form by default, defaults `remoteip` to the `CF-Connecting-IP` header, and populates `context.data.turnstile` with the siteverify response object (weight 0.61, https://developers.cloudflare.com/pages/functions/plugins/turnstile/). Note the plugin's IP default: `CF-Connecting-IP`, not `X-Forwarded-For`; when a handler sits behind a proxy chain, prefer the header Cloudflare sets itself (weight 0.95, https://developers.cloudflare.com/turnstile/get-started/server-side-validation/, form-data example).

## Summary

The canonical call is small: one POST, three or four parameters, one JSON response, four checks. Everything the skill adds around it (the confirmation script, the diff gate, the env-var discipline) exists to keep that call verifiable and to keep the surrounding handler exactly as the user wrote it.
