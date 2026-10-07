# 07: Anti-patterns and why each breaks

Scope: the 6 failure patterns the source doc names, the mechanism behind each, and how the dig evidence corroborates or contextualizes them.

## The 6 anti-patterns

All 6 are attributed to the source doc:

1. nspawn as a QEMU substitute when kernel isolation is required. nspawn shares the host kernel; TEE, seccomp, or test isolation that needs a separate kernel belongs to bcvk-virtualization.
2. nspawn with --private-users=0. This disables user-namespace isolation and runs the container as root inside, breaking the yubiOS least-privilege model. Always pass --private-users=UID_RANGE, yubiOS convention 100000-165535.
3. nspawn with --bind=/home. Binding the host's /home shares the host UID namespace and defeats user-namespace isolation. Scope binds to --bind=/home/user/project.
4. Long-running nspawn containers without --ephemeral. nspawn has no image-update story, so long-running containers drift from the source image. Use bootc install to-disk or podman for long-running.
5. nspawn for multi-tenant isolation. Isolation is process-level, not hardware-level. Multi-tenant workloads need Kata Containers, gVisor, or bcvk-virtualization.
6. Running nspawn inside Docker. Nested user namespaces are fragile; use docker buildx with the docker-container driver instead.

## External corroboration

The multi-tenant case has the most direct external support, though weakly weighted. A Unix and Linux Stack Exchange answer (https://unix.stackexchange.com/questions/145739/what-makes-systemd-nspawn-still-unsuitable-for-secure-container-setups, weight 0.14) states that even with security precautions, nspawn is not suitable for secure container setups because many security features can be circumvented and are primarily useful to avoid accidental damage. ADHDecode (https://adhdecode.com/linux/13-systemd/systemd-nspawn-lightweight-containers/, weight 0.12) draws the same line: nspawn isolates filesystems and processes but does not match kernel-virtualizing technologies. The LWN piece on Clear Containers (https://lwn.net/Articles/644675/, weight 0.17) documents the industry answer to exactly this gap, running containers inside hardware virtualization. All three corroborate the source doc's process-level-versus-hardware-level distinction.

The systemd.io project front page (https://systemd.io/, weight 0.87) grounds the environment these rules live in: systemd tracks processes with control groups and manages mounts and automounts, the machinery nspawn composes with. The ArchWiki (https://wiki.archlinux.org/title/Systemd-nspawn, weight 0.53) describes nspawn as a chroot on steroids that fully virtualizes the file system hierarchy and process tree, which is the accurate reading of anti-pattern 1: virtualized userspace, shared kernel.

## The user-namespace edge

Anti-patterns 2 and 3 are both about the same mechanism: user namespaces only isolate if both sides of the boundary respect them. Docker's own documentation on userns-remap (https://docs.docker.com/engine/security/userns-remap/, weight 0.12) makes the parallel point for a different runtime, that user-namespace remapping changes the ownership semantics of host-mounted paths. The source doc's --bind=/home rule is the nspawn form of that hazard. The ArchWiki (https://wiki.archlinux.org/title/Systemd-nspawn, weight 0.53) additionally warns about read-write /proc and /sys bind mounts into unprivileged containers, reinforcing the same scoping discipline.

## What is NOT here

The dig set contains no authoritative source endorsing nspawn-in-Docker or nspawn as a multi-tenant boundary, which is itself informative: the anti-pattern list is a yubiOS-side judgment grounded in the isolation mechanics above, not a position with external advocacy on either side. Record it as such.

## Reading the list as isolation boundaries

The 6 items sort into 3 boundary classes. Anti-patterns 1 and 5 are about the kernel boundary: nspawn virtualizes userspace on a shared kernel, so anything that needs a different kernel or hardware-enforced tenant separation is out of scope by construction, with bcvk-virtualization, Kata Containers, or gVisor as the named escapes. Anti-patterns 2 and 3 are about the user-namespace boundary: the UID range only isolates if the container is root inside its own namespace (2) and if everything bound in respects the shifted IDs (3). Anti-patterns 4 and 6 are about operational shape: long-lived state inside a mechanism that has no update story (4) and nested namespace stacks that multiply fragility (6).

That classification is this corpus's reading of the source doc list, not a claim from any dig source. The external material, the Stack Exchange answer (weight 0.14), the ADHDecode deep dive (weight 0.12), the LWN Clear Containers piece (weight 0.17), and the Docker userns-remap documentation (weight 0.12), corroborates the kernel-boundary and user-namespace-boundary classes; none of it addresses anti-pattern 6 directly, and the source doc's docker buildx with the docker-container driver recommendation stands as the routing for that case.

## The least-privilege tie-in

The source doc maps this skill to the least-privilege primitive (P3) through user-namespace isolation and bind scoping specifically. Anti-patterns 2 and 3 are the two ways a yubiOS invocation violates that primitive, which is why they are named as hard rules rather than preferences. A container started with --private-users=0 is root on the host's ID space for every operation the kernel does not namespace, and a wide bind re-imports host ownership into that scope. Both failures are silent at launch and only show up as excessive privilege at audit time, which is the worst time to find them.
