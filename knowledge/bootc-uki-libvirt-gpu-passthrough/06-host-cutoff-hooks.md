# 06 - Host-side cutoff hooks and enforcement actions

Scope: the host's enforcement surface for a misbehaving VM: libvirt qemu hooks, hook phases and return-code semantics, and the pause, poweroff, destroy, and detach action ladder.

## The hook surface

libvirt executes custom hook scripts on host events: a QEMU guest is started, stopped, or migrated, and on libvirt daemon start, stop, or reload (source: https://libvirt.org/hooks.html, jev weight 0.93). The qemu hook lives at /etc/libvirt/hooks/qemu, or per-VM under /etc/libvirt/hooks/qemu.d/<vm-name>/ (source: https://libvirt.org/hooks.html, jev weight 0.92; per-VM layout per yubiOS internal record, internal provenance).

Hook scripts must begin with a command interpreter declaration, because they are executed using standard Linux process creation functions (source: https://libvirt.org/hooks.html, jev weight 0.93). For a hook script to be utilized it must have its execute bit set, and it must be present when the libvirt daemon is started; a hook script added after the daemon is already running is not used until the daemon restarts (source: https://www.libvirt.org/hooks.html, jev weight 0.94). That deployment detail is a classic silent failure: a cutoff hook dropped in at runtime never runs.

## Arguments and phases

ArchWiki's example shows the invocation shape: to run a command every time a qemu guest starts, before any resources are allocated, libvirt runs the hook as /etc/libvirt/hooks/qemu <guest_name> prepare begin (source: https://wiki.archlinux.org/title/Libvirt, jev weight 0.85). The yubiOS cutoff hook listens for the stopped phase, where $1 is the phase and $2 is the VM name, and escalates based on host-side GPU telemetry before deciding whether to sever the PCI binding (source: yubiOS internal record, internal provenance).

## Return-code semantics

Return codes are load-bearing: if a hook script exits 0 the libvirt daemon regards it as successful and logs nothing; a nonzero exit is regarded as a failure, the return code is logged, and the operation the hook gated is affected (source: https://www.libvirt.org/hooks.html, jev weight 0.86). A cutoff hook that fails loudly (nonzero) can therefore block a VM operation, which is either the intended interlock or an availability hazard depending on which phase the hook gates. Defensive hooks should explicitly exit 0 on phases they do not handle.

## Real-world hook patterns

NVIDIA ships a Python libvirt hook for automatic configuration of NVIDIA Fabric Manager shared NVSwitch GPU partitions during startup and shutdown of a QEMU guest, which is a maintained example of a GPU-specific lifecycle hook (source: https://github.com/NVIDIA/libvirt-hooks, jev weight 0.80). Community hook collections confirm the two common trigger points, VM start and stop, optionally VM-specific (source: https://github.com/portellam/libvirt-hooks, jev weight 0.33, weak backing, labeled as such). A tutorial deep-dive organizes the same system into prepare/begin hooks at startup and shutdown hooks at VM stop (source: https://deepwiki.com/bryansteiner/gpu-passthrough-tutorial/3-libvirt-hook-system, jev weight 0.26, weak backing, labeled as such).

## The action ladder

Whatever the hook decides, the host's executable actions form a ladder (source: yubiOS internal record, internal provenance):

1. Pause the guest; resume once telemetry recovers. The softest intervention, reversible.
2. Power off the guest; full device reclaim, requires an explicit start to revive.
3. Destroy the guest; the forceful equivalent of poweroff with no graceful shutdown.
4. Detach the GPU via virsh nodedev-detach; the VM keeps running but loses GPU access. This is the SEVER move for a VM that is hung but not crashed, and it maps to the S4 SEVER tier of the yubiOS misbehavior severity ladder (source: yubiOS internal record, internal provenance).

What the host cannot do through kernel VFIO is the boundary condition for this whole ladder: kernel VFIO offers no way to throttle GPU compute, cap VRAM usage mid-run, or impose a percentage quota. The host owns or reclaims the whole assignment and nothing finer-grained (source: yubiOS internal record, refs/bootc-uki-libvirt-gpu-passthrough-2026-08-07.md, internal provenance). Anything finer-grained belongs to the emulated-device track (vfio-user, mdev, vGPU), covered in doc 08.

## Operator checklist for this layer

1. Install hooks before libvirtd starts, or restart the daemon after installing them; a hook added at runtime is inert (source: https://www.libvirt.org/hooks.html, jev weight 0.94).
2. Make hook scripts executable with a proper interpreter line and explicit exit 0 on unhandled phases (source: https://libvirt.org/hooks.html, jev weight 0.93; https://www.libvirt.org/hooks.html, jev weight 0.86).
3. Choose the rung deliberately: pause for transient excursions, destroy or poweroff for hard cutoff, nodedev-detach to keep the VM alive GPU-less (source: yubiOS internal record, internal provenance).
4. Do not try to meter GPU usage from the host; kernel VFIO cannot express it (source: yubiOS internal record, internal provenance).
