# 05 - Permissions and Matrix Hygiene

Scope: The workflow `permissions:` block discipline (top-level least privilege, redundant job-level overrides, no read-write token defaults) and the matrix strategy conventions across the 24 yubiOS workflow files.

## Permissions: the baseline

All 24 workflows declare a top-level `permissions:` block. Zero workflows rely on the read-write `GITHUB_TOKEN` default. This matches the platform guidance: use the `permissions` key to modify GITHUB_TOKEN permissions for an entire workflow or for individual jobs, configuring the minimum required permissions (source: https://docs.github.com/actions/using-jobs/assigning-permissions-to-jobs, weight 0.96).

19 of the 24 add a redundant job-level `permissions:` override with the same minimum as the workflow level. Redundant but harmless: it is belt-and-suspenders, and it keeps each job's need explicit if the workflow-level block is ever widened. Dedicated tooling exists for exactly this audit shape, monitoring a workflow to discover the least privilege it actually needs before tightening (source: https://github.com/GitHubSecurityLab/actions-permissions, weight 0.78). Hardening guidance recommends read-only workflow defaults with narrowly scoped job-level write access (source: https://starsling.dev/best-practices/github-actions/limit-github-actions-permissions, weight 0.56).

## The 3 fetch-* exceptions

The 3 `fetch-*` workflows (`fetch-dhi-manifest`, `fetch-fedora-bootc-manifest`, `fetch-released-tag-ref`) hold `contents: write, actions: write` at workflow level, because they push to the repo through the Contents API. Their job-level blocks downgrade to `contents: read`, which is defensive: the write grant exists at the workflow level for the one step that needs it and the jobs that do not need it explicitly refuse it.

## What is never granted

No workflow grants `packages: write`, `id-token: write`, or `attestations: write`. The sigstore and SLSA attestation work happens out-of-band rather than inside these workflows, so the token surface stays minimal. This is the least-privilege discipline working as intended: permissions follow what the workflow actually does, not what it might someday do.

## Matrix strategy conventions

Every matrix job in the fleet follows one shape:

- `matrix.include: [{arch: amd64}]` as a forward-looking stub.
- `fail-fast: false`, set explicitly rather than left as default.
- `runs-on: ubuntu-24.04`, pinned, never `ubuntu-latest`.

The `include` key is documented as adding to the matrix combinations generated from the base keys (source: https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/run-job-variations, weight 0.98). yubiOS uses that mechanism as a placeholder: when the org is ready to add an arm64 lane, the stub flips from one include entry to two, and no job structure changes.

`fail-fast: false` matters for release-shaped pipelines: by default a matrix cancels in-progress jobs when one fails (weak backing: https://runs-on.com/github-actions/the-matrix-strategy/, weight 0.28). Explicitly disabling it means one failing architecture does not mask the pass or fail state of the others, which is what a reproducibility gate needs.

The single non-stub axis in the fleet is `ci_firmware-rk.yml::firmware-reproducibility` with `matrix.board: [qemu-arm64, rockpro64-rk3399, rock5b-rk3588]`: 3 real boards, each a genuine build target rather than a placeholder.

## Why the redundant overrides are kept

Least-privilege tooling recommends the same two-layer shape: discover what a job actually touches, then express the minimum at each scope. The GitHubSecurityLab actions-permissions tool exists because applying least privilege blind breaks workflows, so it monitors first and tightens after (source: https://github.com/GitHubSecurityLab/actions-permissions, weight 0.78). yubiOS inverts the discovery cost by keeping the job-level line even where the workflow-level block already covers it: the reader of any single job sees its ceiling without opening the parent block. Practical guidance for GITHUB_TOKEN hygiene makes the same recommendation: declare permissions explicitly in every workflow and choose deliberately between workflow-level and job-level scope (weak backing: https://blog.stephane-robert.info/en/docs/pipeline-cicd/github/securite/permissions/, weight 0.18).

## The include stub mechanics

The include mechanism is what makes the stub approach cheap. The docs note that `include` entries add to the matrix combinations generated from the base keys, and that an include value that does not match an original combination extends the matrix rather than overriding it (source: https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/run-job-variations, weight 0.98). So `matrix.include: [{arch: amd64}]` generates exactly one job today, and appending `{arch: arm64}` later generates exactly one more, with no change to job definition, permissions, or runner pinning. The `fail-fast: false` that ships alongside it stays correct for both sizes: a matrix cancellation on the first failing arm would be exactly wrong for a fleet validating a new architecture in parallel with the baseline.

## Takeaway

Two quiet conventions, both enforced by uniformity rather than tooling: every workflow names its permissions explicitly and never inherits defaults, and every matrix job carries an explicit fail-fast and a pinned runner with an include stub ready for the second architecture. The 3 fetch-* workflows are the only ones granted write scopes, and their job-level downgrades show the downgrade reflex is already in place.
