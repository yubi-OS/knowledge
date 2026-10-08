# 07 Rollback Strategy

Scope: the rollback plan document: trigger conditions, rollback steps, database considerations, and time-to-rollback targets.

## Every deployment needs a plan first

The source doc's opening rule is that every deployment needs a rollback plan before it happens (source doc, Rollback Strategy). The plan is a concrete document template (source doc), not a paragraph in a launch email. Its sections are fixed: trigger conditions, rollback steps, database considerations, and time to rollback.

The trigger conditions section restates the threshold numbers as plan parameters: error rate greater than 2x baseline, P95 latency over a number to be filled in, and user reports of a specific issue (source doc). Making them template fields forces the launch owner to instantiate the thresholds doc in this corpus for the specific release before the launch, while there is still time to instrument the missing baseline.

## The 2 rollback paths

The template gives 2 paths (source doc): disable the feature flag if applicable, which is the fast path, or deploy the previous version via git revert and push, which is the slow path. After either path, the plan requires the same 2 verification steps as the post-launch checklist: verify the rollback with a health check and error monitoring, then communicate by notifying the team of the rollback (source doc).

The 2 paths have different blast radii and different clocks. The source doc's time-to-rollback section quantifies this (source doc): a feature flag rollback completes in under 1 minute, redeploying the previous version in under 5 minutes, and a database rollback in under 15 minutes. The ordering is also the priority ordering: if a flag exists, flag off is always the first response, because it is 5 times faster than a redeploy and leaves the deployed code intact for diagnosis.

## Database considerations

The template's database section names 2 things that must be decided in advance (source doc): whether the migration has a rollback (the example shows a Prisma rollback command) and what happens to data inserted by the new feature: preserved or cleaned up.

The expand and contract pattern is the established mechanism for making schema changes rollback-safe in production: Prisma's data migration guide documents making changes to a production database schema while ensuring data consistency by splitting the change into backward-compatible stages (https://www.prisma.io/docs/guides/data-migration, jev 0.88). Under this pattern, a migration is never the thing you roll back; you roll back the code while the schema stays compatible in both directions, and contract the schema only after the old code path is gone. This is the strong-source backing for the source doc's "Migration [X] has a rollback" template line: the honest version of a database rollback is often "the schema was built so no rollback is needed".

Weak-backing context: a rollback-plan best-practices piece from CTOx (https://ctox.com/best-practices-for-rollback-plan-in-secure-deployments/, jev 0.17, weak backing), an expand/contract walkthrough from Reliable Penguin (https://blogs.reliablepenguin.com/2025/11/16/database-migrations-without-drama-expand-contract-in-practice, jev 0.19, weak backing), and a deployment rollback guide from OpenStatus (https://www.openstatus.dev/guides/deployment-rollback, jev 0.19, weak backing) cover the same territory as corroboration. SQLServerCentral's guidance to develop and test your rollback plan before you need it (https://www.sqlservercentral.com/blogs/develop-and-test-your-rollback-plan, jev 0.24, weak backing) matches the source doc's "dry run if possible" line in the post-launch verification routine.

## Runbook shape

Weak-backing context: SolarWinds' runbook automation guide treats rollback procedures as runbooks that should be executable under pressure (https://www.solarwinds.com/sre-best-practices/runbook-automation, jev 0.24, weak backing). The source doc's template is already runbook-shaped: numbered steps, verification after each path, and a communication step that prevents the silent-rollback antipattern where the team discovers the rollback from the dashboards.

The red flags list closes the loop: "Deploying without a rollback plan" is the first red flag in the source doc (source doc). A launch without the plan filled in is not a faster launch; it is an unrecoverable launch with better optics.
