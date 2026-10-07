# 06 - Feature flags need their own lifecycle

Scope: the per-flag lifecycle record (purpose, owner, temporary versus permanent classification, expiry, environments, code references, removal PR, archive date), LaunchDarkly's flag lifecycle statuses, and OpenFeature's provider-event observability.

Grounding spine: the source doc `yubi-OS/yubiOS skills/nss-lifecycle/SKILL.md`, standard 5, guideline 8, the Anti-patterns list, and Example 6.

## The "done" test

A flag is not done when the feature reaches 100%; it is done when the temporary decision mechanism has been removed or deliberately converted into a permanent control (source doc). Guideline 8 states the terminal condition: the feature-flag lifecycle ends at removed or archived, not "Live forever" (source doc). The matching anti-pattern: a feature flag that never reaches removed is flag debt, because the flag's job is the decision mechanism, not the feature (source doc). The red-flags table quantifies the failure: a flag that is Live for more than 12 months with no expiry date means flag debt is accumulating (source doc).

## The per-flag record

Per-flag coverage should include: purpose, owner, temporary/permanent classification, creation date, intended expiry, environments, variations, prerequisites, rollout state, code references, removal PR, archive date, and fallback behavior (source doc). The source doc's Example 6 shows the YAML shape for a deprecated temporary flag: flag_key yubios.experimental.vgpu-passthrough, stage deprecated, introduced_in 1.2.0, deprecated_in 1.5.0, a deprecation block with reason (superseded by ADR-031 hardware-enforced IOMMU gate), replacement (ADR-031 trust boundary, no flag needed), removal_in_version 2.0.0, sunset_at 2027-02-12, code_references pointing at the systemd unit and the CI test script, removal_pr null (pending after Stage 1 GA), archive_date null (set when the removal PR merges), and environments [dev, ci], explicitly not in production (source doc).

## External anchor: LaunchDarkly statuses

LaunchDarkly distinguishes Live, Ready for code removal, Ready to archive, Deprecated, Archived, and Deleted, with environment-specific status and safeguards around prerequisites and code references (source doc). The digs confirm the operational surface:

- The flags list can display whether a flag is "Ready for code removal" or "Ready to archive", and the indicator can be clicked to remove the flag from code or archive it (https://launchdarkly.com/docs/home/flags/flag-status, jev 0.63).
- Flag lifecycle settings let teams customize the criteria LaunchDarkly uses to determine when flags are ready to be archived; archiving is described as good practice to clean up flags no longer needed, and custom lifecycle settings apply only to critical environments (https://launchdarkly.com/docs/home/flags/flag-lifecycle-settings, jev 0.71).
- The technical-debt guide lists the stages Ready for code removal, Ready to archive, and Archived, and notes that configs, unlike flags, do not have code references, flag lifecycle stages, or a flag health metric (https://launchdarkly.com/docs/guides/flags/technical-debt, jev 0.60).

This is exactly the yubiOS mapping: the removal_pr and archive_date fields in Example 6 are the local version of "Ready for code removal" and "Ready to archive" statuses.

## External anchor: OpenFeature provider events

OpenFeature reinforces that provider state transitions should be observable events rather than silently inferred state (source doc). The OpenFeature specification confirms the mechanism: the feature provider interface must define a mechanism for signaling the occurrence of one of a set of events, including PROVIDER_READY, PROVIDER_ERROR, PROVIDER_CONFIGURATION_CHANGED, PROVIDER_STALE, PROVIDER_RECONCILING, and PROVIDER_CONTEXT_CHANGED, with a provider event details payload (https://openfeature.dev/specification/sections/events/, jev 0.49, weak weight, label accordingly). The specification also requires SDK implementations to provide an in-memory provider intended for testing (https://openfeature.dev/specification/appendix-a/, jev 0.54).

Weak-weight note: the OpenFeature events citation sits at 0.49, just under the 0.5 authoritative line, so the provider-event claim should be read as source-doc supported with dig corroboration at weak weight.

## What the Lifecycle block must not do

The Lifecycle block must not let a flag stage linger outside the fixed vocabulary, must not omit expiry for a temporary flag, and must not treat "feature shipped" as the flag's terminal state (source doc). Environments matter as much as stage: Example 6 scopes the flag to [dev, ci] and marks production exclusion explicitly (source doc).

## Sources

- Source doc: `yubi-OS/yubiOS skills/nss-lifecycle/SKILL.md`, standard 5, guideline 8, Anti-patterns (feature flag that never reaches removed), Red flags (Live more than 12 months with no expiry), Example 6.
- https://launchdarkly.com/docs/home/flags/flag-lifecycle-settings (jev 0.71)
- https://launchdarkly.com/docs/home/flags/flag-status (jev 0.63)
- https://launchdarkly.com/docs/guides/flags/technical-debt (jev 0.60)
- https://openfeature.dev/specification/appendix-a/ (jev 0.54)
- https://openfeature.dev/specification/sections/events/ (jev 0.49, weak)
