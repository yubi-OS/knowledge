# 02 - Multi-connection pinning

Scope: how to route an authenticated request through one specific connection when several stored connections share the same host, using the `connections` parameter plus the `X-Sauna-Connection-Id` header. Grounding spine: yubi-OS/yubiOS skills/custom-connection/SKILL.md (source doc).

## The two-part call pattern

When calling the Cloudflare API through the Sauna proxy, two things must be sent together (source doc):

1. The `connections` parameter on the tool call, listing the working row: `connections: [{id: "<working-conn-id>", name: "Cloudflare"}]`. The proxy only injects credentials for connections named in this parameter.
2. The request header `X-Sauna-Connection-Id: <working-conn-id>`, pinning which of the passed connections the credential comes from.

Both ids must be updated to whichever row currently works (source doc). The header's value must be one of the ids passed in `connections`, or `none` to explicitly send a request without credential injection (source doc).

## Why the header is not optional

The proxy resolves which stored credential to inject by matching the request's host against stored connection rows. When multiple rows cover the same host, as with the six Cloudflare rows described in doc 01, host matching alone is ambiguous, and the proxy fails with `Multiple matching connections found` (source doc). The header is the disambiguator: it selects one row out of the ones you passed.

Dig corroboration: this injection pattern is the standard way credential-aware proxies work. Header mode is documented as the most common credential injection pattern in a comparable CLI proxy, which injects a stored credential as an HTTP header with optional formatting (https://nono.sh/docs/cli/features/credential-injection, jev 0.48, weak backing, just below the 0.5 bar). HTTP headers are the request-level routing metadata layer, which is why a per-request pin fits a header rather than a URL parameter (https://developer.mozilla.org/en-US/docs/Web/HTTP, jev 0.89).

## What the proxied credential layer looks like

The managed connector row `conn_pd_apn_1KhdoD7` is a Pipedream-backed managed connection (its id carries the `conn_pd_apn_` prefix; source doc). Pipedream's Connect model exposes a proxy that fronts managed auth: you send requests through the Connect proxy with the Pipedream SDKs or directly over REST, and the auth material is injected server side (https://pipedream.com/docs/connect/api-proxy, jev 0.84). Pipedream distinguishes key-based apps from OAuth-based apps, and custom OAuth clients are a separate mechanism from stored API keys (https://pipedream.com/docs/connect/managed-auth/oauth-clients, jev 0.88). That distinction is what doc 09 builds the connector-selection strategy on.

## Failure modes to expect

- Omitting the header while multiple same-host rows are passed: `Multiple matching connections found` (source doc).
- Passing a connection id in `connections` but pinning a header value that is not among the passed ids: the proxy cannot inject for an unpinned row (source doc; the header value must be one of the passed ids).
- Pinning a dead row by id: the request goes through, the credential is injected, and the upstream rejects it with the row's own error code (6111 or 9109; see doc 04).

## The session rule

Because the working row id churns (two prior working rows died; source doc), never hardcode the pinned id from memory. Read the current working id from the connection table at session start, verify it with the health check, then pass that id in both places for the rest of the session (source doc, with the health-check contract from doc 03).
