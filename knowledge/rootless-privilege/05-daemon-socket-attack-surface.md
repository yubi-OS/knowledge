# The daemon socket: a root-equivalent handoff

## Scope

Why access to a container daemon's Unix socket is equivalent to root on the host, how that shapes the rootless decision, and the concrete escape paths that make socket exposure a supply-chain risk.

## The root-equivalence claim

The OWASP Docker Security Cheat Sheet states it plainly: the Docker socket /var/run/docker.sock is the UNIX socket that Docker is listening to, the primary entry point for the Docker API, owned by root; giving someone access to it is equivalent to giving unrestricted root access to the host (OWASP Cheat Sheet Series, https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html). The docker group (or any group specified with -G to own the socket) is likewise root-equivalent (Ask Ubuntu, https://askubuntu.com/questions/477551/how-can-i-use-docker-without-sudo). Netdata's operational guide frames the same fact as the reason to audit socket exposure and reduce container escape risk (Netdata, https://www.netdata.cloud/guides/docker/docker-socket-security/).

The mechanism is structural, not incidental: the daemon runs as root, and the API accepts requests to start containers with arbitrary mounts, capabilities, and namespaces. Whoever can talk to the API can ask the rootful daemon to do anything on the host.

## Attack surface of the daemon itself

Docker's own security documentation reviews the daemon attack surface: starting a container means the daemon creates a set of namespaces and control groups for it, and containers are similar to LXC containers in their security features (Docker Docs, https://docs.docker.com/engine/security/). The daemon is the trusted component that mediates every container operation; a vulnerability in it, or in its API handling, converts directly into host compromise. Remote access configurations that expose the daemon over TCP widen the same surface beyond the local socket (Docker Docs, https://docs.docker.com/engine/daemon/remote-access/).

## Escalation paths in practice

Container-escape write-ups converge on the same top escalators: privileged mode, a mounted docker.sock, excessive capabilities, and dangerous host mounts (golinuxcloud, https://www.golinuxcloud.com/docker-container-escape/). Mounting docker.sock into a container is repeatedly described as worse than running the container privileged, because the container can then command the rootful daemon to spawn arbitrary privileged containers on the host (DZone, https://dzone.com/articles/docker-runtime-escape-docker-sock; sudo.academy, https://sudo.academy/blog/docker-socket-security-preventing-container-escape-and-unauthorized-daemon-access-8fc8c5). Build pipelines that hand a Docker client to untrusted build steps are exactly this pattern.

## Why the rootless decision follows

Any client compromise of a rootful daemon is root. That single fact is what the rootful-alternative rejection in the source ADR rests on, and it is why the builder runs a rootless daemon instead: the client-to-daemon relationship stops being a privilege handoff and becomes a peer relationship between 2 unprivileged processes. The socket-access problem does not disappear (a rootless socket still grants control of that daemon), but the ceiling of what that control reaches drops from host root to the daemon's own unprivileged user, with the user namespace capping what its containers can map.
