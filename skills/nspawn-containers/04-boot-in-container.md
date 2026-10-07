# 04: Boot in container and the test-in-image convention

Scope: what --boot does, why it is the only path to testing systemd unit behavior, and the yubiOS 4-step test-in-image flow.

## What --boot changes

The source doc states that --boot makes PID 1 run /sbin/init (systemd) inside the container, and that this is the only way to test systemd unit files, including hardening drop-ins and dynamic users, without running on the actual host. Community sources corroborate the mechanism, though all in the weak band: stackharbor.com (https://stackharbor.com/en/knowledge-base/systemd-nspawn-containers/, weight 0.12) describes the booted container getting systemd as PID 1 with journal, units, and systemctl working inside, and the journal proxied back to the host so journalctl --machine=<name> works. OneUptime (https://oneuptime.com/blog/post/2026-03-02-how-to-use-systemd-nspawn-for-lightweight-containers-on-ubuntu/view, weight 0.10) shows the -b flag running /sbin/init. Treat both as weak corroboration; the load-bearing claim is the source doc's.

## The pre-boot check

The systemd-nspawn man page (https://man7.org/linux/man-pages/man1/systemd-nspawn.1.html, weight 0.76) records that as a safety check, nspawn verifies the existence of /usr/lib/os-release or /etc/os-release in the container tree before booting, and notes it may be necessary to add that file to the container tree. For yubiOS this is free: mkosi-built images always carry os-release, so the check passes. It is a live concern for hand-assembled trees.

## Booting portable images the same way

The systemd stable docs (https://github.com/systemd/systemd-stable/blob/v255-stable/docs/PORTABLE_SERVICES.md, weight 0.8) confirm the pattern generalized: a portable image can be run as an OS container by booting it with systemd-nspawn -i -b. The -i form takes an image file rather than a directory, which is the --image= side of the source doc's --directory= preference. The Debian manpage (https://manpages.debian.org/systemd-nspawn.1.html, weight 0.75) positions nspawn as chroot but more powerful since it fully virtualizes the file system hierarchy and process tree, which is what makes a booted container behave like a machine rather than a chroot.

## The yubiOS test-in-image convention

The source doc gives a 4-step flow, all attributed to it:

1. Build the mkosi image (mkosi build).
2. Extract to /var/lib/machines/<image-tag> via machinectl import-tar or manual extraction.
3. Run nspawn --boot and execute the test suite inside the container.
4. Ephemeral mode means the image is never modified; the next test starts clean.

Step 4 is the property that makes CI honest: the container under test starts from the signed image every time, so a flaky test cannot be explained by residue from the previous run. The ArchWiki (https://wiki.archlinux.org/title/Systemd-nspawn, weight 0.57) independently describes nspawn as more powerful than chroot because it fully virtualizes the file system hierarchy and process tree, which is the precondition for step 3 exercising real unit semantics.

## Registering and observing booted containers

The linux.org man page copy (https://www.linux.org/docs/man1/systemd-nspawn.html, weight 0.55) notes the boot-related option is useful to ensure the container is accessible via machinectl and shown by tools such as ps. A 0pointer blog category listing (http://0pointer.net/blog/category/projects.html, weight 0.43) includes container-related posts from the systemd author's blog, a secondary pointer rather than a direct claim. The Debian manpage (weight 0.75) already covers the general run-a-command-or-OS framing: without --boot you get a shell or command in a namespace container; with --boot you get a machine.

## Failure shapes at boot

Two failure classes follow from the documented mechanics. First, the os-release check (https://man7.org/linux/man-pages/man1/systemd-nspawn.1.html, weight 0.76): a tree missing /usr/lib/os-release and /etc/os-release refuses to boot, so a mkosi profile change that drops os-release breaks the test-in-image convention at step 3, loudly, which is the good failure mode. Second, the defaults split between manual invocation and the machinectl or systemd-nspawn@.service path (https://wiki.archlinux.org/title/Systemd-nspawn, weight 0.57): a booted container registered as a machine runs with the service default set, so tests that pass under a hand-rolled command line can behave differently when launched the registered way. The source doc's convention pins the launch path, step 3 always uses explicit flags, which sidesteps the divergence by never relying on defaults at all.

The boundary case the source doc names also applies here: if a request only names a trigger without the artifact it acts on, route to the owning surface instead of improvising. In boot terms, if the artifact under test is a unit file, this skill owns it; if it is a whole image build, mkosi-image-builder owns it.
