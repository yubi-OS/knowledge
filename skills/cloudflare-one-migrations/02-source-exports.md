# Exports To Ask For

Scope: the per-source export checklist the cloudflare-one-migrations skill prescribes (Zscaler ZIA, Zscaler ZPA, Palo Alto/Prisma) and where each export lives in the source vendor's own tooling.

Grounding spine: the source doc is `yubi-OS/yubiOS skills/cloudflare-one-migrations/SKILL.md`. Claims marked "source doc" come from that file. Dig-sourced claims carry their URL and jev weight; weak claims (weight below 0.5) are labeled as such.

## The checklists

### Zscaler ZIA

The source doc lists: URL filtering, firewall filtering, SSL inspection, DLP, custom URL categories, IP groups, network services/service groups, users/groups/departments, locations, GRE tunnels, and static IPs.

Zscaler's own Policy Export help page documents exporting policy configurations (https://help.zscaler.com/zia/policy-export, jev 0.52), and the ZIA API documentation covers API access to these configuration objects (https://help.zscaler.com/zia/zscaler-api, jev 0.42, weak). Community-level API cheat sheets exist but are unofficial (https://www.sudojoie.com/vault/zia-api-cheat-sheet, jev 0.09, weak); treat them as navigation aids only.

### Zscaler ZPA

The source doc lists: app segments, segment groups, server groups, app connectors/connector groups, access policies, IdP/group mapping, private DNS domains, ports, and protocols.

Zscaler documents the access policies API (https://help.zscaler.com/zpa/configuring-access-policies-using-api, jev 0.32, weak) and the application segments API (https://help.zscaler.com/zpa/configuring-application-segments-using-api, jev 0.27, weak). These confirm the export targets exist in ZPA's own tooling even where the dig did not return strong primary pages for every object.

### Palo Alto / Prisma

The source doc lists: security/NAT/decryption rules, address/service objects and groups, URL categories, HIP profiles, GlobalProtect config, Prisma Access remote network/service connection config, zones, tags, logs, and hit counts.

## Why structured exports beat screenshots

The source doc's workflow step 2 says to prefer structured exports over screenshots or prose summaries. The reason is concrete: the skill's rule-accounting and validation stages count objects. A screenshot cannot be diffed against the migrated object set; a JSON or CSV export can. The Zscaler policy export page above is the canonical structured path for ZIA.

## The reference-resolution hazard

The source doc's gotchas section warns that source exports often split references across files: a rule may reference an address object, a service object, and a custom URL category, each defined in a different export file. Resolve IDs against the object, service, and group files before declaring a rule unmappable. This is why the checklist asks for objects and groups alongside the rules themselves: an export of rules without the referenced objects produces false "unmappable" verdicts.

## Hit counts and logs

The ZIA and Palo Alto checklists both include hit counts (source doc). Hit counts drive three migration decisions the skill cares about: identifying stale/no-hit rules that may be dropped with user approval, prioritizing high-hit rules for careful mapping, and preserving rule order where it carries intent. The Palo Alto checklist also includes logs, which feed the log-comparison step of staged rollout.

## Locations, tunnels, and static IPs

ZIA locations with IPs, GRE tunnels, and static IPs are export targets because they carry two different kinds of migration value: locations with IPs serve as source IP lists for policy conditions, while the GRE tunnel transport itself is a separate WARP Connector or Cloudflare WAN workstream (source doc, expanded in the ZIA traps material of the source doc). Do not conflate the two: the export informs policy; the transport migration is its own project.

## Weak-backing summary

Most ZPA export targets in this doc are corroborated only by weak-weight vendor help pages (0.27 to 0.42). The object lists themselves come from the source doc, which is the primary source of record; the dig confirms the export surfaces exist but does not independently verify each object name. Where a claim rests on the source doc alone, it is marked as such.
