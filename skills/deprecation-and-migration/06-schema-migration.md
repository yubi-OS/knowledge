# Zero-Downtime Database Schema Migration: Expand and Contract

Scope: the production schema-migration discipline the skill's frontmatter names ("migrating a database schema in production, such as renaming or dropping a column without downtime"), expressed through the industry's expand/contract (parallel change) pattern (ground source: yubi-OS/yubiOS skills/deprecation-and-migration/SKILL.md frontmatter description).

## The problem the pattern solves

The source doc's description names the scenario without detailing the mechanism: renaming or dropping a column without downtime. The dig record fills this in. A naive schema change locks tables in production; one write-up describes the failure shape precisely: a migration locks a table for 30 seconds, the API times out, and the on-call engineer gets paged (https://www.mefjudev.com/blog/database-migrations-zero-downtime, jev weight 0.23, weak backing).

The fix the industry converged on is the expand-contract pattern, also called parallel change: replace one breaking schema change with a sequence of backward-compatible steps. One walkthrough defines the sequence as a contract between schema, application code, and deployment cadence, "usually expressed as expand, migrate data, contract" (https://matheuspalma.com/blog/zero-downtime-database-migrations-expand-contract-pattern, jev weight 0.32, weak backing). Another describes it as replacing one breaking schema change with backward-compatible steps, expanding the schema first (https://www.aegontech.dev/blog/zero-downtime-database-migrations-expand-contract-pattern-2026, jev weight 0.27, weak backing). A parallel-change writeup adds that the schema change must stay backward compatible with the currently deployed application version at every step (https://drcodes.com/posts/zero-downtime-database-migrations-master-the-expand-contract-pattern, jev weight 0.24, weak backing).

## The three phases

1. **Expand**: add the new shape alongside the old (new column, new table, new index) without changing or removing anything consumers use. The schema now serves both the old and the new application versions.
2. **Migrate data**: backfill the new shape from the old, usually in batches, while both paths remain live. Dual-write or shadow-write schemes keep the new shape current during the transition; shadow columns and online index builds are the standard supporting techniques (https://mdsanwarhossain.me/blog-zero-downtime-database-migration-flyway-liquibase.html, jev weight 0.21, weak backing).
3. **Contract**: after every reader and writer has switched to the new shape, remove the old shape. This is the deprecation step: the old column is deprecated, consumers are migrated, and the column is dropped only when zero active usage remains.

The contract phase is exactly the skill's migration process (see 04-migration-process.md) applied to a database column instead of a service: announce, migrate incrementally, verify zero usage, remove.

## Worked case: renaming a column without downtime

Applying the pattern to the source doc's named case, a column rename proceeds as a series of backward-compatible deploys:

1. Add the new column (expand). Old code is unaffected.
2. Deploy application code that writes both columns.
3. Backfill the new column from the old for existing rows.
4. Deploy code that reads the new column (falling back where backfill has not landed).
5. Stop writing the old column; verify zero reads and zero writes through metrics.
6. Drop the old column (contract).

Schema-migration tooling like Flyway and Liquibase structures the phase sequence as versioned, backward-compatible migrations; the same guide covers rolling deployments, backward compatibility, shadow columns, and online index builds as the supporting techniques for the phase sequence (https://mdsanwarhossain.me/blog-zero-downtime-database-migration-flyway-liquibase.html, jev weight 0.21, weak backing).

## How this connects to the skill

The expand/contract pattern is the database-shaped instance of 2 skills the corpus documents elsewhere. It is the strangler pattern (see 05-migration-patterns.md) at the schema layer: old and new shapes run in parallel, traffic (reads and writes) shifts incrementally, and the old shape is removed when it serves nothing. And its contract phase is governed by the same verification discipline as step 4 of the migration process: no removal without verified zero active usage, measured through metrics and logs, not assumed.

Weak-backing note: every dig source retained for this subtopic scores below the 0.5 noul bar (0.21 to 0.32). The pattern itself is well established in industry practice, but this corpus's dig record does not include a primary source (vendor documentation from a major database, or a widely cited engineering blog) above the bar. Treat the external citations here as corroborating practice notes; the phase sequence is grounded in the convergence of multiple independent weak-backed sources plus the source doc's named scenario.
