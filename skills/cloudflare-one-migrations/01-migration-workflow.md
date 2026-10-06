# Migration Workflow

Scope: the 7-step migration workflow the cloudflare-one-migrations skill prescribes, from source-stack identification through rule accounting, and how each stage is grounded in Cloudflare's own migration guidance.

Grounding spine: the source doc is `yubi-OS/yubiOS skills/cloudflare-one-migrations/SKILL.md`. Claims marked "source doc" come from that file. Dig-sourced claims carry their URL and jev weight.

## The workflow as the skill defines it

The source doc defines 7 ordered steps:

1. Identify the source stack: Zscaler ZIA, Zscaler ZPA, Palo Alto NGFW/Prisma/GlobalProtect, legacy VPN/SWG/SD-WAN, or other (source doc).
2. Request exports and logs before mapping. Prefer structured exports over screenshots or prose summaries (source doc).
3. Build an inventory: identities, groups, apps, destinations, connectors/tunnels, DNS/URL/firewall/DLP/TLS policies, objects/lists, locations/sites, exceptions, hit counts, and compliance logging (source doc).
4. Produce a mapping plan: source object, Cloudflare One target resource, confidence, prerequisites, unsupported/partial mappings, and manual decisions (source doc).
5. Create dependencies first: identity/SCIM, connectors/on-ramps, routes/DNS, lists/objects, TLS bypasses, Access apps/policies, Gateway policies, DLP/CASB, logging (source doc).
6. Stage safely: use a migration prefix, create disabled/audit-mode rules by default, pilot with small groups/sites, compare logs, then expand rollout (source doc).
7. Account for every source rule. Each rule must map to a Cloudflare object or an explicit Not Migrated row with reason and security impact (source doc).

## Why the order matters

Step 5 (dependencies first) is the load-bearing ordering decision. Cloudflare's own replace-VPN guidance structures the work the same way: establish identity, device enrollment, and connectivity targets before enforcing policy. The replace-vpn doc describes the end state as users authenticating to Access and the device agent routing traffic, which presupposes the identity and connector layers exist before policy enforcement can be turned on (https://developers.cloudflare.com/cloudflare-one/setup/replace-vpn/, jev 0.80).

The network-vpn-migration design guide makes the same point from the network side: it frames the migration as a phased move of network flows from concentrators to Zero Trust network segments, with each phase gated on the previous one being stable (https://developers.cloudflare.com/reference-architecture/design-guides/network-vpn-migration/, jev 0.77). That is the external corroboration for the skill's staging discipline in step 6.

Step 6's staging mechanics (migration prefix, disabled-by-default rules, pilot groups, log comparison, expand) are the skill's own operational recipe and have no direct external equivalent; they are a stronger, more prescriptive version of the phased-rollout idea in the design guide above (source doc, corroborated at jev 0.77).

## Step 2 in practice: structured exports over screenshots

The insistence on structured exports is not cosmetic. Screenshots and prose summaries hide missing object files, and the skill's later validation gates (object count reconciliation) depend on having machine-parseable source data. The learning-path documentation for the replace-VPN flow similarly assumes configuration-level inputs rather than verbal descriptions of the old stack (https://developers.cloudflare.com/learning-paths/replace-vpn/configure-device-agent/, jev 0.69).

## Step 7: rule accounting as the completion criterion

Step 7 is the skill's definition of done. A migration is complete not when the important rules are migrated but when every source rule has one of exactly two dispositions: a mapped Cloudflare object, or an explicit Not Migrated row carrying a reason and a security impact. This turns the migration from a best-effort port into an auditable transformation. The accounting table format is detailed in the validation-gates doc (10-validation-gates.md) in this corpus.

## Positioning within the broader migration landscape

The skill operates in the SASE/zero-trust migration space, where the general pattern is convergence of network security and access services onto a cloud-delivered edge. Third-party definitions of SASE (for example, Cisco's overview at https://www.cisco.com/site/us/en/learn/topics/security/what-is-secure-access-service-edge-sase.html, jev 0.32, weak) and Palo Alto's starter guide (https://www.paloaltonetworks.com/cyberpedia/what-is-sase, jev 0.21, weak) describe the destination category but do not cover migration mechanics; they are background, not migration sources. The authoritative mechanics come from Cloudflare's own replace-vpn and design-guide pages above.

## Failure modes the workflow prevents

- Mapping before exports exist: step 2 exists precisely because teams start mapping from memory and miss objects.
- Policy before dependencies: enabling Gateway policies before SCIM sync and connector deployment produces either broad rules (no identity available) or unreachable apps (no tunnel routes).
- Silent incompleteness: without step 7, unmapped rules simply disappear; with it, every gap is a named, owned, security-impact-annotated row.
