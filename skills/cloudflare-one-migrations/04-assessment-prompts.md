# Migration Assessment Prompts

Scope: the 7 readiness dimensions the cloudflare-one-migrations skill uses to assess a migration: source coverage, rule volume and hit data, object dependencies, identity readiness, TLS/DLP readiness, connectivity readiness, and rollout readiness.

Grounding spine: the source doc is `yubi-OS/yubiOS skills/cloudflare-one-migrations/SKILL.md`. Claims marked "source doc" come from that file. Dig-sourced claims carry their URL and jev weight.

## Source coverage

Which products are in scope, which exports are available, and whether screenshots or prose summaries are hiding missing object files (source doc). This is the first gate: an assessment built on incomplete exports produces a false mapping plan. The exports checklist (02-source-exports.md) defines what "complete" means per source stack.

## Rule volume and hit data

Counts by rule type, disabled/stale rules, no-hit rules, high-hit rules, and business-critical exceptions (source doc). The purpose is triage: stale and no-hit rules are candidates for retirement (with user approval, per the source doc's gotchas), high-hit rules deserve careful mapping, and business-critical exceptions deserve explicit pilot attention.

## Object dependencies

Address objects, service objects, groups, custom categories, network services, app IDs, zones, tags, connectors, and server groups (source doc). The skill resolves rule references against these object exports before declaring anything unmappable, so the dependency inventory is what makes the accounting table trustworthy.

## Identity readiness

IdP, SCIM/group sync, group-name normalization, individual-user rules, local groups, service accounts, and contractor identities (source doc). SCIM is the gating prerequisite for group selectors: Cloudflare's SCIM provisioning documentation describes syncing user and group membership from the identity provider into Cloudflare One (https://developers.cloudflare.com/cloudflare-one/team-and-resources/users/scim/, jev 0.55). Until that sync is live and verified, identity-scoped rules cannot be expressed faithfully, which is why the source doc's ZIA traps make an enforceable identity alternative (user/email lists) a documented fallback.

## TLS/DLP readiness

Source decryption rules, certificate-pinned bypasses, DLP engines/profiles, custom regex, exact-match data, and payload logging expectations (source doc). Two external anchors:

- Cloudflare's egress and traffic-policy documentation shows where HTTP-level policy (including TLS handling) lives in the target (https://developers.cloudflare.com/cloudflare-one/traffic-policies/egress-policies/, jev 0.81).
- The TLS decryption documentation describes how Cloudflare Gateway performs TLS inspection and how Do Not Inspect handling works (https://developers.cloudflare.com/cloudflare-one/traffic-policies/http-policies/tls-decryption/, jev 0.72).

The assessment question is whether each source decryption rule and certificate-pinned bypass has a target expression: inspect, do not inspect, or explicit decision. Certificate-pinned application handling has no automatic translation (source doc; the Zscaler/SWG trap material treats caution/warn behavior the same way).

## Connectivity readiness

Source tunnels/connectors, private DNS, split tunnel or bypass behavior, source IP preservation, egress IP allowlists, and site-to-site requirements (source doc). The strongest dig corroboration in the whole corpus is here:

- Cloudflare's egress policies overview defines the egress control model (https://developers.cloudflare.com/cloudflare-one/traffic-policies/egress-policies/, jev 0.81).
- Egress through Cloudflare Tunnel documents egressing private-app traffic via tunnel (https://developers.cloudflare.com/cloudflare-one/traffic-policies/egress-policies/egress-cloudflared/, jev 0.83).
- Cloudflare's blog announces dedicated egress IPs and egress policies as the mechanism for controlling source IP presentation (https://blog.cloudflare.com/gateway-dedicated-egress-policies/, jev 0.67; https://blog.cloudflare.com/gateway-egress-policies/, jev 0.66).
- Device posture checks are the enforcement prerequisite for HIP-style device compliance rules (https://developers.cloudflare.com/cloudflare-one/reusable-components/posture-checks/, jev 0.65).

Each of these maps to a specific assessment prompt: source IP preservation and egress allowlists resolve against the egress policy docs; HIP-equivalent device checks resolve against posture checks; split-tunnel bypass behavior resolves against the WARP split tunnel configuration (cited in the source doc).

## Rollout readiness

Pilot groups/sites, parallel-run period, rollback owner, source-stack decommission criteria, and monitoring/log comparison plan (source doc). These five items are the assessment's exit checklist: a migration without a named rollback owner or a decommission criterion is not rollout-ready regardless of how complete the mapping plan is.

## How the prompts are used

The assessment prompts are the intake questionnaire for the assessment template (10-assessment-template.md). Each prompt's answer feeds a template section: source coverage feeds "Artifacts reviewed" and "Assumptions / missing exports"; object dependencies and rule volume feed "Mapping summary"; TLS/DLP and connectivity gaps feed "Risks / partial mappings"; identity and posture gaps feed "Not migrated"; the rollout readiness items feed "Pilot plan", "Validation", and "Rollback".

## Weak signals

Third-party readiness checklists exist but scored low (https://www.nanosek.com/resources/cloudflare-zero-trust-readiness-checklist, jev 0.11, weak). The skill's readiness dimensions are its own and are anchored to the source doc; dig sources corroborate the target-side mechanisms, not the assessment structure itself.
