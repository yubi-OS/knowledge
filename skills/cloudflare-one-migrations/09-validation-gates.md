# Validation Gates

Scope: the 6 validation gates the cloudflare-one-migrations skill requires after each migration stage: object count reconciliation, manual review item classes, pilot group validation, TLS/Do Not Inspect testing, rollback paths, and the final source-rule accounting table.

Grounding spine: the source doc is `yubi-OS/yubiOS skills/cloudflare-one-migrations/SKILL.md`. Claims marked "source doc" come from that file. Dig-sourced claims carry their URL and jev weight; weak claims (weight below 0.5) are labeled as such.

## Gate 1: object count reconciliation

After each migration stage, compare Cloudflare object counts against parsed source counts. Stop on mismatches (source doc). This gate catches the silent-drop failure mode: a rule whose object references failed to resolve, or a category that generated more target lists than expected, shows up as a count delta. The comparison must run against parsed source counts (from the structured exports of 02-source-exports.md), not against remembered totals.

## Gate 2: manual review item classes

Review every `unsupported`, `partial`, `unmapped`, `needs_identity`, `needs_posture`, and `manual_review` item before enabling policies (source doc). The six classes form a checklist: the first three come from mapping verdicts, the last three come from readiness gaps (identity sync, posture integrations, human decisions). Nothing in any of these classes may be live in production when the gate fires.

## Gate 3: pilot validation with real users

Validate group matching with real pilot users after SCIM sync and re-authentication (source doc). Cloudflare's SCIM provisioning is the identity sync mechanism (https://developers.cloudflare.com/cloudflare-one/team-and-resources/users/scim/, jev 0.55). The gate is explicit about re-authentication because identity claims can be cached; a pilot user who has not re-authenticated may be evaluated against stale group membership, making the policy test meaningless.

## Gate 4: TLS and Do Not Inspect testing

Test TLS inspection and Do Not Inspect behavior before enabling HTTP/DLP blocks broadly (source doc). The target-side mechanism is documented in Cloudflare's TLS decryption docs, which describe how Gateway performs TLS inspection and how Do Not Inspect exclusions are expressed (https://developers.cloudflare.com/cloudflare-one/traffic-policies/http-policies/tls-decryption/, jev 0.69 for the validation-gates dig; the same page scored 0.72 in the gotchas dig). Cloudflare's learning path on TLS inspection walks the configuration and testing flow (https://developers.cloudflare.com/learning-paths/secure-internet-traffic/build-http-policies/tls-inspection/, jev 0.49, weak). A community thread confirms the Do Not Inspect setting as an operational concern (https://community.cloudflare.com/t/do-not-inspect-setting/494526, jev 0.09, weak; anecdotal only).

## Gate 5: rollback paths

Keep rollback paths explicit: disable migrated rules by prefix, restore source routing, or revert the pilot group/site (source doc). The migration prefix required by workflow step 6 (all migrated objects carry a common name prefix) is what makes prefix-scoped rollback possible. Rollback has three distinct scopes: policy-level (disable by prefix), routing-level (restore source routing), and population-level (revert the pilot group/site).

## Gate 6: the source-rule accounting table

Before declaring done, produce a source-rule accounting table with, for each source rule: migrated object, partial mapping, not migrated reason, security impact, and owner for each manual action (source doc). This is the completion artifact. It is also the audit trail that connects the migration to its evidence: every Not Migrated decision names the reason and the security impact it accepts, and every manual action names an owner.

## Why the gates are stage-scoped

All gates run "after each migration stage" (source doc), not once at the end. This matches the staging discipline of workflow step 6: pilot, compare logs, expand. A mismatch caught after the pilot group is a revert of one group; the same mismatch caught after an enterprise-wide rollout is an incident. The phased-rollout framing in third-party material echoes this (https://ashishsrivastav.com/blog/phased-zero-trust-rollout-plan, jev 0.20, weak), but the skill's stage-scoped gates are stricter and more mechanical than general rollout advice.

## Gate failure behavior

The skill defines stopping behavior only for gate 1 (stop on mismatches) and pre-enablement blocking for gate 2 (review before enabling). The other gates are conditional prerequisites: gate 3 blocks identity-scoped enablement, gate 4 blocks broad HTTP/DLP enablement, gate 5 must exist before any enablement, gate 6 must exist before "done" is declared. Read together, the gates define the only path to enablement: counts reconcile, review items cleared, pilot validated, TLS tested, rollback explicit, accounting table produced.
