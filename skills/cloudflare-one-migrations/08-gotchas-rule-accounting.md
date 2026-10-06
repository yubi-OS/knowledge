# Gotchas and Rule Accounting

Scope: the cross-source gotchas the cloudflare-one-migrations skill records (export reference resolution, identity normalization, decision points, rule order and hit counts, catchall prohibition) and how they feed the rule-accounting obligation.

Grounding spine: the source doc is `yubi-OS/yubiOS skills/cloudflare-one-migrations/SKILL.md`. Claims marked "source doc" come from that file. Dig-sourced claims carry their URL and jev weight; weak claims (weight below 0.5) are labeled as such.

## Gotcha 1: references split across export files

Source exports often split references across files. Resolve IDs against object, service, and group files before declaring a rule unmappable (source doc). This is the first gotcha because it corrupts everything downstream: an unresolved reference produces a false "unmappable" verdict in the accounting table, which then either blocks the migration or (worse) silently drops a live control. The fix is procedural: resolve every rule's references against the full object inventory from the exports checklist before any mapping verdict is recorded.

## Gotcha 2: identity normalization is the gating prerequisite

Individual users, local groups, departments, and dynamic application IDs often need identity normalization. SCIM/group sync is the gating prerequisite for group selectors (source doc). Cloudflare's SCIM provisioning documentation confirms the mechanism (https://developers.cloudflare.com/cloudflare-one/team-and-resources/users/scim/, jev 0.55, corroborated in the assessment-prompts dig). The trap shape: a source rule scoped to a local group or an individual user cannot be expressed as a Cloudflare group selector until the identity layer exists, so unmigrated identity work silently turns into overly broad rules unless an enforceable alternative (user/email lists) is added explicitly.

## Gotcha 3: behaviors without exact equivalents are decision points

Zscaler caution/warn behavior, Palo Alto App-ID behavior, and TLS/decryption exceptions may not have exact equivalents. Flag them as decision points instead of forcing a 1:1 mapping (source doc). Cloudflare's TLS decryption documentation describes the target-side inspect/do-not-inspect model (https://developers.cloudflare.com/cloudflare-one/traffic-policies/http-policies/tls-decryption/, jev 0.72), and Palo Alto's decryption exclusions documentation shows the source-side concept it must map onto (https://docs.paloaltonetworks.com/network-security/decryption/administration/decryption-exclusions, jev 0.38, weak). Community-level discussions of certificate-pinned handling are anecdotal (https://community.netskope.com/steering-configuration-77/general-q-a-certificate-pinned-application-steering-e, jev 0.06, weak). The skill's stance is that the customer decides; the migration records the decision, it does not default one silently.

## Gotcha 4: rule order and hit counts are evidence

Preserve source rule order and hit counts where available. Disable or delete stale/no-hit rules only with user approval (source doc). Rule order carries enforcement intent (first-match semantics), and hit counts carry evidence about which rules are live controls versus dead weight. Third-party firewall rule cleanup guides describe the same audit discipline on the source side (https://itperfection.com/it-operations-cybersecurity-encyclopedia/firewall-rule-review-and-cleanup/, jev 0.12, weak; https://dapripro.com/firewall-rule-auditing-how-to-clean-up-and-optimize-your-ruleset/, jev 0.12, weak), but the skill's version is stricter: approval-gated retirement, evidence-preserved ordering.

## Gotcha 5: no broad catchalls

Never create broad allow-all catchalls to preserve connectivity unless explicitly requested and time-limited (source doc). This is the strongest wording in the gotchas section because the failure is attractive: during a cutover, a catchall makes connectivity work immediately and defers the security debt. The skill permits it only under two simultaneous conditions: explicit user request and a time limit.

## How the gotchas feed rule accounting

The rule-accounting obligation (workflow step 7 in the source doc) requires every source rule to end as either a mapped Cloudflare object or an explicit Not Migrated row with reason and security impact. Each gotcha is a specific way the accounting goes wrong if ignored:

- Split references produce phantom "unmappable" rows (gotcha 1).
- Missing identity sync produces rules that map in form but over-broaden in effect (gotcha 2).
- Forced 1:1 translations produce confident mappings of behavior that no longer exists (gotcha 3).
- Ignored ordering and hit counts produce an accounting table that cannot distinguish live controls from dead ones (gotcha 4).
- Catchalls produce mapped rows that understate security impact (gotcha 5).

## Validation connection

The validation gates (09-validation-gates.md) operationalize the gotchas: object count reconciliation catches reference-resolution losses, the manual-review item classes catch forced mappings, pilot validation with real users catches identity-scoping errors, and the accounting table is the artifact the whole chain produces.
