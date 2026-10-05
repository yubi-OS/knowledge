# 04. --boot and machine lifecycle

Scope: running a full init inside nspawn with --boot, the shell-versus-boot mode split, the systemd-nspawn@.service template unit, and machinectl as the lifecycle interface.

## Shell mode versus boot mode

By default, an interactively invoked systemd-nspawn runs a shell or command inside the container namespace; it does not start an init system. The ArchWiki records the distinction concretely: the -b option boots the container, that is, runs systemd as PID 1, instead of just running a shell, and -D specifies the directory that becomes the container's root ([ArchWiki: Systemd-nspawn](https://wiki.archlinux.org/title/Systemd-nspawn), jev 0.81). The manual page frames the capability at a higher level: in contrast to chroot(1), systemd-nspawn may be used to boot full Linux-based operating systems in a container ([man7.org systemd-nspawn(1)](https://www.man7.org/linux/man-pages/man1/systemd-nspawn.1.html), jev 0.83).

## The service path changes the default

The default differs depending on how nspawn is started. The manual page states that the systemd-nspawn@.service template unit file makes use of the --boot option, which is not the default when systemd-nspawn is invoked from the interactive command line ([freedesktop.org systemd-nspawn(1)](https://www.freedesktop.org/software/systemd/man/systemd-nspawn.html), jev 0.95). The ArchWiki spells out the consequence: containers started via machinectl or systemd-nspawn@.service use different default options than containers started manually, and the extra options used by the service include -b/--boot, so managed containers automatically search for an init program and invoke it as PID 1 ([ArchWiki: Systemd-nspawn](https://wiki.archlinux.org/title/Systemd-nspawn), jev 0.90). A CI leg that drives nspawn directly must therefore pass --boot explicitly to test the boot path; the service path applies it silently.

## machinectl and the machine registry

machinectl is the management front end for the systemd machine manager. Its manual page records that starting a machine starts systemd-nspawn@.service, instantiated for the specified machine name, similar in effect to systemctl start on the service name, and that systemd-nspawn looks for a container image by the specified name in /var/lib/machines/ and other search paths ([freedesktop.org machinectl(1)](https://www.freedesktop.org/software/systemd/man/latest/machinectl.html), jev 0.92). An overview writeup describes machinectl as the command-line interface to systemd-machined, the system service that manages local containers and virtual machines, working alongside container technologies including systemd-nspawn, Docker, and libvirt/QEMU ([codelucky.com: machinectl Command Linux](https://codelucky.com/machinectl-command-linux/), jev 0.47). The systemd project's own architecture map adds that systemd-machined provides a central registry for running containers and VMs with D-Bus/Varlink interfaces, and machinectl is the user-facing CLI for managing machines and images ([DeepWiki: Containers and Virtualization](https://deepwiki.com/systemd/systemd/5-containers-and-virtualization), jev 0.37).

## Lifecycle for a test leg

For the yubiOS dev-environment boundary, the lifecycle split maps to two test shapes. A shell-mode run is the cheap shape: start nspawn against the image, run the test command, tear down, with no init system involved. A boot-mode run exercises more: the container's systemd as PID 1, unit startup, and anything that only converges once the OS tree is actually booted. The yubiOS record lists --boot as one of the three nspawn mechanics that run in zero CI legs today, and names machinectl-level lifecycle extension of the portable-service leg as flip condition (c) for shipping a nspawn leg: when the portable leg needs start/stop/inspect lifecycle semantics, nspawn is the natural host for them ([yubiOS refs record: adjacent-problems-nspawn-boundary-2026-09-17.md](https://github.com/yubi-OS/yubiOS), jev source-doc).

## What a lifecycle leg would catch

A boot-mode leg rooted off the pinned image exercises the image as an operating system rather than as a file tree: init selection, unit startup, and the service-path defaults described above. Combined with machinectl's registry (list, start, stop, inspect), it is the layer the yubiOS record calls "machinectl-level lifecycle" ([yubiOS refs record: adjacent-problems-nspawn-boundary-2026-09-17.md](https://github.com/yubi-OS/yubiOS), jev source-doc). The portable-services introduction documents the lifecycle verbs on the portable side of the same machinery: portablectl reattach combines a detach with an attach, useful when an image gets upgraded, performing a restart on the units instead of stop plus start and preserving runtime state such as the file descriptor store ([systemd.io: Portable Services Introduction](https://systemd.io/PORTABLE_SERVICES/), jev 0.89).

## Sub-claims recap

1. -b/--boot runs systemd as PID 1; without it, nspawn runs a shell or command in the namespace (weight 0.81).
2. The systemd-nspawn@.service template sets --boot as its default; interactive invocation does not (weights 0.95, 0.90).
3. machinectl start instantiates systemd-nspawn@.service and resolves images from /var/lib/machines/ and other search paths (weight 0.92).
4. systemd-machined is the central machine registry behind machinectl (weights 0.47, 0.37).
5. portablectl reattach is the documented restart-preserving lifecycle verb on the portable side (weight 0.89).
6. yubiOS names machinectl-level lifecycle as the trigger condition for adding the nspawn leg (source-doc record).
