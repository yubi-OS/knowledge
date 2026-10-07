# 04 - BLOCKER-001: the workflow scope requirement

Scope: why writing `.github/workflows/` files needs a special credential, the history of BLOCKER-001 in yubi-OS, the five solutions the SKILL.md enumerates, and the closed status as of 2026-07-24 with the credential re-established 2026-08-12.

## The problem

Classic personal access tokens without the `workflow` scope fail with 404 or 403 on any write that touches `.github/workflows/*.yml` (source doc, historical context). Separately, `GITHUB_TOKEN` inside a running workflow cannot modify workflow files even with `contents: write`; the SKILL.md calls this a hard GitHub security block that prevents persistent backdoor injection by a compromised workflow (source doc). Community discussion of protecting workflow files reaches the same conclusion: users with write access can modify GITHUB_TOKEN permissions, so workflow-file writes deserve stricter treatment than ordinary content writes (https://github.com/orgs/community/discussions/120676, w 0.16, weak backing: community discussion).

The failure is reproducible and well known: a PAT that can write ordinary repo contents still cannot write workflow files, and the fix is to mint the token with the workflow-scoped permissions rather than to retry with a broader classic token (https://stackoverflow.com/questions/79442837/github-pat-cannot-modify-workflow-files, w 0.08, weak backing: Stack Overflow answer, but it states the fine-grained `contents: write` + `workflows: write` pair the SKILL.md recommends).

## Status: closed

BLOCKER-001 was closed 2026-07-24, and the credential was re-established 2026-08-12 (source doc). The sole credential for all GitHub API work in yubi-OS, including workflow-file writes, is the `conn_3h7rj41VF6hs` connection ("MASTER GIT SU", a fine-grained PAT, verified live). If a `.github/workflows/**` write returns 404, the correct response per the SKILL.md is to report the missing `Workflows: Write` permission to the org owner, not to work around it (source doc).

The two confirmed scopes of the old classic PAT, for the record: `admin:org_hook, admin:repo_hook, gist, notifications, project, read:org, read:user, repo, write:discussion`, with the workflow scope absent (source doc).

## Solution A: fine-grained PAT with Workflows: Write (the recommended path)

Fine-grained PATs split the classic `workflow` scope into two separate permissions (source doc):

| Fine-grained permission | What it unlocks |
|---|---|
| Actions: Write | trigger workflow_dispatch, enable/disable workflows, cancel/re-run, manage secrets and vars |
| Workflows: Write | add, update, delete `.github/workflows/*.yml` files |

The authoritative list of fine-grained permissions is GitHub's permissions reference (https://docs.github.com/en/rest/authentication/permissions-required-for-fine-grained-personal-access-tokens, w 0.95). The setup the SKILL.md prescribes: generate a token at github.com/settings/tokens?type=beta, scope it to the yubi-OS repos, set Repository permissions to Contents: Read and write (required for the Contents API PUT) and Workflows: Read and write (required to write workflow files), store it in Sauna connections, after which `PUT /repos/yubi-OS/yubiOS/contents/.github/workflows/ci.yml` works (source doc). This is the minimal token for pushing workflow files through the API; no broad `repo` scope is needed (source doc).

The distinction matters for automation design: triggering a workflow only needs Actions: Write, which the org-level Actions API endpoints use, while writing the workflow file itself needs Workflows: Write (source doc; see doc 05 for the trigger surface).

## Solution B: gh auth refresh

For an existing gh CLI session, `gh auth refresh -h github.com -s workflow` adds the workflow scope after a browser approval, after which `gh api ... --method PUT` pushes workflow files normally (source doc).

## Solution C: GitHub web UI (fastest one-time)

Open the repo, Add file, create `.github/workflows/ci.yml`, paste, commit. No token scope needed because the human session is the credential (source doc).

## Solution D: GitHub Apps (best for org-wide automation)

A GitHub App with the `Workflows: write` repository permission pushes workflow files through the Contents API using short-lived installation access tokens that expire in 1 hour, which the SKILL.md calls the enterprise standard, replacing broad classic PATs with auditable, scoped tokens (source doc). The flow: create the app under the org, set Workflows: Read and write, install on the org, mint `POST /app/installations/{id}/access_tokens`, and use that token in the same Contents API PUT pattern (source doc).

## Solution E: staging convention (the retired default)

Stage the file at `<repo>/refs/ci.yml` for manual copy to `.github/workflows/ci.yml`. This was the default until a proper credential existed; rule 4 of the hard rules (doc 01) retired the parallel `2026/` staging convention as of 2026-07-09, and the yubiOS-ci.yml template section still mentions staging only as historical context (source doc). With the MASTER GIT SU PAT live, direct API writes are the operating path.

## Why this block exists at all

GitHub's security hardening guide treats workflow files as a privilege boundary: a workflow that could rewrite its own trigger conditions or permissions would undermine every other control (https://docs.github.com/en/enterprise-server@latest/actions/security-guides/security-hardening-for-github-actions, w 0.95). The GITHUB_TOKEN self-modification block is the runtime half of that boundary; the `workflow` scope gate is the credential half. yubiOS's supply chain posture (doc 01) depends on both halves staying intact, which is why the SKILL.md instructs reporting a 404 rather than working around it.
