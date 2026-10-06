# 05 - Secret existence validation: API mode and allowlist mode

Scope: verifying that referenced secrets actually exist: the GitHub REST endpoint to list repo secrets, best-effort online mode, and the offline allowlist fallback.

## The REST surface

GitHub's REST API exposes create, update, delete, and retrieval endpoints for the secrets that can be used in workflows in GitHub Actions (https://docs.github.com/en/rest/actions/secrets, weight 0.78). The repository-scoped listing endpoint returns all secrets available in a repository without revealing their encrypted values, and requires an access token with the appropriate repo scope (https://tryapis.com/github/api/actions-list-repo-secrets/, weight 0.05, weak backing, third-party API directory; the endpoint itself is documented in the official docs source at https://github.com/github/docs/blob/main/content/rest/actions/secrets.md, weight 0.94). The broader Actions REST surface is documented alongside it (https://docs.github.com/en/rest/actions, weight 0.70).

For an audit script, `GET /repos/{owner}/{repo}/actions/secrets` in online mode returns the authoritative set of secret names. The audit then set-differences: every `secrets.X` reference found in workflow YAML that is not in the returned set is an UNKNOWN_SECRET finding. This is the "best-effort online" mode in the yubiOS design, gated behind `--offline` being false, because it requires credentials and network access that a laptop run may not have.

## What happens when a referenced secret does not exist

The failure mode for a phantom secret reference is documented in community and Q&A sources: referenced secrets that do not exist resolve to an empty string rather than failing the workflow, with the special case that GITHUB_TOKEN is predefined and always present (https://stackoverflow.com/questions/67972124/github-return-empty-string-as-secrets-while-running-actions, weight 0.05, weak backing). The same emptiness applies to scope gaps: secrets are not passed to the runner for workflows triggered from forked repositories (with the GITHUB_TOKEN exception), so the workflow runs but the secret is absent (https://stackoverflow.com/questions/58737785/github-actions-empty-env-secrets, weight 0.07, weak backing). Community troubleshooting checklists enumerate the causes: the workflow must have a secrets context containing the value, and permission or environment protection rules can block access (https://github.com/orgs/community/discussions/50912, weight 0.21, weak backing). Practitioner writeups of the empty-secret debugging experience list secret scope, fork PR restrictions, environment protection rules, and secret-name mismatches as the recurring causes (https://fixdevs.com/blog/github-actions-secret-not-available/, weight 0.08, weak backing).

This empty-string behavior is why the audit treats a retired-secret reference as ERROR rather than assuming it would fail loudly: a `secrets.GH_TK` reference against a deleted secret does not crash the workflow at parse time, it silently substitutes an empty string, and the job either fails downstream in a confusing way or, worse, proceeds with degraded behavior.

## Offline mode and the allowlist

Offline mode (`--offline`) skips the API call entirely and validates references against a checked-in allowlist file, `scripts/audit-workflow-tokens.allowlist.yaml`. The allowlist design has three properties:

1. It lists known repo secrets by name, with a comment on each saying what it is for, so the file is self-documenting (for example DOCKER, used for dhi.io registry auth).
2. It explicitly notes that GITHUB_TOKEN is auto-injected by GitHub Actions and does not need declaring, but is allowlisted for clarity; GitHub's own secrets documentation confirms the three levels (repository, environment, organization) where secrets live (https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets, weight 0.97).
3. It deliberately does not contain retired secrets; GH_TK's absence from the list is what makes a stray reference surface as a finding, and the file carries a comment saying exactly that.

The tradeoff between the modes is trust versus availability: online mode is authoritative but requires a credential with secrets-read scope and network access; offline mode is runnable anywhere, including from a CI job with no extra permissions, but stale by definition, which is why an allowlist mismatch is only a WARN and the allowlist file itself is included in the CI gate's path filter so changes to it re-trigger the audit.

## A caveat about what the API cannot see

The list-secrets endpoint enumerates repo-level secrets; environment-scoped secrets and organization secrets live in separate API surfaces. An audit that only checks the repo list will produce false UNKNOWN_SECRET findings for workflows that legitimately consume environment-scoped secrets. The allowlist mode is the pragmatic mitigation for this gap in the yubiOS design: known legitimate references are allowlisted even when the repo-level API cannot see their source. This limitation is inherent to the API surface split documented across the secrets endpoints (https://docs.github.com/en/rest/actions/secrets, weight 0.78).
