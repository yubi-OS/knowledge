# 01: The CI round trip and why it starves debugging

Scope: why the dispatch, wait, log, fix, re-dispatch CI cycle costs 15 to 45 minutes per iteration, and what live shell access replaces.

## The loop and its cost

A hardware CI debug loop has a fixed shape. You dispatch a workflow, wait for the runner to come up and run the job, pull the logs, read the failure trace, form a hypothesis, ship a fix, re-dispatch, and verify. On GitHub Actions, `workflow_dispatch` runs can be triggered from the Actions tab, the GitHub CLI, or the REST API (source: https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow, jev weight 0.35, weak). That trigger path is easy. The waiting is not.

The motivating deployment for this corpus runs yubiOS CI on real hardware: virtual-machine lanes (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`, the sealed-UKI VM lane) each cost 15 to 45 minutes per dispatch, measured in the source record (refs/debug-with-cli, 2026-08-01, source record, unweighted). During a 7-day failure hunt that needed roughly 30 round trips, the wasted wall clock from the wait steps alone dominated the investigation (source record, unweighted).

## What logs can and cannot tell you

Once a run finishes, the only debugging surface most CI systems hand you is the log stream. GitHub documents step debug logging as the primary escalation: you set a secret or variable to raise log verbosity during and after the job (source: https://docs.github.com/en/actions/how-tos/monitor-workflows/enable-debug-logging, jev weight 0.93). The troubleshooting guide adds more debug logging when workflow logs do not provide enough detail to diagnose a failure (source: https://docs.github.com/actions/how-tos/troubleshoot-workflows, jev weight 0.81). GitLab documents the same pattern: when a pipeline fails, the first tool is reading the job log, with dedicated debugging docs for common failure classes like image pull errors (source: https://docs.gitlab.com/ci/debugging/, jev weight 0.94).

The structural problem is that all of this is post-hoc. Log verbosity helps you read a failure that already happened. It does not let you run one more probe against the machine while the state that caused the failure still exists. For a hardware runner running destructive or stateful tests, by the time the logs exist the guest may have torn itself down.

## The access gap

The reason CI debugging is hard is access, not information. One practitioner writeup states it plainly: unlike local code you can step through with a debugger, GitHub Actions workflows run on remote machines you have no direct access to (source: https://blog.stephane-robert.info/en/docs/pipeline-cicd/github/optimiser/debug/, jev weight 0.12, weak). You cannot `ssh` in mid-run by default, and the runner is single-tenant while a job executes, so even a probe dispatched alongside the job cannot inspect the same machine state.

The industry has noticed this cost. A 2026 writeup from Modern Treasury argues that faster cloud CI helped them merge code more quickly but did not solve the feedback-latency problem for developers and AI agents, and that local execution closes the loop faster (source: https://www.moderntreasury.com/journal/reducing-feedback-latency-with-local-ci-for-developers-and-ai-agents, jev weight 0.33, weak). Benchmark-driven content claims self-hosted runners deliver up to 40% faster CI versus hosted alternatives by removing queue and environment setup time (source: https://markaicode.com/benchmarks/github-actions-production-benchmark-latency/, jev weight 0.16, weak). Treat the 40% figure as marketing-adjacent; the directional claim (closer machine, faster feedback) is the robust part.

Continuous integration itself is the practice of integrating changes frequently and verifying the integrated codebase continuously (source: https://en.wikipedia.org/wiki/Continuous_integration, jev weight 0.26, weak). The faster each verification cycle is, the more cycles a human or an agent can close per day. A loop whose minimum iteration is 15 minutes caps the day at dozens of hypotheses. A loop whose iteration is seconds does not.

## What live shell access changes

The pattern this corpus documents is to wrap the target machine (a CI runner box, a single-board computer, a dev box) behind a small authenticated HTTPS bridge so the agent can run one probe at a time, on demand, in seconds. Instead of re-running a 30-minute workflow to learn one fact, you run `uname -a`, `ip a`, or a version check against the live machine and get the answer in one round trip. The workflow that CI still owns is regression verification; the workflow the bridge takes over is hypothesis testing.

Two further benefits fall out of the shape. First, the probe surface is honest: the agent sees the same machine the CI job will see, including interface state, kernel version, and tool versions. Second, the bridge keeps working between CI runs, so partial-run cleanup (leftover bridges, attached VMs) can be inspected directly rather than inferred from logs. Both are described with verified examples in doc 09.
