# CI parity: keeping the checklist true

## Scope

Keeping the checklist true via CI: the CI gates as the automated counterpart, checkbox-to-test-to-signal cross-reference tables, and preventing drift between the manual worksheet and CI.

## The division of labor

The yubiOS trust-proof artifact states the division explicitly: the playbook and checklist are for a human operator on disposable hardware, not for CI, because "CI already has what would be in the runbook" (source: yubiOS refs/yubios-trust-proof-playbook-checklist-2026-08-07.md, weak source). The CI side is the release-gate checklist plus the bootc/lifecycle workflow set. The worksheet is the manual cross-check an auditor carries; it is not a redundant test.

This is the parity rule for checklist-driven products: every checkbox should map to an existing automated test, and the mapping should be written down. The yubiOS note's recommended next steps include exactly that: "Map each checkbox to an existing test... Build a cross-ref table: checkbox, test file, expected CI signal" (source: yubiOS refs/yubios-trust-proof-playbook-checklist-2026-08-07.md, weak source).

## The cross-reference table shape

The table has 3 columns:

- Checkbox: the human-facing box on the printable sheet.
- Test file: the automated test that covers the same property (for example, a bats unit test for an enrollment script, or a CI workflow that boots the image).
- Expected CI signal: what green means for that property.

The value is bidirectional. Auditors get a bridge from the paper worksheet to the pipeline evidence. Engineers get a coverage detector: a checkbox with no test column is a property nobody automates, and a test with no checkbox is a signal nobody explains to a human.

## Drift is the enemy

A checklist drifts from CI the moment either side changes. Configuration and rule files that agents and pipelines both consume need drift detection wired into CI so that "config drift and validation errors" are caught "in every pull request" (source: https://samplexbro.github.io/agentsmesh/guides/ci-drift-detection/, weight 0.550, authoritative backing). The same mechanics apply to a trust checklist: a lint step that re-derives the checkbox list from the rule table (or vice versa) fails the build when they diverge.

Requirement-to-test-to-code traceability generalizes the pattern: build the traceability chain, catch spec drift early, and enforce it with CI gates and PR checklists (source: https://www.glukhov.org/app-architecture/testing-architecture/specs-tests-code-traceability-ai-development/, weight 0.260, weak backing).

## Gate design constraints

Security gates in CI/CD are "the decision layer that turns scanner output into pipeline behavior" (source: https://helpmetest.com/blog/security-gates-cicd-pipeline/, weight 0.230, weak backing). Two constraints keep the gate layer healthy when it backs a human checklist:

- A security gate that fails every build gets disabled. Gate strictness must match real risk so the gate survives contact with development (source: https://safeguard.sh/resources/blog/security-gates-in-ci-cd, weight 0.180, weak backing).
- Gate sequencing, parallel execution, and failure handling determine whether security checks add latency without adding assurance (source: https://devops-daily.com/guides/security-gates/04-cicd-integration, weight 0.150, weak backing).

## What parity buys the checklist

With the cross-ref table in place, the checklist stays true by construction: a checkbox whose test disappears is flagged by the drift check; a test whose checkbox is missing is flagged at review. The human worksheet then tests exactly what CI cannot: physical key possession, disposable-hardware recovery, and the felt experience of a fail-closed boot, which no pipeline signal reproduces.
