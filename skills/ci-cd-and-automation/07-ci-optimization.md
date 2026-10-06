# 07 - CI Optimization

## Scope

What to do when the pipeline exceeds 10 minutes: the ordered strategy list from the source doc (caching, parallel jobs, path filters, matrix builds, test-suite pruning, larger runners), with dig-grounded detail on path filtering and skip mechanics.

## The trigger and the order (source doc)

The source doc sets the threshold at 10 minutes: "When the pipeline exceeds 10 minutes, apply these strategies in order of impact" (source doc). The order matters because the cheapest and highest-impact changes come first:

1. Cache dependencies: use actions/cache or the setup-node cache option for node_modules.
2. Run jobs in parallel: split lint, typecheck, test, build into separate parallel jobs.
3. Only run what changed: use path filters to skip unrelated jobs, for example skip e2e for docs-only PRs.
4. Use matrix builds: shard test suites across multiple runners.
5. Optimize the test suite: remove slow tests from the critical path, run them on a schedule instead.
6. Use larger runners: GitHub-hosted larger runners or self-hosted for CPU-heavy builds (source doc).

The source doc also gives a concrete parallel-jobs example: separate `lint`, `typecheck`, and `test` jobs, each on ubuntu-latest with checkout, setup-node (Node 22, npm cache), `npm ci`, then its own gate command (source doc). This turns a serial multi-minute gate sequence into a fan-out that finishes in the time of the slowest job.

## Path filters: what the platform actually does (high-backed dig)

The dig substantiates the third strategy with primary documentation. GitHub's docs on skipping workflow runs document `[skip ci]`-style commit-message instructions, and note a critical interaction: if the repository requires specific checks to pass before merge, a skipped workflow means you cannot merge the pull request until you push a new commit without the skip instruction (https://docs.github.com/en/actions/how-tos/manage-workflow-runs/skip-workflow-runs, weight 0.96). This is the boundary of the skip technique: it is safe only for workflows that are not required status checks.

For finer-grained, file-level skipping, the dorny/paths-filter action enables conditional execution of workflow steps and jobs based on the files modified by a pull request or by recently pushed commits, letting teams run slow tasks like integration tests or deployments only for changed components, which saves time and resources especially in monorepo setups; built-in GitHub workflow path filters do not support this because they evaluate at the workflow level rather than producing an outputs-based decision (https://github.com/dorny/paths-filter, weight 0.58). The source doc's "skip e2e for docs-only PRs" is the canonical use of this mechanism.

A lower-weighted guide shows the built-in `paths` and `paths-ignore` triggers so expensive workflows skip docs-only or unrelated changes, with copyable YAML (https://starsling.dev/best-practices/github-actions/path-filter-workflows, weight 0.13, weak).

## Caching and parallelism (source doc)

The first two strategies come from the source doc itself. Dependency caching via setup-node's `cache: 'npm'` appears in every workflow example in the skill, which means a project following the skill already has strategy 1. Job splitting (strategy 2) is the change most teams actually need: the source doc's own basic workflow (doc 02) is serial, and the optimization chapter's example restructures it into parallel jobs.

## Test suite pruning and bigger runners (source doc)

Strategy 5 removes slow tests from the critical path and runs them on a schedule instead; this pairs with the gate-pipeline design in doc 01, where E2E is marked optional, meaning the 10-minute budget is spent on gates that catch the most common defects first. Strategy 6 throws hardware at the problem: GitHub-hosted larger runners or self-hosted runners for CPU-heavy builds (source doc).

## The connection to the no-skip rule

Optimization is not optional polish in this skill. The source doc's rationalization table opens with "CI is too slow" and answers: "Optimize the pipeline, don't skip it. A 5-minute pipeline prevents hours of debugging" (source doc). Slow pipelines generate the pressure to bypass gates; optimization removes the pressure. The red flag "Long CI times with no optimization effort" makes the inverse explicit (source doc).

## Verification target

The source doc's checklist closes with a numeric requirement: "Pipeline runs in under 10 minutes for the test suite" (source doc). That number is the pass/fail condition for this entire doc's strategies, applied in the listed order.
