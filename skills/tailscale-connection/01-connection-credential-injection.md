# 01 - Connection and credential injection

Scope: how the Sauna Tailscale API connection stores its credential, how the proxy injects it, and the calling discipline that makes both work.

## The connection as stored

The working Tailscale connection in Sauna is `conn_vCNyaMA0uZDx`, an `api_key` type connection. The stored credential is a `tskey-api-` API access token (source doc: yubi-OS/yubiOS skills/tailscale-connection/SKILL.md). There are no auth gymnastics: Tailscale accepts this token class as a plain Bearer header, and that is exactly the shape the Sauna proxy injects. No signature, no token exchange, no refresh dance is required for this credential class.

The Tailscale side of this is documented: the API is authenticated by an access token (also called an API key) generated from the Keys page of the admin console, and the API itself is available for all plans (source: https://tailscale.com/docs/reference/tailscale-api, jev weight 0.94). Tailscale's key-prefix reference confirms the taxonomy: the prefix starts with `tskey-` and is followed by the key type; an API access token gets the `tskey-api` prefix (source: https://tailscale.com/docs/reference/key-prefixes, jev weight 0.92).

## The injection mechanics

Every `run_script` or `bash` call that touches `api.tailscale.com` must declare the connection explicitly:

```json
connections: [{ "id": "conn_vCNyaMA0uZDx", "name": "Tailscale API" }]
```

The proxy intercepts outbound requests to the connected host and injects the stored token as `Authorization: Bearer tskey-api-...`. Two consequences follow (source doc):

1. Agent code must not set its own `Authorization` header for this host. A hand-set header either duplicates or clobbers the injected one, and the proxy may refuse to inject at all when the request is made without the connection declared.
2. A request made without the connection declared fails with 401, because no credential was injected. This is a calling-discipline failure, not a Tailscale-side credential failure, and it should be diagnosed first before suspecting the token itself.

The interactive API documentation lives at api.tailscale.com and is mirrored under the Tailscale docs site (source: http://api.tailscale.com/, jev weight 0.92; source: https://tailscale.com/api-docs, jev weight 0.92). Both serve as the reference surface for the call paths the connection can reach.

## What this connection does not need

Because the stored credential is a user-owned API access token rather than an OAuth client secret, the connection does not need:

- The OAuth 2.0 client credentials flow. That flow is for `tskey-client-` secrets and is covered in doc 06 (source doc).
- Periodic token renewal inside agent code. The API access token is long-lived (up to the 90-day API key maximum, covered in doc 07) and the proxy injects the same stored value on every call (source doc).
- Scope negotiation. The token carries the permission of the owning user (source: https://tailscale.com/blog/oauth, jev weight 0.77), so whatever the owner can see through the API, the connection can reach.

## Verification habit

Before trusting any Tailscale call in a new session, run a cheap authenticated read (the device list, doc 02) and check for a 200 with a `devices` array. A 401 on every shape usually means either the connection was not declared in the tool call, or the pasted credential was a `tskey-client-` secret instead of a `tskey-api-` token (source doc). The prefix check is the fastest discriminator and costs zero API calls.

## Source quality notes

The dig for this subtopic returned mostly aggregator and mirror pages on the weak side of the weighting line: integrations.sh at jev weight 0.10, a mirror repo api.md at 0.11, and a lookalike domain at 0.04 (weak backing, not used as evidence). The authoritative spine is the Tailscale docs reference (0.94), the key-prefix reference (0.92), and the interactive API documentation (0.92). The generic tailscale.com landing page weighted 0.63 to 0.65 and is cited only for the general framing that Tailscale connects CI runners and infrastructure, not for any specific API claim.
