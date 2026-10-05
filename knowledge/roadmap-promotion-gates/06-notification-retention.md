# Notification and retention: what is stored, where, how long, what is excluded

Scope: Specifying what owner notification or collected evidence is stored, where, for how long, and what is explicitly excluded from retention.

## The gate question

The promotion gates document (yubiOS refs, roadmap-promotion-gates, 2026-07-17) requires: "If owner notification or evidence is collected, what is stored, where, for how long, and what is explicitly excluded?" The gate prevents two opposite failures: evidence that accumulates forever with no policy, and evidence that exists but is quietly deleted or never specified, leaving claims unprovable at audit time.

## Regulatory anchors show the shape of a retention answer

The strongest sources are regulations that spell out retention in the exact form the gate asks for. US federal grant audit rules require the auditor to retain audit documentation and reports for a minimum of 3 years after the date of issuance of the auditor's report, and allow a cognizant or oversight agency or pass through entity to extend the retention period by written notification (https://www.ecfr.gov/current/title-2/subtitle-A/chapter-II/part-200/subpart-F/subject-group-ECFRea73e47c9a286e6/section-200.517, jev weight 0.81, authoritative). Note the structure: a duration, a storage subject, and an explicit mechanism for extension.

Securities regulation is equally precise: workpapers are defined as documentation of auditing or review procedures applied, evidence obtained, and conclusions reached by the accountant, with prescribed retention periods (https://www.ecfr.gov/current/title-17/chapter-II/part-210/subject-group-ECFR2f5dcb24c1c571e/section-210.2-06, jev weight 0.87, authoritative). The definition of what counts as retained evidence is itself part of the rule, which is the "what is stored" half of the gate.

NIST SP 800-53 control AU-11 covers audit record retention, and a compliance summary of it flags two recurring failures: failing to define what "audit records" means in vendor contracts, and not establishing a process for requesting vendor log data during incident investigations (https://www.compliancestack.ai/guides/audit-evidence-documentation covers related evidence standards and retention across frameworks, jev weight 0.50, weak backing; the AU-11 mapping is at https://www.upguard.com/compliance/nist-sp-800-53/au/au-11, jev weight 0.52, authoritative). The lesson for the gate: undefined scope is the default failure, so the exclusion clause must be explicit.

## Retention at scale has costs the gate should surface

Microsoft's Secure Future Initiative log retention standards describe what adopting a retention standard actually costs: significant engineering effort to update telemetry libraries and log generation across distributed services, coordination across teams to enforce adherence, investment in scalable secure infrastructure for centralized storage and long term retention, and acceptance of higher storage and compute costs (https://learn.microsoft.com/en-us/security/zero-trust/sfi/security-log-retention-standards, jev weight 0.62, authoritative).

General guides put common practice durations in view: most organizations aim to keep security and access logs at least 1 year to support compliance and incident investigations (https://unanswered.io/guide/log-retention-periods, jev weight 0.16, weak backing), with the caveat that appropriate retention depends on environment, risk, regulations, and the value of each log type (https://logstail.com/blog/how-long-should-security-logs-be-retained-a-guide-to-compliance-storage-and-security-requirements, jev weight 0.18, weak backing). Auditing itself, the activity the retained evidence supports, is defined as on site verification activity such as inspection or examination of a process or quality system (https://asq.org/quality-resources/auditing, jev weight 0.80, authoritative).

## Authoring guidance

A complete notification/retention answer has 4 fields:

1. What: the specific notification content or evidence classes stored.
2. Where: the storage location or system.
3. How long: the retention duration, with the authority for extending or shortening it.
4. Excluded: what is explicitly not stored, stated so its absence is a decision rather than an accident.

If the item generates evidence but the exclusion field is empty, that is a red flag: either the author has not decided what not to keep, or the item is collecting more than anyone reviewed.

## Mapping to the source doc

Within the gates framework, this field usually binds to the evidence target field. The evidence target names the artifact that will prove the claim; this field governs its lifecycle afterward. An evidence target with no retention answer produces proof that evaporates; a retention answer with no evidence target produces an archive nobody can use to check anything.
