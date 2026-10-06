# 09 - Bake multi-target builds

Scope: docker-bake.hcl structure (variables, groups, targets, inherits), invocation and overrides, and the --print dry run.

## What bake is

docker buildx bake reads docker-bake.hcl (or .json, or docker-compose.yml) and drives multiple build targets from one declarative file (source doc). The bake file reference is the authoritative spec for targets, groups, variables, and inheritance (https://docs.docker.com/build/bake/reference/, weight 0.90).

## The yubiOS bake file

The source doc's docker-bake.hcl declares two variables, a default group with one target, and the target itself:

    variable "REGISTRY" { default = "dhi.io/yubi-OS" }
    variable "TAG"      { default = "latest" }

    group "default" { targets = ["yubiOS"] }

    target "yubiOS" {
      context    = "."
      dockerfile = "Containerfile"
      platforms  = ["linux/amd64", "linux/arm64"]
      tags       = ["${REGISTRY}/yubiOS:${TAG}"]
      args = {
        BASE_DIGEST = "sha256:6a60ff82da9d2f73aad315233fbffe2ed880a7d695ec9940c0754f84f13db9d6"
      }
    }

The BASE_DIGEST build arg is a pinned base image digest, keeping the bake file aligned with the yubiOS digest-pinning policy (ADR-015) that the Build Policies gate enforces (source doc). Inheritance composes targets: target "yubiOS-dev" inherits = ["yubiOS"] and overrides only the tag (source doc).

## Invocation

    docker buildx bake                                  # build default group
    docker buildx bake yubiOS-dev                       # build a specific target
    docker buildx bake --set "yubiOS.tags=dhi.io/yubi-OS/yubiOS:ci-${GITHUB_SHA}"   # override a variable
    docker buildx bake --print                          # print resolved config without building

(source doc.) The overrides page documents the --set syntax and a second mechanism, additional docker-bake.override.hcl files: if more than one bake file is found, all files are loaded and merged into a single definition (https://docs.docker.com/build/bake/overrides/, weight 0.83).

## Introspection commands

The bake reference also lists the non-build subcommands baked into the bake invocation surface: check evaluates build checks for a target, outline displays the target's build arguments and their defaults, and targets lists all bake targets with descriptions (https://docs.docker.com/build/bake/reference/, weight 0.90). These are useful pre-build gates that complement --print (reference, weight 0.90).

## Where bake fits in yubiOS

The source doc positions bake as the multi-target layer above plain buildx build: the single-target policy-gated build (docs 04, 06) covers the standard image, and the bake file is the declarative surface when the build grows targets or needs CI-parameterized tags (source doc). The oneuptime writeup on bake variable organization is a weak-backed secondary source recommending grouped variables and consistent naming (https://oneuptime.com/blog/post/2026-02-08-how-to-use-docker-bake-with-variable-groups/view, weight 0.08, weak backing, labeled as such).

References: source doc at https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/docker-buildx-rootless/SKILL.md; https://docs.docker.com/build/bake/reference/ (weight 0.90); https://docs.docker.com/build/bake/overrides/ (weight 0.83); weak-backed secondary at 0.08 as labeled above.
