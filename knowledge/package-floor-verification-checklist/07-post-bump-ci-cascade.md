# 07 - Post-Bump CI Cascade

Scope: the after-bump verification: the CI cascade groups the bump triggers (fetches, ci-builders, tests, vm-tests), the 5-step verify-package-floor.sh script, and the engineering gates the cascade must keep passing before a bump is declared safe.

## The cascade a digest bump triggers

Once the bump is on main, the commit triggers a five-stage cascade (source doc: refs/package-floor-verification-checklist-2026-08-04.md section 4.1):

1. `ci_dev_image.yml` rebuilds the dev image with the new base.
2. `ci.yml` group=fetches re-fires all fetches and confirms no other digests are stale.
3. `ci.yml` group=ci-builders re-fires yubiOS-ci plus ci_dev_image plus ci_mkosi-installer.
4. `ci.yml` group=tests re-fires all tests against the new image.
5. `ci.yml` group=vm-tests re-fires the VM tests.

The cascade exists because a digest bump changes the input to every downstream build. The general mechanism is GitHub's workflow triggering model: workflow triggers are events that cause a workflow to run, with some events carrying multiple activity types (source: https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows, jev weight 0.97). Cross-workflow chaining is a recognized pattern: a workflow can trigger another workflow using the workflow_dispatch event, with the target workflow configured for that event type (source: https://github.com/marketplace/actions/workflow-dispatch, weak backing, jev weight 0.49). The yubiOS cascade uses exactly this composition, organized into named groups so that one bump re-fires the whole dependency tree in a controlled order instead of an unbounded fan-out.

## The verification script

The cascade runs `scripts/verify-package-floor.sh` as a gate. The script performs 5 checks against a target image and prints a pass/fail summary (source doc: refs/package-floor-verification-checklist-2026-08-04.md section 4.2):

```
bash scripts/verify-package-floor.sh --target-image docker.io/0mniteck/yubios:dev-<short-sha>

[1/5] Pulling target image... OK
[2/5] Extracting kernel version... OK
[3/5] Comparing kernel floor (6.5 composefs primary, 6.6 verity=require, 6.12 EROFS)... PASS
[4/5] Extracting systemd version... OK
[5/5] Extracting bootc version... OK, comparing bootc floor (v1.16.4)... PASS

Summary: 5/5 PASS
```

If any check fails, the script exits non-zero, the workflow fails, and the bump is flagged for re-resolution (source doc: refs/package-floor-verification-checklist-2026-08-04.md section 4.2). The expected pass state for the current dev image is 5 out of 5: kernel at or above 6.5, kernel at or above 6.6 for verity enforcement, systemd at or above v256, bootc at or above v1.16.4, and the package-set diff empty or non-significant (source doc: refs/package-floor-verification-checklist-2026-08-04.md section 7).

The script shape follows a recognized CI pattern: a CI job scans a pinned container image, saves machine-readable reports, and fails only when its gate condition trips (source: https://johnburns.io/post/build-a-container-image-security-gate-with-trivy/, weak backing, jev weight 0.23). The floor script is the version-gate analog of a vulnerability gate: instead of failing on CVEs, it fails on version regressions introduced by the new base.

## The engineering gates the cascade must hold

The cascade must reach a stable end state, not merely finish (source doc: refs/package-floor-verification-checklist-2026-08-04.md section 4.3):

- All E-1 through E-11 engineering gates still pass (per OMN-142).
- The composefs-kernel-floors invariants still hold (doc 02).
- The signed UKI build (PR #32, ADR-008) still produces a verifiable signed artifact.

If any gate regresses, the protocol is to file a new issue with the commit SHAs, the failure log, and the digest that caused the regression. This turns the cascade from a green/red light into an evidence trail: every gate failure is attributable to a specific digest, which is what makes the rotation history in doc 05 auditable.

## Quality gates as a category

The post-bump cascade is an instance of the general quality-gate pattern: automated checkpoints that validate build results, test results, security scans, and artifact integrity before allowing pipeline progression (source: https://khimananda.com/blog/build-verification-and-quality-gates-in-ci, weak backing, jev weight 0.10). Two lessons from the gate literature transfer directly. First, gates fail loudly or not at all: a gate that is easy to switch off stops being run. The delta-CVE-gate project documents why container scanning gates get switched off, when a first run fails the build with hundreds of inherited findings, teams disable the gate rather than triage them, so the project instead fails the build only on the CVEs the change itself introduced (source: https://github.com/s3cretagent/delta-cve-gate, weak backing, jev weight 0.48). The floor script takes the delta approach by design: it compares the new digest against the recorded floors, so it fails on what the bump changed, not on the entire history of the image.

Second, gate failures need triage paths. The kubernetes cloud-provider-openstack project's "gate failure cause all CI failed" incident shows the value of attributing a CI-wide failure to its actual cause (a cri-dockerd issue) and fixing the root rather than the symptom (source: https://github.com/kubernetes/cloud-provider-openstack/issues/2528, jev weight 0.80). The floor protocol's issue-filing rule, with commit SHAs plus failure log plus causal digest, is the same attribution discipline.

## Manual verification recipe

Between automated runs, the script can be run manually against the current dev image:

```
bash scripts/verify-package-floor.sh --target-image docker.io/0mniteck/yubios:dev
```

Expected output: `Summary: 5/5 PASS` (source doc: refs/package-floor-verification-checklist-2026-08-04.md section 7). The manual run is the operator-facing counterpart of the scheduled gate in doc 08: the gate automates the check, the recipe documents what the check is so it can be run ad hoc after any suspicious change.
