# 08 - Failure Modes and the Hygiene Audit

Scope: the playbook's three failure modes, the audit one-liners that catch drift, the secrets inventory as an audit boundary, and the open gap of no central `permissions:` audit.

## The three failure modes

The source doc (yubi-OS/yubiOS playbooks/github-token-vs-secrets.md) records 3 failure modes:

1. 403 on a callback or push. The `permissions:` block lacks the scope, or the org default moved. The fix is the block, not a PAT. The source doc's specific concern: only `ci.yml` declares `permissions: actions: write` at top level, while the 24 child workflows rely on per-job or inherited grants, which is the latent 403.
2. Push lands, downstream workflow never fires. Expected with `github.token` (doc 02's cascade suppression). If the cascade is truly needed, that is the legitimate named-secret case; yubiOS dispatches explicitly instead.
3. `actions/checkout` auth failure. Check the pinned action SHA before blaming the token. That was the real root cause behind PR #147 (source doc), the diagnostic inversion recorded in doc 06.

## Platform grounding for the 403

GitHub documents the 403 "Resource not accessible by integration" error and the mechanism behind it: a workflow run is considered untrusted, for example when Dependabot triggers it, and the token runs with read-only scopes, so writes fail (weight 0.92, https://docs.github.com/en/code-security/reference/code-scanning/troubleshoot-analysis-errors/resource-not-accessible). The general shape matches failure mode 1: the effective token scope at run time is the thing to inspect, and the effective scope is computed from the defaults chain plus the block (doc 03).

## The audit one-liners

The source doc's audit commands, run from the repo root:

```bash
rg -n 'GH_TK' .github/workflows/ && echo STALE || echo clean   # expect zero hits
rg -n 'secrets\.[A-Z_]+|github\.token' .github/workflows/ | sort -u
for f in .github/workflows/*.yml; do
  grep -q '^permissions:' "$f" || echo "no top-level permissions: $f"; done
```

The 3 checks map to the 3 disciplines of the playbook: no stale PAT references, a complete inventory of every credential reference, and a declared `permissions:` block in every workflow. The middle one is the decision matrix made greppable: every `secrets.X` reference is either a legitimate matrix row (doc 05) or a regression.

## The secrets inventory as audit boundary

GitHub's secrets model enforces read-on-explicit-use: GitHub Actions can only read a secret if the secret is explicitly included in the workflow (weight 0.97, https://docs.github.com/en/actions/concepts/security/secrets). That is what makes the inventory grep an audit boundary rather than a suggestion: the grep's output is the complete list of workflows with access to each secret.

Per the source doc, the current inventory is `DOCKER`, `WORKFLOW` (cross-repo dispatch in the fetch-* family), and `GITHUB_TOKEN` (declared on `ci_test-vgpu-vm.yml`). Each named secret has an owning workflow family; a new consumer outside that family is a decision-matrix event.

## The open gap

The source doc records the gap: there is no central `permissions:` audit, tracked as Gap 11 / Linear candidate 11. The audit one-liners are per-invocation, run by hand; nothing in the repo continuously verifies that every workflow declares a block and that no workflow grants more than its matrix row requires. External tooling exists for parts of this: a scanner that enumerates an org's workflow files and checks permissions and dangerous triggers carries weak backing at weight 0.19 (https://github.com/rapidfort/gh-action-security-audit), and a security-audit survey covering token scope and action pinning carries weak backing at weight 0.18 (https://blog.openreplay.com/github-workflow-security-audit/). Neither closes Gap 11 for yubiOS; they are recorded as weak context for whoever picks the candidate up.

## Takeaway

The failure modes are diagnosable from the same artifacts the audit greps: a 403 points at the block or the org default, a silent downstream points at the cascade suppression, and a checkout auth failure points at the pinned SHA first. The audit one-liners are the manual stand-in for the missing central audit.
