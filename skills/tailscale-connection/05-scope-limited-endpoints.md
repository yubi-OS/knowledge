# 05 - Scope-limited endpoints and dead ends

Scope: the endpoints verified dead on this connection, why they fail under an API key, and what credential class reaches them.

## Verified dead ends (source doc, do not retry)

Two families of failure were verified on 2026-09-24 and are standing instructions (source doc: yubi-OS/yubiOS skills/tailscale-connection/SKILL.md):

1. `GET /api/v2/tailnet/-` returns 405 `method_not_allowed`. The tailnet resource itself is not a GET surface; always scope under `tailnet/-/...` (devices, dns/preferences, dns/nameservers, users).
2. `GET /api/v2/tailnet/-/acls`, `/routes`, `/keyexpiry`, `/tags`, `/invites` return 404/ERR on this key. The judgment in the source doc is that this is an API-key scope limitation: the ACL surface needs an OAuth client or a differently-scoped key. The standing instruction is not to burn calls on them.

## Why an API key hits these walls

The Tailscale API reference describes the alternative credential class directly: as an alternative to an access token that has full permission to the Tailscale API, use trust credentials to provide delegated fine-grained control (source: https://tailscale.com/docs/reference/tailscale-api, jev weight 0.94). The OAuth clients feature doc gives the mechanism: an OAuth client defines the scopes to allow when the client application uses the Tailscale API, with example scopes of the `dns:read` shape (source: https://tailscale.com/docs/features/oauth-clients, jev weight 0.89; same content mirrored at 0.88 and at 0.86 under https://tailscale.com/s/oauth-clients/).

The historical framing helps explain the failure mode: before OAuth support, API requests were authenticated using simple API keys tied to the user that created them, and because those keys carry the same permission as the owning user, Tailscale limited their lifetime to no more than 90 days (source: https://tailscale.com/blog/oauth, jev weight 0.77). A user API access token is therefore an all-or-nothing credential, and endpoints outside its reach fail rather than degrade.

The Terraform provider reference for the OAuth client resource confirms which scopes exist in practice: access tokens generated for an OAuth client can carry scopes including `devices:core` and `auth_keys`, and tags are mandatory when those scopes are present (source: https://registry.terraform.io/providers/tailscale/tailscale/latest/docs/resources/oauth_client, jev weight 0.88).

## The operational rule

For this connection the rule is: read endpoints verified in doc 01 through 04 are in scope; ACL, route, key-expiry, tag, and invite surfaces are out of scope until the credential class changes (source doc). If a task genuinely requires one of those surfaces, the fix is not retrying with the same key; it is creating an OAuth client with the matching scope and either swapping the connection's credential or minting short-lived access tokens from it (doc 06 covers the exchange).

## Drift watch

The dead-end list is dated 2026-09-24. Scope behavior can change as Tailscale moves access control toward scoped credentials (the OAuth direction the docs describe, source: https://tailscale.com/docs/features/oauth-clients, jev weight 0.88). A re-verification of the dead ends is warranted if a task requires them or after any credential rotation on this connection.

## Source quality notes

Strong sources: the API reference (0.94), the OAuth clients feature doc (0.89, 0.88, 0.86 across three collections), the OAuth blog post (0.77), and the Terraform provider reference (0.88). Weak results, recorded but not used: a third-party repo API reference at jev weight 0.11 and an MCP server repo at 0.15. The tailscale.com landing page weighted 0.63 to 0.67 is generic framing only.
