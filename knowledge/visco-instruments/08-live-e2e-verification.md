# 08 Live end-to-end verification

Scope: post-deploy verification: the corpus selftest gaining visco parity checks, live snapback reproducing the Python fixture on round-3 series, honest low r2 on mixed history, the empty-ledger `no_data` shape, and a live persistence run.

## The verification sequence

After the modules-API deploy, verification ran in two layers. First the corpus selftest endpoint returned 200 with all checks passing, and its check set now includes the visco fixture-parity checks, so parity is enforced on every selftest run rather than only at build time. Second, each instrument route was exercised live end to end [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md].

## What each live check established

The live checks were chosen to cover the four routes' distinct failure surfaces [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md]:

1. Snapback on the recorded round-3 series: inversion runs `[[4],[6,7],[10]]`, verdict `snapback`, gate_input `halt_round`, matching the Python fixture exactly. This checks numeric parity on a case with known output.
2. Prony with `metric=dbc&arms=2` on the live runs history: 35 points, t_basis `created_at`, ke -13.54, 2 arms (tau 45.8 and 476.4), fit_quality_r2 0.069. This checks the route against real, messy data, and the r2 is reported as-is rather than tuned; the recorded round-3 trajectory alone fits at r2 near 0 with a ke-only model, documented in the fixtures.
3. Hysteresis with `baseline_id=999999`: `{loops:[], verdict:"no_data"}`. This checks the empty-ledger shape: a caller pointing at a nonexistent baseline gets an explicit verdict, not a zero-filled summary or an error.
4. Persistence e2e: 2 flips applied, 1 persisted, fraction 0.5, verdict `partially_persisted`, audits base -14.85 and loaded -14.49, run `cr_1098cf9f0d919960`. This checks the full audit pipeline (base audit, loaded audit, re-grade leg) on live data.

## Why the empty case is verified explicitly

Deployment verification guidance treats post-deploy checks as a systematic process of validating that a release is correctly installed and configured, executing predefined checks to confirm all components work [source: https://zetcode.com/terms-testing/deployment-verification/, jev weight 0.3078, weak backing]. A checklist-oriented view covers health checks, smoke tests, monitoring validation, performance baseline comparison, error rate verification, and rollback decision criteria [source: https://qapractices.com/checklists/post-deployment-verification-checklist/, jev weight 0.5286]. Most checklists verify the happy path; the visco verification deliberately includes a negative case (the nonexistent baseline id) because rollup endpoints fail differently when empty than when populated, and an unhandled empty case would produce either a crash or a misleading zero summary.

## Deployment gates as the consumer contract

The snapback route emits `gate_input` verdicts designed to be consumed by a gate. Release engineering formalizes this consumer side: deployment gates are added to release pipelines to ensure deployments meet specific criteria before proceeding, enforcing that deployments are reliable and secure [source: https://learn.microsoft.com/en-us/azure/devops/pipelines/release/approvals/gates?view=azure-devops, jev weight 0.944], with pre-deployment and post-deployment conditions configurable per stage [source: https://learn.microsoft.com/en-us/azure/devops/pipelines/release/approvals/?view=azure-devops, jev weight 0.9435]. The visco surface's contribution is the advisory producer: it computes the verdict from the ledger but leaves the enforcement to the gate owner, which is why the build record states the route never auto-actions [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md].

## Selftest as a standing verification surface

Post-deployment smoke testing practice recommends defining a small set of critical-path tests, running them against the real environment after every deploy, and failing the pipeline or alerting when they fail [source: https://helpmetest.com/blog/smoke-testing-after-deployment/, jev weight 0.2737, weak backing]. The corpus selftest follows this shape with a stronger guarantee: because the selftest now includes fixture-parity checks, the worker re-verifies its math against the Python system of record on demand, indefinitely after the deploy. A regression introduced by a later deploy or a runtime change would surface as a selftest failure with a named fixture, not as silently wrong instrument numbers [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md].

## Honest failure reporting as a verification property

The prony live check deserves emphasis as a verification standard: the route reported r2 = 0.069, a bad fit, on the live history, and the build record documents rather than hides this, including the companion observation that the round-3 trajectory alone fits at r2 near 0 [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md]. Verification that only exercises routes where the answer is known-good validates plumbing; verification that reports an honest low-quality result on real data validates the instrument's self-assessment too. Both were run before the surface was declared shipped.
