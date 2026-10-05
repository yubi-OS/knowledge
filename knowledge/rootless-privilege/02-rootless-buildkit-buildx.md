# Rootless BuildKit and buildx: the builder under a normal user

## Scope

Running the BuildKit engine and buildx builders as a non-root user: the standalone rootless path, its prerequisites, and what it removes from the build pipeline's privilege budget.

## The standalone rootless path

BuildKit in standalone mode provides rootless image builds without a Docker daemon dependency. This method eliminates privileged containers entirely and provides a direct replacement for Kaniko-style builds (GitLab Docs, https://docs.gitlab.com/ci/docker/using_buildkit/). In a CI context this is the load-bearing property: the runner no longer needs a privileged Docker daemon or a privileged build container to produce an image.

BuildKit can also be run as a daemon in rootless mode or embedded directly in the build container without a separate daemon (Buildkite Documentation, https://buildkite.com/docs/agent/self-hosted/agent-stack-k8s/buildkit-container-builds). Both shapes serve the same goal: no component of the build path holds uid 0.

## Prerequisites and platform friction

Running BuildKit in rootless mode requires RootlessKit; for a containerd worker, containerd itself is run in rootless mode under rootlesskit (moby/buildkit docs, https://github.com/moby/buildkit/blob/master/docs/rootless.md). Distribution-specific setup is real: for older Debian kernels, kernel.unprivileged_userns_clone=1 must be added to sysctl; RHEL and CentOS 7 need user.max_user_namespaces raised; using the Ubuntu kernel is recommended (crazymax.dev BuildKit guide, https://crazymax.dev/buildkit/user-guides/rootless-mode/). These prerequisites are the price of the user-namespace foundation that rootless builds stand on, and they are the reason a fleet standardises its builder hosts rather than leaving each runner to improvise.

## Comparison with the rootful default

Operator comparisons describe rootful BuildKit as simpler to set up but running with elevated privileges, with rootless configuration as the deliberate, documented alternative (Medium, https://medium.com/@yogendra_79882/running-buildkit-on-kubernetes-a-deep-dive-into-rootless-and-rootful-modes-2eb5760be073). The simplicity delta is real but bounded: once userns prerequisites are baked into the builder image, rootless is the same workflow with a different builder endpoint.

For Kubernetes-based builders, the buildx kubernetes driver creates the builder resources in a cluster namespace while keeping driver configuration local, selected with the --builder flag (Docker Docs, https://docs.docker.com/build/builders/drivers/kubernetes/). This lets a rootless policy be expressed as a builder choice rather than a per-invocation flag, which is how a CI fleet enforces the model by default.

## Position

Rootless BuildKit is the concrete implementation of the builder-side privilege floor: the engine that executes arbitrary Dockerfile RUN steps runs as an unprivileged user inside a user namespace. Combined with the rootless daemon, it means no link in the build pipeline needs uid 0 except the 2 setuid mapping helpers. The remaining question is which BuildKit features, if any, lack a rootless path; absent one, there is no reason to reintroduce a rootful builder.
