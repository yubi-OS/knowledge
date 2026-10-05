# 09 - Phased adoption: from report-only audit to required gate

Scope: the 3-phase migration that lands the reachability assertion without breaking merge flow, the first-run expectations, and the failure modes of tightening CI gates too early.

## The 3 phases

The yubiOS migration plan (per the spec, section 5) runs in 3 phases:

1. Phase 1: ship `scripts/assert-dispatch-reachable.py` plus `.github/workflows/ci_dispatch-reachability.yml` on branch `feat/ci-dispatch-reachability-2026-08-04`, with PR title `feat(ci): workflow_dispatch reachability assertion + ci_dispatch-reachability.yml gate (OMN-159)`. The first run on main populates the gap table; the expected baseline is 0 ERROR.
2. Phase 2: tighten any baseline WARN. Each WARN (for example a stale group entry) gets a follow-up PR removing the stale entry from ci.yml.
3. Phase 3: make the gate required on workflow-touching PRs, enforcing `fail-on: ERROR` on `pull_request`.

The design principle is that detection precedes enforcement. The script and gate exist in Phase 1 and are already visible on PRs, but nothing blocks. Blocking arrives only after the baseline is proven clean, so the first blocked merge is a real violation rather than a pre-existing debt artifact.

## Evidence for phasing

Real-world rollout documents follow the same shape. The catalyst project keeps a `ci-required-checks-rollout.md` that plans required checks in stages (https://github.com/coalesce-labs/catalyst/blob/main/docs/ci-required-checks-rollout.md, weight 0.30, weak backing). The generic gradual-rollout literature argues for shipping a control in observe mode before enforce mode (https://rollgate.io/blog/gradual-rollouts-guide, weight 0.27, weak backing). These are weakly backed, but they align with the spec's own 3-phase structure.

Two concrete failure modes argue for the observe-first ordering:

1. Gate holes. Kestra's CI audit found that a required "gate" job had a hole that let non-compiling code through because the gate's verdict did not actually depend on the underlying jobs in every path (https://github.com/kestra-io/kestra/issues/19067, weight 0.70). A reachability gate that could be skipped (for instance via a `paths` filter that misses a workflow edit, or a `fail-on` override) must be discovered in observe mode, not after it is load-bearing.
2. Skipped-check semantics. Required checks interact badly with conditional execution: yegor256/rultor refused to merge PRs where CI checks were skipped rather than failed, blocking merges even though all required checks that ran had passed (https://github.com/yegor256/rultor/issues/2326, weight 0.91). If the reachability check is required while its own `paths` filter can skip it, branch protection behavior becomes unpredictable. This is the strongest argument for deciding, before Phase 3, whether the gate runs unconditionally or uses a mergeable no-op when the filter skips it.

## First-run expectations and rollback

Phase 1's first run on main is expected to return the baseline from the spec's matrix: 24 dispatchable workflows, 24 group memberships, 0 ERROR, 0 WARN (per the spec, sections 4 and 6). Any deviation is itself a finding about the ci.yml state, not about the script. The assertion is a read-only checker, so rollback is trivial: delete the workflow file and the script; no data or state is involved.

The `--fail-on` flag is the migration knob at every phase: NEVER for pure reporting, ERROR for Phase 1 and 3, WARN once the team wants stale entries treated as blocking (per the spec, section 2.1).

## Landing mechanics

The spec's PR conventions follow the org's workflow: one branch per feature (`feat/ci-dispatch-reachability-2026-08-04`), a title that names the component and the Linear issue, and verification through the dispatch recipe (dispatch the gate itself via the API, then read the audit job's output and uploaded artifact, per the spec, section 6, detailed in doc 07). Because the gate's `pull_request` filter includes its own script path (`scripts/assert-dispatch-reachable.py`), the landing PR exercises the gate on itself: the first run of the assertion happens on the PR that introduces it.

