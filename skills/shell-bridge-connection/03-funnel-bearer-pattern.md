# 03 - Tailscale Funnel plus a bearer-auth bridge

Scope: the architecture behind the bridges: what Tailscale Funnel contributes, what the ~50 LOC stdlib Python bridge contributes, and how the Sauna proxy completes the auth chain.

## The stack in one paragraph

Two Tailscale-Funnel-exposed bearer-auth HTTP bridges, each roughly 50 lines of stdlib Python, give Sauna remote exec on Jenny's ARM64 boxes (source doc). The Funnel layer publishes an internal service on a public `*.ts.net` hostname; the bridge layer authenticates callers with a static Bearer token and executes the posted command. The pattern comes from the debug-with-cli skill (source doc).

## What Tailscale Funnel does

Tailscale Funnel routes internet traffic to a local service on a node, publishing it on the public internet under the tailnet's DNS name (https://tailscale.com/docs/features/tailscale-funnel, jev weight 0.71). The official Funnel examples show the standard shape: a service listening on a local port, served to the outside world at `<node>.<tailnet>.ts.net` (https://tailscale.com/docs/reference/examples/funnel, weight 0.70; same doc mirrored at https://tailscale.com/kb/1247/funnel-examples/, weight 0.68). The bridge hostnames follow exactly that shape: `ubuntu.tail3a04f5.ts.net` and `rock1.tail3a04f5.ts.net` (source doc).

The design consequence: Funnel terminates public TLS and forwards to the local bridge process. Anyone on the internet can reach the hostname, so the bearer token is the only access gate. That is why token hygiene (doc 08) and status-code diagnostics (doc 04) are first-class concerns rather than afterthoughts.

A third-party walkthrough of the same publishing flow exists (https://oneuptime.com/blog/post/2026-01-28-tailscale-funnel-service-publishing/view, weight 0.14, weak backing); prefer the official docs.

## What the bridge contributes

The bridge is deliberately minimal: stdlib Python only, ~50 LOC (source doc). Its responsibilities:

1. Check the Bearer token on every request.
2. Parse the JSON body and hand the command array to `subprocess.run` verbatim (doc 01).
3. Return the three-key response: stdout, stderr, returncode (source doc).

It runs as a systemd service: `shell-bridge.service` on ubuntu, formerly `rock1-shell` on rock1 (source doc). It listens on port 8080 (source doc, established by the zombie-process saga where the August process held that port). It runs as root on both boxes (source doc).

Bearer-token-over-HTTP is the standard authorization scheme for machine-to-machine calls (https://www.askpython.com/python/api-calls-bearer-token-authentication, weight 0.12, weak backing); the load-bearing statement is the source doc's, not the tutorial's.

## How Sauna completes the chain

The token never travels through chat or code. The Sauna connection row stores it; when a tool call names the connection in its connections param, the proxy injects the Bearer header transparently (source doc). The connection ids are `conn_ai5iXWquRX0s` (ubuntu) and `conn_W36n4EetFoNp` (rock1) (source doc).

One control is worth knowing for diagnostics: a request can opt OUT of injection with `X-Sauna-Connection-Id: none` (source doc). That is how you test a raw token directly against the bridge (doc 04).

## Why this pattern is a good default

- No inbound firewall holes on the boxes; Funnel owns the public edge.
- No VPN client needed by the caller; the endpoint is plain HTTPS.
- No dependency beyond Python stdlib on the host; ~50 LOC is auditable in one read (source doc).
- The auth story is one static token plus one systemd unit, which is exactly as much machinery as a debug bridge needs.
- The pattern generalizes: any tailnet device can join the fleet by running the same bootstrap script (doc 06) and getting a Sauna connection row.

The tradeoff is that the static token is a single point of compromise, which is why doc 08 treats token file permissions and history leakage as standing risks, and why a token that nobody outside the box can produce makes the connection row unfixable without box-side work (doc 04).
