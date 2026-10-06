# 06 - CI dispatch and verification

Scope: how a pushed patch is proven green. Dispatching the arm64-chromium-build.yml workflow via workflow_dispatch on main, then verifying with a workflow-filtered runs query until a run exists at the NEW head sha and completes.

Source doc: yubi-OS/yubiOS skills/chromium-overlay-ship/SKILL.md (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/chromium-overlay-ship/SKILL.md).

## Dispatch

After the overlay push (doc 05), the pipeline fires CI: `POST /actions/workflows/arm64-chromium-build.yml/dispatches` with body `{"ref":"main"}` and no dispatch inputs (source doc). This is GitHub's "create a workflow dispatch event" endpoint, which queues a manual run of a workflow on a given ref (https://docs.github.com/en/rest/actions/workflows, weight 0.92). The workflow builds content_shell on the HIGH-MEM self-hosted runner (source doc), so a dispatch exercises the actual Chromium build the patches gate.

The critical honesty rule: **a 204 response is not proof of a run** (source doc). The dispatch endpoint accepts the request and returns success before any run is created; the only proof is a run object appearing in the runs list.

## Verification: workflow-filtered, sha-anchored

The verification loop from the source doc:

1. Poll `GET .../runs?per_page=3` until a run exists whose head sha is the NEW head sha (the sha produced by the doc 05 push).
2. Then poll until that run is `completed` (source doc).

The runs listing endpoint returns workflow runs with head_sha, status, and conclusion fields, and can be filtered by workflow (https://docs.github.com/en/rest/actions/workflow-runs, weight 0.91). Guideline 3 makes the filtering rule absolute: CI verification is workflow-filtered, NEVER head_sha-only (source doc). The reason is that the org runs many workflows; a bare "is there a run at this sha" check can be satisfied by any unrelated workflow, and the build that actually matters can be failing while the check reports green.

The `github/rest-api-description` repository's own Actions page (https://github.com/github/rest-api-description/actions, weight 0.75) illustrates the same runs listing in production use on a GitHub-owned repo, which is useful as a live shape reference for run objects.

## Timing expectations

The source doc records the empirical cadence: runs are usually green within minutes when the change is patch-only (source doc). That makes sense against the build classes (doc 01): a patch-only overlay push does not itself rebuild Chromium; the CI run builds content_shell from the patched tree, which is where the minutes go. Asset-only or grd-only changes avoid the expensive relink class entirely (source doc), so the CI signal mostly confirms the patch applies and the tree still builds.

## Why sha-anchoring matters here specifically

The overlay push uses the Git Data API (doc 05), not a git push from the box. The CI run that matters is the one triggered by the overlay's own main-branch advance, i.e. the run at the head sha the push created (source doc). Polling `per_page=3` at the top of the runs list is enough because the run was just created; the sha match is what disambiguates it from runs of other workflows or older runs of the same one (source doc; runs shape at https://docs.github.com/en/rest/actions/workflow-runs, weight 0.91).

## The failure modes this step guards against

- Treating the 204 as success and reporting a green ship that never built (source doc).
- Verifying against the wrong sha (pre-push head) or the wrong workflow (source doc).
- Waiting forever on a wedged self-hosted runner: the doc's guidance is to poll until `completed`, and its empirical note bounds what "usually" means (minutes for patch-only) so an abnormal wait is visible (source doc).

## Summary

Dispatch is one POST with `{"ref":"main"}` and no inputs (source doc; endpoint docs https://docs.github.com/en/rest/actions/workflows, weight 0.92). Verification is a sha-anchored, workflow-filtered poll until `completed` (source doc; runs docs https://docs.github.com/en/rest/actions/workflow-runs, weight 0.91). The 204 is never the proof; the run object is.
