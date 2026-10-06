# 05 - Builder lifecycle

Scope: creating, bootstrapping, listing, selecting, and removing buildx builders, including the yubiOS-standard create command.

## Create

The yubiOS-standard builder is created with the docker-container driver and host networking (source doc):

    docker buildx create --name yubiOS-builder --driver docker-container --driver-opt network=host --use

The --use flag switches to the new builder immediately. --driver-opt network=host gives the BuildKit container direct host networking, which matters for registry access behind a proxy or local mirror (source doc).

The buildx project README documents the same lifecycle shape: after creating a new instance you manage it with docker buildx inspect, docker buildx stop, and docker buildx rm, and you list all available builders with docker buildx ls (https://github.com/docker/buildx, weight 0.87).

## Bootstrap and inspect

docker buildx inspect --bootstrap starts the BuildKit container and fetches builder info (source doc). The inspect command reference is the authoritative page for the flags and output fields (https://docs.docker.com/reference/cli/docker/buildx/inspect/, weight 0.90). The builder management guide walks the full create/inspect/use/rm loop with the same command set (https://docs.docker.com/build/builders/manage/, weight 0.87).

## List, use, remove

The remaining lifecycle commands, all from the source doc:

    docker buildx ls                          # list all builders
    docker buildx use yubiOS-builder          # switch default builder
    docker buildx rm yubiOS-builder           # remove a builder
    docker buildx use default                 # built-in docker driver, no daemon start

The default builder is the docker driver, built into the daemon, requiring no separate start (source doc, driver model in doc 04). Removing a builder stops and deletes its BuildKit container; creating one again with the same name starts fresh (source doc semantics for rm).

## yubiOS practice

In the yubiOS build flow the builder is long-lived infrastructure, not a per-job artifact: create yubiOS-builder once per machine, keep it selected, and run the policy-gated build commands from the quick reference against it (source doc). The source doc's multi-arch command (ADR-017) assumes a docker-container builder is in use, since multi-platform and --policy both need the full driver (source doc, doc 04).

References: source doc at https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/docker-buildx-rootless/SKILL.md; https://github.com/docker/buildx (weight 0.87); https://docs.docker.com/reference/cli/docker/buildx/inspect/ (weight 0.90); https://docs.docker.com/build/builders/manage/ (weight 0.87).
