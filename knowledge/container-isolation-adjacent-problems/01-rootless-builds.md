# Rootless container image builds

Scope: rootless podman/buildx image builds on an immutable host, the user-namespace mechanism that makes them safe, and why a rootful daemon or a VM per build stage is not used.

## The boundary being built

Building an image is the first isolation question on a bootc host, because the build step runs untrusted instructions (RUN lines, fetched tarballs) before the image is ever verified. The chosen boundary is rootless podman: the build runs as an unprivileged user, inside a Linux user namespace. User namespaces are a cornerstone of Podman's security model: they ensure that even root inside a container is mapped to an unprivileged user on the host, so a container escape does not automatically yield host root [https://oneuptime.com/blog/post/2026-03-18-use-user-namespaces-security-podman/view, weight: low]. Red Hat documents the same property from the vendor side: running in the user namespace in rootless mode lets you customize how containers run to make them easier to use and more secure [https://www.redhat.com/en/blog/rootless-podman-user-namespace-modes, weight: high].

Rootless Podman automatically uses user namespaces, but the user needs subordinate UID and GID ranges configured in /etc/subuid and /etc/subgid [https://oneuptime.com/blog/post/2026-03-18-use-user-namespaces-security-podman/view, weight: low]. The mapping can be inspected directly: Red Hat recommends using the podman unshare command to check that the user namespace maps correctly from the /etc/subuid or /etc/subgid files [https://access.redhat.com/articles/5946151, weight: high]. Kernel prerequisites are modest: full rootless support wants kernel 4.18 or newer, user namespaces enabled in /proc/sys/user/max_user_namespaces, and the newuidmap and newgidmap helpers installed [https://oneuptime.com/blog/post/2026-02-02-podman-security-configuration/view, weight: low].

## Why rootless remapping reduces blast radius

The mechanism matters because of what it contains. Rootless Podman remaps root inside the container through user namespaces, reducing the risk of privilege escalation [https://www.geeksforgeeks.org/devops/rootless-podman/, weight: low]. Concretely: a process that breaks out of the container lands as a subordinate UID on the host, not as UID 0. That is the threat the build boundary answers: malicious or buggy build steps must not gain host privilege.

## Why not a rootful daemon

The alternative most commonly compared against is the Docker model: a persistent dockerd daemon that runs as root by default, with each container a child of that daemon [https://www.kunalganglani.com/blog/docker-vs-podman-2026, weight: low]. Traditional Docker requiring a root daemon is a recognized security concern in environments with strict policies [https://ddev.com/blog/podman-and-docker-rootless/, weight: high]. Docker does ship a rootless mode, but it is opt-in and layered on top of an architecture designed around a root daemon, whereas Podman was designed rootless from the start [https://shattered.io/docker-vs-podman-2026/, weight: low]. On an immutable host the asymmetry is sharper: the whole point of the read-only /usr is that no workload holds privilege over the image, so handing a build daemon permanent root would undo the host's central property. Podman's daemonless architecture, where each container is a direct child process, also removes a long-lived privileged process to attack [https://www.kunalganglani.com/blog/docker-vs-podman-2026, weight: low].

## Why not a VM per build stage

A VM per stage is the strongest boundary available, and it is still not the default for builds because of cost. Measured comparisons put rootless mode at roughly 25 to 30 percent added container startup overhead for both Podman and Docker [https://lucaberton.com/blog/podman-vs-docker-2026/, weight: low]; a VM per stage multiplies that by hypervisor boot and disk provisioning. For build stages, whose inputs are already sandboxed by the user namespace and whose output is a content-addressed image later verified by digest (see the verification-chain doc), the per-stage VM cost buys little. The VM boundary is spent where it is the only thing that works: whole-OS tests (see the ephemeral-VM doc).

## What this boundary does not answer

Rootless namespaces confine the build process, but they say nothing about whether the resulting image is authentic or safe to boot. That is a different boundary: the build policy admits digests, and integrity tooling (dm-verity, composefs) protects the booted image from running processes. Isolation during build is a prerequisite for trust in the artifact, not a substitute for verifying it.

## Placement in the family

Within the isolation family, the rootless build sits at the privilege-minimisation end: it limits what the build process can do (no host root) rather than what it can see. Its relation to the other three boundaries is sequential: build rootless, develop against the signed image in nspawn, test the whole OS in an ephemeral VM, and confine each runtime service with unit sandboxing. Each step narrows a different axis of the same question: what can this process reach.
