# 01. Rootless container security model

Scope: how rootless builds eliminate the root daemon attack surface by mapping container root (UID 0) to an unprivileged host UID (100000+) through user namespaces, and where this model sits in the yubiOS stack.

## The core model

The source doc states the model in one line: rootless builds eliminate the root daemon attack surface. Container root (UID 0) maps to an unprivileged host UID (100000 or above) via user namespaces, so a compromised build cannot own the host (source doc, yubi-OS/yubiOS skills/rootless-container-builds/SKILL.md).

The mechanism is the Linux `user_namespaces(7)` facility. The rootlesscontaine.rs project documents that user namespaces provide fake privileges that are enough to create containers: a real host user such as UID 1000 is mapped to pseudo-root UID 0 inside the user namespace (https://rootlesscontaine.rs/how-it-works/userns/, jev weight 0.77). The container process believes it is root; the kernel knows it is an unprivileged host UID with no authority outside the namespace.

Red Hat's explainer covers the same ground for the podman, buildah, and skopeo tools: it documents how user and group IDs work when using rootless containerization technologies (https://access.redhat.com/articles/5946151, jev weight 0.87). This matters for builds because files created inside the build (layers, container storage) end up owned by the mapped host UID on disk, which is why the subuid/subgid allocation in doc 02 is a prerequisite, not an optimization.

## Rootless daemon vs userns-remap

Docker's rootless mode documentation draws the distinction that matters for threat modeling: rootless mode is similar to userns-remap, except that in userns-remap the daemon itself still runs with root privileges, whereas in rootless mode both the daemon and the container run without root privileges; the two modes also differ in how they map container UIDs and GIDs to the host (https://docs.docker.com/engine/security/rootless/, jev weight 0.95).

That distinction is the whole argument for the yubiOS build path. userns-remap reduces blast radius of containers but keeps a root daemon on the host. Rootless mode removes the root daemon entirely, so the highest-privilege process in the build pipeline is an unprivileged user. The source doc's hardening checklist carries this forward as a gate: user namespaces configured in /etc/subuid and /etc/subgid (source doc).

## The yubiOS stack position

The source doc fixes the stack and the decision behind it. yubiOS uses rootless Docker Buildx plus Build Policies (OPA/Rego) as the primary build tool, per ADR-014. Build Policies (`--policy`) are a Buildx-only capability, which is why Docker Buildx is canonical rather than rootless podman (source doc). Rootless podman and buildah remain in the stack as the alternative build path, and cosign plus Rekor sit on top for signing.

The threat model this stack defends against is concrete: a malicious or compromised Containerfile RUN step, a compromised base image, or an exploited build tool vulnerability all execute inside a user namespace with a mapped unprivileged UID. They cannot modify the host system, install host-wide persistence, or escalate to host root through the build path. What rootless does not defend against is the content of the artifact itself, which is why the same skill pairs the rootless execution model with supply-chain gates (digest pinning, Build Policies, cosign verification) covered in docs 05 through 08.

Weak-backing note: aggregator pages on this topic scored low under jev weighting, for example oneuptime.com's podman rootless post at 0.12 and markaicode.com's podman-vs-docker comparison at 0.12. Claims in this doc rest on the source doc plus the three primary sources cited above; none of the low-weight aggregator content is used.

## What to verify on a machine

The source doc's test sequence doubles as a verification procedure for the model: enable user namespaces with `sudo usermod --add-subuids 100000-165535 --add-subgids 100000-165535 $USER`, confirm the mapping with `grep $USER /etc/subuid /etc/subgid`, and confirm the runtime reports rootless with `podman info | grep rootless` (source doc). If any step fails, the security model is not active: a build executed then would run against a root daemon or an unmapped UID, and the remaining hardening checklist items would be decoration.
