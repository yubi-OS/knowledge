# 04: portable services via portablectl

Scope: portable services: portablectl attach, detach and list, the RootImage= unit wiring into /etc/systemd/system, and sandboxing profile selection.

## What portable services are

`portablectl` may be used to attach, detach or inspect portable service images. It is primarily a command interfacing with `systemd-portabled.service`. Portable service images contain an OS file system tree along with systemd unit file information [1] [2] [3]. A service image may be attached to the local system; when attached, a set of unit files is copied from the image onto the host [1] [2].

Unlike full container runtimes, portable services are a lightweight container alternative: services are bundled with their dependencies in disk images that can be attached to running systems, and a single image can include multiple services [4] (weak backing, w=0.20). A comparison writeup summarizes the model as bundling system services and their dependencies into a single image, with the services running directly on the host [5] (weak backing, w=0.22).

## What attach does to the system

The concrete filesystem effect of attach, which is the primary assertion surface for a test:

1. The unit files from the image are copied onto the host and made available to the host's systemd instance [6] (weak backing, w=0.22, but consistent with the freedesktop man page's "a set of unit file" description at w=0.88) [1].
2. For unit files of type .service, a drop-in is added to those copies that adds `RootDirectory=` or `RootImage=` settings, which ensures these services run within the file system of the originating portable service image [7].

So the deterministic post-attach assertions are: the unit file exists at the host systemd location (/etc/systemd/system/ for the standard attach path), and it carries a `RootImage=` (or `RootDirectory=`) directive pointing at the image [6] [7].

## The attach, list, detach cycle

`portablectl` exposes the full lifecycle as verbs: attach, detach, and inspect (including list) [1] [2] [3]. A test cycle:

1. `portablectl attach` the image. Units are copied and drop-ins written [1] [7].
2. `portablectl list` shows the image as attached [1].
3. Start the service with `systemctl start` and assert it is active and its process is running. The service runs with the image as its filesystem root thanks to the `RootImage=` drop-in [7].
4. `portablectl detach`. The unit is removed from the host; the test asserts the unit file is gone and the service is stopped [1] [2].

## Upgrades: reattach

For an image that gets upgraded, `portablectl reattach` combines a detach with an attach. It allows performing a restart operation on the units instead of stop plus start, providing lower downtime and avoiding losing runtime state associated with the unit, such as the file descriptor store [8]. A lifecycle test that covers image bumping should use reattach rather than detach plus attach when it wants to preserve runtime state.

## Image format expectations

Portable service images are built on the same discoverable image foundations as sysexts: images must follow the UAPI.2 Discoverable Partitions Specification, and the image must contain at least one matching unit file with the right name prefix and suffix [9] (from the Portable Services specification page, w=0.90). A negative-path test can therefore corrupt the DDI and expect attach or start to fail; the failure mode surface is shared with the sysext signature verification story in doc 08.

## Test design implications

1. Positive: attach, assert unit file present with RootImage=, start service, assert active plus process running [1] [7].
2. Cycle: detach, assert service stopped and unit file removed [1] [2].
3. Upgrade path: reattach provides restart semantics with lower downtime and preserved file descriptor store state [8].

## Sources

1. https://www.freedesktop.org/software/systemd/man/portablectl.html (w=0.88)
2. https://manpages.ubuntu.com/manpages/focal/man1/portablectl.1.html (w=0.90)
3. https://redhat-plumbers.github.io/systemd-rhel8/portablectl.html (w=0.79)
4. https://linuxcommandlibrary.com/man/portablectl (w=0.20, weak)
5. https://deepwiki.com/systemd/systemd/5.4-portable-services (w=0.22, weak)
6. https://oneuptime.com/blog/post/2026-03-02-how-to-configure-systemd-portable-services-on-ubuntu/view (w=0.22, weak)
7. https://www.man7.org/linux/man-pages/man1/portablectl.1.html (w=0.72)
8. https://systemd.io/PORTABLE_SERVICES/ (w=0.90)
9. https://systemd.io/PORTABLE_SERVICES/ (w=0.90)
