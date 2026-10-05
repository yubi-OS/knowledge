# 06 Policy-version stamping

Scope: the proposed instrument: stamp policy_version on every jev_corpus_runs row and keep a compact append-only policy changelog in a table the wipe protocol never touches, so the method becomes executable after about 2 policy versions of accumulation.

## The gap the instrument closes

The shift-factor method has a hard data precondition: every response observation must be attributable to the policy version that was active when it happened. Today runs do not stamp the policy version they executed under. Without the stamp, curves cannot be segmented by version, and the superposition fit has no per-version windows to work with.

## Standardization first

The stamp should be a first-class field with a consistent name and type, not an ad-hoc string. The AWS Well-Architected devops guidance recommends normalizing telemetry data using a common format or standard schema to enhance consistency in data collection and reporting, which facilitates correlation and analysis across multiple facets of observability such as system performance, user behaviors, and security events (weight 0.90, https://docs.aws.amazon.com/wellarchitected/latest/devops-guidance/o.dip.6-standardize-telemetry-data-with-common-formats.html). OpenSearch's Simple Schema for Observability (ss4o) is a worked example of the same principle: a standardization for conforming to a common and unified observability schema, with which tools can ingest, extract, and aggregate data (weight 0.78, https://docs.opensearch.org/latest/observing-your-data/ss4o/). Its definition covers the three main structured types that OpenTelemetry and ECS define, logs, traces, and metrics, with a default index pattern per type (weight 0.66, https://github.com/opensearch-project/observability/blob/main/docs/Simple-schema.md). For the corpus, the minimal act of standardization is one column, policy_version, present on every run row and every audit row from the day the stamp ships.

## The changelog half

Stamps answer "which version was active"; they do not answer "what changed between versions". That is the changelog's job. Database version control applies version numbers to snapshot states and systematically manages versioned changes so teams can track, apply, and revert changes (weight 0.62, https://www.liquibase.com/resources/guides/database-version-control). The corpus version of this is a compact append-only policy-changelog: one row per version with version, timestamp, and a diff summary. Append-only matters because the changelog must survive the same operations that destroyed the audit history; a mutable changelog is one accidental delete away from the same data gap repeating.

Modern telemetry architecture practice backs the pairing of stamped events with a maintained registry: architecture guides for streaming telemetry describe collecting and correlating events at scale, which only works when event metadata is consistent (weight 0.78, https://www.cisco.com/c/en/us/solutions/collateral/enterprise/design-zone-security/telemetry-architecture-guide.html; weight 0.71, https://www.cisco.com/c/en/us/td/docs/wireless/controller/9800/17-18/config-guide/b_wl_17_18_cg/streaming-telemetry-on-Cisco-Catalyst-9800-series-wireless-controller.pdf).

## Wipe-immunity as a design constraint

The changelog table must be excluded from the wipe protocol by construction, not by convention. Weak-backed supporting material: SQL Server exposes append-only ledger tables as a first-class mechanism where rows cannot be updated or deleted (weak backing, weight 0.44, https://learn.microsoft.com/en-us/sql/relational-databases/security/ledger/ledger-how-to-a; weak backing, weight 0.42, https://learn.microsoft.com/en-us/sql/relational-databases/security/ledger/ledger-append-o), and schema-evolution trackers exist precisely to monitor schema state over time (weak backing, weight 0.47, https://docs.digna.ai/platform/schema_tracker/Introduction/). These are pointers to the pattern class, cited as weak because the dig did not surface a primary yubiOS-applicable specification.

## Executability timeline

With both halves shipped, the method becomes executable after about 2 policy versions of accumulation: version v_ref and one successor give one shift factor; three or more versions give a_T(v) as a series. The stamp should land in the next build because every unstamped run is a permanently unlabeled observation; policy version is currently v5, so a stamp introduced at v5 labels nothing retroactively but makes every subsequent version measurable.
