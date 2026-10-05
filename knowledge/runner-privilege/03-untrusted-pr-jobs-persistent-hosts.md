# Untrusted PR-triggered jobs on persistent self-hosted hosts

Scope: why letting pull-request-triggered code execute on a long-lived self-hosted runner is the classic runner-compromise path, which trigger patterns create the exposure, and what the documented mitigations are.

## The compromise path in one sentence

Forks of a public repository can run code on your self-hosted runner machine simply by opening a pull request that executes a workflow (https://stackoverflow.com/questions/64553739/how-to-prevent-github-actions-workflow-being-triggered-by-a-forked-repository-ev, w 0.12). The weight is low, but the claim is confirmed by higher-weight sources below; the stackoverflow result is useful as evidence of how widely known the hazard is, not as the sole basis.

## The elevated-trigger pattern

The `pull_request_target` trigger is the mechanism that turns fork PRs into privileged jobs. GitHub's changelog calls it one of the most commonly misused triggers in GitHub Actions and a leading cause of workflow vulnerabilities, because workflows triggered by it run with access to the base repository's secrets even when the code being tested came from a fork (https://github.blog/changelog/2026-06-18-safer-pull_request_target-defaults-for-github-actions-checkout/, w 0.83). GitHub's own reference enumerates the dangerous patterns: fetching the pull request code outside of actions/checkout (with git fetch, gh pr checkout, or by downloading an artifact from a fork's pull_request run) and then running it (https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target, w 0.94).

Attack taxonomy documentation groups this family as the pwn-request attack: pull_request_target abuse that combines fork-controlled code with base-repository privileges (https://hivesecurity.gitlab.io/blog/cicd-pipeline-attacks-detect-2026/, w 0.61). Practitioner guidance concurs that pull_request_target is the most dangerous GitHub Actions trigger and that fork PRs need specific safe patterns (https://blog.stephane-robert.info/en/docs/pipeline-cicd/github/securite/pull-request-target/, w 0.16, low weight, directionally consistent with the docs above).

## Why persistence makes it worse

On a GitHub-hosted runner the blast radius of a compromised job is bounded by ephemerality: hosted runners execute code within ephemeral and clean isolated virtual machines, so there is no way to persistently compromise the environment (https://docs.github.com/en/actions/reference/security/secure-use, w 0.85). On a persistent self-hosted host, the same fork code lands on a machine that still exists tomorrow. Practitioner analysis identifies persistence as the amplifier: it lets one job reach the next, and the elevated-trigger pattern means fork code can run with your secrets (https://safeguard.sh/resources/blog/a-self-hosted-runner-executes-strangers-code, w 0.77). A fork PR that exfiltrates secrets or plants a hook on a persistent runner converts a single untrusted workflow run into standing access to the host.

## The hardening controls

1. Do not admit fork PRs on self-hosted runners at all. The primary control is admission: untrusted PR-triggered jobs are not admitted on self-hosted hosts. A hardening checklist proposes verifying this with a test: open a pull request from a fork and confirm the workflow either does not run against a self-hosted runner at all or requires explicit approval (https://www.decryptiondigest.com/blog/self-hosted-github-actions-runner-security-checklist, w 0.19, low weight, consistent with GitHub docs).

2. Require approval for fork workflow runs. GitHub provides approval gates for workflow runs on pull requests from public forks (https://docs.github.com/en/actions/how-tos/manage-workflow-runs/approve-runs-from-forks, w 0.95). Approval converts an automatic execution into a human decision, which is the correct posture for code of unreviewed provenance.

3. Prefer `pull_request` over `pull_request_target`, and when the target variant is required, never check out and execute fork-controlled code in the privileged context (https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target, w 0.94). GitHub shipped safer defaults for pull_request_target checkout in June 2026 specifically to reduce this class of vulnerability (https://github.blog/changelog/2026-06-18-safer-pull_request_target-defaults-for-github-actions-checkout/, w 0.83).

4. Route untrusted jobs to ephemeral or hosted capacity, never to the persistent host that also holds credentials, attached hardware, or lab state.

## Summary

The runner-compromise path is: fork opens PR, an elevated trigger or unscoped runner label admits the job, fork code executes with base-repository privileges on a persistent host, and persistence converts a one-shot exposure into standing access (w 0.94, w 0.83, w 0.85, w 0.77). The controls are admission denial for untrusted PR code on self-hosted hosts, approval gates for fork runs (w 0.95), checkout discipline inside pull_request_target workflows, and routing untrusted jobs to ephemeral capacity.
