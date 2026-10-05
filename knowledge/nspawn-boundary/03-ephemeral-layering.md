# 03. Ephemeral layering: --ephemeral and Overlay=

Scope: systemd-nspawn's ephemeral container mode, its copy-on-write implementation behavior, the Overlay= settings equivalent, and what repeated test runs actually get.

## What --ephemeral promises

The --ephemeral switch runs a container on a temporary, throwaway root: the container is destroyed when it terminates, so repeated runs always start from a pristine root. The systemd-nspawn manual page documents the general contract that nspawn mounts file systems private to the container at /dev/, /run/, and similar paths ([freedesktop.org systemd-nspawn(1)](https://www.freedesktop.org/software/systemd/man/latest/systemd-nspawn.html), jev 0.94), which is the per-run isolation wrapper around whichever root strategy is chosen.

## The implementation detail that matters for CI

The implementation detail is documented in the project's own tracker: when using systemd-nspawn --ephemeral, "the entire dir seems to be copied to a temporary path in /tmp", and the feature request asks for an overlay-based alternative instead, warning that a lower-layer user must not mutate the lower dir ([github.com/systemd/systemd issue 11054](https://github.com/systemd/systemd/issues/11054), jev 0.61). For a CI leg that would boot the yubiOS mkosi image with --ephemeral, this is the cost model to verify: on filesystems that support copy-on-write the cost is a cheap snapshot, on others it is a full copy. A practitioner building tooling on nspawn records the same behavior: systemd-nspawn has an interesting --ephemeral option that sets up temporary copy-on-write filesystem snapshots on filesystems that support it, like btrfs ([enricozini.org: systemd tag posts, nspawn-runner](https://www.enricozini.org/tags/systemd/), jev 0.29).

## The Overlay= equivalent in settings files

The per-container settings format carries the overlay machinery for the service path: the systemd.nspawn(5) page records that the overlay setting is equivalent to the command line switches --overlay= and --overlay-ro=, and that this setting is privileged ([man7.org systemd.nspawn(5)](https://www.man7.org/linux/man-pages/man5/systemd.nspawn.5.html), jev 0.77). Combined with the sidecar convention from the RootImage doc (a mkosi.nspawn file travels next to the image), an ephemeral layered run can be declared in the settings file rather than re-typed per invocation.

## Ephemeral mode as an immutability pattern

A lab-style writeup on immutable bastion hosts describes the pattern nspawn ephemeral mode serves: secure, ephemeral hosts using systemd-nspawn and OverlayFS so that persistent changes are wiped on every reboot ([devops-geek.net: Building Immutable Bastion Hosts with Systemd-Nspawn and Ephemeral OverlayFS mounts](https://devops-geek.net/devops-lab/building-immutable-bastion-hosts-with-systemd-nspawn-and-ephemeral-overlayfs-mounts/), jev 0.19). The weight is low, so treat it as a usage datapoint rather than documentation; the underlying mechanism claims above carry the higher-weight sources.

## Why this matters for the yubiOS boundary

The yubiOS record names --ephemeral as one of the three nspawn mechanics (with RootImage= and --boot) that run in zero CI legs today, while the tested sysext and portable-service legs run inside bcvk VMs booted from the same signed image ([yubiOS refs record: adjacent-problems-nspawn-boundary-2026-09-17.md](https://github.com/yubi-OS/yubiOS), jev source-doc). Ephemeral mode is the mechanic that makes an nspawn leg cheap to add: with a throwaway root, the leg cannot contaminate the pinned image it boots, which is exactly what a CI job requires. It is also the mechanic whose behavior is most sensitive to filesystem support, per the issue 11054 record above, which makes it the one most worth exercising rather than assuming.

## Sub-claims recap

1. --ephemeral gives a throwaway container root; the per-run private mounts (/dev/, /run/) are part of the base contract (weight 0.94).
2. On filesystems without native copy-on-write support, --ephemeral copies the tree to /tmp; overlay-based ephemeral is a requested feature, not a settled one (weight 0.61).
3. Overlay= in a settings file is the privileged settings-side equivalent of --overlay= and --overlay-ro= (weight 0.77).
4. In yubiOS, --ephemeral is named and unexercised: the boundary that makes a hypothetical CI leg safe is itself untested (source-doc record).
