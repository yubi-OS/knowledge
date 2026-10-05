# Industry-standard OSS project-health measurement

**Scope:** Industry-standard OSS project-health measurement: CHAOSS metrics, OpenSSF Scorecard, devstats as prior art for what to track.

## Why prior art first

Before an early-stage project invents its own metric set, it should check what the dedicated projects measure and why. Two bodies of work dominate: CHAOSS for community health, and OpenSSF Scorecard for security posture. Both are relevant even when a project adopts neither directly, because they define the vocabulary and the failure modes of OSS measurement.

## CHAOSS: community health, structured

CHAOSS (Community Health Analytics in Open Source Software) is a Linux Foundation project focused on creating metrics, metrics models, and software to better understand open source community health (https://www.chaoss.community/, weight 0.84, authoritative). Its core conceptual distinction is between a metric, which is meant to answer one single question about the health of a community, and a metrics model, which is a collection of metrics brought together to provide deeper context and answer more complex questions (https://www.chaoss.community/kb-metrics-and-metrics-models/, weight 0.93, authoritative). The published metrics are implementation-agnostic: they define what to measure, not which tool collects it (https://github.com/chaoss/metrics, weight 0.94, authoritative).

For an early-stage project the practical lesson is the one-question rule. Every metric in a health report should be traceable to a single question ("are decisions being recorded at decision time?", "is a release lane green?"), and only when several questions cluster should they be rolled into a named model. CHAOSS also ships the tooling layer: GrimoireLab and Augur are open-source tools that help display CHAOSS metrics (https://github.com/Chaoss, weight 0.67, authoritative). Those tools are adoption options for later, not prerequisites; the metrics definitions themselves are usable without any tooling.

## OpenSSF Scorecard: automated security posture

OpenSSF Scorecard, launched in November 2020, auto-generates a security score for open-source projects to help users judge trust, risk, and security posture (https://openssf.org/projects/scorecard/, weight 0.94, authoritative). It is an automated tool that assesses a series of important heuristics, called checks, associated with software security, and assigns each check a score (https://github.com/ossf/scorecard, weight 0.82, authoritative). Its stated purposes run in both directions: help maintainers improve security best practices and help consumers judge whether dependencies are safe (https://scorecard.dev/, weight 0.81, authoritative). CISA lists Scorecard as a collection of security health metrics for open source, with results publicly available as a Google Cloud BigQuery dataset (https://www.cisa.gov/resources-tools/services/openssf-scorecard, weight 0.79, authoritative).

Scorecard is the model for artifact-derived public metrics: every check inspects something the repository itself contains (CI configuration, branch protection, dependency updates, signing). A project that wants public health signals can adopt the same shape, even scoring itself informally against Scorecard's check categories, without running the tool. The lesson for a metrics report: security posture is reportable from repo artifacts alone, which is exactly the situation of a project with no telemetry.

## Where an early-stage project diverges

The industry frameworks measure at population scale and optimize for comparability across thousands of projects. A single-maintainer project's report optimizes for decision-driving instead. Three divergences follow:

1. **Fewer metrics, each tied to a decision.** CHAOSS models combine many metrics for context; an early-stage report keeps only the metrics whose answers change an action this month.
2. **No benchmarking.** Scorecard scores are meaningful in comparison across projects. A blocker count is not: its meaning is local, defined by the project's own promotion gates.
3. **Honest gaps over computed proxies.** The frameworks compute proxies from repo data by design. A project without telemetry should still say "unmeasured" for user-facing questions rather than letting a proxy (stars, forks) quietly substitute for the real question.

## A synthesis pattern

A defensible early-stage report borrows the structure of both frameworks without their scale: CHAOSS's one-question rule for each metric, Scorecard's artifact-derived-only principle for what qualifies as a public metric, and the project's own decision-tie as the extra filter neither framework applies. The result is smaller than either framework's catalog and defensible in review, because every row can answer "which question, which artifact, which decision".
