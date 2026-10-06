# 03 - The permissions: Block

Scope: declaring `permissions:` with `contents: read` as the default posture, when to elevate, workflow-level versus job-level grants, and how org defaults interact with explicit blocks.

## How the effective permission is computed

The permissions for the GITHUB_TOKEN in a workflow job are initially set to the default setting for the enterprise, organization, or repository (weight 0.94, https://docs.github.com/en/enterprise-cloud@latest/actions/reference/workflows-and-actions/workflow-syntax). Organization settings can further limit or disable Actions and control the default permissions (weight 0.91, https://docs.github.com/en/organizations/managing-organization-settings/disabling-or-limiting-github-actions-for-your-organization). That chain, enterprise default to org default to repo default to workflow block, is the reason the source doc's failure mode exists: a 403 can appear when "the org default moved" even though nothing in the repository changed (source doc, yubi-OS/yubiOS playbooks/github-token-vs-secrets.md).

## The default moved under everyone, twice

GitHub changed the default GITHUB_TOKEN permissions from read/write to read-only on 2023-02-02, describing the old default as too permissive (weight 0.94, https://github.blog/changelog/2023-02-02-github-actions-updating-the-default-github_token-permissions-to-read-only/). Two years earlier, on 2021-04-20, GitHub had already introduced scoped control and stated that a default of `contents: read` is sufficient for any workflows that simply need to clone and build, with anything more specified in the workflow YAML (weight 0.90, https://github.blog/changelog/2021-04-20-github-actions-control-permissions-for-github_token/). A workflow that silently relied on write-by-default can break purely from these platform-side changes. The explicit block is the defense.

## The yubiOS posture

Per the source doc, the yubiOS default posture is:

```yaml
permissions:
  contents: read          # default posture
  # actions: write        # only for the ci-callback pattern
  # contents: write       # only for the fetch-*.yml family that commits to main
```

Two elevations are documented and each is tied to a named workflow family: `actions: write` exists so a workflow can trigger another one (the ci-callback pattern), and `contents: write` exists so the fetch-*.yml family can commit to main. The source doc records the latent 403: only `ci.yml` declares `permissions: actions: write` at top level, while the 24 child workflows rely on per-job or inherited grants.

## Workflow level versus job level

The `permissions:` block can be declared at workflow level (top of file), which sets the baseline for all jobs, or at job level, which overrides for that job (weight 0.15, weak backing, https://www.dotnetacademy.dev/lesson/workflow-permissions/243). The source doc's practice matches: top-level blocks for the families that genuinely need write everywhere they run, per-job grants elsewhere. A third-party least-privilege guide recommends read-only workflow defaults with narrowly scoped job-level write access (weight 0.16, weak backing, https://starsling.dev/best-practices/github-actions/limit-github-actions-permissions).

## Why the block is the playbook's load-bearing half

Doc 01's matrix routes same-repo work to `github.token` only with an explicit `permissions:` block. The block is what converts the automatic token from an implicit capability grant into a declared one. GitHub's own changelog framing (weight 0.94 and 0.90 above) treats the block as the sanctioned way to grant the extra scopes; the playbook treats it as the only way to keep the bounded credential honest. A missing block is not a style problem, it is the first thing to check when a 403 appears on a callback or push, before reaching for a PAT (source doc).
