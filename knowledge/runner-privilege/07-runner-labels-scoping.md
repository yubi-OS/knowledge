# Runner labels and workflow scoping: routing jobs to the right machines

Scope: how runs-on labels and runner groups decide which workflows reach which hosts, and why label discipline is an admission control rather than a scheduling convenience.

## The routing primitive

Every GitHub Actions job declares where it may run with `runs-on`. For GitHub-hosted runners the value is a workflow label or the name of a runner group (https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job, w 0.85). The same mechanism governs self-hosted runners: labels attached at registration time define the job classes a host will accept. The Enterprise Cloud documentation mirrors this for private and internal repositories, where jobs using the standard workflow labels run on virtual machines with fixed specifications (https://docs.github.com/en/enterprise-cloud@latest/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job, w 0.79).

The routing decision is made before the job executes, which makes it an admission decision in the same sense as registration level: a host labeled `ci-general` will accept any job that asks for `ci-general`, from any repository that can reach the runner group.

## Runner groups: policy above labels

Runner groups sit above labels as an organizational policy layer. GitHub's runner groups feature lets administrators enforce consistent usage of self-hosted runner groups across an organization and enterprise and to secure self-hosted runners by limiting them to specific workflows (https://github.blog/news-insights/product-news/github-actions-secure-self-hosted-runners-specific-workflows/, w 0.87). Access to self-hosted runners in an organization can be limited by policy (https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/manage-access, w 0.93). Organization owners with the relevant fine-grained permissions can enable, disable, and limit GitHub Actions per organization (https://docs.github.com/en/enterprise-server@latest/organizations/managing-organization-settings/disabling-or-limiting-github-actions-for-your-organization, w 0.84).

Enterprise administrators can go further and disable repository-level self-hosted runners across an organization or enterprise, removing the ability of individual repositories to register their own runners (https://github.blog/changelog/2023-06-13-github-actions-you-can-now-disable-repo-level-self-hosted-runners-in-an-enterprise-and-organization/, w 0.94). This is scoping as an architectural choice: runner registration becomes an enterprise decision, not a repository one, which prevents the quiet accumulation of one-off runners with unclear admission.

## The workflow-scoping pattern

The combination that matters for privilege is: a dedicated runner group, restricted to specific workflows, holding a dedicated host. GitHub's product announcement describes exactly this pattern for securing self-hosted runners (w 0.87). Applied to a hardware-attached lab host, the pattern means: the host carries a label used by only one or two workflows, the runner group admits only those workflows, and the group's access policy lists only the repositories that legitimately need the hardware. A job that does not declare the hardware label cannot land on the host, no matter what its workflow file says.

## Failure modes when scoping is loose

1. Label collapse. If multiple job classes share one label, any workflow using that label is admitted to every host carrying it. The production-versus-nonproduction split that practitioners attempt with conditions only works if the underlying labels actually separate the hosts (https://stackoverflow.com/questions/71961921/specify-runner-to-be-used-depending-on-condition-in-a-github-actions-workflow, w 0.04, low weight; the underlying docs-backed mechanism is in w 0.85 above).

2. Default-label drift. A job written with a generic label (for example `self-hosted`) matches every host that self-registers with the default label. GitHub's own guidance treats precise labels as the routing primitive (w 0.85), and enterprise-level disabling of repo-level runners removes the source of untracked default-label hosts (w 0.94).

3. Group-versus-label confusion. Labels route within the pool of runners a group exposes; groups decide which workflows and repositories can reach the pool at all. Using labels alone when groups are available leaves admission policy implicit in workflow files, where any committer can change it.

## Summary

`runs-on` labels are the routing primitive for both hosted and self-hosted capacity (w 0.85, w 0.79). Runner groups add the policy layer: consistent group usage across the organization, limitation to specific workflows (w 0.87), policy-limited access (w 0.93), and enterprise-wide disabling of repo-level runners (w 0.94). Scoping discipline turns runner selection from a scheduling detail into an admission control: the right label on the right group keeps untrusted jobs off hosts that cannot afford them.
