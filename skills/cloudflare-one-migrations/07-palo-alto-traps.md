# Palo Alto / Prisma / NGFW Traps

Scope: the source-specific mapping traps the cloudflare-one-migrations skill flags for Palo Alto NGFW, Prisma Access, and Prisma Remote Networks, and the dig corroboration for the target-side mechanisms involved.

Grounding spine: the source doc is `yubi-OS/yubiOS skills/cloudflare-one-migrations/SKILL.md`. Claims marked "source doc" come from that file. Dig-sourced claims carry their URL and jev weight; weak claims (weight below 0.5) are labeled as such.

## Trap 1: one rule, many resources

One Palo Alto rule can produce multiple Cloudflare resources. The skill says to preserve rule intent, not rule count (source doc). A single security rule that matches zone pair, application, user, service, and decryption state decomposes into separate Gateway network policy selectors, HTTP policy selectors, device posture requirements, and possibly a Do Not Inspect exception. Counting rules 1:1 is therefore the wrong progress metric; the accounting table (per rule) is the right one.

## Trap 2: partial mappings from App-ID, URL categories, zones, HIP, schedules, decryption

App-ID, URL category, zone, HIP, schedule, and decryption behavior rarely translate exactly. The skill says to mark partial mappings rather than forcing false equivalence (source doc). Concretely:

- App-ID's application-level granularity has no direct Cloudflare selector; the closest target surfaces are Gateway network selectors and DNS/HTTP categories, which are coarser.
- Zones are topology constructs; the target expresses the same intent through network selectors and routes, and the skill's guideline is explicit: do not flatten zones blindly into lists (source doc, guidelines 1 and 2).
- HIP profiles map to Cloudflare device posture checks, which require the integrations to exist before enforcement (source doc). Cloudflare's posture checks documentation is the target-side reference (https://developers.cloudflare.com/cloudflare-one/reusable-components/posture-checks/, jev 0.65, corroborated in the assessment-prompts dig).

## Trap 3: missing object exports cause silent drops

Export address/service objects and groups with rules. Missing object exports cause silent-looking drops unless explicitly detected (source doc). A rule whose address object reference cannot be resolved looks like it migrated (the rule row exists) but its scope silently changed. This is why the exports checklist (02-source-exports.md) includes address/service objects and groups as first-class export targets, and why the gotchas doc requires resolving IDs against object, service, and group files before declaring a rule unmappable.

## Trap 4: broad rules and catchalls

Broad `any` destination/service rules and very broad CIDRs require manual review. The skill forbids auto-creating broad catchalls (source doc, guidelines 2). A Palo Alto catchall often encodes decades of implicit allow behavior; porting it as a catchall into Cloudflare One reproduces the blast radius without the compensating controls the source stack had elsewhere. The trap is that the rule migrates cleanly in form while being materially more permissive in effect.

## Trap 5: decryption behavior

Decryption rules and their exceptions rarely map exactly (source doc, gotchas). Cloudflare's TLS decryption documentation describes the target's inspect/do-not-inspect model (https://developers.cloudflare.com/cloudflare-one/traffic-policies/http-policies/tls-decryption/, jev 0.72), and Palo Alto's own documentation covers decryption exclusions as a distinct source-side concept (https://docs.paloaltonetworks.com/network-security/decryption/administration/decryption-exclusions, jev 0.38, weak). The gap between the two models is a decision point, not a silent translation; the validation gates require TLS and Do Not Inspect testing before broad HTTP/DLP enablement.

## Trap 6: Prisma Access scope

The source doc's export checklist includes Prisma Access remote network/service connection config (source doc). The migration-design-guide perspective applies here too: Cloudflare's network VPN migration design guide frames VPN concentrator replacement in terms of network flows and segmentation (https://developers.cloudflare.com/reference-architecture/design-guides/network-vpn-migration/, jev 0.76), and Cloudflare's VPN-to-Access migration blog walks the access-side pattern (https://blog.cloudflare.com/migrating-from-vpn-to-access/, jev 0.71). These are the two strong dig sources for this doc; both are Cloudflare primary sources.

## Weak signals to disregard

The dig for this subtopic surfaced several skill-aggregator pages mirroring the cloudflare-one-migrations skill itself (for example https://gist.github.com/helzkelz/22f6f2c2a987f06a5ece8f71d9afd516, jev 0.12, weak; https://skillsmp.com/creators/cloudflare/skills/skills-cloudflare-one-migrations, jev 0.09, weak) and Prisma ORM documentation that is unrelated to Prisma Access (https://www.prisma.io/, jev 0.05, weak, name collision only). None of these are migration sources; they are excluded from all claims in this doc.

## Summary of the trap logic

The Palo Alto traps share one root cause: the source model is rich (zones, App-ID, HIP, decryption) while the target model decomposes intent into different primitives. The skill's response is uniform: preserve intent, mark partial mappings, never auto-create breadth, and require the object exports and posture integrations before any enforcement is enabled.
