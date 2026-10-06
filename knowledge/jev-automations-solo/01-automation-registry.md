# 01 - The automation registry: versioned templates, not drifting config

Scope: the versioned automation registry as designed in the Jev Automations framing log: automation-as-template in D1/KV, deploy as new-version-plus-activate, dispatch-stamped versions, and the config-drift stress-test critique.

## The design in the framing log

The 2026-09-30 ideate-solo log defines an automation as a versioned template stored in D1/KV: name, stage list, per-stage prompt and model, allowed tools, trigger (manual or cron), and a gate profile. Deploy means writing a new version and activating it. Every dispatch stamps the automation version, in the same way the orchestrator already stamps the policy version (framing log, 2026-09-30).

The stress-test critique in the same log says: an automation registry that stores prompts in a dashboard is config drift with extra steps. The counter: versioned templates, dispatch-stamped automation versions, and the append-only audit make every prompt change reviewable, which is the discipline the policy doc already has (framing log, 2026-09-30).

## What the registry pattern gives you

The registry pattern centralizes management of shared objects so different parts of a system can look them up from one place (https://java-design-patterns.com/patterns/registry/, jev weight 0.7709; https://www.geeksforgeeks.org/system-design/registry-pattern/, jev weight 0.6192). Applied to automations, the registry is the single lookup point for what an automation is allowed to do at dispatch time.

Versioned configuration management is a design pattern that tracks and manages different versions of configuration over time and allows rollback to previous configurations when a new one misbehaves (https://softwarepatternslexicon.com/bitemporal-modeling/versioning-patterns/versioned-configuration-management, jev weight 0.3398, weak backing). The same pattern family is described for schemas: a versioned schema registry enables safe evolution of configuration, smooth rollbacks, and backward-compatible changes at scale (https://beefed.ai/en/versioned-schema-registry, jev weight 0.1674, weak backing). The Jev registry's write-new-version-then-activate step is this pattern applied to prompts and stage definitions.

## Config-as-code comparison

GitLab defines CI/CD pipelines and their jobs and stages in a YAML configuration file per project, with a pipeline editor for editing that configuration (https://docs.gitlab.com/ci/pipelines/, jev weight 0.95). This is the mainstream shape of config-as-code: definitions live in reviewable files with version history. CI/CD versioning practice commonly combines semantic versioning and commit-hash-based methods for artifact versioning (https://www.hokstadconsulting.com/blog/versioning-in-ci-cd-pipelines-best-practices, jev weight 0.1946, weak backing). The framing log's registry stores templates in D1/KV rather than git, but keeps the same discipline: every change is a new version, and the audit records which version ran.

## Version stamping and audit

Stamping executable definitions with version identifiers so behavior changes can be correlated later is an established observability practice for prompts: a prompt-assembly playbook recommends stamping system messages with version hashes and deployment timestamps so teams can correlate behavioral changes with prompt updates (https://inferensys.com/prompts/context-engineering-and-prompt-assembly/prompt-assembly-observability-and-debug, jev weight 0.1036, weak backing).

Audit logging in data pipelines is compared to an airplane black box: the pipeline can run without it, but when something goes wrong, audit logging lets you query a SQL table and get an answer for any date, any table, any pipeline run (https://www.drivedatascience.com/audit-logging-data-pipelines/, jev weight 0.3073, weak backing). The dispatch stamp in the Jev design serves exactly that role: every automation run is answerable to the version that produced it.

## Verdict

The registry is the part of the finalist design that answers the drift critique directly. The load-bearing claims are the pattern-level ones: central lookup (registry pattern), change-by-version (versioned configuration management), and per-dispatch stamping (prompt version stamping). Each has independent prior practice behind it, even where the specific web sources backing the details carry weak weights.
