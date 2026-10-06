# 09 - Connector selection strategy

Scope: which creation flow to use for a new Cloudflare credential row, based on the 2026-09-21 resolution of the OAuth-create defect, and what the dig record says about managed auth versus manual keys. Grounding spine: yubi-OS/yubiOS skills/custom-connection/SKILL.md (source doc).

## The resolution note

On 2026-09-21 the source doc resolved an earlier OAuth-create defect (source doc). The managed-connector row added through the standard Cloudflare connector works, unlike the four 6111 rows created through ad-hoc or OAuth flows (source doc). The resulting strategy (source doc):

1. Default to the standard connector for future Cloudflare credentials.
2. Manual api_key rows remain the fallback. The only row that ever worked before this one was a manually saved api_key (`conn_x7vt48bbDCmj`, working 2026-09-04 through 2026-09-06).

The defect itself: both September 21 "Cloudflare (steady-orbit)" rows landed with the same malformed-Authorization defect, including the one created through the OAuth flow, and all four return 400 with error 6111 (source doc; see doc 04). So the OAuth flow was not a one-off failure mode; two rows created through it on the same day both stored broken values.

## Why managed connectors are the default

A managed connector row delegates credential storage to the connector platform. Pipedream's security model stores third-party OAuth grants, API keys, and environment variables as managed secrets (https://pipedream.com/docs/privacy-and-security, jev 0.90). Pipedream's API supports two authentication methods, OAuth and user API keys (https://pipedream.com/docs/rest-api/auth, jev 0.87), and its Connect proxy fronts managed auth so requests go through a proxied surface rather than raw credentials in the caller's hands (https://pipedream.com/docs/connect/api-proxy, jev 0.84).

The operational evidence from this environment points the same way: the managed-connector row verified cleanly on creation day with `GET /accounts` returning 200 (source doc), while every ad-hoc/OAuth-created row in the table is dead.

## The fallback path and its risk

Manual api_key rows work when the key is saved correctly, which the one historical success demonstrates (source doc). But the row-creation flow has no verification gate. Connection-management guidance for custom API-key connections records that saving a custom key does not verify it works: a wrong URL or a bad key is stored without complaint, so you should test the connection when you add it and confirm what it exposes (https://docs.duvo.ai/best-practices/reliable-connections, jev 0.77). The source doc's own health-check discipline (doc 03, doc 06) is that verification step applied to every row, new or old.

## Selection decision procedure

1. New Cloudflare credential needed: create it through the standard Cloudflare connector (managed flow) (source doc).
2. Verify immediately with `GET /client/v4/accounts` through the new row; a fresh 200 is the pass condition (source doc).
3. If the standard connector is unavailable and a manual api_key row is the only path, save it, then run the same health check before trusting it (source doc, with the verification rule from https://docs.duvo.ai/best-practices/reliable-connections, jev 0.77).
4. Avoid ad-hoc or OAuth-flow row creation for this provider: both rows created that way on 2026-09-21 landed dead with 6111 (source doc).
5. Record the new row in the dead/working table with a dated line in the same session (source doc; see doc 07).

## The general principle

Prefer the creation flow that stores the credential in a proven-good format, verify at creation time, and keep the fallback documented rather than forgotten. The strategy is specific to what the environment's history proved: the managed connector row works, the manual api_key row can work, and the ad-hoc OAuth path stored malformed values twice. When the history changes (a new working row through a new flow), the resolution note pattern in doc 07 is how the strategy gets updated without rewriting what was observed.
