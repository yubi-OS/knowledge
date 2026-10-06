# 06 - Bundling strategy: per-day bundles and weekly rollups

## Scope

How yubiOS structures long-running evidence collection: per-day bundles with rolling IMA anchoring, weekly Merkle-root summary bundles, and the split between long-term verification and forensic drill-down.

## The two-tier structure

The source doc (yubi-OS/yubiOS skills/audit-evidence-packaging/SKILL.md) sets the trigger: for systems that produce more than 100 MB of logs per day, the yubiOS convention is to bundle per-day. The structure has 2 tiers:

- **Daily**: `evidence-bundle-YYYY-MM-DD-yubiOS-prod/`, one per day, including that day's logs plus a rolling IMA measurement list. The measurement list is cumulative but anchored daily: each day's bundle re-states the IMA state as of that day, so any single day can be verified on its own while the chain of IMA measurements continues across days.
- **Weekly**: `evidence-bundle-YYYY-W{NN}-yubiOS-prod/`, a summary bundle that includes the Merkle roots of each day's bundle. This is the year-at-a-glance bundle.

The source doc states the division of labor directly: the weekly bundle's Merkle root is what long-term auditors verify; daily bundles are kept for forensic drill-down.

## Why this shape

The 100 MB per-day threshold and the naming scheme come from the source doc itself; the reasoning follows from the skill's do-not-use rule (bundles over 100 MB should be split) and from the verification cost structure. A verifier who can check a week by recomputing one Merkle root over 7 daily roots does O(7) root work instead of hashing the week's raw logs. The daily roots are themselves signed artifacts, so the weekly bundle inherits the same trust chain without re-copying the day's logs.

The rolling IMA measurement list is the subtle part. IMA measurements accumulate over a system's lifetime, and PCR 10 extends with each measurement, so a daily bundle cannot contain a self-contained IMA list unless it restates the cumulative state. Anchoring daily means each bundle's IMA list plus its PCR quote cross-check (verify path step 6) is valid for that day, while the weekly chain ties the days together.

## Retention drivers from the compliance side

The strategy aligns with how audit retention is regulated elsewhere. NIST SP 800-53 control AU-11 covers audit record retention, and compliance guidance maps log categories to specific retention requirements, with authentication logs, privileged access records, and configuration change logs warranting longer retention than routine system health data (https://www.upguard.com/compliance/nist-sp-800-53/au/au-11, weight 0.6). Microsoft's Purview audit retention documentation shows the operational pattern: retention policies defined per log category with the compliance portal as the management surface (https://learn.microsoft.com/en-us/purview/audit-log-retention-policies, weight 0.8). Practitioner guidance for audit log retention holds that centralizing and archiving logs outside native storage is the most reliable way to meet retention requirements and support forensic investigation (https://www.manageengine.com/products/active-directory-audit/kb/audit-log-retention.html, weight 0.51, weak backing: vendor KB). Compliance-archiving write-ups note that regulators test for long-term access and integrity, not just storage (https://www.archondatastore.com/blog/compliance-archiving/, weight 0.51, weak backing: vendor blog).

The yubiOS strategy is the cryptographic version of this pattern: instead of trusting the archive's storage layer, the weekly Merkle root gives the retention store a compact, self-verifying commitment, and the daily bundles are the drill-down.

## Hash-chain verification over long horizons

Tooling built for the same problem confirms the structure. LogSeal documents a dedicated endpoint that verifies an organization's entire event chain by recomputing every hash in the chain (https://docs.logseal.io/docs/hash-verification, weight 0.52, weak backing: product docs). An open-source proof-of-concept integrity log stores events append-only and links each record to the previous one via hash (https://github.com/nrpilla/integrity-log, weight 0.52, weak backing: community project). The weekly-bundle design is the aggregate-level version of the same discipline: the weekly root is the chain link between days.

## What long-term auditors actually check

Per the source doc, the long-term auditor verifies the weekly bundle's Merkle root; the daily bundles exist for drill-down when a specific incident or control question needs the underlying logs. This implies the retention hierarchy: keep weekly bundles (and their roots) for the full retention period, keep daily bundles per operational and forensic need. The source doc does not state explicit retention durations; it names the structure, not the schedule.

## Key takeaways

- Trigger: more than 100 MB of logs per day.
- Daily bundles carry that day's logs plus a rolling, cumulatively-anchored IMA measurement list.
- Weekly bundles carry the Merkle roots of each day's bundle and are what long-term auditors verify; daily bundles are for forensic drill-down.
- The structure mirrors mainstream audit-retention practice (category-based retention, external archiving) but replaces storage-layer trust with a signed weekly Merkle root.