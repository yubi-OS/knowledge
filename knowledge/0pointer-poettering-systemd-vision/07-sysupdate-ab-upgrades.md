# 07 systemd-sysupdate: A/B Atomic Upgrades

Scope: systemd-sysupdate as the self-updating mechanism of the vision: A/B atomic updates, transfer configuration, real deployments, and how it satisfies the robustness goals.

## What sysupdate does

The upstream man page defines the tool precisely: systemd-sysupdate atomically updates the host OS, container images, portable service images or other sources, based on the transfer configuration files described in sysupdate.d(5) (source: https://www.freedesktop.org/software/systemd/man/latest/systemd-sysupdate.html, jev 0.91). The A/B partition model provides a clean, atomic, and robust update mechanism: sysupdate installs the new version into the inactive slot while the system keeps running from the active one (source: https://deepwiki.com/systemd/systemd/4.3-system-update-with-systemd-sysupdate, jev 0.56, secondary source; low-weight duplicate: jev 0.17).

## The design goals it implements

In the essay's goal list, sysupdate is goal 5 (self-updating via A/B atomic upgrades) and the precondition for goal 6 (robust against power loss, because the A/B partition scheme means an interrupted update never leaves a half-written OS) (source: https://0pointer.net/blog/fitting-everything-together.html, jev 0.95). The same essay's boot flow closes the loop: systemd-boot picks the newest kernel image by version sort, so after an update a reboot is all that is needed and no explicit switch mechanism is required (source: https://0pointer.net/blog/fitting-everything-together.html, jev 0.95).

## Block-level, image-based updates

Independent analysis characterizes sysupdate as a block-level, A/B image-based update tool shipped as part of systemd that replaces traditional package managers like dpkg and rpm for whole-system updates (source: https://botmonster.com/self-hosting/atomic-linux-updates-systemd-sysupdate/, jev 0.24, low weight). That characterization matters for the vision: updates move at the image level, so the unit of update is the same immutable artifact the OS ships as, not a set of individually versioned packages.

## Real-world adoption

GNOME OS migrated to sysupdate as its update system; the Codethink write-up describes the migration as one of the tasks toward the general goal of image-based OS delivery, noting that sysupdate was the new system being adopted (source: https://www.codethink.co.uk/articles/2024/GNOME-OS-systemd-sysupdate/, jev 0.52). GNOME OS is the reference deployment demonstrating that the A/B model works for a full desktop OS in production CI-driven image builds.

## Where sysupdate sits in the provisioning stack

At All Systems Go! 2026, Poettering's talk "Provisioning and Deployment Mechanisms in systemd" grouped the recent improvements to OS provisioning and deployment tooling, naming systemd-sysinstall, systemd-sysupdate, and credentials as the pieces (source: https://cfp.all-systems-go.io/all-systems-go-2026/speaker/UNJXNH/, jev 0.59; recording: https://media.ccc.de/v/all-systems-go-2026-434-provisioning-and-deployment-mechanisms-in-systemd, jev 0.81). The picture is a pipeline: sysinstall lays down the initial image, sysupdate keeps it current atomically, and credentials carry secrets into the new generation. v261 already flagged planned v262 removals of the sysupdated D-Bus API, showing the tooling is still being reshaped around this pipeline (source: https://github.com/systemd/systemd/releases/tag/v261, jev 0.86, per the parent source material).

## Keys and trust in updates

The vision pairs image updates with local key generation: Poettering's "Authenticated Boot and Disk Encryption on Linux" essay discusses that if the design requires it, mechanisms such as a per-host signature key generated locally could authenticate data without a central authority holding secrets (source: http://0pointer.net/blog/authenticated-boot-and-disk-encryption-on-linux.html, jev 0.90). For sysupdate this is the difference between downloading an image and trusting it: the A/B slot content is verified against signatures the system already trusts from the boot chain (source: http://0pointer.net/blog/authenticated-boot-and-disk-encryption-on-linux.html, jev 0.90; https://0pointer.net/blog/fitting-everything-together.html, jev 0.95).

## Why A/B beats in-place for immutable systems

The stack is coherent because every piece assumes the same invariant: /usr is immutable and vendor-owned while /etc and /var hold local state (source: https://0pointer.net/blog/fitting-everything-together.html, jev 0.95). With that separation, an A/B update only has to replace the immutable half of the system, which is exactly the image sysupdate delivers atomically; local state survives across updates untouched (source: https://www.freedesktop.org/software/systemd/man/latest/systemd-sysupdate.html, jev 0.91; https://0pointer.net/blog/fitting-everything-together.html, jev 0.95).
