# 08 - Alternative tooling: actionlint, rulesets, and the gap a custom assertion fills

Scope: what off-the-shelf workflow tooling already checks, where GitHub's rulesets enforce workflows, and why neither closes the orphan-workflow gap.

## actionlint: syntax and semantics, not reachability

actionlint is the dominant static checker for GitHub Actions workflow files: it checks for unexpected or missing keys, expression validity, and shell fragments (https://pkg.go.dev/github.com/rhysd/actionlint, weight 0.67; project site https://rhysd.github.io/actionlint/, weight 0.70; repository https://github.com/rhysd/actionlint, weight 0.76). A Marketplace action wraps it with Problem Matchers support and is platform-independent (https://github.com/marketplace/actions/actionlint, weight 0.76).

What actionlint does not know is a repository's dispatch contract. Its checks are workflow-local; the question "does ci.yml's group table list this file?" spans two files and a repo-specific convention, which no generic linter can encode. A practitioner guide nonetheless shows the closest integration point: once actionlint passes on the default branch, add it as a required status check in a branch ruleset so a workflow change that fails lint cannot merge (https://tenki.cloud/blog/lint-github-actions-workflows-actionlint, weight 0.66). That enforces syntax health, not group coverage.

## Rulesets and required workflows: enforcement, not discovery

GitHub's ruleset mechanism is the enforcement layer. Originally, Required Workflows let org admins require specific workflows across repositories; GitHub announced those would move to repository rulesets, with GHES 3.12 and later offering required-workflow enforcement only via rulesets (https://github.blog/changelog/2023-08-02-github-actions-required-workflows-will-move-to-repository-r, weight 0.83). The enforcing post describes requiring workflow runs via repository rulesets as a control over code being merged (https://github.blog/enterprise-software/ci-cd/enforcing-code-reliability-by-requiring-workflows-with, weight 0.78). The enterprise docs cover ruleset creation and enforcement statuses (https://docs.github.com/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your, weight 0.85), and the rules list includes the available repository rules (https://docs.github.com/en/enterprise-cloud@latest/repositories/configuring-branches-and-merges-in-y, weight 0.94). The well-architected governance library situates required workflows inside a broader repository-governance taxonomy with reusable workflows producing stable status checks (https://learn.github.com/well-architected/library/governance/recommendations/managing-repositories-a, weight 0.88).

The community discussion on the beta tracks the same migration (https://github.com/orgs/community/discussions/67754, weight 0.24, weak backing). Two limits matter for the reachability problem: rulesets require specific named workflows to run, which says nothing about whether other dispatchable workflows are reachable; and rulesets are default-branch constructs, so they evaluate merged state, not PR state.

## The gap and how a custom assertion fills it

Neither class of tool encodes the yubiOS contract: every `workflow_dispatch` workflow must appear in a ci.yml group table. The contract is repo-specific, bidirectional (orphans in one direction, stale entries in the other), and lives inside a shell string in ci.yml. The custom assertion in doc 04 is the mechanism for it; actionlint and rulesets remain complementary layers. The sensible stack is:

1. actionlint on every PR for syntax and expression health.
2. The reachability assertion for the dispatch contract, report-only initially.
3. A ruleset making the assertion's check required once the baseline is clean.

This division is the same one the yubiOS spec implies: the companion token-scope audit (Linear OMN-161) and the input-shape gate (OMN-158) are each their own script-plus-gate, with actionlint-style generic checks left to existing tooling (per the yubiOS spec, section 7).

