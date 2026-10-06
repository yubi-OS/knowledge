# 02 Orchestrator: ci.yml and the no-chain dispatch model

**Scope:** how `ci.yml` turns a single group choice into independent workflow dispatches, what propagates and what does not, and why the repo rejected a chained pipeline. Grounding spine: source doc (yubi-OS/yubiOS docs/CI_MAP.md, https://github.com/yubi-OS/yubiOS/blob/main/docs/CI_MAP.md).

## The input surface

`ci.yml` exposes a single `group:` choice input with 10 values: `none`, `firmware`, `tests`, `vm-tests`, `fetches`, `ci-builders`, `forks`, `audits`, `research`, `all`. Alongside it ride `reason`, `target_ref`, and `Docker_push` (source doc). The workflow itself is minimal: 1 job (`dispatch`, 1 step) on `ubuntu-24.04` (source doc).

When dispatched, the orchestrator fires one independent `workflow_dispatch` call per workflow in the chosen group's list, then exits. There is no state machine, no callback handoff, no chain: every workflow in a group runs standalone from its own dispatch call (source doc). Choosing `none` is an acknowledged no-op (source doc). The `all` group is the union of the eight dispatchable groups and amounts to 38 independent dispatches, verified against the `WORKFLOWS` array in the dispatch step on 2026-10-06 (source doc).

## Key invariants

The source doc (source doc) records four invariants:

1. **No chain.** A group dispatch does not sequence its members; each runs independently.
2. **`Docker_push` is honored only by the four builder workflows:** `ci_firmware-rk.yml`, `yubiOS-ci.yml`, `ci_dev_image.yml`, `ci_mkosi-installer.yml`. Every other workflow ignores it. Notably `ci_build-test-fixtures.yml` is a builder but its push is controlled by its own `push` input, not `Docker_push`.
3. **Re-running means re-dispatching**, with the same group or by dispatching the workflow directly.
4. **Array agreement.** The `all` group's `WORKFLOWS` array and the per-group arrays agree with the group taxonomy in the file header comment; `ci_dispatch-reachability.yml` asserts this on Mondays and on workflow-file PRs (doc 08).

## The 2026-10-06 group promotion

On 2026-10-06, commit `e46a3cb8` added the `audits` (5 governance guards) and `research` (6 research workflows) choices to ci.yml, promoting what the ci-launchpad app had tracked as hand-maintained taxonomy rows into real orchestrator dispatch targets. The same commit added `lean-run.yml` and `phonon-followups.yml` to `research` and `all`, clearing the dispatch-reachability orphans those two workflows had in the `all` union (source doc). Before this commit, those two workflows were display-only members of the app's taxonomy and were dispatched individually, not through the orchestrator (source doc, doc 10).

## Why no-chain is the right model here

The dispatch-vs-chain tradeoff is documented in the source doc's own history: PR #145 (`group-routing-redesign`) removed the callback chain and the callback contract. Under the pre-#145 model, ci.yml dispatched a child with `ci_callback=true`, the child reduced its `needs` JSON to a success/failure conclusion, and dispatched `state` back to ci.yml, which stopped on non-success or dispatched the next workflow (source doc, historical callback contract). That contract no longer fires; the `ci-callback` jobs still present in some child workflows are legacy no-ops kept for history (source doc).

The no-chain model trades automatic sequencing for blast-radius control: a failed firmware build cannot block or silently skip an unrelated audit, and any subset of the 38 workflows can be run without running its predecessors. The cost is that ordering must come from the operator or from the group definition, which is why the group lists themselves, not a state machine, are the unit of design (source doc).

## The platform mechanics behind the model

GitHub's own documentation grounds the two mechanics this design relies on. A workflow can be triggered by a `workflow_dispatch` event, which is the manual trigger surface GitHub Actions provides (docs.github.com, "Events that trigger workflows", https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows, jev weight 0.79). And when the repository's `GITHUB_TOKEN` performs tasks that trigger events, those events do not create new workflow runs by default, which is the documented behavior the orchestrator's API-based dispatch calls must route around (docs.github.com, "Triggering a workflow", https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow, jev weight 0.58).

External commentary on orchestrator patterns in GitHub Actions exists but is mostly third-party tooling rather than platform fact: the workflow-dispatch-and-wait marketplace action (github.com/marketplace/actions/workflow-dispatch-and-wait, jev weight 0.08) and external orchestrators like Kestra (kestra.io/orchestration/github-actions, jev weight 0.27) and dispatchoor (github.com/ethpandaops/dispatchoor, jev weight 0.17) are weakly-backed context only, and yubiOS deliberately uses none of them: the orchestrator is a single 1-job workflow plus a shell `WORKFLOWS` array (source doc).

## Composes with

The orchestrator composes with ci-launchpad (the Sauna app fires the same `workflow_dispatch` calls with the full input schema visible and tracks every `.yml` file in the repo) and with every group member as an independent dispatch target (source doc). The dispatch plumbing itself was verified across all 38 group paths in the 2026-10-06 full CI-path dispatch test; open failures are in child workflow dependency installs and build stages, not in reachability (source doc, doc 10).
