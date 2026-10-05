# Ephemeral and autoscaling runners as mitigation

Scope: how single-job ephemeral runners and autoscaling infrastructure narrow the persistent-host problem, what the runner scale set model looks like, and what ephemeral runners do not solve.

## The mechanism: one runner, one job

GitHub introduced ephemeral self-hosted runners in September 2021: ephemeral means single job, and after a job is run, ephemeral runners are automatically removed (https://github.blog/changelog/2021-09-20-github-actions-ephemeral-self-hosted-runners-new-webhooks-for-auto-scaling/, w 0.81). The same release added the workflow_job webhook so that autoscalers can react to job demand in real time. The security property follows directly from the lifecycle: a compromised or polluted runner ceases to exist at the end of its single job, so nothing a job plants survives to the next job on the same machine.

This is the self-hosted approximation of the hosted property. GitHub-hosted runners execute code within ephemeral and clean isolated virtual machines with no way to persistently compromise the environment (https://docs.github.com/en/actions/reference/security/secure-use, w 0.85). Ephemeral self-hosted runners import that property into infrastructure you own.

## Autoscaling infrastructure

The current supported autoscaling model is runner scale sets. GitHub's self-hosted runners reference documents the GitHub Actions Runner Scale Set Client as a standalone Go-based module that platform teams, integrators, and infrastructure providers use to build custom autoscaling solutions (https://docs.github.com/en/actions/reference/runners/self-hosted-runners, w 0.93). The Enterprise Server documentation describes the same client and notes that ephemeral runners are the recommended configuration for autoscaling (https://docs.github.com/en/enterprise-server@latest/actions/hosting-your-own-runners/autoscaling-with-self-hosted-runners, w 0.74). The reference scaleset client creates runners just-in-time as jobs arrive, or pre-provisions them ahead of demand to reduce latency, with GitHub assigning pending jobs to any idle runner in the scale set (https://github.com/actions/scaleset, w 0.71).

At team scale, practitioners observe that self-hosted runners stop being only a cost discussion and become an execution-isolation and security-boundary discussion; ARC (Actions Runner Controller) with ephemeral runners is the operational answer (https://labhub.hopto.org/blog/devops/2026-03-17-github-actions-arc-ephemeral-runner-security-operations, w 0.44). ARC has two modes and only one is currently supported by GitHub: the runner scale set mode installed by the gha-runner-scale-set-controller (https://blog.stephane-robert.info/en/docs/pipeline-cicd/github/runners/ephemeres/, w 0.61).

## What ephemeral does not solve

1. Job-to-job isolation on the same host is not implied. Ephemeral removal removes state persistence per runner process, but multiple runner processes can still share a host kernel unless the deployment is containerized or virtualized per job. Third-party implementations make per-job isolation the explicit product: one commercial design assigns each job a single-use Firecracker microVM with its own host-enforced network policy (https://runzivo.dev/, w 0.22). The general lesson from container isolation analysis is that sharing the host kernel is not suitable for untrusted code (https://northflank.com/blog/firecracker-vs-docker, w 0.32).

2. Observability must be externalized. GitHub's reference warns that runner application log files for ephemeral runners must be forwarded to an external log storage solution for troubleshooting and diagnostics, because the runner disappears with its logs (https://docs.github.com/en/actions/reference/runners/self-hosted-runners, w 0.91).

3. Admission is still separate. An ephemeral runner pool that is labeled for public PR jobs still admits fork code; ephemerality bounds persistence, not the decision to execute untrusted code at all.

## Operational checklist

Lab-style guidance combines the pieces: build custom runner images, implement runner group isolation for separation of duties, and configure autoscaling (https://secure-pipelines.com/ci-cd-security/lab-ephemeral-self-hosted-runners-actions-runner-controller/, w 0.52). Commercial self-hosting on your own cloud account follows the same pattern: ephemeral self-hosted GitHub Actions runners in your own AWS account, one stack, any EC2 instance type per job (https://runs-on.com/, w 0.43).

## Summary

Ephemeral runners remove persistence, which is the amplifier that turns one bad job into standing host access (w 0.81, w 0.85). The supported scaling mechanism is the runner scale set client, with ephemeral configuration recommended for autoscaling (w 0.93, w 0.74, w 0.71). Ephemeral does not by itself provide per-job kernel isolation (w 0.32), it forces log forwarding off-host (w 0.91), and it does not change the admission decision for untrusted PR jobs. It is a lifecycle control, not an admission control.
