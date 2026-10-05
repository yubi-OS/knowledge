# 08. Silent failure modes and cross-version compatibility

Scope: how nspawn environments break quietly across systemd upgrades and image changes, the documented upgrade breakage cases, and how NEWS and release notes record the changes a test leg would catch.

## Why the failure is silent

An unexercised boundary does not alarm: it degrades. The yubiOS record names the shape precisely: the nspawn dev-environment boundary is "the only one whose failure mode is silent": an nspawn that refuses RootImage= (quota, mount topology, or UKI layout change across systemd majors) degrades the dev workflow with no test to catch it ([yubiOS refs record: adjacent-problems-nspawn-boundary-2026-09-17.md](https://github.com/yubi-OS/yubiOS), jev source-doc). The two tested legs in that project run inside bcvk VMs booted from the same signed image, so they exercise the image but never the nspawn boundary against it ([yubiOS refs record: adjacent-problems-nspawn-boundary-2026-09-17.md](https://github.com/yubi-OS/yubiOS), jev source-doc).

## Documented breakage across upgrades

Upgrade-time breakage of nspawn environments is documented in the project tracker. Issue 37295 records a systemd start timeout aborting a dnf system-upgrade run inside an nspawn container: after issuing the upgrade reboot in the container, the container restarted and started the upgrade as expected, but the start timeout later kicked in and aborted the upgrade, "leaving a partially upgraded and broken container", which had to be recreated from scratch ([github.com/systemd/systemd issue 37295](https://github.com/systemd/systemd/issues/37295), jev 0.56). The failure mode there is not a loud rejection at start; it is a mid-operation abort that leaves state half-migrated.

Networking is the other documented degradation path. Launchpad bug 1764338 records systemd-nspawn containers on an Ubuntu 18.04 server, used for an internal test automation service, with private networking via the network-veth option and a single exposed port, losing container networking after an upgrade ([Launchpad bug 1764338: systemd-nspawn container networking lost](https://bugs.launchpad.net/ubuntu/+source/systemd/+bug/1764338), jev 0.40). That bug report is itself the picture of the silent failure in production: a test automation fleet whose boundary degraded underneath it.

## Where the changes are recorded

The authoritative record of behavior changes is the project's NEWS file, the changelog maintained in the systemd repository ([github.com/systemd/systemd/blob/main/NEWS](https://github.com/systemd/systemd/blob/main/NEWS), jev 0.74), surfaced per release on the releases page, which documents feature removals and deprecations such as superseded EFI variables and changes to systemd-sysupdate units ([github.com/systemd/systemd Releases](https://github.com/systemd/systemd/releases), jev 0.88). The yubiOS record's flip condition (b) is exactly this discipline: verify RootImage= behavior against the pinned mkosi fork per PINNED.md when systemd majors move ([yubiOS refs record: adjacent-problems-nspawn-boundary-2026-09-17.md](https://github.com/yubi-OS/yubiOS), jev source-doc). Reading NEWS is the paper trail; a CI leg is the execution trail. The record's position is that the paper trail alone is what exists today, which is why the gap is stated rather than filled ([yubiOS refs record: adjacent-problems-nspawn-boundary-2026-09-17.md](https://github.com/yubi-OS/yubiOS), jev source-doc).

## What a leg would catch, concretely

A nspawn leg rooted off the pinned image would catch three classes of quiet breakage:

1. Image-format drift: an mkosi output layout change that the directory-tree legs never see, because only RootImage= parses the image ([yubiOS refs record: adjacent-problems-nspawn-boundary-2026-09-17.md](https://github.com/yubi-OS/yubiOS), jev source-doc).
2. Runtime-option drift: changes to nspawn defaults or settings-file semantics across systemd majors, the class of change NEWS records ([github.com/systemd/systemd/blob/main/NEWS](https://github.com/systemd/systemd/blob/main/NEWS), jev 0.74).
3. Upgrade-path behavior: the partially-upgraded-container class of failure from issue 37295, which only manifests when a container actually runs lifecycle operations against a real image ([github.com/systemd/systemd issue 37295](https://github.com/systemd/systemd/issues/37295), jev 0.56).

## The boundary's own honesty

The tool's manual page sets expectations for what the boundary guarantees in the first place: the containment is not a security feature and provides protection against accidental destructive operations only ([linux.org: systemd-nspawn man page](https://www.linux.org/docs/man1/systemd-nspawn.html), jev 0.65). A silent degradation of a convenience boundary is therefore not a security incident; it is a workflow regression, which is exactly why it can go unnoticed between releases and why the yubiOS record frames the fix as a test-leg decision under explicit flip conditions rather than as an urgent hole ([yubiOS refs record: adjacent-problems-nspawn-boundary-2026-09-17.md](https://github.com/yubi-OS/yubiOS), jev source-doc).

## Sub-claims recap

1. The nspawn boundary's failure mode is silent degradation, by construction of the coverage state (source-doc record).
2. Documented upgrade breakage includes mid-operation upgrade aborts leaving partially upgraded containers (issue 37295, weight 0.56) and lost container networking after upgrades (Launchpad 1764338, weight 0.40).
3. NEWS and the releases page are the authoritative paper trail for nspawn behavior changes across majors (weights 0.74, 0.88).
4. The boundary is documented as protection against accidental destructive operations, not as a security feature (weight 0.65).
5. The yubiOS remedy is a flip-condition-gated CI leg, not an assumed-urgent fix (source-doc record).
