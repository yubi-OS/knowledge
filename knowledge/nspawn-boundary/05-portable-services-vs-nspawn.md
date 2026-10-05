# 05. Portable services versus nspawn

Scope: portablectl attach, detach, and reattach; what a portable service image is; how portable services differ from a fully isolated nspawn container; and the substitution relation yubiOS records between them.

## What a portable service image is

A portable service image contains an OS file system tree along with systemd unit file information. The portablectl manual records that portablectl may be used to attach, detach, or inspect portable service images, interfacing primarily with systemd-portabled.service, and that when an image is attached, a set of unit files are copied from the image to the host ([freedesktop.org portablectl(1)](https://www.freedesktop.org/software/systemd/man/portablectl.html), jev 0.80; [man7.org portablectl(1)](https://www.man7.org/linux/man-pages/man1/portablectl.1.html), jev 0.80; [Ubuntu manpages: portablectl](https://manpages.ubuntu.com/manpages/focal/man1/portablectl.1.html), jev 0.89).

## The isolation difference

The project's own introduction draws the boundary precisely: "Container" is a very vague term, used for systemd-nspawn/LXC-type OS containers, for Docker/rkt-like micro service containers, and even certain lightweight VM runtimes, and portable services "do not provide a fully isolated environment to the payload, like containers mostly intend to" ([systemd.io: Portable Services Introduction](https://systemd.io/PORTABLE_SERVICES/), jev 0.89). This is the core of the substitution relation: a portable service reuses the host system rather than virtualizing it. The introduction also records where unit files are found inside the image: the unit file is searched in the usual paths, primarily /etc/systemd/system/ and /usr/lib/systemd/system/ within the image ([systemd.io: Portable Services Introduction](https://systemd.io/PORTABLE_SERVICES/), jev 0.93).

## The shared image machinery

Portable service images and nspawn containers consume the same artifact forms. The introduction records that a base or OS image, and each upper extension image, can be a plain sub-directory, a btrfs subvolume, or a raw disk image, and that such an image can be run as an OS container using systemd-nspawn, by booting the image with systemd-nspawn -i -b ([systemd.io: Portable Services Introduction](https://systemd.io/PORTABLE_SERVICES/), jev 0.94). That one-flag difference is why the two mechanisms can substitute for each other in testing: the image is identical, only the attach/detach versus boot/run decision changes.

## The lifecycle verbs

The introduction documents the upgrade-aware lifecycle: portablectl reattach combines a detach with an attach, useful when an image gets upgraded, because it performs a restart operation on the units instead of stop plus start, providing lower downtime and avoiding losing runtime state associated with the unit, such as the file descriptor store ([systemd.io: Portable Services Introduction](https://systemd.io/PORTABLE_SERVICES/), jev 0.89). A third-party comparison frames where each mechanism belongs: systemd-nspawn for building and testing OS images (mkosi), portable services, and running a full trusted Linux userspace; Firecracker for untrusted or per-tenant workloads at density ([PandaStack: Firecracker vs systemd-nspawn](https://www.pandastack.ai/blog/firecracker-vs-systemd-nspawn/), jev 0.43).

## The yubiOS split: one half tested, one half not

The yubiOS container-isolation family record originally carried the caveat that the nspawn-as-portable-service convention was stated in the skill but not exercised in a CI leg. The later adjacent-problems record corrects that caveat as half-stale: portable-service attach/detach is exercised in CI (the second job of the sysext/portable workflow runs the portable-service test script), but the nspawn mechanics that convention substitutes for, RootImage= off the signed mkosi image, --ephemeral, and --boot, run in zero CI legs ([yubiOS refs record: adjacent-problems-nspawn-boundary-2026-09-17.md](https://github.com/yubi-OS/yubiOS), jev source-doc).

The substitution relation is what makes this split sharp. The tested portable leg proves the image content works when attached to a host. The untested nspawn leg would prove the same signed image works when treated as a whole operating system root. Those are different questions about the same bytes, and today only the first is answered by CI ([yubiOS refs record: adjacent-problems-nspawn-boundary-2026-09-17.md](https://github.com/yubi-OS/yubiOS), jev source-doc).

## Sub-claims recap

1. A portable service image is an OS tree plus unit files; attaching copies the units onto the host (weights 0.80, 0.89).
2. Portable services deliberately do not fully isolate the payload; nspawn OS containers do (weight 0.89).
3. The same image artifact serves both paths; portable can be booted as an OS container with nspawn -i -b (weight 0.94).
4. reattach is the restart-preserving lifecycle verb for image upgrades (weight 0.89).
5. yubiOS exercises the portable half in CI and leaves the nspawn half unexercised (source-doc record).
