# 07 - Upgrade, switch, and rollback

Scope: the update lifecycle of a booted system: staged upgrades, controlled maintenance windows, blue/green image switching, rollback, and auto-updates.

## The staging model

bootc upgrades follow a fetch-stage-apply pattern. The source doc (yubi-OS/yubiOS skills/bootc-images/SKILL.md) and the upstream model both describe it: the new image is pulled and staged as a new deployment, and it takes effect on the next reboot. `bootc upgrade` stages the update; `bootc upgrade --apply` stages it and reboots immediately (source doc). The design is the same atomic A/B swap OSTree has always used: the running system keeps using the old deployment until the machine chooses to boot the new one (ostreedev.github.io/ostree/atomic-upgrades/, w=0.74).

Nothing is mutated in place during an upgrade. If the pull fails, the network dies, or the staging step crashes, the running deployment is untouched. This is why bootc upgrades are safe to schedule unattended, and it is the property the whole fleet-update posture rests on (docs.fedoraproject.org/en-US/bootc/getting-started/, w=0.92).

## Controlled maintenance windows

The source doc gives the download-only workflow for fleets that patch inside a window:

```bash
bootc upgrade --download-only   # 1. fetch without applying
bootc status --verbose          # 2. shows Download-only: yes
bootc upgrade --from-downloaded # 3a. apply staged, no re-fetch
bootc upgrade --from-downloaded --apply  # 3b. apply + reboot now
bootc upgrade --check           # no side effects; update check only
```

(source doc). The --check flag is the read-only membership probe: it reports whether a newer image exists without staging anything. The --download-only / --from-downloaded pair decouples network work (slow, failure-prone) from the apply decision (fast, local).

## Switching image sources

`bootc switch` repoints the machine at a different image source:

```bash
bootc switch dhi.io/yubi-OS/yubiOS:v2026.06       # tag
bootc switch dhi.io/yubi-OS/yubiOS@sha256:...     # digest pin
bootc switch --apply dhi.io/yubi-OS/yubiOS:v2026.06
```

(source doc). The guarantee that makes switch safe for production: "bootc switch preserves /etc and /var - SSH keys, home dirs, persistent state all survive" (source doc). Only /usr is replaced. Digest-pinned switches are the yubiOS norm; tag switches are for canary rings.

## Rollback

`bootc rollback` swaps bootloader ordering to the previous deployment (source doc). There is no data migration to unwind because /etc and /var were never replaced; a rollback returns the OS to the prior image and the machine boots it immediately. The failed new deployment remains on disk for diagnosis.

## Auto-updates

The upstream-provided timer automates the fetch-apply loop (source doc):

```bash
systemctl enable --now bootc-fetch-apply-updates.timer
```

Default behavior: checks every 4 hours, applies on next reboot. For yubiOS the timer is appropriate for machines in the auto ring; machines in controlled rings keep the manual window workflow above. The CNCF profile frames bootc's update model as the project's core value (cncf.io/projects/bootc/, w=0.69), and Red Hat's guide recommends the timer for hands-off fleets (developers.redhat.com/articles/2024/09/24/bootc-getting-started-bootable-containers, w=0.80).

## Fleet ordering for yubiOS

Combining the primitives gives the standard rollout: canary ring switches by digest and boots immediately; a soak period follows; the broad ring takes the same digest via upgrade or the timer; any machine that misbehaves rolls back with one command and its state intact. Because every ring consumes the same digest, provenance and attestation chains (SLSA provenance skill) hold across the whole fleet.

## Failure and retry behavior

Because staging is local, a failed fetch retries safely: re-run bootc upgrade and it fetches again from the registry, with the old deployment still booted. The failure modes to plan for are registry-side (auth token expiry, digest unreachable) rather than local. A staged-but-not-applied deployment is visible in bootc status --verbose and can be discarded by switching back to the current image source or simply waiting for the next successful upgrade to supersede it (source doc).

## Relation to the immutability stack

An upgrade replaces the entire /usr in one atomic step, which is what keeps the "/usr is immutable at every boot" invariant meaningful across the fleet: between boots, no partial update exists. The composefs-verified root (doc 03) means the new deployment's content is verified at first boot, so an interrupted or corrupted stage cannot boot half-applied. Rollback inherits the same guarantee in reverse.
