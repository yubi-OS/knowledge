# 08 - Scheduled Drift-Detection Gate

Scope: the ci_package-floor.yml gate: its daily 06:00 UTC schedule and pull_request path triggers on PINNED.md and Containerfile, and the 2026-09-18 finding that the gap between the checklist's design and its execution was scheduling, not tooling.

## The gate design

The CI gate runs the floor verification script on two trigger classes (source doc: refs/package-floor-verification-checklist-2026-08-04.md section 5):

- `pull_request` events with path filters on `PINNED.md`, `Containerfile`, `Containerfile.dev`, and `scripts/verify-package-floor.sh`.
- `schedule` with cron `0 6 * * *`, daily at 06:00 UTC.
- `workflow_dispatch` with a `target_image` string input, defaulting to `docker.io/0mniteck/yubios:dev`.

The job checks out the repo, installs skopeo, runs `scripts/verify-package-floor.sh` against the target image, and uploads `floor-report.json` as a workflow artifact with `if: always()` so the report exists even on failure. The artifact uploader is the standard actions/upload-artifact action (source: https://github.com/actions/upload-artifact, jev weight 0.85).

## Path filters

The pull_request path filter is GitHub-native: when using push and pull_request events, a workflow can be configured to run based on which file paths changed, and path filters are not evaluated for pushes of tags (source: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax, jev weight 0.96; also https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow, jev weight 0.93). This is what scopes the gate to pin-touching PRs: a PR that edits a ref doc does not run the floor check, while a PR that edits the pin does. The migration plan in the source doc phases this in: phase 1 ships the checklist, script, and gate; phase 2 makes the verify-floor step required on any PR touching PINNED.md or the Containerfile; phase 3 runs the gate on every digest bump event automatically once the dispatcher is consistent (source doc: refs/package-floor-verification-checklist-2026-08-04.md section 6).

For finer control than the native filter, the dorny/paths-filter action enables conditional execution of steps and jobs based on the files modified by a pull request, on a feature branch, or by recently pushed commits (source: https://github.com/dorny/paths-filter, jev weight 0.88), and marketplace path-filter actions offer detailed per-step control over changed-file filtering (source: https://github.com/marketplace/actions/path-filter, jev weight 0.93). The native paths trigger is sufficient for the yubiOS gate's four fixed paths, which is why the workflow uses it directly.

## The schedule and its caveats

The daily 06:00 UTC cron is the drift-detection mechanism: even when nobody is bumping anything, the gate pulls the dev image, re-checks the floors, and records a report. GitHub's schedule event runs in UTC and can be delayed during periods of high load, so a scheduled run is approximate rather than exact (source: https://stackoverflow.com/questions/75166565/how-to-run-cron-jobs-in-github-action-for-a-particular-day-and-time, weak backing, jev weight 0.21). Cron-schedule guides repeat the UTC point and the five-field syntax constraints for GitHub Actions schedules (source: https://cronwizard.com/github-actions-cron, weak backing, jev weight 0.16; https://cronread.com/blog/github-actions-cron-examples, weak backing, jev weight 0.13). For a daily drift check, schedule delay is tolerable: a delay of minutes does not matter when the drift horizon is days.

## Why scheduling, not tooling, was the gap

The gate's design existed before it was needed. The 2026-09-18 re-verification pass found that the fourth rotation the checklist had been written to catch had happened and was not caught: the pin had been stale for approximately 44 days, the pinned manifest 404ed on quay, and the next main image build failed at pull (source doc: refs/package-floor-verification-checklist-2026-08-04.md section 9; refs/fedora-bootc-digest-drift-check-2026-09-18.md). The re-verification drew the conclusion directly: the pre-bump check list is executable now, steps 2 and 3 are one-line curl checks, and the gap between the checklist's design and its execution is scheduling, not tooling. The linked issue OMN-62 had been listed Done, yet the failure recurred, which is the strongest argument for the scheduled weekly resolution check the digest-drift record proposes (same source).

This is the general failure mode of checklists without triggers: a manual protocol with no scheduled execution degrades silently, and its "done" status hides that the protection stopped running. The gate's daily schedule exists to convert the protocol from something operators remember into something the CI system enforces.

## The scheduled run as evidence

The scheduled run's artifact output makes the gate auditable over time: each run uploads floor-report.json, so the history of reports shows when floors were verified and against which digest. The daily schedule plus the pull_request path trigger plus the workflow_dispatch input cover the three ways floor state needs checking: continuously (drift), at review time (pin-touching PRs), and on demand (operator-specified target image). Together with the post-bump cascade (doc 07), this closes the loop the incident history exposed: rotation detection is no longer dependent on a human noticing a failed pull.
