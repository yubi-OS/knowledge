# 01 - When to use and where to place the login step

Scope: when a GitHub Actions job needs docker/login-action, where the step belongs in the job, and the ordering rule the skill teaches.

Grounding spine: source doc `yubi-OS/yubiOS skills/docker-login-action/SKILL.md` (frontmatter description and When to use section).

## The rule: login before any push

The source doc's core directive is that docker/login-action authenticates to a container registry before pushing images. It states the step must precede any `docker/build-push-action` step that pushes (source doc, Notes section). This is an ordering contract, not a suggestion: a build step that pushes before a login step runs will fail authentication, because the registry sees an anonymous request. The Docker CLI reference confirms the same model for manual use: `docker login` authenticates to any public or private registry for which you have credentials, and authentication may be required for pulling and pushing (https://docs.docker.com/reference/cli/docker/login/, weight 0.94).

The GitHub Action is a wrapper around exactly this flow. The upstream repository describes docker/login-action as the "GitHub Action to login against a Docker registry" (https://github.com/docker/login-action, weight 0.96). A third-party walkthrough (weak source, weight 0.15) describes it the same way: it authenticates the Docker CLI to a registry using credentials you supply, so later push steps succeed (https://latchkey.dev/learn/actions/docker/login-action). The DeepWiki mirror says the action "wraps docker login" for the runner (https://deepwiki.com/docker/login-action, weight 0.09, weak source, treat as corroboration only).

## Placement: start of any pushing job

The source doc says to place the login step at the start of any job that pushes to a registry (source doc, When to use). Concretely this means the step sits after checkout (and after any buildx setup when using build-push-action), and before the first build or push that touches the registry. Docker's own GitHub Actions guide for pushing to Docker Hub follows this shape: the workflow pushes the built image to Docker Hub, so it must first authenticate with Docker credentials, the username and access token (https://docs.docker.com/guides/gha/, weight 0.81).

The official action README's examples all place login immediately before the build-push step, and the login step carries the job's credentials at the point of first registry contact (https://github.com/docker/login-action, weight 0.96). The Marketplace page for the action repeats the same usage pattern (https://github.com/marketplace/actions/docker-login, weight 0.60).

## What login buys you, and how long it lasts

Two properties the source doc calls out (Notes section):

1. Login persists for the job. No explicit logout is needed. The credentials written by the action live in the runner's Docker config for the remainder of that job.
2. GHCR needs no extra secret. For GitHub Container Registry the `GITHUB_TOKEN` is automatically available, so the login step can reference it directly (source doc). This is confirmed by GitHub's docs: the Container registry supports the `GITHUB_TOKEN` for authentication in workflows (https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry, weight 0.96).

Credentials do not cross jobs. A weak third-party source on the ECR login action notes that Docker credentials masked in logs are also prevented from being shared between separate jobs (https://deepwiki.com/aws-actions/amazon-ecr-login/7.4-using-docker-credentials-across-jobs, weight 0.30, weak source, label as weak). The practical rule matches the source doc's placement instruction: every job that pushes logs in for itself, at the top of the job.

## When to use something else

The source doc scopes this skill to docker/login-action. Two adjacent cases fall outside it and are worth naming so the boundary is clear:

- Amazon ECR has a dedicated first-party action, aws-actions/amazon-ecr-login, which "logs in the local Docker client to one or more Amazon ECR Private registries or an Amazon ECR Public registry" (https://github.com/aws-actions/amazon-ecr-login, weight 0.78). The login-action README itself documents ECR logins too (https://github.com/docker/login-action, weight 0.96), so either path can work; the dedicated action handles AWS token exchange for you.
- Local or self-hosted registry work that never touches a remote registry needs no login step at all.

## Multi-registry jobs

When one job pushes to several registries, each registry needs its own login step. Docker documents the pattern under "Push to multiple registries with GitHub Actions", where multiple login steps precede a single or multi-output push (https://docs.docker.com/build/ci/github-actions/push-multi-registries/, weight 0.93). The source doc's yubiOS pattern section encodes exactly this: two login steps, quay.io first, ghcr.io second, in one job (source doc).

## Summary

Use docker/login-action when a GitHub Actions job will push to Docker Hub, GHCR, quay.io, dhi.io, or any other OCI-compatible registry (source doc). Place it at the start of the job and strictly before any build-push step that pushes. Login persists for the job; no logout is needed. One login step per registry. Anything beyond registry authentication (building, tagging, attestation) is a different step's job, per the source doc's Guidelines section.
