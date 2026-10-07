# 03: Anatomy of an nspawn invocation

Scope: the flags yubiOS actually uses, what each does, and the machinectl commands that move images into place.

## The canonical yubiOS invocation

The source doc gives this shape (all flags attributed to it):

machinectl pull-yubiOS --verify=signature <url> yubiOS-2026.08, then systemd-nspawn --machine=yubiOS-dev --directory=/var/lib/machines/yubiOS-2026.08 --ephemeral --private-users=100000-165535 --network-bridge=br0 --bind=/home/user/project:/project --setenv=DISPLAY=:0 /usr/bin/bash.

The yubiOS flag conventions are:

- --directory= preferred over --image= because mkosi default output is an extracted directory, not a raw disk image.
- --ephemeral for dev/test; changes are discarded on exit.
- --private-users=100000-165535 matches the yubiOS standard UID range for rootless operation.
- --network-bridge=br0 for containers that need network; --private-network for fully offline builds.

## What the man pages say about the core flags

The systemd-nspawn man page (https://man7.org/linux/man-pages/man1/systemd-nspawn.1.html, weight 0.84) documents PrivateUsers semantics: the --private-users-ownership=auto option is implied when --private-users=pick is used, user namespacing is required for the option to have effect, and systemd-dissect(1)'s --shift switch can shift UID/GID ownership of a tree. The same man page records a boot-time safety check (weight 0.75): nspawn verifies /usr/lib/os-release or /etc/os-release exists in the container tree before booting.

The settings file side is documented in systemd.nspawn(5) (https://man7.org/linux/man-pages/man5/systemd.nspawn.5.html, weight 0.7): PrivateUsers= is the per-machine equivalent of the --private-users= switch, takes the same options, and is a privileged setting. In other words, everything the source doc passes on the command line has a persistent per-image form.

## machinectl and image handling

The machinectl man page (https://www.freedesktop.org/software/systemd/man/latest/machinectl.html, weight 0.87) documents list-images --all for including hidden images in listings, and warns that combined with --all a removal command empties /var/lib/machines entirely. The Ubuntu manpage copy (https://manpages.ubuntu.com/manpages/focal/man1/machinectl.1.html, weight 0.78) adds the detail that pull-tar and pull-raw usually create hidden, read-only, unmodified machine images from the downloaded image first, before cloning working copies. This matters for the source doc's flow: the imported image is the pristine base, ephemeral containers are throwaway clones, and the base never mutates.

The man7 machinectl page (https://www.man7.org/linux/man-pages/man1/machinectl.1.html, weight 0.8) frames machinectl as the interface to systemd-machined.service for introspecting and controlling machines and images. The linux.org copy (https://www.linux.org/docs/man1/machinectl.html, weight 0.46, weak) points readers to systemd-nspawn(1) for image formats and specifically the --directory= and --image= options.

## Service defaults differ from CLI defaults

The ArchWiki (https://wiki.archlinux.org/title/Systemd-nspawn, weight 0.58) documents that containers started via machinectl or the systemd-nspawn@.service unit use different default options than containers started manually with the systemd-nspawn command. For yubiOS this is a real trap: a script that works with hand-rolled flags can behave differently when the same container is started as a registered machine. Verify which default set is in play before comparing behavior across the two launch paths.

## General systemd context

The Wikipedia systemd article (https://en.wikipedia.org/wiki/Systemd, weight 0.35, weak) provides general context on systemd as the init system and the daemons around it, including machine management. A third-party machinectl guide (https://codelucky.com/machinectl-command-linux/, weight 0.09, weak) exists but adds nothing the man pages do not; it is listed here only as a weak corroboration that machinectl is the standard management surface.

## Reading the invocation back against the docs

Mapping the canonical invocation onto the man pages gives a per-flag provenance table. --machine registers the container with systemd-machined (https://www.man7.org/linux/man-pages/man1/machinectl.1.html, weight 0.8), which is what makes machinectl commands work on it later. --directory points at the extracted rootfs tree (https://www.linux.org/docs/man1/machinectl.html, weight 0.46, weak, pointing into nspawn(1)). --private-users maps to the documented PrivateUsers= semantics with the ownership-shift tooling around systemd-dissect (https://man7.org/linux/man-pages/man1/systemd-nspawn.1.html, weight 0.84). --ephemeral is the dev/test hygiene flag from the source doc. --network-bridge and --setenv are covered by the source doc's own conventions.

One operational detail from the machinectl documentation deserves emphasis for CI users: because pull operations create hidden read-only pristine images before cloning (https://manpages.ubuntu.com/manpages/focal/man1/machinectl.1.html, weight 0.78), a cleanup script that uses machinectl remove without --all will not touch the pristine bases, which is exactly what yubiOS wants. The mirror risk is documented on the listing side: list-images --all combined with a removal command empties /var/lib/machines (https://www.freedesktop.org/software/systemd/man/latest/machinectl.html, weight 0.87), so the --all flag belongs in audit commands, not in cleanup commands.
