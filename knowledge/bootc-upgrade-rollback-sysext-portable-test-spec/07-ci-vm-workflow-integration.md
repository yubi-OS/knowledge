# 07: CI lanes for VM tests

Scope: GitHub Actions lanes for VM tests: workflow_dispatch inputs, amd64 plus arm64 matrix with self-hosted KVM runners, lint gates, artifact upload, and orchestrator group routing.

## Dispatch and matrix shape

A VM test lane in GitHub Actions is typically `workflow_dispatch` only: a human or an orchestrator triggers it with inputs, rather than it firing on every push. Workflows can define inputs on the dispatch event and jobs can build a matrix dynamically from event payload information; the docs show a workflow triggered on `repository_dispatch` whose matrix version variable is derived from the event payload [1]. For an OS image test lane the practical pattern is a static `matrix: arch: [amd64, arm64]` with `runs-on:` chosen per leg, which is the standard variation mechanism GitHub documents under running variations of jobs in a workflow [1].

For the arm64 leg, self hosted runners are the supported path for hardware attached VM testing: GitHub documents self hosted runners as machines you manage, and for scale out, Actions Runner Controller (ARC) is the reference implementation of GitHub's scale set APIs and the recommended Kubernetes based solution for autoscaling self hosted runners [2]. A single labeled self hosted box (for example a KVM capable arm64 host with the label set `self-hosted, linux, arm64, kvm`) serves as the hardware leg without ARC overhead [2] (the label mechanics are the documented runner labeling system).

## Lint gates before the VM boots

Because VM test scripts are bash and expensive to debug once a VM is running, lint gates run first and cheap:

- The ShellCheck GitHub action accepts any supported ShellCheck option or flag through the `SHELLCHECK_OPTS` env key in the job definition, including disabling specific checks (for example `-e SC2059 -e SC2034 -e SC1090`) or testing against different shells [3].
- Differential ShellCheck is a Marketplace action for performing differential scans using the ShellCheck linter, which is useful when a long lived test script suite accrues warnings over time [4].

A lint job that runs `shellcheck -x` on each `tests/vm/*.sh` before the matrix job keeps script regressions out of the expensive VM legs.

## Artifact upload as the evidence trail

When a VM test fails, the assertion evidence lives inside the guest and host logs the script wrote to a log directory. GitHub's artifact system is the transport for that evidence out of the runner: you can upload build and test output to use for debugging failed tests or crashes, and viewing test suite coverage, using the upload-artifact action [5]. An artifact is a file or collection of files produced during a workflow run; artifacts allow you to persist data after a job has completed and share that data with another job in the same workflow, and GitHub provides upload and download actions for the two directions [6].

The upload-artifact action is the official mechanism ("Upload Actions Artifacts from your Workflow Runs") [7]. For VM lanes the pattern is an upload step guarded with `if: always()` so logs are captured on failure as well as success, with the log directory as the artifact path [5] [6].

## Orchestrator group routing

When several VM workflows exist (base VM tests, vGPU VM tests, sealed UKI VM tests, and the new lifecycle tests), a top level orchestrator workflow dispatches the child workflows as a group rather than each being triggered separately. The reusable workflow and dispatch input forwarding mechanism is the documented way to pass inputs (image tag, hardware device flag, real-key allowance) from the orchestrator into each child workflow [1]. A known failure mode for such dispatchers is passing inputs that a child workflow has not declared; GitHub rejects the dispatch, so every child in the group must declare exactly the input set the orchestrator forwards [1] (weak backing for the rejection detail, w=0.47, practitioner writeup).

## Test design implications

1. Each new VM test workflow should be workflow_dispatch with declared inputs, added to the orchestrator's vm-tests group, so one dispatch exercises all lanes [1].
2. Keep a lint job (shellcheck, yq validation) separate from and ahead of the VM matrix jobs [3].
3. Upload per-leg log directories with upload-artifact under `if: always()` so failed VM boots still produce evidence [5] [6] [7].

## Sources

1. https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/run-job-variations (w=0.96)
2. https://docs.github.com/actions/reference/runners/self-hosted-runners (w=0.97)
3. https://github.com/marketplace/actions/shellcheck (w=0.69)
4. https://github.com/marketplace/actions/differential-shellcheck (w=0.55)
5. https://docs.github.com/en/actions/tutorials/store-and-share-data (w=0.83)
6. https://docs.github.com/en/actions/concepts/workflows-and-actions/workflow-artifacts (w=0.77)
7. https://github.com/actions/upload-artifact (w=0.69)
8. https://dev.to/instadevops/advanced-github-actions-matrix-builds-reusable-workflows-and-self-hosted-runners-h07 (w=0.47, weak)
