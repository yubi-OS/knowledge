# 09 Deploy, live verification, and reporting

Scope: phase 6 and the closing guidelines: the orchestrator deploys and verifies every route and leg live before reporting, tracks the build in a todo list with per-phase ids, and reports once on completion with shipped items, live proof points, tests, and what is open.

Grounding spine: yubi-OS/yubiOS skills/parallel-build-lanes/SKILL.md ("source doc").

## Deploy plus live verify as one phase

The source doc's phase 6 reads: "Deploy + live verify: orchestrator deploys, then verifies every route/leg live before reporting." Two things are packed there. The deploy is performed by the orchestrator itself, not delegated to a lane, because the deploy-safety rules (doc 08) require judgment about legacy modules, binding ordering, and invariants that the orchestrator owns. And the phase is not complete at a successful deploy: "verifies every route/leg live before reporting" makes live verification a completion condition. Reporting before verification is out of order.

"Every route/leg" is the scope term. A route is a serving path of the deployed worker; a leg is any other live surface the build promised (a webhook receiver, a queue consumer, a scheduled entry point). The example build in the source doc ends "deploy -> live route-by-route verification," so verification is per-route, not a single health check.

## Why live verification follows the lane pipeline

The pipeline's own lessons explain the need. The integration lessons record that in-memory test drivers tolerate what the real backend rejects (D1 failing closed on unknown columns, NOT NULL columns rejecting explicit NULL), so an all-green build can still fail against the real deployment. The advisor's suites and e2e test run against lane code, not against the deployed worker. Live verification is therefore the only step that exercises the real bindings, real secrets, and real routes, and the source doc places it after every other check precisely because nothing earlier can substitute for it.

## The todo discipline

Guideline 2 of the source doc: "Track the build in a todo list with per-phase ids; update after every phase." The 6 phases (capability map, ideate-solo one-pager, SPEC, lanes, advisor, deploy and verify) get ids, and the todo is updated after every phase, not at completion. This gives a resumable state: if a build is interrupted mid-pipeline, the todo shows which phases completed. It also gives the final report its skeleton, since each phase's outcome was recorded when it happened.

## The single completion report

Guideline 3: "Report once on completion: shipped, live proof points, tests, what is open." The report is singular (one report at completion, not per-phase chatter) and has 4 fixed components. Shipped: what was built and deployed. Live proof points: the evidence from the live verification, route by route. Tests: the counts from the lanes and the advisor's combined run. What is open: anything unfinished, stated rather than hidden. The "report once" rule prevents the anti-pattern of narrating each lane's return; the orchestrator's chat output is a completion report, and the per-phase record lives in the todo list.

## Corroboration from external practice

The dig for this subtopic produced the corpus's single high-weight result (0.51, above the 0.5 authoritative threshold): a post-deploy live verification workflow document from a public claude-skills repository, which prescribes verifying each deployed route live before reporting success (high, 0.51; github.com/rampstackco/claude-skills/blob/main/workflows/post-deploy-live-verification.md). A related build-verification-gate skill listing describes merge-gate verification before deployment (weak, 0.10; mcpmarket.com/tools/skills/build-verification-gate-3). These align with the source doc's rule but do not define it; the per-route/per-leg scope and the report format are the doc's own.

## The closing loop

The full sequence closes where it opened: the capability map named the modules, the SPEC promised contracts for them, the lanes implemented, the advisor reconciled and reported, and the completion report claims shipped, proved by live verification. The source doc's history line (jev-orchestrator and Jev Automations on the steady-orbit worker, 2026-10-01, descending from the 2026-08-01 playbooks build and the 2026-09-29 mega-task fan-out) is the record that this closing loop is the validated practice, not a proposal: 2 builds ran it end to end and produced the lessons the skill carries forward.
