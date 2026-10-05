# 01: bootc upgrade staging semantics

Scope: bootc upgrade staging semantics: pulling new container images, --download-only staging, bootc status fields, and how a staged upgrade becomes the next bootable deployment.

## What bootc upgrade does

bootc applies the container image model to bootable host systems: standard OCI and Docker containers are the transport for operating system updates [1]. Once a system is installed, whether directly via `bootc install` or via another installer mechanism, further updates are pulled and applied with `bootc upgrade` [2]. Fedora's documentation frames bootc as a modern, opinionated way of deploying and managing immutable, image based Linux systems, with ostree as the underlying storage engine [3] [4]. A bootc image includes the kernel, initrd, bootloader, and firmware needed to boot bare metal or VMs; after deployment the system does not run as a container, systemd acts as PID 1 as usual [5] (weak backing, w=0.47).

## The download-only mode

`bootc upgrade --download-only` fetches the update and stages it without applying it. Red Hat's guidance describes the flow explicitly: download the update in download only mode, then verify the staged deployment, then apply during a maintenance window [6]. The upstream bootc documentation shows the same 3 step pattern: `bootc upgrade --download-only`, then `bootc status --verbose` where the output shows `Download-only: yes`, then test or wait [7].

The `--check` option is a lighter probe: it verifies whether updates are available without downloading the full image layers, downloading only the updated manifest and image configuration, typically kilobyte sized metadata [8] (weak backing, w=0.15).

## Reboot before apply discards the stage

A behavior that matters directly for upgrade testing: if you reboot before applying a download only update, the system boots into the current deployment and the staged deployment is discarded. The downloaded image data remains cached, so re-running `bootc upgrade --download-only` afterwards is fast and does not re-download the container image [9]. A CI test that stages an update and reboots without applying it must therefore expect the stage to be gone on the next boot, not preserved.

## Reading staged state with bootc status

A queued update is visible as staged in `bootc status` [8] (weak backing, w=0.15). Red Hat's article walks the apply step: setting download only status to false readies the system to switch on the next reboot, and `bootc upgrade --from-downloaded --apply` unlocks the staged deployment and immediately reboots into it [1]. That is the exact command a VM test uses to drive the staged update to completion in one step.

One caveat for testing inside containers: when `bootc status` is invoked in a container or non bootc system, the host detection returns a default Host structure with empty status and spec fields [10] (weak backing, w=0.17). Tests must assert status inside a booted VM, not inside a bare container run.

## What a lifecycle test should assert

For a bootc upgrade test in an ephemeral VM, the observable state machine is:

1. Pull the target image so it is available locally.
2. Stage with `bootc upgrade --download-only` and confirm staging via `bootc status` (staged deployment visible; `Download-only: yes` in verbose output) [6] [7] [8].
3. Apply with `bootc upgrade --from-downloaded --apply`, which unlocks the staged deployment and reboots into it [1].
4. After reboot, confirm the booted image is the new one. A reboot before this apply step would have discarded the stage [9].

## Sources

1. https://developers.redhat.com/articles/2026/02/18/control-updates-download-only-mode-bootc (w=0.89)
2. https://github.com/bootc-dev/bootc (w=0.70)
3. https://docs.fedoraproject.org/en-US/bootc/getting-started/ (w=0.87)
4. https://linuxcent.com/atomic-os-updates-explained/ (w=0.14, weak)
5. https://github.com/andrew-weida/bootc-container-image-best-practices (w=0.47, weak)
6. https://developers.redhat.com/articles/2026/02/18/control-updates-download-only-mode-bootc (w=0.89)
7. https://bootc.dev/bootc/bootc-upgrades.7.html (w=0.94)
8. https://www.mankier.com/8/bootc-upgrade (w=0.15, weak)
9. https://github.com/bootc-dev/bootc/blob/main/docs/src/bootc-upgrades.7.md (w=0.93)
10. https://deepwiki.com/bootc-dev/bootc/3.3-system-status (w=0.17, weak)
