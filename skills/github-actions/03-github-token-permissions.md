# 03 - GITHUB_TOKEN permissions

Scope: what the ephemeral GITHUB_TOKEN can do, the permission scopes yubiOS grants in workflows, job-level scoping, and the org-level defaults that sit underneath all of it.

## What GITHUB_TOKEN is (source doc)

The SKILL.md defines GITHUB_TOKEN as an ephemeral token scoped to the repo, and the rule is to grant only what each job actually needs. It is not a PAT and not an org credential; it exists only inside a running workflow and its default permissions are configurable at the repository or organization level (https://github.blog/changelog/2021-04-20-github-actions-control-permissions-for-github_token/, w 0.91). That 2021 change is what made restrictive defaults possible: the options were read/write for all scopes (the old default) or a restrictive default starting at `contents: read`, which GitHub notes is sufficient for any workflow that just needs to clone and build (https://github.blog/changelog/2021-04-20-github-actions-control-permissions-for-github_token/, w 0.91).

## The permission vocabulary

The SKILL.md lists the permissions yubiOS workflows actually use, each tied to a job type:

| Permission | Unlocks |
|---|---|
| contents: read | read the repo |
| contents: write | create releases, push to the repo |
| packages: write | push to GHCR (ghcr.io) |
| id-token: write | SLSA provenance, OIDC |
| attestations: write | actions/attest |
| pages: write | actions/deploy-pages |
| pull-requests: write | post PR comments |
| issues: write | post issue comments |
| actions: read | read workflow run artifacts |

The minimal grant for a read-only build is `permissions: contents: read` alone (source doc). GitHub's tutorial on authenticating with GITHUB_TOKEN confirms the token is accessible through the `github.token` context even when the workflow does not explicitly pass it to an action, which is why an explicit permissions block is the only real control (https://docs.github.com/en/actions/tutorials/authenticate-with-github_token, w 0.97).

## Job-level scoping

The SKILL.md shows the scoping pattern: declare a permissive-enough set per job, not per workflow:

```yaml
jobs:
  build:
    permissions:
      contents: read
      id-token: write
  deploy:
    permissions:
      pages: write
      id-token: write
```

Job-level permissions replace the workflow-level defaults for that job only, which limits blast radius (source doc). The GitHub tutorial covering assigning permissions to jobs is the reference for this pattern (https://docs.github.com/actions/using-jobs/assigning-permissions-to-jobs, w 0.96).

Two yubiOS-relevant specifics:

- `id-token: write` is the OIDC permission. Setting it to write is required for a job to request an OpenID Connect JWT from GitHub's OIDC provider (https://stackoverflow.com/questions/72183048/what-is-the-permission-scope-of-id-token-in-github-action, w 0.1, weak backing: Stack Overflow). The authoritative chain is the actions/attest README, which requires both `id-token: write` and `attestations: write` and explains that the id-token permission mints the OIDC token needed to request the attestation signing flow (https://github.com/actions/attest, w 0.87).
- Concerns that `id-token: write` grants broader write access are common; the deploy-pages maintainers addressed the confusion in a public issue, and the practical reading is that id-token grants the OIDC mint, not arbitrary write (https://github.com/actions/deploy-pages/issues/329, w 0.69).

## Org-level defaults underneath

The org-level Actions permissions API sets the default workflow permissions every repo inherits: `GET/PUT /orgs/{org}/actions/permissions/workflow` returns `default_workflow_permissions` (read or write) and `can_approve_pull_request_reviews` (source doc, with the REST reference at https://docs.github.com/en/rest/actions/permissions, w 0.96). The SKILL.md example sets `default_workflow_permissions: write` with `can_approve_pull_request_reviews: false`; the safer posture many orgs take is a read default with explicit per-workflow grants (source doc shows both the endpoint and the pattern; yubiOS's own setting is read from the API, not assumed).

## Least privilege in practice

Third-party checklists agree on the mechanics: explicit top-level permissions, read-only defaults, narrowly scoped job-level writes (https://starsling.dev/best-practices/github-actions/limit-github-actions-permissions, w 0.13, weak backing: practitioner blog). A monitoring approach exists for teams that cannot guess the right grants up front: GitHubSecurityLab's actions-permissions action observes what a workflow actually uses and proposes a minimal policy (https://github.com/GitHubSecurityLab/actions-permissions, w 0.48, weak backing: below the 0.5 line, useful as a pointer only). The yubiOS discipline avoids the discovery step: the SKILL.md's table maps each known job type to its known permission, so new workflows start from the table, not from monitoring.

One hard boundary carries over from doc 04: no GITHUB_TOKEN configuration can grant workflow-file write. That block is a platform rule, not a permissions setting, and is covered next.
