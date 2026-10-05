# 07: Operational hardening and rotation

Scope: operational posture: token stored mode 600 on target, localhost-only listen, nohup logging, non-ephemeral Tailscale auth keys, rotation triggers.

## Token storage on the target

The bearer token lives in one file on the target machine, `/etc/<name>-shell.env` with mode 600, and in the agent platform's connection store. It must never appear in a chat transcript, a session file, or git (source record, refs/debug-with-cli, 2026-08-01, unweighted). The general guidance agrees on the shape: keep tokens on the server, avoid browser storage, prefer short lifetimes, and rotate on a schedule (source: https://www.reform.app/blog/storing-oauth-tokens-securely-tips, jev weight 0.23, weak). More complete API-key guidance recommends generation with a CSPRNG, storing only a hash where feasible, and rotation without downtime (source: https://knowledgelib.io/software/patterns/api-key-management/2026, jev weight 0.13, weak). Auth0's token best practices make the rotation case explicitly: both rotating and non-rotating tokens can be configured with idle or absolute expiry, and expiry values help remove stolen tokens from circulation (source: https://auth0.com/docs/secure/tokens/token-best-practices, jev weight 0.76).

## Listen surface

The bridge binds `127.0.0.1:8080` only. Funnel is the ingress; nothing else needs to reach the listener (source record, unweighted). Binding to localhost means an attacker who gains any foothold on the LAN still cannot reach the bridge directly, and the public attack surface is exactly one HTTPS URL guarded by one bearer check (docs 02 and 03).

## Process management and logging

The bridge runs under `nohup` and logs to a file under `/var/log`, with no request logging by default (source record, unweighted). Turning request logging off is a security decision, not laziness: request logs would accumulate command contents and any header material, creating a secondary store of sensitive data on the very machine the bridge is protecting. The trade is observability; if you need it, log method and path only, never bodies or headers.

## Tailscale node auth keys

The target node joined the tailnet with a non-ephemeral, reusable, pre-approved auth key (source record, unweighted). The non-ephemeral property is load-bearing. Tailscale docs explain that ephemeral nodes are automatically removed after going offline and that for multiple instances of the same container you should use a reusable auth key rather than baking a node key into an image (source: https://tailscale.com/docs/features/ephemeral-nodes, jev weight 0.50). For a long-lived hardware box behind a stable Funnel URL, ephemeral is wrong twice over: the node would vanish when idle, and the Funnel URL rotates with it, breaking the agent's connection row. Auth keys exist precisely to register new nodes without a browser sign-in (source: https://tailscale.com/docs/features/access-control/auth-keys, jev weight 0.56).

Key expiry still applies to reusable keys, which is why a community issue requests non-expiry auth keys for long-lived automated deployments (source: https://github.com/tailscale/tailscale/issues/14115, jev weight 0.25, weak). Plan the expiry into the rotation calendar instead of assuming it away; a key-expiry surprise on reboot is a documented failure mode (source: https://www.reddit.com/r/Tailscale/comments/106lrju/tailscale_key_expires_on_reboot/, jev weight 0.03, weak).

## Rotation triggers

The source record names four triggers for rotating the bearer token: the agent connection being dropped, the Tailscale node being removed and re-added, a team-membership change on the target box, and a suspected leak (source record, unweighted). Rotation here is deliberately cheap: generate a new token, update the env file on the target, restart the bridge, update the agent connection row. Because the token is shared-secret bearer (not a certificate), there is no PKI ceremony, which is the operational payoff of the auth choice made in doc 06.

## The failure drills worth rehearsing

Three failure drills cover most real incidents. One: bridge process dies, agent sees 530 at the edge, restart with `nohup`, no rotation needed. Two: node goes offline or the auth key expires, agent sees DNS or TLS failure at the Funnel URL, re-auth the node with the reusable key, URL survives. Three: token suspected compromised, rotate per the recipe above, confirm the old token now 401s. Each drill exercises one layer (origin, network, auth) and nothing else, which is the payoff of keeping the layers independent.
