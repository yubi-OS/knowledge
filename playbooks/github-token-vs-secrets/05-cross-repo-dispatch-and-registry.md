# 05 - The Legitimate Named Secrets: Cross-Repo Dispatch and Registry Login

Scope: the two named-secret rows of the yubiOS decision matrix, `secrets.WORKFLOW` for cross-repo workflow dispatch in the fetch-* family and `secrets.DOCKER` for container registry login.

## Why these two survive the matrix

The source doc (yubi-OS/yubiOS playbooks/github-token-vs-secrets.md) routes two needs away from `github.token`: dispatching a workflow in another repo goes to `secrets.WORKFLOW`, and container registry login goes to `secrets.DOCKER`. Both are structural. The GITHUB_TOKEN is scoped to the repository, so it cannot act in another repo (weight 0.16, weak backing, https://github.com/orgs/community/discussions/21068), and a registry credential is an external service the repository token knows nothing about. These are the rows where a named secret is not a convenience but the only mechanism.

## Cross-repo dispatch

The fetch-* family dispatches workflows in other repositories, which is why it carries `secrets.WORKFLOW` (source doc). The mechanism class: triggering a workflow in a different repository requires a credential with rights in the target repo, typically a PAT, used with `workflow_dispatch` or `repository_dispatch` events (weight 0.19, weak backing, https://blog.marcnuri.com/triggering-github-actions-across-different-repositories; weight 0.20, weak backing, https://github.com/marketplace/actions/workflow-dispatcher). Marketplace trigger actions state the prerequisite plainly: the target workflow needs a dispatch trigger and a PAT is needed to call it (weight 0.20, weak backing, marketplace URL above).

The source doc records a sharper alternative for yubiOS: yubiOS dispatches explicitly instead of relying on push cascades. The explicit dispatch keeps the cross-repo capability confined to one named secret read by the workflows that need it, instead of being smeared across every push-capable workflow.

## Registry login

Registry credentials are the second named-secret row. The yubiOS pattern from the source doc:

```yaml
- uses: docker/login-action@<pinned-sha>
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER }}
```

The `docker/login-action` action is the standard GitHub Action to log in against a Docker registry (weight 0.72, https://github.com/docker/login-action). Docker's own docs describe using secrets with GitHub Actions, including how secrets are mounted into the build container, and show the GITHUB_TOKEN being used alongside build secrets (weight 0.88, https://docs.docker.com/build/ci/github-actions/secrets/). The registry row is a named secret because a registry identity is external: the token GitHub mints cannot represent an account on Docker Hub or any other registry.

## The scoping discipline

Both secrets earn their place but should be no larger than the need. GitHub's secrets model already helps: GitHub Actions can only read a secret if the secret is explicitly included in the workflow (weight 0.97, https://docs.github.com/en/actions/concepts/security/secrets). That means the exposure surface of `secrets.WORKFLOW` is exactly the fetch-* workflows that name it, and `secrets.DOCKER` is exposed only to the login steps that consume it. The source doc's inventory lists `WORKFLOW` as cross-repo dispatch in the fetch-* family, which is the audit boundary: any workflow outside that family reading the secret is a regression against the decision matrix.

The OWASP GitHub Actions security cheat sheet frames the stakes: CI/CD pipelines often use long-lived credentials to access external services, and secrets exfiltration is one of the primary outcomes to prevent (weight 0.63, https://cheatsheetseries.owasp.org/cheatsheets/GitHub_Actions_Security_Cheat_Sheet.html). Registry credentials are long-lived by nature, which is exactly why the playbook keeps them as named secrets rather than embedding them in workflow code, and why doc 08's audit one-liners inventory every `secrets.*` reference.

## Takeaway

The two legitimate named secrets are the two rows `github.token` cannot serve. Keep them pinned to the workflow families that need them, keep the registry credential in a secret rather than in code, and treat any new consumer of `secrets.WORKFLOW` or `secrets.DOCKER` as a decision-matrix event, not a plumbing detail.
