# 02 - Rootless daemon install and context

Scope: the install paths, systemd user unit, linger, socket location, and CLI context that stand up a rootless dockerd.

## Prerequisites

Three things must be true before install (source doc). First, /etc/subuid and /etc/subgid must carry at least 65,536 subordinate UIDs and GIDs for the user; the source doc shows the check with grep, expecting a line like jenny:231072:65536. Second, newuidmap and newgidmap must exist, installed via shadow-utils on Fedora/RHEL or uidmap on Ubuntu/Debian. Third, the system-wide daemon must be out of the way: systemctl disable --now docker.service docker.socket and remove /var/run/docker.sock so no client accidentally talks to the rootful daemon (source doc).

The official rootless mode page is the authoritative backdrop for all of this (https://docs.docker.com/engine/security/rootless/, weight 0.94, carried from doc 01's dig).

## Install with packages

The packaged path is dockerd-rootless-setuptool.sh install, which sets up ~/.config/systemd/user/docker.service and creates a rootless CLI context (source doc). The script lives in the Moby repository at contrib/dockerd-rootless-setuptool.sh (https://github.com/moby/moby/blob/master/contrib/dockerd-rootless-setuptool.sh, weight 0.82). After install, start the daemon as a user unit with systemctl --user start docker.service and make it survive logouts with sudo loginctl enable-linger (source doc).

The alternative is the standalone installer: curl -fsSL https://get.docker.com/rootless | sh, which drops binaries into ~/bin for environments without packages (source doc). The dockerd reference documents the daemon itself and its rootless operation flags (https://docs.docker.com/reference/cli/dockerd/, weight 0.74), and the daemon configuration overview covers the wider configuration surface (https://docs.docker.com/engine/daemon/, weight 0.61).

## Socket and context wiring

Without packages, export DOCKER_HOST=unix:///run/user/1000/docker.sock with the real UID substituted (source doc). With packages, the preferred route is the created context: docker context use rootless, then docker context ls to confirm (source doc). The context approach is preferred because it persists the endpoint choice per user rather than per shell (source doc).

## Verify

docker info piped through grep on Security Options must print a rootless line (source doc). This is the same check as in doc 01; run it right after install and again after any daemon restart, since a system docker.socket coming back up is the classic way the context silently points at the wrong daemon.

## yubiOS usage

yubiOS treats this setup as a given: builds run through rootless Docker Buildx per ADR-014, with Build Policies layered on top (source doc). The dhi.io CI container image ships in a rootless-compatible environment, so CI runners do not need a per-job install dance (source doc).

References: source doc at https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/docker-buildx-rootless/SKILL.md; https://github.com/moby/moby/blob/master/contrib/dockerd-rootless-setuptool.sh (weight 0.82); https://docs.docker.com/reference/cli/dockerd/ (weight 0.74); https://docs.docker.com/engine/daemon/ (weight 0.61); https://docs.docker.com/engine/security/rootless/ (weight 0.94).
