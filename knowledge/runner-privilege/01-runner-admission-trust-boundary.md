# Runner admission as a trust boundary before any process exists

Scope: runner admission is the decision that binds a machine into the CI trust fabric, and it happens before any job process runs; this doc maps the boundary, why org-level registration widens it, and what admission-time controls exist.

## The boundary is set at registration, not at execution

A runner is admitted to a trust domain when it is registered, not when it picks up its first job. GitHub's secure use reference states the mechanism plainly: when a self-hosted runner is defined at the organization or enterprise level, GitHub can schedule workflows from multiple repositories onto the same runner, and a security compromise of that runner therefore impacts every repository it serves (https://docs.github.com/en/actions/reference/security/secure-use, w 0.97). The admission decision determines the blast radius of every later compromise. A runner registered at repository level serves one repository; a runner registered at organization level serves all of them; the job code never changes this, because the boundary was drawn before the process existed.

This ordering matters because a CI runner is the machine where untrusted repository-defined code actually executes. Product security guidance for GitLab runners frames runner design as one of the most important trust decisions in CI (https://www.product-security.expert/07-ci-cd-and-software-supply-chain/runner-isolation-and-trust-boundaries.html, w 0.21). The same structural fact holds on GitHub Actions: the runner admission step decides whose code that machine will execute, before any workflow YAML is read.

## Contrast with the hosted boundary

GitHub-hosted runners execute code within ephemeral and clean isolated virtual machines, which means there is no way to persistently compromise that environment (https://docs.github.com/en/actions/reference/security/secure-use, w 0.85). The admission boundary for hosted runners is drawn by GitHub itself: every job gets a fresh machine, so admission and execution collapse into the same instant and nothing carries over. Self-hosted runners break that equivalence: admission is a durable state change on a machine you own, and every job after admission inherits the exposure. This is why the admission step, not the per-job step, is where self-hosted runner hardening concentrates.

## Admission-time controls

Three controls act at or near admission:

1. Registration level. You can add a self-hosted runner to a repository, an organization, or an enterprise (https://docs.github.com/en/enterprise-cloud@latest/actions/how-tos/manage-runners/self-hosted-runners/add-runners, w 0.95). Choosing the narrowest level that works is the single admission-time decision with the widest consequences.

2. Runner groups and workflow scoping. Organization policies can limit which workflows reach which self-hosted runners; GitHub's runner groups feature enforces consistent usage of self-hosted runner groups across an organization and enterprise, and lets administrators limit specific runners to specific workflows (https://github.blog/news-insights/product-news/github-actions-secure-self-hosted-runners-specific-workflows/, w 0.87). Scoping at admission is cheaper than detecting misuse at execution.

3. Runtime monitoring on admitted runners. Harden-Runner applies security controls and monitoring to self-hosted runners, including egress monitoring and detection after admission has already happened (https://github.com/step-security/harden-runner, w 0.82). Monitoring is a compensating control: it observes jobs on an admitted runner but cannot undo an over-broad admission.

Separate runners for trusted and untrusted workloads, with production deployments kept away from general build activity, is the standard first-line advice in CI/CD secret-leakage guidance (https://dev.to/clearpathsecurity/preventing-secret-leakage-in-cicd-environments-3de2, w 0.17). The advice is directionally correct even though the source is low weight: admission policy is how trusted and untrusted become different machines rather than different jobs on the same machine.

## The general property of trust boundaries

The security literature defines a trust boundary as the line between a trusted part of a system and an untrusted part, where controls must be applied to anything crossing it (https://datatracker.ietf.org/doc/html/draft-ietf-dtn-bpsec-02, w 0.54). Runner admission is exactly the placement of that line for CI compute: on one side sits the host with its credentials, disks, and attached hardware; on the other sits every workflow any admitted repository can define. Admission before execution means the line is drawn by an administrator, once, and every later job crosses it on inherited terms.

## Summary

Runner admission is a trust boundary decision that precedes every job. Registration level determines blast radius (org-level registration multiplies it across repositories, w 0.97); hosted runners dissolve the boundary by rebuilding the machine per job (w 0.85); runner groups and workflow scoping narrow admission after the fact (w 0.87); runtime monitoring compensates but cannot redraw the line (w 0.82). The admission decision is the cheapest and most durable control in the runner privilege stack.
