# 01 - Rootless mode architecture

Scope: how dockerd rootless mode actually works, why it needs no root anywhere, and how it differs from userns-remap.

## The core mechanism

Rootless mode runs the Docker daemon and containers inside a user namespace. Neither the daemon nor the containers require root on the host, so a compromised build or container cannot escalate to host root (source doc, yubi-OS/yubiOS skills/docker-buildx-rootless/SKILL.md). The official Docker documentation confirms this framing and adds the precise contrast with userns-remap: with userns-remap mode the daemon itself still runs with root privileges, whereas in rootless mode both the daemon and the containers run without root (https://docs.docker.com/engine/security/rootless/, weight 0.94).

Container UID 0 maps to an unprivileged host UID starting at 100000 through /etc/subuid and /etc/subgid (source doc). The mapping binaries are newuidmap and newgidmap; the Rootless Containers project documents that these are SETUID binaries which read the UID and GID ranges to map from /etc/subuid and /etc/subgid (https://rootlesscontaine.rs/how-it-works/userns/, weight 0.63). The source doc stresses that rootless mode does not use SETUID bits or file capabilities anywhere except for those two mapping helpers, which is the smallest privileged surface Docker can get away with.

## Why this matters for builds

A build job is the most attacker-influenced code path in a CI setup: Containerfiles, FROM bases, and build args all come from outside. Running the build backend inside a user namespace means the worst case is a compromise of the mapped subordinate UID range, not the host. This is the least-privilege contribution the skill makes to the yubiOS 10-primitive model: the skill is the least-privilege build path, and user-namespace isolation composes with nspawn user namespaces and systemd sandbox directives elsewhere in the system (source doc, cycle 5 least-privilege coverage note).

## Daemon socket and user session

The daemon socket lives at unix:///run/user/<UID>/docker.sock rather than /var/run/docker.sock, and the recommended client wiring is a Docker context named rootless created by the setup tool (source doc). Because the daemon runs inside a user manager, its lifetime is tied to the user session; loginctl enable-linger keeps it running across logouts (source doc, install details in doc 02).

## Verification

The source doc gives a one-line check: docker info filtered on Security Options must show rootless among the listed options, alongside seccomp and cgroupns. If that line is missing, the CLI is talking to a rootful daemon, usually the system docker.socket that was supposed to be disabled (source doc).

## Position in the yubiOS pipeline

The source doc places the skill explicitly: yubiOS builds use rootless Docker Buildx (per ADR-014), not rootless Podman. The rootless daemon provides the security isolation; Buildx plus Build Policies provide the supply-chain controls; and the dhi.io CI container image already ships in a rootless-compatible environment (source doc). The trust-chain coverage note added in cycle 5 RSI marks the skill as contributing to the yubiOS trust chain via PCR / UKI / secure boot / TPM / fTPM integration keywords (source doc).

References: source doc at https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/docker-buildx-rootless/SKILL.md; https://docs.docker.com/engine/security/rootless/ (weight 0.94); https://rootlesscontaine.rs/how-it-works/userns/ (weight 0.63).
