# 03 - Supported registries and their credential mapping

Scope: the registry table the skill teaches, Docker Hub, GHCR, quay.io, dhi.io, and the any-OCI fallback, with each registry's credential source.

Grounding spine: source doc `yubi-OS/yubiOS skills/docker-login-action/SKILL.md` (Supported registries section).

## The table as the source doc states it

| Registry | registry value | Credential |
|---|---|---|
| Docker Hub | omit | DOCKERHUB_TOKEN secret |
| GHCR | ghcr.io | GITHUB_TOKEN (auto, packages: write) |
| quay.io | quay.io | quay robot account token |
| dhi.io | dhi.io | dhi.io credentials |
| Any OCI | hostname | username + password |

(Source doc, Supported registries.) The mapping is the skill's core knowledge: the `registry` input is a hostname, and the credential varies per registry, not per action.

## Docker Hub: the default

Omitting `registry` logs in to Docker Hub. The credential is a `DOCKERHUB_TOKEN` secret, a stored access token rather than the account password (source doc). Docker's GitHub Actions guide follows the same shape: the workflow authenticates with Docker credentials, a username and an access token, before pushing to Docker Hub (https://docs.docker.com/guides/gha/, weight 0.81). Docker Hub is the registry the upstream action was built around first; it is the default target of the action's own examples (https://github.com/docker/login-action, weight 0.96).

## GHCR: GitHub Container Registry

GHCR takes the hostname `ghcr.io` and uses the workflow's automatic `GITHUB_TOKEN` (source doc). GitHub's Container registry documentation states that you can store and manage Docker and OCI images in the Container registry, and that GitHub Packages authenticates with the `GITHUB_TOKEN` in Actions workflows (https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry, weight 0.96). Publishing and installing packages with GitHub Actions is documented first-party as well (https://docs.github.com/en/packages/managing-github-packages-using-github-actions-workflows/publishing-and-installing-a-package-with-github-actions, weight 0.93). The packages: write permission requirement comes from the source doc and is covered in doc 04.

## quay.io: robot accounts

quay.io takes the hostname `quay.io` and a quay robot account token (source doc). Robot accounts are quay.io's service identity: Quay's own documentation explains that robot accounts can be shared by multiple repositories owned by a user or organization, and that creating one yields a username of the form namespace+accountname (https://docs.quay.io/glossary/robot-accounts.html, weight 0.93). Red Hat's Quay documentation describes the same mechanism for Red Hat Quay, where credentials are generated and associated with the robot account (https://docs.redhat.com/en/documentation/red_hat_quay/3/html/about_quay_io/allow-robot-access-user-repo, weight 0.90). In the source doc's yubiOS pattern the robot token lands in `${{ secrets.QUAY_TOKEN }}` (source doc).

## dhi.io: Docker Hardened Images

dhi.io is Docker's registry for Docker Hardened Images. The source doc lists `dhi.io` with dhi.io credentials (source doc). Docker's DHI documentation says to run `docker login dhi.io` to authenticate, and distinguishes two registries: use dhi.io for community images pulled directly from Docker Hardened Images, and docker.io for mirrored repositories (https://docs.docker.com/dhi/how-to/use/, weight 0.85). The DHI quickstart covers subscription setup, mirroring repositories, and accessing compliance verification (https://docs.docker.com/dhi/get-started/, weight 0.88). Mirroring itself requires a DHI Select or Enterprise subscription; without one you can pull images directly from dhi.io without mirroring (https://docs.docker.com/dhi/how-to/mirror/, weight 0.84). DHI is described as a set of secure, minimal, production-ready base images (https://docs.docker.com/dhi/, weight 0.80).

## Any OCI-compatible registry

The source doc's final row is the fallback: any OCI registry, addressed by hostname, with a username plus password pair (source doc). The upstream README's registry coverage is broader than the yubiOS table; a weak third-party analysis counts the action as providing unified authentication support for over 10 different container registries, each with its own authentication requirements and URL patterns (https://deepwiki.com/docker/login-action/2.2-registry-support, weight 0.10, weak source). Among the ones the upstream README itself documents: Google Artifact Registry with a service account key (https://github.com/marketplace/actions/docker-login, weight 0.55), Azure Container Registry via OpenID Connect (https://github.com/docker/login-action, weight 0.96), and AWS ECR. For ECR there is also a first-party dedicated action, aws-actions/amazon-ecr-login, which logs the local Docker client in to ECR Private or ECR Public registries (https://github.com/aws-actions/amazon-ecr-login, weight 0.78); using it is an alternative to login-action for ECR, not a contradiction of the source doc's any-OCI row.

## Registries the table deliberately does not enumerate

The source doc's table is a yubiOS-focused subset, not an exhaustive list. Anything with a hostname and an OCI endpoint is reachable through the last row. What the table does not cover is a registry whose auth model is not username/password shaped at all, for example short-lived token exchanges handled by dedicated provider actions; those are out of scope for this skill and are handled by the provider's own login action.

## Summary

The mapping is the skill: pick the hostname, pick the credential source, log in before pushing. Docker Hub is the default with a stored access token; GHCR rides the automatic GITHUB_TOKEN; quay.io uses robot accounts; dhi.io uses Docker Hardened Images credentials; everything else OCI-compatible takes hostname plus username and password (source doc).
