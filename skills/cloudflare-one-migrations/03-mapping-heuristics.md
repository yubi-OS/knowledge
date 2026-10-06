# Mapping Heuristics

Scope: the source-stack to Cloudflare One target-resource mapping patterns the cloudflare-one-migrations skill teaches: where ZIA/SWG policies go, where ZPA private access goes, how Palo Alto rules translate, and what a legacy VPN replacement looks like.

Grounding spine: the source doc is `yubi-OS/yubiOS skills/cloudflare-one-migrations/SKILL.md`. Claims marked "source doc" come from that file. Dig-sourced claims carry their URL and jev weight.

## ZIA / SWG to Gateway traffic policies

The skill maps Zscaler Internet Access and generic secure web gateway policies to Gateway traffic policies and Gateway lists (source doc). Gateway traffic policies are Cloudflare One's HTTP and network policy layer, and Gateway lists are the reusable value sets (domains, IPs, categories) that policies select on. The practical consequence: one source SWG rule becomes a target policy plus one or more list entries, so object counts grow during migration. This expansion is why the ZIA trap doc (in the source doc) counts generated lists, not just source categories.

## ZPA private app access to Access + Tunnel + DNS + policies

The skill maps Zscaler Private Access app segments to a composite of four Cloudflare resources (source doc):

- Access application types, which define who and what reaches the app (https://developers.cloudflare.com/cloudflare-one/access-controls/applications/choose-application-type/, cited in the source doc).
- Cloudflare Tunnel, which provides the connector path into the private network (https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/, cited in the source doc).
- Private network routing and DNS.
- Access policies, which encode the authorization rules.

Cloudflare's own documentation describes this decomposition directly. The private networks doc explains how Cloudflare Tunnel brings private network destinations into reach (https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/private-net/, jev 0.64), and the tunnel routing concepts doc distinguishes IP/CIDR routes from hostname routes on a tunnel (https://developers.cloudflare.com/tunnel/concepts/routing/, jev 0.66). That distinction is exactly the mapping the source doc's ZPA section teaches: app segment IP addresses and CIDRs become CIDR routes, domain names become hostname routes.

Cloudflare's blog post on routing public traffic to private origins covers the public-hostname variant of this pattern, where an Access application fronts a private origin by hostname (https://blog.cloudflare.com/private-origins-dns-routing/, jev 0.58). Cloudflare's ZTNA datasheet describes the same private-routing architecture at product level (https://www.cloudflare.com/static/ab08b3c8fb3ab17c4101896bd8a6af65/Cloudflare_Access_Datasheet_-_English.pdf, jev 0.51).

The key structural insight, stated in the source doc: ZPA app segments, server groups, and connector groups do not map 1:1. Cloudflare separates Access apps, tunnel routes, DNS, and policies, so one ZPA construct fans out into several Cloudflare objects. Plan object counts and policy reuse accordingly (reusable Access policies created before app attachment, per the source doc's ZPA traps).

## Palo Alto rules: intent over count

The skill's heuristic for Palo Alto is that one source rule can produce multiple Cloudflare resources, so preserve rule intent rather than rule count (source doc). Mapping happens only after understanding traffic direction, zones, objects, users, apps, decryption, and hit counts; zones are never flattened blindly into lists (source doc). This is expanded in the Palo Alto traps doc (07-palo-alto-traps.md).

## Legacy VPN replacement

The skill's pattern for legacy VPN replacement is Access plus the Cloudflare One Client (WARP) plus Tunnel or Mesh for app access (source doc). Cloudflare WAN is used only when site-to-site traffic is required (source doc). The distinction matters: per-user app access is a client-plus-Access problem; site-to-site networking is a network-to-network problem with a different product surface.

Cloudflare maintains two canonical references the skill points at for current patterns: the network VPN migration design guide (https://developers.cloudflare.com/reference-architecture/design-guides/network-vpn-migration/, jev 0.77 in the workflow doc's dig) and the replace-VPN setup path (https://developers.cloudflare.com/cloudflare-one/setup/replace-vpn/, jev 0.80). The skill's rule is to use those docs for current patterns rather than baking patterns into the skill text, because Cloudflare's product guidance evolves.

## Weak signals and what to ignore

Community migration threads exist, for example a Cloudflare community discussion on migrating from Zscaler and replicating ZPA configuration (https://community.cloudflare.com/t/migrate-from-zscaler-to-cloudflare-and-replicate-zpa-configuration/891546, jev 0.13, weak) and a third-party migration service page (https://www.nanosek.com/zscaler-to-cloudflare-one, jev 0.16, weak). These are anecdotes and marketing, not mapping authority. The skill's mapping heuristics rest on the source doc plus Cloudflare's own documentation; vendor-neutral aggregator content was rejected by weighting.

## How to use the heuristics

Treat the heuristics as starting positions, not verdicts. The workflow (01-migration-workflow.md) requires each source object to receive a confidence level and a mapping plan entry before any Cloudflare object is created. A heuristic that resolves cleanly becomes a confident mapping; one that hits a trap (hostname limits, egress decisions, TLS exceptions) becomes a manual decision row.
