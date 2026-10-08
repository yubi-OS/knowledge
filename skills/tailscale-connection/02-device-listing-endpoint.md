# 02 - Device listing endpoint

Scope: `GET /api/v2/tailnet/-/devices`, the main surface of the connection, its response shape, and the field-level facts worth reading off a device object.

## The endpoint

`GET https://api.tailscale.com/api/v2/tailnet/-/devices` returns 200 with a body of the form `{"devices":[...]}`, one entry per device (source doc: yubi-OS/yubiOS skills/tailscale-connection/SKILL.md, verified 2026-09-24). This is the first call to make in any new session against the connection: it is a cheap read, it confirms the credential works end to end, and it returns the fleet inventory every other operation depends on.

The endpoint is documented in the interactive API documentation (source: https://tailscale.com/api-docs, jev weight 0.92) and in the API reference overview (source: https://tailscale.com/docs/reference/tailscale-api, jev weight 0.93), which notes that API use requires an Owner, Admin, IT admin, or similar administrative role on the tailnet. The docs index carries the reference guides for the API surface (source: https://docs.tailscale.com/, jev weight 0.94).

## Device object fields

The device entries carry these fields per the source doc: `name` (full DNS name such as `rock1.tail3a04f5.ts.net`), `addresses` (both the v4 and v6 Tailscale IPs), `os`, `clientVersion`, `created`, `lastSeen`, `connectedToControl`, `authorized`, `expires` (node-key expiry), `keyExpiryDisabled`, `updateAvailable`, `blocksIncomingConnections`, and `tailnetLockError`.

Reading habits that pay off (source doc):

- `connectedToControl` distinguishes a device that is truly online from one that is merely authorized.
- `expires` is the node-key expiry, not the API key expiry; the two live on different clocks and are covered in docs 07 and 08.
- `blocksIncomingConnections` and `tailnetLockError` are the fields to glance at when connectivity problems are intermittent rather than total.
- `updateAvailable` and `clientVersion` together answer whether a device is behind on its Tailscale client.

## Field-level drift to know about

A Tailscale status incident dated Oct 10, 2025 recorded that a change to the `lastSeen` field was causing unexpected negative impact to some workloads, with mitigation under investigation (source: https://status.tailscale.com/incidents/01K76ZVEFT538NWXK0XJFKT2HD, jev weight 0.84). Treat `lastSeen` as a field whose semantics and reliability have shifted in the 2025-2026 window: do not build hard automation decisions on `lastSeen` alone; prefer `connectedToControl` for liveness. This is a dated correction to the source doc's field list, which simply includes the field without characterizing its reliability.

## What the device list is used for in this workspace

The two known devices are `rock1.tail3a04f5.ts.net` (100.100.90.103) and `ubuntu.tail3a04f5.ts.net` (100.123.151.62); the full inventory facts are internal-record material covered in doc 08 (source doc). The device list read is also the natural place to detect new or unexpected devices joining the tailnet, and the `expires` field read here is the early warning for the node-key expiry failure mode described in doc 08.

## Source quality notes

Strong sources for this subtopic are the Tailscale API reference (0.93), the docs index (0.94), the interactive API docs (0.92), and the first-party status incident page (0.84). Weak results, recorded but not used: a StackOverflow answer at jev weight 0.09, a scripts reference page at 0.48 (weak backing, treat as anecdotal), a homepage widget doc at 0.10, and a third-party repo API reference at 0.11. The tailscale.com landing page weighted 0.63 appears repeatedly across queries and is not a content source for endpoint claims.
