# systemd-nspawn on a signed image: the dev environment boundary

Scope: running a hermetic development environment directly off the signed host image with systemd-nspawn and RootImage=, and why Docker dev containers or toolbox do not fill this role.

## What the boundary is

On a bootc host with a read-only /usr, the developer needs to run code against the actual operating system image, not an approximation of it. The chosen tool is systemd-nspawn, booted with RootImage= pointing at the same signed image the host runs. systemd-nspawn is described as a chroot on steroids: it runs a command or operating system in a lightweight namespace container, more powerful than chroot because it fully virtualizes the file system hierarchy and the process tree [https://wiki.archlinux.org/title/Systemd-nspawn, weight: high].

Two upstream contracts make the image-rooted flow work. First, systemd-nspawn implements the Container Interface specification, and running containers are registered with the systemd-machined service, which keeps track of running containers and provides programming interfaces to interact with them [https://www.freedesktop.org/software/systemd/man/latest/systemd-nspawn.html, weight: high]. Second, as a safety check systemd-nspawn verifies the existence of /usr/lib/os-release or /etc/os-release in the container tree before booting a container [https://www.freedesktop.org/software/systemd/man/systemd-nspawn.html, weight: high]; the same check applies to an image-based tree, which is why real OS images rather than application containers are the natural input.

The RootImage= mechanism is documented in the portable services design: if an image is moved, the RootImage= line written to the unit drop-in points to its new location [https://systemd.io/PORTABLE_SERVICES/, weight: high]. The same design notes that a portable service image can be run as an OS container using systemd-nspawn by booting the image, and can even be booted directly as a VM image with a generic VM executor such as QEMU or KVM [https://systemd.io/PORTABLE_SERVICES/, weight: high]. That triple compatibility is the reason the signed image is the single artifact at the center of the dev boundary: the exact bits the host boots are what the developer enters.

## What it isolates, and from what

The nspawn boundary answers a specific threat: the dev workload must not mutate the host's immutable system tree, and the host must not leak host-specific state into the dev environment. Because the container boots the signed image's own systemd tree (the image is a full OS tree, not an application bundle), the developer sees the same service layout, same systemd version, and same /usr as production. systemd-nspawn is a lightweight container manager that runs an entire OS tree in a namespace-isolated environment using the host kernel; unlike Docker it uses no daemon, no image format of its own, and manages containers as systemd machines via machinectl [https://techprephq.com/question/devops/linux/systemd-nspawn-machinectl-containers, weight: low].

## Why not a Docker dev container

Docker dev containers serve a different purpose: application deployment with a full-feature toolset built around an image format and a daemon [https://brainly.com/question/50537321, weight: low]. That is precisely why they fail the yubiOS requirement: they boot a composed application image, not the actual host image's systemd. A container that your dev workflow produces could be run in nspawn with all the advantages and disadvantages of the systemd init process, or in a Docker container with all the disadvantages of the Docker daemon; the two are not interchangeable [https://www.reddit.com/r/homelab/comments/1af0ikl/why_docker_over_systemdnspawn/, weight: low]. For long-running work the difference is structural: nspawn's native systemd integration means services inside the machine are managed the same way as on the host [https://botmonster.com/self-hosting/systemd-nspawn-lightweight-containers-without-docker/, weight: low]. The same source notes the trade honestly: teams running docker-compose flows would have to rewrite that tooling around machinectl and .nspawn files [https://botmonster.com/self-hosting/systemd-nspawn-lightweight-containers-without-docker/, weight: low]. On yubiOS that cost is accepted because matching the production image is the requirement, not a preference.

Systemd and Docker both manage the execution of applications, but systemd traditionally manages services while Docker isolates them in containers; they overlap enough to confuse, which is why the choice must be made per use [https://dev.to/_russell/systemd-vs-docker-exploring-a-surprising-alternative-4pmm, weight: high].

## Why not toolbox

Toolbox-style tools layer a mutable environment over the host user session. They solve "give me a writable shell" but not "boot the image I ship". Since the immutable host's dev question is specifically about the image, an overlay tool answers the wrong question; the nspawn container rooted at the signed image is the only option among the alternatives that exercises the image's own boot path (short of the VM boundary, which is reserved for whole-OS tests).

## Limits of the boundary

nspawn shares the host kernel. Anything that depends on a different kernel, on UEFI firmware behavior, on disk-level boot (LUKS2 unlock, FIDO2), is outside what a namespace container can exercise. Those cases graduate to the ephemeral VM boundary. Conversely, because nspawn reuses the host kernel, it stays fast enough to sit inside an edit-run-debug loop, which the VM boundary cannot.
