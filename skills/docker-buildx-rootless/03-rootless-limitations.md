# 03 - Rootless mode limitations

Scope: what rootless dockerd still cannot do, which limits are structural, and where network performance differs.

## The five documented limits

The source doc lists the known limitations as recorded from the official docs (source doc, grounding spine https://docs.docker.com/engine/security/rootless/, weight 0.94):

1. No cgroup v1 device access; --device is limited without cgroup v1 (source doc).
2. AppArmor and SELinux policy enforcement may require extra configuration (source doc).
3. Network performance can differ because the daemon sits behind slirp4netns rather than the host namespace (source doc).
4. Some docker run flags that require root are restricted (source doc).
5. The overlay storage driver requires kernel 5.11 or later, otherwise fuse-overlayfs is the fallback (source doc).

The kernel floor is the one yubiOS cares about most: composefs and the image-mode stack in yubiOS assume modern kernels anyway, so the 5.11 floor for overlay2 is comfortably met on yubiOS targets (source doc context).

## Network performance in practice

Independent writeups agree on the slirp4netns overhead and describe the newer pasta driver, which copies the host network configuration into the container namespace without NAT and offers better throughput (https://www.virtua.cloud/learn/en/tutorials/docker-security-hardening-rootless-seccomp, weight 0.15, weak backing; treat as secondary). A 2026 walkthrough of IPv4 networking in rootless mode likewise frames slirp4netns versus pasta as the main configuration axis and notes port-binding limitations for unprivileged users (https://oneuptime.com/blog/post/2026-03-20-docker-ipv4-networking-rootless-mode/view, weight 0.11, weak backing). Both carry low jev weights, so read them as corroboration of the source doc's structural point, not as primary facts: the source doc's own claim is the authoritative one here.

## Containerd cross-check

The containerd/nerdctl rootless documentation describes the same user-namespace model and its tradeoffs from a neighboring implementation (https://github.com/containerd/nerdctl/blob/main/docs/rootless.md, weight 0.51). Its agreement on the mechanism (rootlesskit, slirp4netns, subordinate UID ranges) is useful corroboration that the limits are properties of the user-namespace design, not of Docker specifically (weight 0.51).

## What this means for yubiOS builds

The source doc does not treat any of these limits as blockers for the yubiOS build path: builds use the docker-container builder driver (doc 04), which runs BuildKit in a container inside the rootless daemon, and the supply-chain controls live in Build Policies, not in daemon flags (source doc). The dhi.io CI image being rootless-compatible is the source doc's statement that the limitations above do not bite the CI path (source doc).

References: source doc at https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/docker-buildx-rootless/SKILL.md; https://docs.docker.com/engine/security/rootless/ (weight 0.94); https://github.com/containerd/nerdctl/blob/main/docs/rootless.md (weight 0.51); weak-backed corroboration at 0.15 and 0.11 as labeled above.
