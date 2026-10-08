# 03 - DNS preferences and MagicDNS

Scope: the two DNS read endpoints on the connection, what each returns, and how MagicDNS behaves when it is enabled.

## The endpoints

Two DNS reads are verified working on this connection (source doc: yubi-OS/yubiOS skills/tailscale-connection/SKILL.md, verified 2026-09-24):

- `GET /api/v2/tailnet/-/dns/preferences` returns 200 with `{"magicDNS":true|false}`. This is the single-flag read that answers whether MagicDNS is on for the tailnet.
- `GET /api/v2/tailnet/-/dns/nameservers` returns 200 with `{"dns":[...]}`. This lists the tailnet's configured nameservers.

Both are scoped under `tailnet/-/` (doc 05 explains why the scoping is mandatory). The interactive API documentation covers the DNS endpoints (source: http://api.tailscale.com/, jev weight 0.92).

## MagicDNS behavior

Tailscale's MagicDNS documentation states that MagicDNS automatically registers DNS names for devices in your network and is available for all plans; with MagicDNS on, a device called `my-server` can be reached by name instead of its Tailscale IP (source: https://tailscale.com/docs/features/magicdns, jev weight 0.93). The DNS-in-Tailscale reference adds the setting-level view: the MagicDNS setting determines whether your tailnet uses MagicDNS to automatically assign DNS names to devices, and MagicDNS is optional and not required to use other DNS settings (source: https://tailscale.com/docs/reference/dns-in-tailscale, jev weight 0.95).

The same reference describes the wider DNS configuration surface that the nameservers read sits inside: by default, tailnet devices use their local DNS settings for all queries, and an Override DNS servers toggle forces clients to always use the nameservers you define; search domains and public DNS record handling sit alongside (source: https://tailscale.com/docs/reference/dns-in-tailscale, jev weight 0.95).

## What this tailnet runs

On this tailnet, MagicDNS is on and there are no custom nameservers configured (source doc, internal record from the 2026-09-24 verification). Two operational consequences follow:

1. Device names like `rock1.tail3a04f5.ts.net` and `ubuntu.tail3a04f5.ts.net` resolve by MagicDNS registration, which is why the shell-bridge connections can be keyed on those hostnames.
2. With the nameservers list empty, any DNS behavior change on the tailnet side would come from a change in the `dns/preferences` or `dns/nameservers` reads, so a periodic check of both endpoints is the cheap drift detector.

## When the reads disagree with the docs

The dig surfaced no conflict between the verified endpoint shapes and current Tailscale documentation. The API docs remain the arbiter for request and response shapes (source: https://tailscale.com/docs/reference/tailscale-api, jev weight 0.93). If a future read returns a shape that no longer matches `{"magicDNS":...}` or `{"dns":[...]}`, treat it as drift, re-read the API reference for the current schema, and record the change as a dated correction in this corpus.

## Source quality notes

Strong sources: the DNS-in-Tailscale reference (0.95, twice collected), the MagicDNS feature doc (0.93), the API reference (0.93), and the docs index (0.94). The Kubernetes operator page on API server access over Tailscale weighted 0.92 and is a real example of MagicDNS names in service URLs, but it is off the focal path for this connection and is cited only as corroboration that MagicDNS names are meant to be used as stable endpoints. Weak results, recorded but not used as evidence: a deepwiki mirror at jev weight 0.15, a community Terraform resource dump at 0.20, and a personal blog note on Tailscale plus NextDNS custom domains at 0.18. The tailscale.com landing page weighted 0.68 to 0.71 is generic.
