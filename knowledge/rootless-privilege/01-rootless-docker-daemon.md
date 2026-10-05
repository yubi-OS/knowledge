# Rootless Docker daemon: what unprivileged actually buys

## Scope

Rootless Docker daemon mode: how it works (user namespace), what it changes versus userns-remap, the setuid surface it keeps, and the residual limitations that decide whether a build fleet can run without a rootful daemon.

## The mechanism

Rootless mode executes the Docker daemon and containers inside a user namespace (Docker Docs, https://docs.docker.com/engine/security/rootless/). It is similar to userns-remap mode, except that with userns-remap mode the daemon itself is running with root privileges, whereas in rootless mode both the daemon and the container are running without root privileges. The two modes also differ in how they map container UIDs and GIDs to the host (Docker Docs, https://docs.docker.com/engine/security/rootless/).

The stated purpose is to mitigate potential vulnerabilities in the daemon and the container runtime (Docker Docs, https://docs.docker.com/engine/security/rootless.md). Rootless mode does not require root privileges even during installation of the daemon, as long as prerequisites are met (Docker Docs, https://docs.docker.com/engine/security/rootless/).

## The setuid surface it keeps

Rootless mode does not use binaries with setuid bits or file capabilities, except newuidmap and newgidmap, which are needed to allow multiple UIDs and GIDs to be used in the user namespace (Docker Docs, https://docs.docker.com/engine/security/rootless). This is the honest floor of the model: the audited privileged surface shrinks to exactly 2 setuid helpers from shadow-utils, not to zero. Any threat model that counts setuid binaries has to count these 2 and justify keeping them; it cannot claim the build is setuid free.

## Why it beats userns-remap for the builder

Userns-remap keeps the root daemon and only maps container UIDs to unprivileged host UIDs; rootless mode runs the daemon itself as a normal user (Crusader Two-One, https://josephstreeter.github.io/docs/infrastructure/docker/rootless.html). For a builder link in a supply chain, the difference is decisive: a compromised client of a rootful daemon holds a root-equivalent handoff regardless of userns mapping, while a compromised client of a rootless daemon holds the unprivileged user only.

## Residual limitations that shape adoption

Third-party operational guides converge on the same constraint set for rootless Docker: ports under 1024 require workarounds, client IPs disappear behind the user namespace network, storage drivers are constrained, and device access is limited (learncybers, https://learncybers.com/rootless-docker-containers-without-root/). Setup guides for Ubuntu, Debian, AlmaLinux, and Rocky Linux document cgroup v2 delegation and networking limits as the standard prerequisites and friction points (panelica, https://panelica.com/blog/how-to-run-docker-rootless-mode-complete-security-guide-2026). A rootless-mode security checklist summarises the trade: rootless mode reduces the damage if the Docker daemon gets compromised, but it does not stop application bugs or bad container hygiene (Kunal Ganglani, https://www.kunalganglani.com/blog/docker-rootless-mode-security).

These limitations are acceptance criteria for a build fleet, not blockers: builders rarely need privileged ports or host devices, so the rootless trade is usually favourable for the builder link and remains unfavourable only where the workload itself demands device or network privileges.

## Position

Rootless daemon mode is the baseline that makes the rest of the privilege-minimisation stack coherent: it removes the root-equivalent daemon socket (the failure mode of the rootful model), confines the remaining privilege to 2 setuid helpers, and leaves capability questions (CAP_SYS_ADMIN grants, ambient sets) as the exception path rather than the default.
