# 04 - PAT Hazards: Why the Unbounded Token Lost

Scope: why personal access tokens are the credential of last resort, the specific hazards that make them so, and why yubiOS removed its same-repo PAT.

## The scope problem

A PAT's defining hazard is what it is not: bounded. The GITHUB_TOKEN is scoped to the repository it runs in, so it cannot cross repo boundaries (weight 0.16, weak backing, https://github.com/orgs/community/discussions/21068). A PAT can. That capability is sometimes the point, but it means the blast radius of a leaked PAT is every repo, org scope, and external service the token can reach, while the blast radius of the automatic token is one repository for one run.

GitHub's own guidance points the same way: when you use a personal access token in a GitHub Actions workflow, consider whether you can use the built-in GITHUB_TOKEN instead (weight 0.97, https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens). GitHub also documents that fine-grained personal access tokens have several security advantages over classic PATs, though with limitations that may prevent using them in every scenario (weight 0.97, same URL). So even when a PAT is structurally required, the token class matters.

## The cascade problem

The second hazard is behavioral. Pushes made with `github.token` do not trigger other workflows' `on:` events; pushes made with a PAT do (source doc, yubi-OS/yubiOS playbooks/github-token-vs-secrets.md). The GitHub community discussion confirming the GITHUB_TOKEN side of this, with a PAT recommended as the workaround to restore the cascade, carries weak backing at weight 0.19 (https://github.com/orgs/community/discussions/25702). The inverse, that a PAT-made push fires `on: push` workflows, is the documented exception surface: GitHub's trigger docs carve out `workflow_dispatch` and `repository_dispatch` as the always-run events for GITHUB_TOKEN and note the recursion-prevention purpose of the suppression (weight 0.94, https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow).

For the playbook this cuts both ways. Cascade behavior is a hazard when you did not want it (a PAT-bearing workflow commit re-triggering CI), and it is the legitimate reason to reach for a named secret when you truly need the chain (doc 05).

## The lifetime problem

A PAT is a long-lived credential. That is the third hazard: CI/CD pipelines often use long-lived credentials to access external services, and secrets exfiltration is one of the primary outcomes GitHub Actions security work aims to prevent (weight 0.63, https://cheatsheetseries.owasp.org/cheatsheets/GitHub_Actions_Security_Cheat_Sheet.html). Contrast the automatic token: an installation access token refreshable for up to 24 hours (weight 0.97, https://docs.github.com/en/actions/concepts/security/github_token), designed for roughly 60 minute ephemeral runners (weight 0.67, https://github.com/actions/runner/issues/4248). A credential that expires with the job needs no rotation discipline. A credential that outlives the job becomes an inventory item, and inventories rot.

## The GH_TK case

The source doc records the concrete instance: `GH_TK` was a same-repo PAT used where `github.token` would do. PR #148 (branch `ci/remove-gh-tk-references`, commit `a49e95db`, 2026-07-29) removed all 6 of its references across 3 workflow files, replacing them with `github.token` (source doc). The replacement was possible precisely because the uses were same-repo, single-run: checkout tokens, a dead env var, and `git push` lines. None of them needed a PAT's powers, so all of them were exposed to a PAT's risks for nothing.

The cleanup principle the playbook records: after the references are gone, the secret itself is referenced by no workflow and can be deleted from repo Settings, closing the loop (source doc). A named secret that no workflow reads is pure attack surface.

## Takeaway

Treat a PAT as a structural tool, not a convenience: reach for it only when the bounded token cannot do the job (cross-repo, external service, outliving the run, triggering a cascade), scope it as narrowly as the task allows, and delete it the day the references disappear.
