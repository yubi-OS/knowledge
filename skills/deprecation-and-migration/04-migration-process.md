# The Four-Step Migration Process and the Churn Rule

Scope: the skill's operational sequence for every deprecation: build the replacement, announce and document, migrate incrementally, remove the old system, plus the Churn Rule that binds the deprecating owner to the migration work (ground source: yubi-OS/yubiOS skills/deprecation-and-migration/SKILL.md, section "The Migration Process").

## Step 1: Build the replacement

The source doc forbids deprecating without a working alternative, and sets 3 acceptance criteria for the replacement: it covers all critical use cases of the old system, it has documentation and migration guides, and it is proven in production (not just "theoretically better"). The third criterion is the one teams skip: a replacement that has never carried production traffic is not a replacement, it is a hope. The deprecation-decision framework encodes this as question 3 (see 02-deprecation-decision.md): if no replacement exists, building it is part of the migration cost.

## Step 2: Announce and document

The source doc ships a deprecation-notice template with 5 fields: status with the deprecation date, replacement pointer, removal date (advisory notices carry "no hard deadline yet"), the reason for deprecation, and the migration guide. Its example notice deprecates OldService as of 2025-03-01 because it "requires manual scaling and lacks observability" while NewService handles both automatically. The migration guide in the example is concrete: replace the import, update configuration, run a verification script (`npx migrate-check`).

The external record on API deprecation matches this structure with standard headers: announce with Deprecation, set Sunset for the compulsory case, and link a migration explanation (see 03-advisory-vs-compulsory.md for the header mapping). The template's most important field is the reason: a deprecation announced without a reason invites the rationalizations cataloged in 08-rationalizations-flags.md.

## Step 3: Migrate incrementally

The source doc requires migrating consumers one at a time, never all at once, and gives a 5-step loop per consumer:

1. Identify all touchpoints with the deprecated system.
2. Update to use the replacement.
3. Verify behavior matches (tests, integration checks).
4. Remove references to the old system.
5. Confirm no regressions.

External practice supports the incremental requirement on risk grounds. Vercel's engineering blog argues almost all migrations that require migration should aim to be incremental, to minimize risk by reducing the scope of individual steps (https://vercel.com/blog/incremental-migrations, jev weight 0.47, weak backing, just under the 0.5 bar). A freecodecamp walkthrough of migrating a legacy monolith without a big-bang rewrite states the same constraint the skill's step 3 encodes: migrate a capability without intentionally changing observable behavior (https://www.freecodecamp.org/news/migrate-legacy-monolith-incrementally/, jev weight 0.26, weak backing). That phrasing is Hyrum's Law operationalized (see 01-core-principles.md): observable behavior is the real contract, so each migration step must hold it constant.

Checklist-driven migration planning is the standard tooling for step 3's touchpoint inventory: migration-plan checklists and tooling guides structure the work (https://www.kohezion.com/blog/software-migration-plan, jev weight 0.19, weak backing; https://www.projectmanagementdocs.com/template/project-documents/implementation-and-migration-plan/, jev weight 0.10, weak backing).

### The Churn Rule

The source doc's strongest cultural rule: "If you own the infrastructure being deprecated, you are responsible for migrating your users, or providing backward-compatible updates that require no migration. Don't announce deprecation and leave users to figure it out."

This rule inverts the usual incentive. The deprecating team has the context, the tooling, and the motivation to finish; the consumers have none of these. The Churn Rule assigns the migration work to the party best positioned to do it. It also explains why the skill treats "users will migrate on their own" as a rationalization (see 08-rationalizations-flags.md): they won't, and the owner who counted on it has shipped an indefinite zombie.

## Step 4: Remove the old system

Removal happens only after all consumers have migrated, and the source doc requires verifying zero active usage through metrics, logs, and dependency analysis before the code goes. Then the removal sweep: remove the code, the associated tests, documentation, and configuration, and finally the deprecation notices themselves, which "served their purpose." The source doc ends the sequence with "Celebrate, removing code is an achievement."

The verification-before-removal requirement is the step that prevents zombie code from being created by accident (see 07-zombie-code.md): a system removed while consumers still depend on it does not disappear, it becomes undocumented dependency debt. The 6-item post-deprecation verification checklist in the skill (see 08-rationalizations-flags.md) is the audit for this step.

## Connecting the steps

The 4 steps map onto the migration patterns in 05-migration-patterns.md: the strangler pattern is the vehicle for step 3 at traffic scale, the adapter pattern lets consumers stay on the old interface while the backend migrates, and feature flags are the per-consumer switch that makes incremental migration reversible. The deprecation-notice template from step 2 and the zero-usage verification of step 4 are the bookends that keep the process honest.
