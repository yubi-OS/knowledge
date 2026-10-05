# 05 - Suspend, resume, and state capture at workload cut-off

Scope: VM suspend-resume, qcow2/savevm snapshots, and live migration as state-preservation patterns at workload cut-off; discard-versus-preserve semantics with GPU passthrough.

## QEMU's snapshot machinery

The QEMU monitor exposes commands to create and restore snapshots of a running VM: savevm and loadvm. The design goal is the ability to save a complete and restorable VM state (https://airbus-seclab.github.io/qemu_blog/snapshot.html, weight 0.46, weak backing for this specific writeup but consistent with the primary wiki sources below).

QEMU disk snapshots are copy-on-write overlays: a snapshot image refers to an original image using redirect-on-write so the original is never modified, created with the qcow2 backing-file flag (https://wiki.qemu.org/Documentation/CreateSnapshot, weight 0.75). The QEMU feature tracker describes the full live-snapshot sequence: save vmstate to an external qcow2 file, freeze the guest filesystem via the guest agent, freeze QEMU block I/O by pausing the VM or queueing I/O, snapshot each block device, then restore block I/O and the guest filesystem by resuming the VM (https://wiki.qemu.org/Features/VMSnapshotEnchancement, weight 0.72). This is the pattern a cut-off policy would reuse: quiesce, capture, then act.

A smaller hypervisor project documents the same lifecycle shape: suspend attempts a qcow2 savevm snapshot when possible, then stops the process; restore loads the snapshot if present, otherwise cold-boots the disk (https://grainvm.com/docs/0.4.0/guides/lifecycle/, weight 0.63).

## VFIO device migration: the device-side state path

QEMU's VFIO device migration documentation defines how device state moves during live migration. The VFIO migration code uses a VM state change handler to change the VFIO device state when the VM state changes from running to not-running and vice versa (https://qemu.readthedocs.io/en/v8.1.5/devel/vfio-migration.html, weight 0.94). The migration flow for a VFIO device supporting both precopy and P2P migration defines the state-change flow during live migration (https://www.qemu.org/docs/master/devel/migration/vfio.html, weight 0.79; mirrored at https://virtio-fs.gitlab.io/qemu/devel/vfio-migration.html, weight 0.88).

The mechanics are documented in the migration region: a save_live_iterate function reads the VFIO device's data from the vendor driver through the migration region during the iterative phase, and a save_state function saves the device config space if present (https://virtio-fs.gitlab.io/qemu/devel/vfio-migration.html, weight 0.88). Device state capture is therefore a vendor-driver capability that must be negotiated per device, not a universal guarantee.

## Live migration with passthrough devices

Red Hat's deep dive explains how to migrate a virtual machine that has a passthrough device via VFIO by using a standard virtio-net device to redirect traffic during the migration (https://developers.redhat.com/articles/2024/02/21/virtio-live-migration-technical-deep-dive, weight 0.89). The pattern shows passthrough and migration are not inherently incompatible, but require a standby paravirtual device to bridge the window when the physical device is detached.

A community reference on external snapshots lists the required sequence: pause the VM, create a qcow2 overlay with qemu-img create -f qcow2 -b base.qcow2 snapshot.qcow2, then save and restore VM state from the snapshot (https://deepwiki.com/sifive/riscv-qemu/8.2-snapshots-and-saverestore, weight 0.58). A superuser question on predictable savevm behavior and a Medium production guide on KVM GPU passthrough carry weak backing (https://superuser.com/questions/1768173/how-to-work-with-qemu-snapshots-savevm-in-a-way-that-is-predictable-like-virtual, weight 0.05, weak; https://medium.com/@armestonaidoost/kvm-gpu-passthrough-with-vfio-a-production-focused-guide-de432ca2a12b, weight 0.23, weak).

## Discard versus preserve at cut-off

The reviewed sources establish two distinct semantics:

1. Suspend-resume (save VM state to disk, clear host resources, resume later) is a resource-management pattern. It preserves VM state by design but is invoked for scheduling, not for misbehavior response.
2. Device reset discards state. The VFIO reset path and the vendor reset tooling both terminate in a clean device with no prior state retained.

No reviewed source combines them: a behavioral trigger that snapshots state first and only then severs. The building blocks exist (qcow2 overlays, guest-agent quiescing, the VFIO migration region for device state), which is why the preserve-then-sever sequence in ADR-033 is an assembly of documented parts rather than a new primitive.

## Sources considered

| source | weight |
|---|---|
| https://qemu.readthedocs.io/en/v8.1.5/devel/vfio-migration.html | 0.94 |
| https://virtio-fs.gitlab.io/qemu/devel/vfio-migration.html | 0.88, 0.88 |
| https://developers.redhat.com/articles/2024/02/21/virtio-live-migration-technical-deep-dive | 0.89 |
| https://www.qemu.org/docs/master/devel/migration/vfio.html | 0.79 |
| https://wiki.qemu.org/Documentation/CreateSnapshot | 0.75 |
| https://wiki.qemu.org/Features/VMSnapshotEnchancement | 0.72 |
| https://grainvm.com/docs/0.4.0/guides/lifecycle/ | 0.63 |
| https://deepwiki.com/sifive/riscv-qemu/8.2-snapshots-and-saverestore | 0.58 |
| https://airbus-seclab.github.io/qemu_blog/snapshot.html | 0.46 (weak) |
| https://github.com/TikZSZ/vfio-gpu-passthrough | 0.44 (weak) |
| https://medium.com/@armestonaidoost/kvm-gpu-passthrough-with-vfio-a-production-focused-guide-de432ca2a12b | 0.23 (weak) |
| https://superuser.com/questions/1768173/how-to-work-with-qemu-snapshots-savevm-in-a-way-that-is-predictable-like-virtual | 0.05 (weak) |
