# 02 - dind Patterns

Scope: The two docker-in-docker patterns found across the 24 yubiOS workflow files, why the rootless-socket pattern dominates, and the failure mode of the legacy pattern.

## Inventory

14 of the 21 container jobs do docker work inside their container. They split into 2 patterns:

- 13 jobs use the rootless-via-socket pattern.
- 1 job uses the legacy inner-dind pattern.

## Pattern 1: rootless dockerd over a unix socket

13 of the 14 dind jobs drive a rootless dockerd listening on a dedicated unix socket, then run `docker -H unix:///run/docker-rootless/docker.sock buildx bake ...` from the job steps. The outer container still declares `options: --privileged`. That combination is not contradictory: rootless mode runs both the daemon and its containers without root privileges (source: https://docs.docker.com/engine/security/rootless/, weight 0.92), but the daemon still needs the kernel to let it set up user namespaces, and inside a container that kernel work requires the outer container to be privileged.

The Docker rootless tips documentation confirms the daemon is meant to be addressed through user-level paths and configuration rather than the root-owned `/var/run/docker.sock` (source: https://docs.docker.com/engine/security/rootless/tips/, weight 0.94). yubiOS applies the same principle at the socket level: the job talks to `/run/docker-rootless/docker.sock`, a purpose-named socket, instead of the ambient default socket.

`docker buildx` is the build entrypoint for these jobs. Buildx supports the build features of the classic builder plus outputs configuration, inline caching, and target platforms (source: https://github.com/docker/buildx, weight 0.91). The `bake` subcommand takes a file of build targets and supports entitlements such as extra privileged entitlement and security.insecure, the mechanism by which privileged builds are granted deliberately instead of ambient (source: https://docs.docker.com/reference/cli/docker/buildx/bake/, weight 0.97).

## Pattern 2: legacy inner-dind

The outlier is `ci_test_bootc-filesystem.yml::install-to-filesystem`. It runs `docker run --rm --privileged --pid=host --ipc=host` inside a container that has no outer `options:` key. The job is doing a `bootc install` to a filesystem: bootc provides `install to-disk` and `install to-filesystem` subcommands where the container image itself carries the baseline installation tooling and nothing external is required (source: https://github.com/bootc-dev/bootc/blob/main/docs/src/bootc-install.md, weight 0.68).

The flags it passes are the classic sign of a nested container trying to reach what its sandbox denied it. Running privileged containers, host PID namespace, and docker-socket services are documented as Docker-only opt-in features that grant a container deep host access (source: https://docs.kurtosis.com/running-privileged-containers/, weight 0.91). `--pid=host` and `--ipc=host` share the host PID and IPC namespaces with the inner container; hardening references note that `--privileged` itself does not remove namespace separation but the combination of host-namespace flags plus privileged mode is the maximal-access configuration (weak backing: https://desecurity.github.io/hacktricks/linux-hardening/privilege-escalation/docker-security/docker-, weight 0.45).

This is the same class of bug being fixed in `ci_test_sealed-uki-vm.yml`: an inner container asking for privileges its outer container never granted. The difference is that the sealed-UKI-VM stub is missing the outer container entirely, while the bootc-filesystem job has a container but an under-specified one.

## Why the pattern split matters

The two patterns differ in what they grant and what they depend on:

- Rootless-socket jobs grant privileges at the outer boundary only and keep the inner daemon unprivileged. The privilege is declared once, in the canonical `container:` block, and the build work runs as a non-root daemon.
- Legacy inner-dind jobs push privilege inward: the outer container is unprivileged, so each `docker run` must re-declare `--privileged`, host PID, and host IPC to escape its own sandbox. The privilege surface is per-invocation and easy to get wrong, which is exactly the failure the sealed-UKI-VM fix series targets.

## Takeaway

13 of 14 dind jobs converge on one working shape: privileged outer container, rootless inner daemon, buildx bake over a named socket. The 1 legacy job survives because bootc installation happens to work under its flag stack, but it is the pattern-level anti-example: if a job needs host namespaces, the canonical answer is the canonical container block, not per-run flag surgery. Bootc container best-practice material describes transactional in-place OS updates over standard OCI images as the transport, which is why the install job exists at all (weak backing: https://github.com/andrew-weida/bootc-container-image-best-practices, weight 0.54).
