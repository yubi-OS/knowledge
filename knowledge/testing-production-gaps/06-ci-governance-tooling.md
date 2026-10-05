# 06 - CI governance and tooling

## Scope

CI tooling governance: input-shape doctrine, workflow group reachability, token-scope audits, concurrency declarations, and fork upstream-sync drift.

## The input-shape problem

GitHub Actions workflow_dispatch workflows accept inputs declared in YAML; the platform validates input types but not semantic shape (source: https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow, jev weight 0.86). A workflow that takes a git ref as a string accepts anything, including a ref that does not exist, and fails four hours into a run. The workflow syntax reference gives each input a type (choice, boolean, string) and a description, but the choices list is only enforced at the UI level, not when a workflow is dispatched through the REST API or by another workflow (source: https://docs.github.com/en/enterprise-cloud@latest/actions/reference/workflows-and-actions/workflow-syntax, jev weight 0.96).

The yubiOS 7-day failure cluster (drop-in lex-sort, /dev/vfio five-layer bug, ALLOW_REAL_U2F, group-routing, GH_TK, dispatcher inputs) shares one root: no shared doctrine for input shape across workflow YAML, drop-in filenames, OCI references, and registry channels (yubiOS source: refs/testing-production-gaps-2026-08-01). The fix the audit proposes is a reusable composite action, .github/actions/validate-input-shape/action.yml, asserting four things: inputs are enums, drop-in filenames lex-sort after upstream overrides, OCI references are digest-pinned, and channel selection is role-bound; the orchestrator invokes it from ci.yml so every dispatch passes through the same gate (yubiOS source: refs/testing-production-gaps-2026-08-01). This converts retroactive BLOCKERS.md entries into a proactive machine check.

## Group reachability

The yubiOS orchestrator dispatches workflows through group enums (PR #145 redesign). The audit found 3 workflows unreachable from any group: ci_test-ftpm-tpm0.yml, ci_test-fedora-bootc-arm64-pull.yml, and ci_test-vgpu-vm.yml. A dispatch of group=all silently misses them, which means green group-all runs do not prove those workflows even compile. The fix is a Bats test asserting the union of group lists covers every dispatch-enabled workflow, or adding a tests-standalone group; the audit prices it at half a day (yubiOS source: refs/testing-production-gaps-2026-08-01).

## Token scope and permissions

GitHub creates a repository-scoped GITHUB_TOKEN for each job, and the token exists even when a workflow never mentions it, so the effective default permission set matters (source: https://docs.github.com/en/actions/concepts/workflows-and-actions/concurrency, jev weight 0.98, concept reference also at https://docs.github.com/en/actions, jev weight 0.94). yubiOS's audit findings: every permissions: block is hand-written, 24 children inherit the top-level ci.yml declaration of actions: write, 20 of 25 workflows lack concurrency:, and the GH_TK secret cleanup was the symptom of untracked token sprawl (yubiOS source: refs/testing-production-gaps-2026-08-01). The fix is an audit script, .github/scripts/audit-workflow-permissions.sh, asserting every workflow declares permissions: explicitly, only the 4 builder workflows accept a Docker_push input, and no workflow holds a gratuitous contents: write.

## Concurrency as a correctness control

Without concurrency declarations, GitHub Actions allows multiple workflow runs within the same repository to run concurrently (source: https://docs.github.com/en/actions/concepts/workflows-and-actions/concurrency, jev weight 0.98). For a fleet that builds images and pushes them to a shared registry, concurrent runs of the same build workflow race on registry tags and on digest bumps. The fix in the yubiOS audit is partly the audit script (flag the missing concurrency:) and partly adding group-scoped concurrency keys to the 20 workflows that lack them.

## Fork upstream-sync drift

The yubiOS org maintains forks; the fetch-released-tag-ref.yml workflow peels released tag refs on demand, but after the PR #145 group-routing redesign, 4 forks lost automatic upstream sync, and no drift nag exists (yubiOS source: refs/testing-production-gaps-2026-08-01). The proposed fix is a daily schedule firing group=fetches that detects fork drift (compare each fork's default branch against its upstream) and files a Linear issue tagged area:supply-chain when a PINNED.md diff appears, so digest drift is visible rather than discovered at build failure.

## Why these are one work item

All five findings are governance-layer: they do not touch the OS image at all. The audit prices the combined CI tooling work at roughly 2 weeks (input-shape doctrine 1 week author plus 1 week wiring, reachability 0.5 day, fork drift 1 week, token audit 2 to 3 days) (yubiOS source: refs/testing-production-gaps-2026-08-01). The shared design principle is that each fix converts a human memory (which inputs are valid, which workflows belong in which group, which tokens a builder may hold) into a machine-checked invariant that fails CI instead of failing a debug session 7 days later.

## Sources

- https://docs.github.com/en/enterprise-cloud@latest/actions/reference/workflows-and-actions/workflow-syntax (weight 0.96)
- https://docs.github.com/en/actions/concepts/workflows-and-actions/concurrency (weight 0.98)
- https://docs.github.com/en/actions (weight 0.94)
- https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow (weight 0.86)
- https://oneuptime.com/blog/post/2025-12-20-workflow-dispatch-inputs-github-actions/view (weight 0.42, weak backing)
- https://github.com/VowpalWabbit/vowpal_wabbit/pull/4940 (weight 0.45, weak backing)
- yubiOS refs/testing-production-gaps-2026-08-01 (internal source doc for all repo-internal claims)
