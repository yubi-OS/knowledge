# Modern systemd Features: The v254 to v261 Wave

**Abstract.** Between v254 (2023) and v261 (2026), systemd shipped a coordinated set of features aimed squarely at image-mode, immutable-root operating systems: systemd-sysupdate for A/B partition updates, soft-reboot for userspace-only restarts, ukify for building Unified Kernel Images, run0 for privilege elevation without setuid binaries, and in v261 the first PID 1 integration with the kernel's Live Update Orchestration (LUO) and Kexec Handover (KHO) plus a native installer (systemd-sysinstall) and boot secrets. For image-mode OSes these matter because they close the last operational gaps: sysupdate makes atomic A/B updates a systemd primitive rather than a bespoke script, soft-reboot applies a full userspace update without a kernel restart, and LUO/KHO point at the endgame of keeping even the kernel warm across updates. An image-mode OS built on bootc, mkosi, UKIs, and dm-verity can now source its entire update, reboot, and privilege model from upstream systemd instead of maintaining project-specific tooling.

## The "What's New" Tour Becomes a Canon

Since v256, Lennart Poettering has documented each systemd release on 0pointer not as a monolithic essay but as a curated index into a series of Mastodon posts. The [v256 announcement](https://0pointer.net/blog/announcing-systemd-v256.html) (posted June 12, 2024, one day after the release) lists 16 post series covering the release's key features, including run0 as a sudo replacement, unprivileged DDI mounts, and mutable systemd-sysext. The pattern continued: an [announcement for v257](https://0pointer.net/blog/announcing-systemd-v257.html) (December 17, 2024) lists 37 post series, and dedicated story index pages exist for [v258](https://0pointer.net/blog/mastodon-stories-for-systemd-v258.html), [v259](https://0pointer.net/blog/mastodon-stories-for-systemd-v259.html), [v260](https://0pointer.net/blog/mastodon-stories-for-systemd-v260.html), and [v261](https://0pointer.net/blog/mastodon-stories-for-systemd-v261.html) (posted June 26, 2026, covering the June 19 release with 27 posts). These index posts are now the primary narrative record of the systemd feature wave; the [freedesktop release notes](https://github.com/systemd/systemd/releases) carry the ground truth (0.39).

## systemd-sysupdate: A/B Updates as a systemd Primitive

systemd-sysupdate downloads and installs new versions of the host OS (or of its components, like kernels and container images) based on declarative `sysupdate.d/` transfer files, with the `systemd-sysupdate.service` system service triggering updates on a timer ([systemd-sysupdate man page](https://www.freedesktop.org/software/systemd/man/systemd-sysupdate.html), 0.10). The model is A/B: new versions are installed into a separate partition or subvolume next to the running one, and a switch happens at the next boot. For image-mode OSes this replaces hand-rolled update scripts: the transfer files describe which partition to fetch into and which to swap, and sysupdate handles versioning, signatures, and target selection. The tool predates the v256 wave: by v254 the [release notes](https://github.com/systemd/systemd/releases/tag/v254) were already adding new `sysupdate.d/` drop-in settings, so sysupdate was under active refinement throughout the period (version-sensitive: exact introduction version not verified here). The v261 story list adds [systemd-boot A/B support](https://0pointer.net/blog/mastodon-stories-for-systemd-v261.html) (Post #12), connecting the update tool to the bootloader that performs the swap.

## soft-reboot: Userspace-Only Restarts

v254 introduced a new reboot mechanism exposed as `systemctl soft-reboot` ([v254 release notes](https://github.com/systemd/systemd/releases/tag/v254)). A soft-reboot is like a regular reboot except it affects userspace only: the kernel keeps running, PID 1 is replaced, and services restart from scratch ([openSUSE MicroOS blog](https://microos.opensuse.org/blog/2024-06-13-soft-reboot/), 0.38). For image-mode OSes this is the update-latency killer: after a sysupdate A/B swap, a soft-reboot activates the new userspace without paying the full firmware, bootloader, and kernel boot cost. The v261 [release notes](https://github.com/systemd/systemd/releases/tag/v261) note that logind's reboot-related operations now include `SoftReboot()` as a distinct operation alongside `Reboot()`, `PowerOff()`, `Halt()`, and `Kexec()`, so the mechanism is a first-class citizen rather than a compatibility trick.

## ukify: Building Unified Kernel Images

ukify combines a kernel, initrd, and other components into a Unified Kernel Image (UKI), the signed, self-measuring artifact that the authenticated-boot stack from the [Fitting Everything Together](https://0pointer.net/blog/fitting-everything-together.html) essay assumes ([ukify man page](https://www.freedesktop.org/software/systemd/man/ukify.html)). It can also generate UKI-like extension images, sign Secure Boot artifacts via its `genkey` verb, and print detailed information about existing UKIs ([ukify man page](https://www.freedesktop.org/software/systemd/man/ukify.html)). The v257 wave pushed UKIs further: [Multi-Profile UKIs](https://0pointer.net/blog/announcing-systemd-v257.html) (Post #4), initrd and microcode UKI add-ons (Post #13), DeviceTree matching in UKIs (Post #22), and the new systemd-sbsign tool for Secure Boot signing (Post #14). For image-mode OSes, ukify plus systemd-stub means the kernel itself becomes part of the verifiable, composable image rather than a mutable host-level artifact.

## run0: Privilege Elevation Without sudo

v256 introduced run0, which runs commands as root not by exec'ing a setuid binary but by asking systemd to spawn the command as a transient service ([v256 announcement](https://0pointer.net/blog/announcing-systemd-v256.html), Post #5; [Phoronix](https://www.phoronix.com/news/systemd-256), 0.18). The command runs under the full systemd sandbox machinery, with an allow/deny policy in a `10-root.permissive` style polkit decision rather than a sudoers grammar (version-sensitive: exact polkit integration details not verified here). run0 gained `--pty` and related settings in v257 ([LWN](https://lwn.net/Articles/1001657/), 0.73) and `--empower` in v259 ([v259 story index](https://0pointer.net/blog/mastodon-stories-for-systemd-v259.html)). For image-mode OSes the significance is structural: the root trust path runs through systemd's audit and sandbox machinery instead of a separate setuid-root binary, which removes sudo from the set of things an image must ship, measure, and keep patched.

## v261: sysinstall, Boot Secrets, and Live Updates

v261 (released June 19, 2026) landed three changes with outsized image-mode consequences ([v261 release notes](https://github.com/systemd/systemd/releases/tag/v261); [LWN](https://lwn.net/Articles/1078708/), 0.46; [Phoronix](https://www.phoronix.com/news/systemd-261), 0.16):

1. **systemd-sysinstall**, a native OS installer that unifies the repart/bootctl layer ([v261 story index](https://0pointer.net/blog/mastodon-stories-for-systemd-v261.html), Post #7; [desdelinux](https://blog.desdelinux.net/en/systemd-261-lanzamiento-novedades-instalador-sysinstall-luo-kho-tpm/), 0.45). Image-mode OSes install by writing a disk image, not by assembling packages, and sysinstall is the systemd-native expression of that.
2. **Boot secrets and automatic software TPM fallback**: where no physical TPM exists, systemd can use a software TPM keyed from the new "boot secret" facility, enabled via the `systemd.tpm2_software_fallback=` kernel command line option ([v261 release notes](https://github.com/systemd/systemd/releases/tag/v261)). This extends the LUKS2/TPM2 unlock chain described in the [Authenticated Boot essay](https://0pointer.net/blog/authenticated-boot-and-disk-encryption-on-linux.html) to VMs and boards without a hardware TPM. Cloud instance metadata (IMDS) support for EC2, Azure, and others landed in the same release ([v261 release notes](https://github.com/systemd/systemd/releases/tag/v261)).
3. **LUO/KHO integration**: PID 1 now supports the kernel's Live Update Orchestration (LUO) and Kexec Handover (KHO) facilities when present and enabled, and system units can create their own LUO sessions by talking to the kernel ([v261 release notes](https://github.com/systemd/systemd/releases/tag/v261); [LWN](https://lwn.net/Articles/1078708/), 0.46). This is the logical successor to soft-reboot: instead of restarting userspace on a warm kernel, LUO/KHO aim to carry state across a kernel replacement, turning "reboot to apply an update" into a near-zero-downtime handover.

## What the Wave Means for Image-Mode OSes

Read together, the v254 to v261 wave converts the image-mode thesis of [Fitting Everything Together](https://0pointer.net/blog/fitting-everything-together.html) from architecture to operations. The immutable, verifiable root the 2023 essays described now has an upstream update mechanism (sysupdate), two tiers of restart cost (soft-reboot for userspace, LUO/KHO for kernel handover), a build-time artifact pipeline (ukify), a trust path for root operations (run0), and an installer (sysinstall) that treats "write the image and boot it" as the norm. An OS built this way ships no sudo binary, no bespoke updater, no out-of-tree UKI assembly, and no TPM-less fallback hacks of its own; it pins a systemd version and inherits the rest.

## Sources considered

- https://0pointer.net/blog/ (index; used)
- https://0pointer.net/blog/announcing-systemd-v256.html (used)
- https://0pointer.net/blog/announcing-systemd-v257.html (used)
- https://0pointer.net/blog/mastodon-stories-for-systemd-v261.html (used)
- https://0pointer.net/blog/mastodon-stories-for-systemd-v259.html (used)
- https://0pointer.net/blog/fitting-everything-together.html (used)
- https://0pointer.net/blog/authenticated-boot-and-disk-encryption-on-linux.html (used)
- https://github.com/systemd/systemd/releases (used)
- https://github.com/systemd/systemd/releases/tag/v254 (used)
- https://github.com/systemd/systemd/releases/tag/v261 (used)
- https://www.freedesktop.org/software/systemd/man/systemd-sysupdate.html (used, 0.10)
- https://www.freedesktop.org/software/systemd/man/ukify.html (used)
- https://microos.opensuse.org/blog/2024-06-13-soft-reboot/ (used, 0.38)
- https://lwn.net/Articles/1078708/ (used, 0.46)
- https://lwn.net/Articles/1001657/ (used, 0.73)
- https://www.phoronix.com/news/systemd-256 (used, 0.18)
- https://www.phoronix.com/news/systemd-261 (used, 0.16)
- https://blog.desdelinux.net/en/systemd-261-lanzamiento-novedades-instalador-sysinstall-luo-kho-tpm/ (used, 0.45)
- https://systemd.io/ (secondary; only generic)
- https://newreleases.io/project/github/systemd/systemd/release/v261 (rejected: duplicate)
- https://www.linuxnews.net/articles/systemd-v261-released (rejected: duplicate)
- https://4sysops.com/archives/systemd-v256-new-features-of-the-linux-service-manager/ (rejected: duplicate)
- https://0pointer.net/blog/mastodon-stories-for-systemd-v258.html (rejected: unused)
- https://0pointer.net/blog/mastodon-stories-for-systemd-v260.html (rejected: unused)
