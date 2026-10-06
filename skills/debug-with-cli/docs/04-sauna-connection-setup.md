# 04 The Sauna side: connection and auth injection

Scope: registering the bridge as a Sauna custom keys connection so the proxy injects the Bearer header automatically, and the 2-call verification protocol. Grounded in the source doc (yubi-OS/yubiOS skills/debug-with-cli/SKILL.md), with the Bearer scheme grounded in the HTTP auth specifications.

## The Bearer scheme the connection relies on

The bridge authenticates requests with the HTTP Bearer scheme: an `Authorization: Bearer <token>` header. RFC 7235 defines the HTTP Authentication framework and the Authorization and WWW-Authenticate header fields (https://httpwg.org/specs/rfc7235.html, weight 0.69); RFC 6750 defines bearer token usage, including the requirement that the token string be carried in the Authorization header with the Bearer scheme (https://www.rfc-editor.org/info/rfc6750/, weight 0.55). OAuth.net's summary matches: a bearer token is a cryptic string presented with every request, whoever bears it gains access (https://oauth.net/2/bearer-tokens/, weight 0.54). MDN's HTTP authentication guide covers the same header mechanics at a general level (https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication, weak, weight 0.34).

The practical consequence, which the source doc leans on: the header is the credential. Whoever can set that header on a POST to the Funnel URL runs commands on the box. That is why the token lives in the Sauna connection, not in chat or scripts.

## The connection recipe (source doc)

The source doc specifies an exact `connect_account` configuration. The fields that matter:

- `connection_type`: `"keys"`. The source doc is emphatic that this is a custom API key connection, not `"mcp"`.
- `name`: `"<node> shell bridge"`, for example `"rock1 shell bridge"`.
- `url`: `https://<node>.<tailnet>.ts.net/`.
- `auth_type`: `"bearer"`.
- `fields`: one password-type required field named `token`, labeled "Bearer Token".
- `auth_strategy`: `{ strategy: "static", inject: [{ type: "bearer" }] }`.

After the user pastes the token into the form, Sauna stores it and the proxy auto-injects `Authorization: Bearer <token>` on every request to that domain (source doc). The agent never sees, types, or logs the token; injection is the point of the `auth_strategy`.

## The verification protocol (source doc)

Two calls, in this order:

1. Without auth: `curl -sS -i https://<node>.<tailnet>.ts.net/run -X POST -d '{"command":["echo","probe"]}' -H "Content-Type: application/json"`. Expected: `HTTP/1.1 401 Unauthorized`. Passing means the Funnel is up, the bridge is listening, and auth is enforced (source doc).
2. With the connection's auth injected (the connection passed in the tool call): the same call should return 200 with the echo result (source doc).

The 401-first call is doing double duty: it proves reachability and proves the auth boundary in one round-trip. If it returns a Cloudflare 530 or error 1016 instead, that is not an auth problem; it means the origin is not listening on the Funnel'd port (source doc; see doc 10).

## Where the token comes from

The token was minted on the target in doc 03 (`openssl rand -hex 32`, stored in `/etc/rock1-shell.env`). The user copies that same value into the Sauna connection form. The source doc's security model requires the token never appear in the Sauna chat, a session file, or git (source doc); the form paste is the one sanctioned transfer.
