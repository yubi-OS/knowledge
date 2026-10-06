# 02 - Action reference: the step shape and its inputs

Scope: the docker/login-action step as the source doc writes it, the three inputs it uses, and the input surface the upstream action actually exposes.

Grounding spine: source doc `yubi-OS/yubiOS skills/docker-login-action/SKILL.md` (Action reference section).

## The step shape the skill teaches

The source doc's action reference is a three-input step:

```yaml
- uses: docker/login-action@v3
  with:
    registry: ghcr.io          # omit for Docker Hub
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}
```

Three observations the source doc encodes (source doc):

1. `registry` is optional. Omit it and the action logs in to Docker Hub, the default registry.
2. `username` and `password` are always explicit in the skill's examples. Nothing is implied.
3. The version pin is `@v3`.

The action itself is published by Docker as "GitHub Action to login against a Docker registry" (https://github.com/docker/login-action, weight 0.96). The Marketplace entry carries the same description and the same input surface (https://github.com/marketplace/actions/docker-login, weight 0.60).

## The three inputs in detail

### registry

The registry hostname to authenticate against. The source doc's supported-registries table maps values: omit for Docker Hub, `ghcr.io` for GHCR, `quay.io` for quay.io, `dhi.io` for dhi.io, and a hostname for any OCI-compatible registry (source doc). A weak third-party reference confirms the default behavior: docker/login-action authenticates the Docker CLI to a registry, with Docker Hub, GHCR, and cloud registries among the examples (https://latchkey.dev/learn/actions/docker/login-action, weight 0.13, weak source).

### username

The identity the registry checks. The source doc uses `${{ github.actor }}` for GHCR, the workflow's own actor, paired with the automatic `GITHUB_TOKEN`. For quay.io the source doc pulls the username from a secret, `${{ secrets.QUAY_USERNAME }}` (source doc, yubiOS pattern). Third-party registry guides follow the same split: a well-known default identity for GHCR, a stored credential pair everywhere else (https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry, weight 0.96).

### password

The credential. For GHCR it is `${{ secrets.GITHUB_TOKEN }}`; the source doc notes it is automatically available and needs no extra secret (source doc, Notes). For quay.io it is `${{ secrets.QUAY_TOKEN }}` (source doc). The Marketplace documentation extends the input to other registries: Google Artifact Registry uses a service account key downloaded as JSON (https://github.com/marketplace/actions/docker-login, weight 0.55), and Azure Container Registry can be reached through OpenID Connect by configuring a federated identity credential, using the Azure Login action, then exposing an ACR access token to the login step (https://github.com/docker/login-action, weight 0.96).

## The scope input the source doc does not mention

The upstream action has grown an input the source doc does not cover: `scope`. The README states the scope input allows limiting registry credentials to a specific repository or namespace scope when building images with Buildx, and that this is useful in GitHub Actions to avoid overriding credentials for other registries (https://github.com/docker/login-action, weight 0.96; also https://github.com/marketplace/actions/docker-login, weight 0.60). For a multi-registry job this matters: without scoping, one login's stored credentials can shadow another's in the Docker config. The source doc predates this; treat `scope` as a dated 2026-10-06 addition observed upstream, not as part of the skill's canon.

## Version drift: v3 to v4

The source doc pins `docker/login-action@v3`. The upstream README's collected examples now show `docker/login-action@v4`, for example its "Login to GitHub Container Registry" sample (https://github.com/docker/login-action, weight 0.96). This is drift, not contradiction: the input contract (`registry`, `username`, `password`, and now `scope`) is unchanged between the two. Dated correction 2026-10-06: prefer the latest major tag the upstream README advertises when starting a new workflow; the source doc's v3 pin remains valid for existing yubiOS workflows.

## How the action executes a login

A weak third-party mirror describes the execution model: the action authenticates a GitHub Actions runner to one or more Docker-compatible container registries, wrapping `docker login`, and for certain registries performs additional credential exchange (https://deepwiki.com/docker/login-action, weight 0.09, weak source). A Forgejo mirror of the action README repeats the registry/scope surface (https://forgejo.mixinet.net/docker/login-action, weight 0.54). The strong primary source remains the upstream repo itself (weight 0.96).

## What the inputs do not cover

The action does not build, tag, push, or attest. Those belong to docker/build-push-action and docker/metadata-action. The source doc's boundary rule applies: every use of this skill stays inside the frontmatter description's scope, and anything beyond registry authentication is a different skill's job (source doc, Guidelines).
