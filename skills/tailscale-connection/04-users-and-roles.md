# 04 - Users and roles

Scope: `GET /api/v2/tailnet/-/users`, what it returns on this connection, and how Tailscale's role model maps onto the single-owner tailnet it exposes.

## The endpoint

`GET /api/v2/tailnet/-/users` returns 200 with login identities, each carrying `role` (on this tailnet: `owner`) and `displayName` (source doc: yubi-OS/yubiOS skills/tailscale-connection/SKILL.md, verified 2026-09-24). The read is scoped under `tailnet/-/` like every other working endpoint on this connection (doc 05).

On this tailnet the users read surfaces a single owner identity, `foil-copy-overrate@github`, with displayName `OMNI-AGENT` and role `owner` (source doc, internal record as of 2026-09-24).

## The Tailscale role model

The users read is documented in the API reference (source: https://tailscale.com/docs/reference/tailscale-api, jev weight 0.93), and the role semantics behind the `role` field are documented separately: an Owner is the owner of the Tailscale account for the organization, can access all information about the account including pricing plan and billing information, and can transfer ownership (source: https://tailscale.com/docs/reference/user-roles, jev weight 0.93). The roles reference enumerates the full role set beyond owner, including admin-class roles such as IT admin, Network admin, and Auditor (source: https://tailscale.com/docs/reference/user-roles, jev weight 0.93).

The API permission model connects the two: requests to the API require an Owner, Admin, IT admin, or similar administrative role (source: https://tailscale.com/docs/reference/tailscale-api, jev weight 0.94). Because the stored credential is a user-owned API access token (doc 01), the effective API permission equals the permission of the user who minted the token; on a single-owner tailnet that means the token inherits owner-class reach for the endpoints the key is allowed to hit.

## Practical uses of the users read

- Confirming who the token acts as. The users read is the identity-side counterpart to the device list: if ownership of the tailnet ever changes, the `role: owner` entry moves and the users read shows it.
- Reading `displayName` is the fastest way to put a human label on an API-visible identity without touching the admin console.
- The general account-management surface behind roles (invite users, assign or change roles, remove users) is documented in the docs index (source: https://docs.tailscale.com/, jev weight 0.94), but on this single-owner tailnet none of those mutations have been exercised through the API.

## Drift surfaces worth watching

The Tailscale changelog is the standing record of API-visible changes and weighted 0.91 in the dig (source: https://tailscale.com/changelog). For a corpus concerned with a verified-as-of-date endpoint snapshot, the changelog plus the API reference are the two places a silent field or role change would surface first.

## Source quality notes

Strong sources: the user-roles reference (0.93), the API reference (0.93 and 0.94 across two collections), the docs index (0.94), and the changelog (0.91). One result weighted high at 0.83 but is an Auth0 documentation page for `get-user-roles`, a different product entirely; it is recorded in the archive but rejected during authoring as off-topic despite its weight, a good example of why the weight is advisory and the author still checks content. Weak results, recorded but not used: a third-party repo API reference at jev weight 0.11 and an MCP server tool listing at 0.15. The tailscale.com landing page weighted 0.66 to 0.72 is generic marketing framing.
