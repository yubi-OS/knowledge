# 06: bcvk ephemeral VMs as a test harness

Scope: bcvk (bootc virtualization kit) ephemeral VMs as a CI test harness: run, stop and rm lifecycle, port forwarding, and USB device passthrough for hardware tests.

## What bcvk is

bcvk is the bootc virtualization kit: it bridges the gap between container development and hardware deployment. With bcvk you can launch ephemeral virtual machines from bootc containers to test bootable images locally, or generate disk images for production frameworks [1].

Everything with `bcvk ephemeral` creates a podman container that reuses the host virtualization stack, making it simple to test bootc containers without requiring root privileges or dedicated VM infrastructure [2] [3]. The ephemeral mode is the primary execution mode in bcvk: temporary, container based virtualization that runs bootc container images as fully isolated virtual machines, a hybrid approach that combines container convenience with VM security and isolation [4] (weak backing, w=0.51, third party documentation mirror).

## How the VM actually runs

Inside the podman container, a QEMU process creates the actual virtual machine, and the VM guest runs the bootc container image as a complete operating system [5] (weak backing, w=0.49, man page). This two layer shape (podman wrapper, QEMU inside) is what allows the no-root property claimed above [2].

## The ephemeral lifecycle

The lifecycle verbs the test harness relies on map to bcvk's own CLI surface:

1. `bcvk ephemeral run --image <image>`: boot the image as a VM.
2. `--port` style port forwarding to reach SSH inside the guest.
3. `bcvk ephemeral stop` and `bcvk ephemeral rm` to tear down.

The man pages describe the simplest invocation, `run-ssh`, which starts the VM and drops you into an SSH session; when you exit, the VM is cleaned up. For longer sessions the VM can run in the background with SSH access [6] (weak backing, w=0.28). A typical development loop combines `podman build` with ephemeral testing [6] (weak backing, w=0.28).

A background VM with SSH access is the mode a CI script wants: boot detached, wait for SSH to accept connections, run assertions over SSH, then stop and remove the VM. The port forwarding flag maps a host port to the guest's port 22, which is how the test scripts reach the guest [6] (weak backing, w=0.49 for the run subcommand details).

## Why ephemeral VMs fit CI

Red Hat's image mode documentation positions bcvk for exactly this use: test bootable images locally in ephemeral VMs, or generate disk images for production deployment frameworks [1]. Because each VM is created from a container image and torn down after the test, a CI matrix leg (amd64 cloud runner or arm64 self hosted KVM box) can run the full boot to userspace cycle per job without leftover state [2] [4].

The same tooling family is what earlier yubiOS VM lanes used for disposable boot chains: a sealed UKI boot chain can be proven in a disposable QEMU/OVMF/swtpm environment [7] (weak backing, w=0.37, third party repo). bcvk's contribution is making that disposable-VM pattern the default path for bootc images rather than a hand rolled QEMU script [1] [2].

## Test design implications

1. Boot: `bcvk ephemeral run --image <base-image>` with a port mapping for SSH; assert SSH readiness with a bounded retry loop [2] [6].
2. Interact: all in-guest assertions (bootc status, systemd-sysext, portablectl) run over the forwarded SSH port [6].
3. Reboot cycles for upgrade and rollback tests happen inside the guest (`systemctl reboot`), with the harness re-waiting for SSH each cycle [6].
4. Teardown: `bcvk ephemeral stop` then `bcvk ephemeral rm` (ignore errors, the VM may already be gone) [2] [3].

## Sources

1. https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/using_image_mode_for_rhel_to_build_deploy_and_manage_operating_systems/managing-image-updates-with-the-bootc-virtualization-kit-bcvk (w=0.90)
2. https://github.com/bootc-dev/bcvk (w=0.58)
3. https://github.com/bootc-dev/bcvk/blob/main/README.md (w=0.87)
4. https://deepwiki.com/bootc-dev/bcvk/3-ephemeral-vms (w=0.51)
5. https://www.mankier.com/8/bcvk-ephemeral-run (w=0.49, weak)
6. https://www.mankier.com/8/bcvk-ephemeral (w=0.28, weak)
7. https://github.com/frostyard/snosi (w=0.37, weak)
