# GitHub-hosted vs self-hosted runners: custody and its consequences

Scope: the custody tradeoff between GitHub-hosted and self-hosted runners, what each side controls, and why the tradeoff is ultimately a trust decision rather than a cost decision.

## What each side controls

GitHub defines the split in its own concepts documentation: a self-hosted runner is a system you deploy and manage to execute jobs from GitHub Actions, and it gives you more control of hardware, operating system, and software tools (https://docs.github.com/en/actions/concepts/runners/self-hosted-runners, w 0.78). That control is the whole reason self-hosted runners exist: custom hardware, pinned toolchains, attached devices. It is also the reason self-hosted runners carry risk that hosted runners do not: the machine's state, and its compromise by any admitted workflow, is now your problem.

GitHub's own comparison framework evaluates the two across five areas rather than one; the headline difference is that hosted runners are ephemeral and managed by GitHub while self-hosted runners are persistent and managed by you (https://github.blog/enterprise-software/ci-cd/when-to-choose-github-hosted-runners-or-self-hosted-runners-with-github-actions/, w 0.83).

## Registration topology is a custody choice

Adding a self-hosted runner is itself a decision with trust consequences: a runner can be added at the repository, organization, or enterprise level (https://docs.github.com/en/enterprise-cloud@latest/actions/how-tos/manage-runners/self-hosted-runners/add-runners, w 0.95). Hosted runners have no equivalent choice because there is nothing to register; the custody boundary is fixed by the platform. On the self-hosted side, every widening of registration scope multiplies the number of repositories whose workflows the machine will execute.

## Scaling and lifecycle

Self-hosted runner management has its own reference documentation, including the GitHub Actions Runner Scale Set Client, a standalone Go-based module that lets platform teams build custom autoscaling solutions (https://docs.github.com/en/actions/reference/runners/self-hosted-runners, w 0.79). Autoscaling exists on the self-hosted side precisely because the machines are yours to provision and retire; GitHub-hosted capacity scales automatically because GitHub owns the fleet. The scaleset client decouples the two models: you can keep the custody of self-hosted hardware while borrowing the elasticity of hosted runners.

## The security asymmetry

Third-party hardening guidance draws the practical conclusion: self-hosted runners should only be used in trusted workflows, because only verified GitHub Actions should reach them, and the dedicated host is the runner (https://github.com/dduzgun-security/github-self-hosted-runners, w 0.49). The asymmetry is structural. A hosted runner is destroyed after the job; a self-hosted runner persists, so anything a job leaves behind (files, tooling, modified state, a running process) survives to the next job. Choosing self-hosted means accepting that jobs are not automatically isolated from each other by platform design, and compensating with isolation of your own.

## Choosing between them

The decision axis is not price alone. A self-hosted runner is justified when the job needs something GitHub cannot provide: nonstandard hardware, attached physical devices, a specific operating system image, or a toolchain too large to reinstall per job. A hosted runner is justified when the job is generic and the trust question matters more than the compute question: fresh machines, platform-managed isolation, no persistent state. Most organizations run both, and the discipline is in routing: generic builds to hosted runners, hardware-bound or toolchain-heavy builds to named self-hosted runners with narrow workflow scoping.

## Summary

Custody is the axis: you deploy and manage self-hosted runners for control of hardware, OS, and tools (w 0.78), you register them at repository, organization, or enterprise level with blast radius growing at each level (w 0.95), you scale them with your own tooling such as the Runner Scale Set Client (w 0.79), and you accept that only trusted workflows should ever reach them (w 0.49). Hosted runners buy platform-managed ephemerality; self-hosted runners buy control at the price of owning every isolation property yourself.
