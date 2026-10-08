# 07 - API key expiry and rotation

Scope: the 90-day API key ceiling, the known expiry dates on this connection, and the rotation discipline that prevents a dead connection.

## The 90-day ceiling

Tailscale API access tokens have a bounded lifetime. The API reference states that when you generate an access token from the Keys page you can choose the number of days, between 1 and 90 inclusive, for the key expiry (source: https://tailscale.com/docs/reference/tailscale-api, jev weight 0.93). The auth keys doc states the same 1 to 90 inclusive window for auth keys (source: https://tailscale.com/docs/features/access-control/auth-keys, jev weight 0.92). The historical reason is stated in Tailscale's OAuth blog post: simple API keys carry the same permission as the user who created them, so their lifetime is capped (source: https://tailscale.com/blog/oauth, jev weight 0.77). The scoped alternative is an OAuth client, whose access tokens are short-lived but renewable (doc 06).

## The dates that matter here

On this connection, the current key pair (1 API key + 1 auth key) expires 2026-12-23 (source doc: yubi-OS/yubiOS skills/tailscale-connection/SKILL.md, internal record). After that date the connection should be expected to fail with 401 on every shape, and the right response is to prompt for rotation rather than to debug the connection as if it were broken. 2026-12-23 is 90 days after 2026-09-24, the verification date the source doc records, which is consistent with the keys having been minted at full lifetime.

## Rotation discipline

The practical rotation pattern for this connection (source doc):

- Before the expiry date, mint a new API key and a new auth key in the admin console, update the stored connection credential, and delete the old key.
- Expect the auth key's 90-day clock to matter for device enrollment workflows too: an auth key automatically expires after the number of days specified when generated, between 1 and 90 inclusive (source: https://tailscale.com/docs/features/access-control/auth-keys, jev weight 0.92).
- Treat the expiry as a scheduled event, not a surprise: record the date wherever connection credentials are tracked, and set the check far enough ahead that rotation is not done in a broken state.

An expired or revoked token is visible on the Keys page (source: https://tailscale.com/docs/reference/tailscale-api, jev weight 0.94), which makes the post-rotation verification cheap: a failed connection plus an expired-looking entry on the Keys page confirms the diagnosis without further API calls.

## Do not confuse the three clocks

This corpus tracks three different expiry clocks, and mixing them causes misdiagnosis:

1. API key expiry: 1 to 90 days, chosen at mint time. Applies to `tskey-api-` tokens. Affects the connection itself.
2. Auth key expiry: 1 to 90 days, chosen at mint time. Affects device enrollment only, not API calls (source: https://tailscale.com/docs/features/access-control/auth-keys, jev weight 0.92).
3. Node key expiry: a per-device clock, 180 days by default, covered in doc 08 (source: https://tailscale.com/docs/features/access-control/auth-keys, jev weight 0.92).

A 401 on API calls implicates clock 1. A device that stops passing traffic implicates clock 3. A new device that fails to join implicates clock 2.

## Device-side expiry mitigation (for completeness)

For device keys rather than API keys, Tailscale documents mitigation options: key expiry can be disabled for a device, which is available for all plans, and `tailscale up --force-reauth` renews a device key (source: https://tailscale.com/docs/features/access-control/key-expiry, jev weight 0.92). These levers do not apply to the API connection itself; there is no documented way to disable expiry on an API access token, which is why rotation is the only strategy for the connection.

## Source quality notes

Strong sources: the API reference (0.93, 0.94), the auth keys doc (0.92), the key expiry doc (0.92), and the OAuth blog post (0.77). Weak results, recorded but not used: a Reddit thread on the 90-day limit at jev weight 0.05, a dnssync issue at 0.14, and a third-party docs integration page at 0.11. The tailscale.com landing page (0.63 to 0.65) and login.tailscale.com (0.75) are not content sources. The tailscale GitHub repo README (0.92) is strong but is about the codebase, not key policy, and is not cited for expiry claims.
