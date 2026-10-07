# 01 - yubiOS hard rules and the approved action allowlist

Scope: the four AGENTS.md rules every workflow in yubi-OS must follow, the approved action SHA table, and the organization-level enforcement mechanisms that make pinning and allowlisting work.

## The four hard rules (source doc)

The ground source (`yubi-OS/yubiOS skills/github-actions/SKILL.md`) states four rules that every workflow in `yubi-OS/*` must follow, taken from AGENTS.md:

1. All action refs must be pinned to a full commit SHA. No `@v4`, no `@main`.
2. The container image must use the approved dhi.io digest, or the job must run without a container.
3. Only approved actions are allowed, per the allowlist maintained in AGENTS.md.
4. Workflow files live at `<repo>/.github/workflows/*.yml` and are edited directly through the sole GitHub connection `conn_3h7rj41VF6hs` ("MASTER GIT SU", a fine-grained PAT). The older staging convention of writing to `<repo>/2026/<name>.yml` or `refs/<name>.yml` was retired as of 2026-07-09.

Rule 1 is the load-bearing one for supply chain security. GitHub's own changelog states that pinning dependency versions to a specific commit SHA prevents malicious code added to a new or updated branch or tag from being executed automatically (https://github.blog/changelog/2025-08-15-github-actions-policy-now-supports-blocking-and-sha-pinning-actions/, w 0.85). A tag is mutable; a SHA is not.

## The approved action SHA table (source doc)

The SKILL.md pins these exact SHAs, and the rule is "commit these exact SHAs, no floating refs":

| Action | SHA | Note |
|---|---|---|
| actions/checkout | de0fac2e4500dabe0009e67214ff5f5447ce83dd | v6.0.2 |
| actions/attest | 59d89421af93a897026c735860bf21b6eb4f7b26 | |
| actions/configure-pages | 45bfe0192ca1faeb007ade9deae92b16b8254a0d | |
| actions/deploy-pages | cd2ce8fcbc39b97be8ca5fce6e763baed58fa128 | |
| actions/upload-artifact | bbbca2ddaa5d8feaa63e36b76fdaad77386f024f | |
| actions/upload-pages-artifact | fc324d3547104276b827a68afc52ff2a11cc49c9 | |
| docker://dhi.io/debian-base | sha256:9415967aa0ed8adea8b5c048994259d1982026dca143d0303c7bbe0e11ed67d3 | container image |
| docker://ghcr.io/actions/jekyll-build-pages | sha256:6791ebfd912185ed59bfb5fb102664fa872496b79f87ff8b9cfba292a7345041 | Pages builds |
| 0mniteck/.pki/.github/*/*@* | wildcard entry | internal PKI workflows only |

Adding a new action requires an explicit entry in AGENTS.md first. The SKILL.md is explicit: never silently introduce an unpinned or unapproved action, because the Build Policy and supply chain controls exist for a reason (source doc).

## Why the allowlist and pinning pair together (digs)

The organization-level allowlist is the enforcement layer above the per-workflow pin. GitHub documents that an organization can disable GitHub Actions entirely or limit it to specific actions and reusable workflows (https://docs.github.com/github/setting-up-and-managing-organizations-and-teams/disabling-or-limiting-github-actions-for-your-organization, w 0.97). At the enterprise tier, admins can enforce policies for GitHub Actions across organizations, including which actions are permitted to run (https://docs.github.com/enterprise-cloud@latest/admin/enforcing-policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-github-actions-in-your-enterprise, w 0.96).

As of 2025-08-15 GitHub also shipped native policy support for blocking and SHA-pinning actions at the organization level, which means the pinning rule yubiOS enforces through AGENTS.md can now be backed by a platform control rather than review discipline alone (https://github.blog/changelog/2025-08-15-github-actions-policy-now-supports-blocking-and-sha-pinning-actions/, w 0.85). Under the native policy, an organization can require that third-party actions be pinned to a full length commit SHA; a workflow referencing a mutable tag is blocked before it runs (https://latchkey.dev/learn/github-actions/github-actions-actions-allowlist-blocks-third-party-action, w 0.12, weak backing: a secondary tutorial site, but consistent with the changelog announcement).

A practical gap worth noting: pinning stops tag mutation, but it does not update itself. Community guidance is to pair SHA pinning with Dependabot so the pinned SHAs receive pull requests when the upstream action releases a new version (https://tomodahinata.com/en/blog/dependabot-github-actions-sha-pinning-supply-chain-security-guide, w 0.2, weak backing: personal blog). The yubiOS equivalent is a deliberate AGENTS.md edit: the SHA table changes only through an explicit, reviewed change.

## Editing workflow files under these rules

Because rule 3 restricts which actions may be referenced, and rule 4 restricts where workflow files live, the operational path in yubiOS is: edit `<repo>/.github/workflows/*.yml` via the Contents API using the MASTER GIT SU connection, reference only actions from the SHA table, and open an AGENTS.md change first when a new action is needed. The `workflow` scope requirement that governs whether such writes succeed at all is covered in doc 04.
