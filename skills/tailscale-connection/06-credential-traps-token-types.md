# 06 - Credential traps: token types and the 401 diagnosis

Scope: the two `tskey-` credential classes, why one works as a Bearer and the other never does, and the diagnostic sequence when a Tailscale connection suddenly 401s on every shape.

## The two prefixes

Tailscale keys share the `tskey-` prefix and diverge after it (source: https://tailscale.com/docs/reference/key-prefixes, jev weight 0.92):

- `tskey-api-` is a user-owned API access token. It works directly as a Bearer header (source doc: yubi-OS/yubiOS skills/tailscale-connection/SKILL.md). This is what the Sauna connection stores (doc 01).
- `tskey-client-` is an OAuth client secret. It NEVER works as a direct Bearer credential: a Bearer attempt with it returns 401 `API token invalid` (source doc). It must be exchanged at `POST /api/v2/oauth/token` for 1-hour access tokens.

The Tailscale OAuth clients doc confirms the exchange shape: the Tailscale OAuth token endpoint accepts requests conforming to the OAuth 2.0 client credentials grant format and returns OAuth 2.0-shaped responses (source: https://tailscale.com/docs/features/oauth-clients, jev weight 0.89; mirrored at 0.88). The same doc notes that OAuth client libraries in popular languages can handle API access token generation and renewal, so hand-rolled renewal is usually avoidable (source: https://tailscale.com/docs/features/oauth-clients, jev weight 0.88).

Tailscale's own framing splits the two mechanisms by identity: OAuth clients use the client credentials flow and create tag-owned resources, while user API access tokens act as the user (source: https://tailscale.com/docs/oauth, jev weight 0.93).

## The sudden-401 diagnostic

If a Tailscale connection that used to work starts returning 401 on every shape (source doc):

1. Check which prefix the user pasted. A `tskey-client-` value stored as if it were an API token produces exactly this signature: 401 `API token invalid` on every call.
2. If the prefix is `tskey-api-`, check expiry. API access tokens have a 1 to 90 day lifetime (doc 07), and an expired token is shown on the Keys page (source: https://tailscale.com/docs/reference/tailscale-api, jev weight 0.94).
3. If the credential class is actually an OAuth client secret, do not keep it as a Bearer; exchange it at the token endpoint for a 1-hour access token per call window (source doc).
4. Revocation is also a 401 source: an API access token can be revoked from the Keys page of the admin console (source: https://tailscale.com/docs/reference/key-secret-management, jev weight 0.92).

## Behavioral difference worth knowing

Switching credential classes is not behavior-neutral even when auth succeeds. A GitHub issue against tailscale/tailscale recorded that calls to `GET /v2/tailnet/-/devices` under an OAuth client-credentials token return only devices owned by the tailnet, while a standard API access token also returns devices shared into the tailnet (source: https://github.com/tailscale/tailscale/issues/16911, jev weight 0.73). For a connection whose device list is the main surface, that visibility difference matters when comparing credentials.

Another practical 401 case: an issue recording a GET to `/tailnet/-/keys` succeeding while a POST to the same path to create an auth key failed with `API Token Invalid` despite a seemingly valid token (source: https://github.com/tailscale/tailscale/issues/15764, jev weight 0.72). The lesson generalizes: method-level failures on otherwise-working credentials exist, so diagnose per endpoint, not just per token.

## Source quality notes

Strong sources: the OAuth clients doc (0.89, 0.88), the OAuth overview (0.93), the key-prefixes reference (0.92), the key and secret management reference (0.92), and the API reference (0.95). The two GitHub issues (0.73 and 0.72) are first-party project issue reports: credible for behavioral observations, not for documented API contracts. Weak results, recorded but not used: a Netgate forum thread at jev weight 0.06 (twice collected), a mirror of the oauth-clients doc at 0.08, and a third-party API reference page at 0.21. The tailscale.com landing page weighted 0.64 to 0.70 is generic.
